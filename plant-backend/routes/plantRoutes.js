import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const FILE = path.join(__dirname, '../plants.json');

if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([], null, 2));
}

const getPlants = async (mongoConnected) => {
  if (mongoConnected) {
    try {
      const Plant = (await import('../models/Plant.js')).default;
      const data = await Plant.find();
      if (data.length > 0) return data;
    } catch {}
  }
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
};

// GET all
router.get('/', async (req, res) => {
  const plants = await getPlants(req.mongoConnected);
  res.json(plants);
});

// POST add
router.post('/', async (req, res) => {
  let plants = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const newPlant = { _id: Date.now().toString(), ...req.body };
  plants.push(newPlant);
  fs.writeFileSync(FILE, JSON.stringify(plants, null, 2));
  if (req.mongoConnected) {
    try {
      const Plant = (await import('../models/Plant.js')).default;
      const p = new Plant(req.body);
      await p.save();
    } catch {}
  }
  res.json(newPlant);
});

// 🔥 PUT UPDATE - THIS WAS MISSING!
router.put('/:id', async (req, res) => {
  try {
    let plants = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    const idx = plants.findIndex(p => String(p._id) === String(req.params.id));
    if (idx !== -1) {
      plants[idx] = { ...plants[idx], ...req.body, _id: plants[idx]._id };
      fs.writeFileSync(FILE, JSON.stringify(plants, null, 2));
    }
    
    if (req.mongoConnected) {
      try {
        const Plant = (await import('../models/Plant.js')).default;
        await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
      } catch (e) {
        // if ID is not ObjectId (like "1"), try findOneAndUpdate with custom _id
        console.log('Mongo update fallback:', e.message);
      }
    }
    
    res.json({ msg: 'updated', plant: plants[idx] || req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// also support PATCH for same
router.patch('/:id', async (req, res) => {
  req.params.id = req.params.id;
  return router.handle({ ...req, method: 'PUT' }, res);
});

// DELETE
router.delete('/:id', async (req, res) => {
  let plants = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  plants = plants.filter(p => String(p._id) !== String(req.params.id));
  fs.writeFileSync(FILE, JSON.stringify(plants, null, 2));
  if (req.mongoConnected) {
    try {
      const Plant = (await import('../models/Plant.js')).default;
      await Plant.findByIdAndDelete(req.params.id);
    } catch {}
  }
  res.json({ msg: 'deleted' });
});

export default router;