import express from 'express';

import authRoutes from './authRoutes.js';
import plantRoutes from './plantRoutes.js';


const router = express.Router();

// 1. Mount your sub-routers under clean API prefixes

router.use('/auth', authRoutes);

 router.use('/plants', plantRoutes); // Connects plant endpoints later

// 2. Add a simple root health check endpoint//

router.get('/', (req, res) => {
  res.json({ message: "Welcome to the Plant Store API Hub! 🌿" });
});

export default router;