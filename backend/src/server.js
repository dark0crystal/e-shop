import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import productsRoutes from './routes/productsRoutes.js'

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
app.use('api/product', productsRoutes)

// Start server
app.listen(8383, () => {
  console.log('Server started on port: 8383');
});
