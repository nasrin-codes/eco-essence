// routes/users.js - Eco-Essence USERS API (self-contained: apna SiteUser model, auth ke User model se koi lena-dena nahi)
// Mount in app.js:
//   import usersRoute from './routes/users.js';
//   app.use('/api/users', usersRoute);
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const SiteUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, index: true },
  phone: String,
  role: { type: String, default: 'user' },
  loginAt: String,
  lastLoginAt: String,
  totalLogins: { type: Number, default: 0 },
}, { timestamps: true, strict: false });

const SiteUser = mongoose.models.SiteUser || mongoose.model('SiteUser', SiteUserSchema);

// GET /api/users - saare customers (admin ko frontend filter karta hai)
router.get('/', async (req, res) => {
  try {
    const users = await SiteUser.find({}).sort({ updatedAt: -1 }).lean();
    res.json(users);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/users/upsert - login/register pe customer darj karo. Same email dobara aaye to update (duplicate nahi banega).
router.post('/upsert', async (req, res) => {
  try {
    const { name, email, phone, role } = req.body || {};
    const cleanEmail = String(email || '').toLowerCase().trim();
    if (!cleanEmail) return res.status(400).json({ message: 'email required' });
    const now = new Date().toISOString();
    const updated = await SiteUser.findOneAndUpdate(
      { email: cleanEmail },
      {
        $set: { name: name || '', phone: phone || '', role: role || 'user', lastLoginAt: now },
        $setOnInsert: { loginAt: now, totalLogins: 0 },
        $inc: { totalLogins: 1 },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    res.json(updated);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
