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

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
          passwordHash: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
          isAdmin: false,
        },
      });
    }

    // Sync cart items from frontend (if provided)
    if (cartItems && Array.isArray(cartItems)) {
      for (const item of cartItems) {
        // Validate productItemId
        if (!item.productItemId) {
          console.warn(`Skipping invalid cart item: productItemId is undefined for item ${JSON.stringify(item)}`);
          continue; // Skip invalid items
        }

        const existingItem = await prisma.CartItem.findFirst({
          where: {
            userId: user.id,
            productItemId: item.productItemId,
          },
        });

        if (existingItem) {
          await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity },
          });
        } else {
          console.log("create cart")
          await prisma.CartItem.create({
            data: {
              userId: user.id,
              productItemId: item.productItemId,
              quantity: item.quantity,
              user: { connect: { id: user.id } }, // Explicitly connect the user
            },
          });
        }
      }
    }

    const token = generateAuthToken(user.id, user.isAdmin);

    await prisma.otpRequest.delete({
      where: { id: record.id },
    });

    return res.status(200).json({
      message: "Authenticated successfully.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Error verifying OTP." });
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