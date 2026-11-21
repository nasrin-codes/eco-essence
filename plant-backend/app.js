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

dotenv.config();

const app = express();
// Establish MongoDB connection
connectDB();

// Global Middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mounting API endpoints
app.use('/api/plants', plantRoutes);
app.use('/api/auth', authRoutes);

// Fallback error fallback handler
app.use((req, res) => {
  res.status(404).json({ message: "Route target endpoint not found" });
});

export default app;