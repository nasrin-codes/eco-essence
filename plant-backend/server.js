import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const FILE = path.join(__dirname, 'plants.json');
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([], null, 2));
}

// Pots file - plants.json jaisa hi fallback.
// Backend hi source of truth hai, tabhi dusre PC / hard refresh pe bhi naye pots dikhte hain.
const POTS_FILE = path.join(__dirname, 'pots.json');
if (!fs.existsSync(POTS_FILE)) {
  fs.writeFileSync(POTS_FILE, JSON.stringify([], null, 2));
}

let mongoConnected = false;
try {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
  mongoConnected = true;
  console.log('✅ MongoDB Connected');
} catch (err) {
  console.log('⚠ Mongo Error:', err.message);
  console.log('👉 Using plants.json fallback');
}

// Pot model - inline, taaki alag models/Pot.js file ki zaroorat na pade.
// _id String hai (Date.now) taaki pots.json wali id aur Mongo wali id hamesha SAME rahe.
// Agar dono alag hui to PUT ek jagah update karta, doosri jagah purana pot rehta.
const potSchema = new mongoose.Schema({
  _id: { type: String, default: () => Date.now().toString() },
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
}, { timestamps: true, strict: false });
const Pot = mongoose.models.Pot || mongoose.model('Pot', potSchema);

const readPots = () => {
  try { return JSON.parse(fs.readFileSync(POTS_FILE, 'utf8')); }
  catch { return []; }
};
const writePots = (pots) => fs.writeFileSync(POTS_FILE, JSON.stringify(pots, null, 2));

// --- ALL ROUTES INLINE - PUT GUARANTEED ---

// GET all
app.get('/api/plants', async (req, res) => {
  try {
    if (mongoConnected) {
      const Plant = (await import('./models/Plant.js')).default;
      const data = await Plant.find();
      if (data.length > 0) return res.json(data);
    }
  } catch {}
  const plants = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  res.json(plants);
});

// POST add
app.post('/api/plants', async (req, res) => {
  let plants = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const newPlant = { _id: Date.now().toString(), ...req.body };
  plants.push(newPlant);
  fs.writeFileSync(FILE, JSON.stringify(plants, null, 2));
  if (mongoConnected) {
    try {
      const Plant = (await import('./models/Plant.js')).default;
      await new Plant(req.body).save();
    } catch {}
  }
  res.json(newPlant);
});

// 🔥 PUT - UPDATE - THIS WAS MISSING
app.put('/api/plants/:id', async (req, res) => {
  console.log('PUT called for id:', req.params.id);
  try {
    let plants = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    const idx = plants.findIndex(p => String(p._id) === String(req.params.id));
    if (idx !== -1) {
      plants[idx] = { ...plants[idx], ...req.body };
      fs.writeFileSync(FILE, JSON.stringify(plants, null, 2));
      console.log('✅ Updated in plants.json');
    }
    if (mongoConnected) {
      try {
        const Plant = (await import('./models/Plant.js')).default;
        await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
      } catch (e) { console.log('Mongo update skip:', e.message); }
    }
    res.json({ msg: 'updated', plant: plants[idx] || req.body });
  } catch (err) {
    console.log('PUT Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH also for safety
app.patch('/api/plants/:id', async (req, res) => {
  let plants = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const idx = plants.findIndex(p => String(p._id) === String(req.params.id));
  if (idx !== -1) {
    plants[idx] = { ...plants[idx], ...req.body };
    fs.writeFileSync(FILE, JSON.stringify(plants, null, 2));
  }
  res.json({ msg: 'updated' });
});

// DELETE
app.delete('/api/plants/:id', async (req, res) => {
  let plants = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  plants = plants.filter(p => String(p._id) !== String(req.params.id));
  fs.writeFileSync(FILE, JSON.stringify(plants, null, 2));
  if (mongoConnected) {
    try {
      const Plant = (await import('./models/Plant.js')).default;
      await Plant.findByIdAndDelete(req.params.id);
    } catch {}
  }
  res.json({ msg: 'deleted' });
});

// ================= POTS - SAME PATTERN AS PLANTS =================
// Admin ke pots yahan save hote hain. Pehle sirf localStorage me save hote the,
// isliye dusre PC pe kholne par default pots aa jaate the.

// GET all pots - Pots page + Admin dono yahi padhte hain
app.get('/api/pots', async (req, res) => {
  try {
    if (mongoConnected) {
      const data = await Pot.find();
      if (data.length > 0) return res.json(data);
    }
  } catch (e) { console.log('Mongo pots read skip:', e.message); }
  res.json(readPots());
});

// POST add pot - Admin se naya pot
app.post('/api/pots', async (req, res) => {
  try {
    let pots = readPots();
    const newPot = { _id: Date.now().toString(), ...req.body };
    pots.push(newPot);
    writePots(pots);
    if (mongoConnected) {
      try { await new Pot({ ...req.body, _id: newPot._id }).save(); }
      catch (e) { console.log('Mongo pot save skip:', e.message); }
    }
    console.log('✅ Pot added:', newPot.name);
    res.json(newPot);
  } catch (err) {
    console.log('POST /api/pots Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update pot - Admin se Edit (kal wala pot aaj bhi update hoga, default pe wapas nahi jayega)
app.put('/api/pots/:id', async (req, res) => {
  console.log('PUT pot called for id:', req.params.id);
  try {
    let pots = readPots();
    const idx = pots.findIndex(p => String(p._id) === String(req.params.id) || String(p.id) === String(req.params.id));
    if (idx !== -1) {
      pots[idx] = { ...pots[idx], ...req.body, _id: pots[idx]._id };
      writePots(pots);
      console.log('✅ Updated in pots.json:', pots[idx].name);
    }
    if (mongoConnected) {
      try {
        await Pot.findByIdAndUpdate(req.params.id, { ...req.body, _id: req.params.id }, { new: true, upsert: true });
      } catch (e) { console.log('Mongo pot update skip:', e.message); }
    }
    res.json({ msg: 'updated', pot: pots[idx] || req.body });
  } catch (err) {
    console.log('PUT /api/pots Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH pot also for safety
app.patch('/api/pots/:id', async (req, res) => {
  try {
    let pots = readPots();
    const idx = pots.findIndex(p => String(p._id) === String(req.params.id) || String(p.id) === String(req.params.id));
    if (idx !== -1) {
      pots[idx] = { ...pots[idx], ...req.body };
      writePots(pots);
    }
    if (mongoConnected) {
      try { await Pot.findByIdAndUpdate(req.params.id, req.body, { new: true }); } catch {}
    }
    res.json({ msg: 'updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE pot - sirf Bin se Permanent Delete pe call hota hai
app.delete('/api/pots/:id', async (req, res) => {
  try {
    let pots = readPots();
    pots = pots.filter(p => String(p._id) !== String(req.params.id) && String(p.id) !== String(req.params.id));
    writePots(pots);
    if (mongoConnected) {
      try { await Pot.findByIdAndDelete(req.params.id); } catch {}
    }
    console.log('✅ Pot deleted:', req.params.id);
    res.json({ msg: 'deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.send('eco-essence API running — PUT fixed'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Routes: GET, POST, PUT, PATCH, DELETE /api/plants + /api/pots');
});
