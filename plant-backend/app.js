import dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']); // Overrides your network's slow/blocked DNS lookup

import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Route Imports
import plantRoutes from './routes/plantRoutes.js';
import authRoutes from './routes/authRoutes.js';
import potsRoutes from './routes/pots.js';
import ordersRoutes from './routes/orders.js';
import usersRoutes from './routes/users.js';

dotenv.config();

const app = express();
// Establish MongoDB connection
connectDB();

// Global Middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Mounting API endpoints
app.use('/api/plants', plantRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pots', potsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);

// Fallback error fallback handler
app.use((req, res) => {
  res.status(404).json({ message: "Route target endpoint not found" });
});

export default app;
