import express from "express";
import prisma from '../prismaClient.js';
import { verifyToken } from "./authRoutes.js";

const router = express.Router();



//=======================================
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { productItemId, quantity } = req.body;
    const userId = req.user.userId;
    console.log("productItemId:",productItemId)
    console.log("quantity",quantity)

    // Validate input
    if (!productItemId || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid productItemId or quantity' });
    }

    // Check if product item exists
    const productItem = await prisma.productItem.findUnique({
      where: { id: productItemId },
    });

    if (!productItem) {
      return res.status(404).json({ message: `ProductItem with ID ${productItemId} not found` });
    }

    // Check stock
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
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productItemId,
          quantity,
          createdAt: new Date(),
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

// Sync guest cart items after login
router.post('/sync-guest-cart', verifyToken, async (req, res) => {
  try {
    const { cartItems } = req.body;
    const userId = req.user.userId;

    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ message: 'Invalid cart items data' });
    }

    const syncedItems = [];
    
    for (const item of cartItems) {
      if (!item.productItemId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        continue;
      }

      const productItem = await prisma.productItem.findUnique({
        where: { id: item.productItemId },
        include: { product: true, images: true }
      });

      if (!productItem || productItem.stockQuantity < item.quantity) {
        continue;
      }

      const existingItem = await prisma.cartItem.findFirst({
        where: { userId, productItemId: item.productItemId }
      });

      let processedItem;
      if (existingItem) {
        const newQuantity = existingItem.quantity + item.quantity;
        if (productItem.stockQuantity < newQuantity) {
          continue;
        }
        
        processedItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
          include: {
            productItem: {
              include: { product: true, images: true }
            }
          }
        });
      } else {
        processedItem = await prisma.cartItem.create({
          data: {
            userId,
            productItemId: item.productItemId,
            quantity: item.quantity,
            createdAt: new Date()
          },
          include: {
            productItem: {
              include: { product: true, images: true }
            }
          }
        });
      }
      
      if (processedItem) {
        syncedItems.push(processedItem);
      }
    }

    return res.status(200).json({ 
      message: 'Cart items synced successfully',
      syncedItems 
    });
  } catch (error) {
    console.error('Error syncing guest cart:', error);
    return res.status(500).json({ 
      message: 'Error syncing guest cart', 
      error: error.message 
    });
  }
});

export default router;