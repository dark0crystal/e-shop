import express from "express";
import prisma from '../prismaClient.js';
import { verifyToken } from "./authRoutes.js";

const router = express.Router();



//=======================================
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { productItemId, quantity } = req.body;
    console.log("from add:",productItemId)
    const userId = req.user.userId; // From verifyToken middleware

    // Validate input
    if (!productItemId || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid productItemId or quantity' });
    }

    // Check if product item exists and has stock
    const productItem = await prisma.productItem.findUnique({
      where: { id: productId },
    });
    console.log("pro:",productItem)
    if (!productItem) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (productItem.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Check for existing cart item
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productItemId,
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          userId,
          productItemId,
          quantity,
        },
      });
    }

    return res.status(200).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
});

//=======================================

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