import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: 'Flowers' }, // No enum - accepts anything
  caption: { type: String, default: '' },
  description: { type: String, default: '' },
  fullHistory: { type: String, default: '' },
  careLight: { type: String, default: '' },
  careWater: { type: String, default: '' },
  light: { type: String, default: 'Bright Indirect' },
  water: { type: String, default: 'Weekly' },
  careInstructions: { type: String, default: '' },
  image: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  tag: { type: String, default: 'New' },
  originalImageName: { type: String, default: '' },
}, { timestamps: true });

export const Plant = mongoose.model('Plant', plantSchema);