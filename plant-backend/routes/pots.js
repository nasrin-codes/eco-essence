// backend/routes/pots.js - Pots API (【entity-MongoDB¦canonical_name=MongoDB】)
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const PotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: String,
  price: { type: Number, default: 0 },
  category: { type: String, default: 'Ceramic Pots' },
  description: String,
  desc: String,
  images: { type: [String], default: [] },
  image: String,
  imageUrl: String,
  colours: { type: Array, default: [] },
  colour: String,
  potStatus: { type: String, default: 'Pot Only' },
  sizes: { type: [String], default: ['4"', '6"', '8"'] },
  stock: { type: String, default: 'In Stock' },
  care: String,
  careGuide: String,
  material: String,
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Pot = mongoose.models.Pot || mongoose.model('Pot', PotSchema);

// GET /api/pots - sab pots
router.get('/', async (req, res) => {
  try {
    const pots = await Pot.find({}).sort({ createdAt: 1 });
    res.json(pots);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load pots', details: e.message });
  }
});

// POST /api/pots - naya pot (Admin se)
router.post('/', async (req, res) => {
  try {
    const pot = new Pot(req.body);
    await pot.save();
    res.status(201).json(pot);
  } catch (e) {
    res.status(400).json({ error: 'Failed to save pot', details: e.message });
  }
});

// PUT /api/pots/:id - pot update (Admin se Edit)
router.put('/:id', async (req, res) => {
  try {
    const pot = await Pot.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: false });
    if (!pot) {
      const created = new Pot({ ...req.body, _id: undefined });
      await created.save();
      return res.json(created);
    }
    res.json(pot);
  } catch (e) {
    res.status(400).json({ error: 'Failed to update pot', details: e.message });
  }
});

// DELETE /api/pots/:id - hamesha ke liye delete
router.delete('/:id', async (req, res) => {
  try {
    await Pot.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: 'Failed to delete pot', details: e.message });
  }
});

export default router;
