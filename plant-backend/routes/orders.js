// routes/orders.js - Eco-Essence ORDERS API (self-contained: apna Order model, auth ke User model se koi lena-dena nahi)
// Mount in app.js:
//   import ordersRoute from './routes/orders.js';
//   app.use('/api/orders', ordersRoute);
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const OrderSchema = new mongoose.Schema({
  id: { type: String, index: true }, // client-side order id (Date.now) - duplicate POST se bachne ke liye
  customerName: String,
  customerEmail: String,
  email: String,
  phone: String,
  address: mongoose.Schema.Types.Mixed,
  items: mongoose.Schema.Types.Mixed,
  total: Number,
  paymentMethod: String,
  payment: mongoose.Schema.Types.Mixed,
  date: String,
  status: { type: String, default: 'pending' },
}, { timestamps: true, strict: false });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// GET /api/orders - saare orders, naya pehle
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/orders - naya order. Same client id dobara aaye to update (duplicate nahi banega).
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    if (body.id) {
      const updated = await Order.findOneAndUpdate(
        { id: String(body.id) },
        { $set: body },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).lean();
      return res.status(201).json(updated);
    }
    const created = await Order.create(body);
    res.status(201).json(created);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /api/orders/:id - status badlo. :id client id ho ya Mongo _id, dono chalega.
router.put('/:id', async (req, res) => {
  try {
    const raw = String(req.params.id || '');
    const or = [{ id: raw }];
    if (/^[0-9a-fA-F]{24}$/.test(raw)) or.push({ _id: raw });
    const updated = await Order.findOneAndUpdate(
      { $or: or },
      { $set: { status: req.body?.status } },
      { new: true }
    ).lean();
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
