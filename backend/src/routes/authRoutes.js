import express from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import prisma from "../prismaClient.js";
import { decodeToken, generateAuthToken } from '../service/tokenService.js';

const router = express.Router();

// Configure your transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashed = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await prisma.otpRequest.create({
      data: {
        email,
        otpHash: hashed,
        expiresAt,
      },
    });

    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    return res.status(200).json({ message: "OTP sent." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Error sending OTP." });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
  const { email, otp, cartItems } = req.body;

  const record = await prisma.otpRequest.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP expired or not found." });
  }

  const valid = await bcrypt.compare(otp, record.otpHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid OTP." });
  }

  // Run in a transaction
  const result = await prisma.$transaction(async (tx) => {
    let user = await tx.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await tx.user.create({
        data: {
          email,
          name: email.split('@')[0],
          passwordHash: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
          isAdmin: false,
        },
      });
    }

    // Sync cart items
    if (cartItems && Array.isArray(cartItems)) {
      for (const item of cartItems) {
        if (!item.productItemId || typeof item.quantity !== 'number' || item.quantity <= 0) {
          console.warn(`Skipping invalid cart item: ${JSON.stringify(item)}`);
          continue;
        }

        const productItem = await tx.productItem.findUnique({
          where: { id: item.productItemId },
        });

        if (!productItem) {
          console.warn(`ProductItem not found for ID: ${item.productItemId}`);
          continue;
        }

        const existingItem = await tx.cartItem.findFirst({
          where: {
            userId: user.id,
            productItemId: item.productItemId,
          },
        });

        if (existingItem) {
          await tx.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity },
          });
        } else {
          console.log("Creating cart item");
          await tx.cartItem.create({
            data: {
              userId: user.id,
              productItemId: item.productItemId,
              quantity: item.quantity,
            },
          });
        }
      }
    }

    await tx.otpRequest.delete({
      where: { id: record.id },
    });

    return user;
  });

  const token = generateAuthToken(result.id, result.isAdmin);

  return res.status(200).json({
    message: "Authenticated successfully.",
    token,
    user: {
      id: result.id,
      email: result.email,
      name: result.name,
      isAdmin: result.isAdmin,
    },
  });
} catch (error) {
  console.error("Error in verify-otp:", error);
  return res.status(500).json({ message: "Error verifying OTP.", error: error.message });
}
});

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    const decoded = decodeToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

// Middleware to check admin status
export const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
  next();
};

// Endpoint to check session (JWT-based)
router.get("/session", verifyToken, (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user.userId,
      isAdmin: req.user.isAdmin,
    },
  });
});

export default router;