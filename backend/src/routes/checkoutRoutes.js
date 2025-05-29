import express from 'express';
import prisma from '../prismaClient.js';
import { verifyToken } from './authRoutes.js';
import fetch from 'node-fetch';

const router = express.Router();
const THAWANI_API_KEY = process.env.THAWANI_API_KEY;
const THAWANI_BASE_URL = 'https://uatcheckout.thawani.om/api/v1';

// Calculate total price securely on the server
async function calculateTotalPrice(cartItems) {
  let total = 0;
  
  for (const item of cartItems) {
    const productItem = await prisma.productItem.findUnique({
      where: { id: item.productItemId },
      include: { product: true }
    });

    if (!productItem) {
      throw new Error(`Product item ${item.productItemId} not found`);
    }

    if (productItem.stockQuantity < item.quantity) {
      throw new Error(`Insufficient stock for ${productItem.product.name}`);
    }

    total += Number(productItem.price) * item.quantity;
  }

  return total;
}

// Create checkout session
router.post('/create-checkout-session', verifyToken, async (req, res) => {
  try {
    const { cartItems, shippingAddress, paymentMethodId } = req.body;
    const userId = req.user.userId;

    // Calculate total price securely
    const totalPrice = await calculateTotalPrice(cartItems);

    // Create order in database first
    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: 'pending',
        userPaymentMethodId: paymentMethodId,
        shippingMethodId: 'default-shipping-method',
        orderStatusId: 'pending', // Using the ID from our migration
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Create Thawani payment intent
    const paymentIntentResponse = await fetch(`${THAWANI_BASE_URL}/payment_intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'thawani-api-key': THAWANI_API_KEY
      },
      body: JSON.stringify({
        payment_method_id: paymentMethodId,
        amount: Math.round(totalPrice * 1000), // Convert to smallest currency unit (baisa)
        client_reference_id: order.id,
        return_url: `${process.env.FRONTEND_URL}/order-confirmation?orderId=${order.id}`,
        metadata: {
          orderId: order.id,
          userId: userId
        }
      })
    });

    if (!paymentIntentResponse.ok) {
      throw new Error('Failed to create payment intent');
    }

    const paymentIntent = await paymentIntentResponse.json();

    // Update stock quantities
    for (const item of cartItems) {
      await prisma.productItem.update({
        where: { id: item.productItemId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Clear user's cart
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      paymentIntentId: paymentIntent.id,
      checkoutUrl: paymentIntent.checkout_url
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Verify payment status
router.get('/verify-payment/:paymentIntentId', verifyToken, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    
    const response = await fetch(`${THAWANI_BASE_URL}/payment_intents/${paymentIntentId}`, {
      headers: {
        'Accept': 'application/json',
        'thawani-api-key': THAWANI_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }

    const paymentIntent = await response.json();
    
    if (paymentIntent.status === 'paid') {
      // Update order status
      await prisma.order.update({
        where: { id: paymentIntent.metadata.orderId },
        data: {
          status: 'paid',
          orderStatusId: 'paid', // Replace with actual status ID
        },
      });
      
      res.status(200).json({
        success: true,
        status: 'succeeded',
      });
    } else {
      res.status(200).json({
        success: true,
        status: paymentIntent.status,
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router; 