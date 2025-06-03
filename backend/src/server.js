import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import productsRoutes from './routes/productsRoutes.js'
import categoriesRoutes from './routes/categoriesRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import checkoutRoutes from './routes/checkoutRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'

const app = express();

// Enable CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));

// Middleware
app.use(express.json()); // To parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/product', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/payment', paymentRoutes);

// Start server
app.listen(8383, () => {
  console.log('Server started on port: 8383');
});
