import express from "express";
import prisma from '../prismaClient.js';
import { verifyToken } from "./authRoutes.js";

const router = express.Router();



//=======================================
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { productItemId, quantity } = req.body;
    const userId = req.user.userId;

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

    console.log('Syncing guest cart items:', cartItems);

    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ message: 'Invalid cart items data' });
    }

    // Process each cart item in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const syncedItems = [];

      for (const item of cartItems) {
        if (!item.productItemId || typeof item.quantity !== 'number' || item.quantity <= 0) {
          console.warn(`Skipping invalid cart item: ${JSON.stringify(item)}`);
          continue;
        }

        const productItem = await tx.productItem.findUnique({
          where: { id: item.productItemId },
          include: {
            product: true
          }
        });

        if (!productItem) {
          console.warn(`ProductItem not found for ID: ${item.productItemId}`);
          continue;
        }

        // Check stock availability
        if (productItem.stockQuantity < item.quantity) {
          console.warn(`Insufficient stock for product ${item.productItemId}. Available: ${productItem.stockQuantity}, Requested: ${item.quantity}`);
          continue;
        }

        const existingItem = await tx.cartItem.findFirst({
          where: {
            userId,
            productItemId: item.productItemId,
          },
        });

        if (existingItem) {
          // Update existing item with new quantity
          const newQuantity = existingItem.quantity + item.quantity;
          if (productItem.stockQuantity < newQuantity) {
            console.warn(`Insufficient stock for updating cart item ${item.productItemId}. Available: ${productItem.stockQuantity}, Requested: ${newQuantity}`);
            continue;
          }
          
          const updatedItem = await tx.cartItem.update({
            where: { id: existingItem.id },
            data: { 
              quantity: newQuantity,
              updatedAt: new Date()
            },
          });
          syncedItems.push(updatedItem);
        } else {
          // Create new cart item
          const newItem = await tx.cartItem.create({
            data: {
              userId,
              productItemId: item.productItemId,
              quantity: item.quantity,
              createdAt: new Date(),
              updatedAt: new Date()
            },
          });
          syncedItems.push(newItem);
        }
      }

      return syncedItems;
    });

    return res.status(200).json({ 
      message: 'Cart items synced successfully',
      syncedItems: result 
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