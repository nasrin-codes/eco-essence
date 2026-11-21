// authRoutes.js - Improved for Plant E-comm JWT Gate
// Your existing file upgraded with name, phone, me route, and longer expiry
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

// Middleware to verify JWT - for protecting shop routes
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, login first to unlock shop' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expired or invalid, login again' });
  }
};

// ========== SIGNUP (Register) - For Plant ==========
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Validation for plant e-comm
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, password required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password min 6 chars' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists, please login' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      name: name || email.split('@')[0],
      email, 
      phone: phone || '',
      password: hashedPassword 
    });
    await newUser.save();

    // JWT with 7 days for plant e-comm (your old was 2h, too short for shop)
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      message: 'Account created 🌱 Welcome to Green Roots!',
      token, 
      user: { id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ========== LOGIN ==========
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User does not exist, please signup' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      message: 'Login success 🌱 Shop unlocked!',
      token, 
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ME - Verify JWT (Used by Frontend ProtectedRoute to unlock shop) ==========
router.get('/me', protect, async (req, res) => {
  res.json({ 
    message: 'Token valid, shop unlocked',
    user: { id: req.user._id, name: req.user.name, email: req.user.email, phone: req.user.phone }
  });
});

// ========== SHOP DATA - Protected (Only after login can scroll shop) ==========
router.get('/shop/plants', protect, async (req, res) => {
  res.json({
    message: `Welcome ${req.user.name}, shop data unlocked 🌱`,
    user: req.user,
    plants: [
      { id: 1, name: 'Monstera Deliciosa', price: '₹450' },
      { id: 2, name: 'Snake Plant', price: '₹299' },
    ]
  });
});

router.post('/verify-admin-key', (req, res) => {
  const { adminKey } = req.body;
  if (adminKey === process.env.ADMIN_KEY || adminKey === 'eco_123_admin') {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
});

export default router;