import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { Plant } from './models/Plant.js';

const yourExact17 = [
  { name: 'Monstera Deliciosa', price: 55.99, category: 'Indoor Plants', originalImage: 'Monasteria.jpg', careLight: 'Bright, indirect window filtration. Avoid prolonged raw midday sun.', careWater: 'Hydrate every 1-2 weeks. Let top 5cm of soil completely dry out first.', fullHistory: 'Known globally as the Swiss Cheese plant due to its natural leaf splits, this equatorial jungle native uses thick aerial root structures to climb canopies. It makes a stunning statement feature while cleansing internal carbon levels effectively over years.The specific epithet deliciosa means "delicious", referring to the edible fruit. The genus Monstera is named from the Latin word for "monstrous" or "abnormal", and refers to the unusual leaves with natural holes that members of the genus have.', image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&q=80' },
  { name: 'Fiddle Leaf Fig', price: 34.99, category: 'Indoor Plants', originalImage: 'fig.jpg', careLight: 'Consistent, highly filtered bright light. Rotate 90 degrees every month.', careWater: 'Thoroughly drench only when potting sub-layers turn dry. Avoid muddy pooling.', fullHistory: 'The crowning jewel of interior architectural trees. Features massive, heavily veined violin-shaped glossy leaves. This plant appreciates ambient thermal stability and reacts poorly to drafty hallways.', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600' },
  { name: 'Pumpkin Tub', price: 47.17, category: 'Edibles', originalImage: 'pumpkin.jpg', careLight: 'Full overhead direct sunlight. Requires minimum 6-8 daily hours.', careWater: 'Keep soil evenly moist. Irrigate deeply directly at the root base early.', fullHistory: 'A rewarding container harvest project. Sprawling green vines set rich yellow blossoms that require open air cycles for outdoor balcony patio environments.', image: 'https://images.unsplash.com/photo-1501003878151-d370cb0af3b0?w=600' },
  { name: 'Kale Leaves', price: 27.17, category: 'Edibles', originalImage: 'kale.jpg', careLight: 'Partial sun to light afternoon shade zones.', careWater: 'Regular hydration tracks to maintain cool root system values.', fullHistory: 'Crisp curly rosettes boasting deep structural green and plum shades. This highly resilient cold-hardy vegetable produces continuously as outer stems are harvested.', image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600' },
  { name: 'Orchids', price: 59.17, category: 'Flowers', originalImage: 'Orchids.jpg', careLight: 'Bright indirect windowsills, preferably east-facing.', careWater: 'Run water through bark medium once a week; allow complete drainage.', fullHistory: 'Exotic epiphytes that feed on ambient humidity cycles rather than dense earth mixes. Long-lasting, sculptural blooms project timeless minimal elegance.', image: 'https://images.unsplash.com/photo-1560717845-01307a8f1862?w=600' },
  { name: 'Avocado Plant', price: 57.17, category: 'Indoor Plants', originalImage: 'avocado.jpg', careLight: 'Maximum unfiltered sunny spaces.', careWater: 'Keep moist but highly aerated; extremely sensitive to root drowning.', fullHistory: 'Young structural trees displaying oversized leathery lanceolate foliage. Great candidate for tall, open sunny room corners.', image: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?w=600' },
  { name: 'Purple Daisies', price: 41.55, category: 'Flowers', originalImage: 'purple_daisy.jpg', careLight: 'Full open uncovered sun exposure.', careWater: 'Hydrate when topsoil layers reduce completely.', fullHistory: 'Robust continuous floral bloomer creating rich contrast. Excellent choice for outer porch arrangements seeking low-maintenance seasonal beauty.', image: 'https://images.unsplash.com/photo-1497582347859-2d82bcb9a6af?w=600' },
  { name: 'Cherry Tomatoes', price: 21.55, category: 'Edibles', originalImage: 'cherry.jpg', careLight: 'Direct raw overhead light framework.', careWater: 'Water strictly on scheduled matching frequencies to limit cracked skins.', fullHistory: 'Compact patio-ready clusters yielding hundreds of sweet red culinary jewels. Requires a simple bamboo stake cage framework as fruit populates.', image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600' },
  { name: 'Basil Tub', price: 51.55, category: 'Herbs', originalImage: 'basil.jpg', careLight: 'Warm, highly protective radiant sills.', careWater: 'Base hydration early in the day; avoid wetting leaves.', fullHistory: 'Fragrant sweet companion herb. Pinch off topmost leaf clusters weekly to prompt highly dense bushy side branch development.', image: 'https://images.unsplash.com/photo-1618164435735-413d3abaf39d?w=600' },
  { name: 'Fresh Mint', price: 19.99, category: 'Herbs', originalImage: 'mint.jpg', careLight: 'Highly versatile, copes with part shade easily.', careWater: 'Enjoys highly damp, rich organic potting networks.', fullHistory: 'Incredibly vigorous aromatic foliage. Best kept confined inside its own dedicated companion planter box to manage its active rhizome growth.', image: 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=600' },
  { name: 'Rosemary Shrub', price: 29.99, category: 'Herbs', originalImage: 'rosemary.jpg', careLight: 'Intense heat and full unshaded daylight grids.', careWater: 'Highly drought-resistant. Water rare and sparingly.', fullHistory: 'Woody evergreen shrub featuring needle leaves rich in pine pinene essential oils. Thrives in highly porous, sandy terrain frames.', image: 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=600' },
  { name: 'English Thyme', price: 18.50, category: 'Herbs', originalImage: 'thyme.jpg', careLight: 'Bright open sun positions.', careWater: 'Allow potting earth to dry completely between cycles.', fullHistory: 'Fine-textured ground cover producing aromatic trailing runners. Creates a gorgeous waterfall spilling effect along stone container lips.', image: 'https://images.unsplash.com/photo-1583753074188-1236cc509a30?w=600' },
  { name: 'Alpine Fern', price: 38.00, category: 'Indoor Plants', originalImage: 'alpine.jpg', careLight: 'Medium to low indirect dim settings.', careWater: 'Requires high humidity. Misting routines recommended.', fullHistory: 'Feathery soft fronds designed to mimic shaded damp northern wilderness floors. Excellent for low-light bathroom shelves.', image: 'https://images.unsplash.com/photo-1501004318641-b72bc4ea3ad1?w=600' },
  { name: 'French Lavender', price: 32.45, category: 'Flowers', originalImage: 'lavendar.jpg', careLight: 'Basking unshaded solar grids with high cross ventilation.', careWater: 'Infrequent deep watering; demands crisp gritty sand porosity.', fullHistory: 'Deeply aromatic gray-green stems capped with soothing purple spikes. Creates an instant therapeutic outdoor spa environment.', image: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=600' },
  { name: 'Mogra Jasmine', price: 45.00, category: 'Flowers', originalImage: 'Mogra.jpg', careLight: 'Warm morning light arrays.', careWater: 'Consistent structural moisture profiles.', fullHistory: 'The legendary Arabian Jasmine. Produces small, wax-white blossoms releasing an incredibly rich, sweet perfume during evening breezes.', image: 'https://images.unsplash.com/photo-1592727368401-2ca46b0b33a1?w=600' },
  { name: 'Sunflower Mini', price: 15.99, category: 'Flowers', originalImage: 'sun.jpg', careLight: 'Absolute full direct lighting parameters.', careWater: 'Moderate loam moisture retention.', fullHistory: 'Dwarf, single-stem classic sunflower built specifically for desktop pots. Vibrant gold radiating petals frame a heavily seeded center core.', image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=600' },
  { name: 'Cascading Petunia', price: 24.99, category: 'Flowers', originalImage: 'petunia.jpg', careLight: 'Bright early exposure layers.', careWater: 'High volume required during hot summer standard spikes.', fullHistory: 'Trumpet-shaped velvety flowers that loop downward in thick color streams. Demands deadheading old flowers to double seasonal yields.', image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600' }
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("🌱 Connected - Seeding YOUR exact 17 plants...");
  
  let added = 0, updated = 0;
  for (const p of yourExact17) {
    const payload = {
      name: p.name,
      price: p.price,
      category: p.category,
      caption: `${p.category} • Eco-Essence Audited`,
      description: p.fullHistory,
      careLight: p.careLight,
      careWater: p.careWater,
      fullHistory: p.fullHistory,
      light: p.careLight,
      water: p.careWater,
      careInstructions: `${p.careLight} | ${p.careWater}`,
      image: p.image,
      originalImageName: p.originalImageName || p.originalImage
    };
    
    const exists = await Plant.findOne({ name: p.name });
    if (!exists) {
      await Plant.create(payload);
      added++;
      console.log(`✅ Added: ${p.name} - ₹${p.price} - ${p.category}`);
    } else {
      // Update existing with your latest care guide if you want
      await Plant.findByIdAndUpdate(exists._id, payload);
      updated++;
      console.log(`🔄 Updated existing: ${p.name} - Now editable`);
    }
  }
  
  const total = await Plant.countDocuments();
  console.log(`\n🎉 DONE! Added: ${added}, Updated: ${updated}, Total in DB: ${total}`);
  console.log(`\nAll 17 plants are now editable at /admin:`);
  console.log(`- Edit: Click Edit on any plant (Monstera, Tulip, etc) → Change price/name/care guide → Update`);
  console.log(`- Delete: Remove any plant`);
  console.log(`- Add: Desktop upload new plant with image from Pictures folder`);
  process.exit();
};

seed();