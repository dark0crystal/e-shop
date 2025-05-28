import express from "express";
import prisma from '../prismaClient.js';
import { verifyToken } from "./authRoutes.js";

const router = express.Router();



// Get cart for the logged-in user (using JWT)
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        productItem: {
          include: { images: true, product: true },
        },
      },
    });

    const formattedCart = cartItems.map((item) => ({
      id: item.id,
      productItemId: item.productItemId,
      productName: item.productItem.product.name,
      price: Number(item.productItem.price),
      quantity: item.quantity,
      image_url: item.productItem.images[0]?.imageUrl || item.productItem.product.coverImage || '',
    }));

    return res.status(200).json(formattedCart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});



export default router;