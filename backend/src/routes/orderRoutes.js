const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new order
router.post('/', async (req, res) => {
  const { userId, cartItems, shippingMethodId, paymentMethodId, address } = req.body;

  try {
    // Create or link the address
    const userAddress = await prisma.userAddress.create({
      data: {
        userId,
        address: {
          create: {
            unitNumber: address.unitNumber || '',
            streetNumber: address.streetNumber || '',
            addressLine: address.addressLine,
            city: address.city,
            region: address.region,
            countryId: address.countryId,
          },
        },
      },
      include: { address: true },
    });

    // Calculate total price from cart items
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: 'pending',
        userPaymentMethodId: paymentMethodId,
        shippingMethodId,
        orderStatusId: 'pending_status_id', // Replace with dynamic ID if available
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
        userPaymentMethod: true,
        shippingMethod: true,
        orderStatus: true,
      },
    });

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get all orders for a user
router.get('/', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        userPaymentMethod: true,
        shippingMethod: true,
        orderStatus: true,
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// Get a specific order by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        userPaymentMethod: true,
        shippingMethod: true,
        orderStatus: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

module.exports = router;