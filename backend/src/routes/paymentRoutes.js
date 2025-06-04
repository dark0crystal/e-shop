import express from 'express';
import prisma from '../prismaClient.js';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

// Create a new payment method
router.post('/payment-methods', verifyToken, async (req, res) => {
  try {
    const { paymentTypeId, provider, accountNumber, expiryDate } = req.body;
    const userId = req.user.userId;

    // First, ensure the payment type exists
    const paymentType = await prisma.paymentType.findUnique({
      where: { id: 'card' }, // Use the default card payment type
    });

    if (!paymentType) {
      // Create the default payment type if it doesn't exist
      await prisma.paymentType.create({
        data: {
          id: 'card',
          value: 'Credit Card'
        }
      });
    }

    // Create the payment method
    const paymentMethod = await prisma.userPaymentMethod.create({
      data: {
        userId,
        paymentTypeId: 'card',
        provider,
        accountNumber,
        expiryDate: new Date(expiryDate),
        isDefault: true, // Set as default payment method
      },
    });

    res.status(201).json(paymentMethod);
  } catch (error) {
    console.error('Error creating payment method:', error);
    res.status(500).json({ error: 'Failed to create payment method' });
  }
});

// Get user's payment methods
router.get('/payment-methods', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const paymentMethods = await prisma.userPaymentMethod.findMany({
      where: { userId },
      include: {
        paymentType: true,
      },
    });

    res.status(200).json(paymentMethods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

export default router; 