// routes/users.js
import express from 'express';
import { User } from '../models/User.js'; // Adjust path/casing if necessary

const router = express.Router();

//  GET: Fetch all users (excluding their hashed passwords for security) //
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  GET: Fetch a single user profile by ID--------//

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;