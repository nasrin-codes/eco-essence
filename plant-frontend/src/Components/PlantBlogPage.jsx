import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Monasteria from '../assets/Monasteria.jpg';
import Fig from '../assets/fig.jpg';
import kale from '../assets/kale.jpg';
import Orchids from '../assets/Orchids.jpg';
import purple_daisy from '../assets/purple_daisy.jpg';
import pumpkin from '../assets/pumpkin.jpg';
import cherry from '../assets/cherry.jpg';
import avocado from '../assets/avocado.jpg';
import basil from '../assets/basil.jpg';
import mint from '../assets/mint.jpg';
import rosemary from '../assets/rosemary.jpg';
import thyme from '../assets/thyme.jpg';
import alpine from '../assets/alpine.jpg';
import lavendar from '../assets/lavendar.jpg';
import Mogra from '../assets/Mogra.jpg';
import sun from '../assets/sun.jpg';
import petunia from '../assets/petunia.jpg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const originalImageMap = {
  'Monstera Deliciosa': Monasteria, 'Fiddle Leaf Fig': Fig, 'Pumpkin Tub': pumpkin,
  'Kale Leaves': kale, 'Orchids': Orchids, 'Avocado Plant': avocado,
  'Purple Daisies': purple_daisy, 'Cherry Tomatoes': cherry, 'Basil Tub': basil,
  'Fresh Mint': mint, 'Rosemary Shrub': rosemary, 'English Thyme': thyme,
  'Alpine Fern': alpine, 'French Lavender': lavendar, 'Mogra Jasmine': Mogra,
  'Sunflower Mini': sun, 'Cascading Petunia': petunia,
};

export default function PlantBlogPage() {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('plant_jwt_token');
    fetch(`${API_URL}/api/plants/${plantId}`, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} })
      .then(r => r.json()).then(data => {
        let final = data.image;
        if (originalImageMap[data.name] && (!data.image || data.image.includes('unsplash'))) final = originalImageMap[data.name];
        if (data.image?.startsWith('data:image')) final = data.image;
        setPlant({ ...data, displayImage: final }); setLoading(false);
      });
  }, [plantId]);

  const handleAddToCart = () => {
    const existing = JSON.parse(localStorage.getItem('green_roots_cart') || '[]');
    const found = existing.find(c => c._id === plant._id);
    if (found) found.quantity = (found.quantity || 1) + 1;
    else existing.push({ _id: plant._id, name: plant.name, price: plant.price, image: plant.displayImage, quantity: 1 });
    localStorage.setItem('green_roots_cart', JSON.stringify(existing));
    window.location.reload();
  };

  if (loading) return <><Navbar /><div style={{background:'white',minHeight:'70vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading...</div></>;
  if (!plant) return <><Navbar /><div>Not found</div></>;

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'white', padding: '24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <button onClick={() => navigate('/shop')} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', marginBottom: '16px' }}>← Back to Shop</button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <img src={plant.displayImage} alt={plant.name} style={{ width: '100%', borderRadius: '18px', maxHeight: '600px', objectFit: 'cover' }} />
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '800' }}>{plant.name}</h1>
              <div style={{ display: 'flex', gap: '12px', margin: '12px 0' }}>
                <span style={{ fontSize: '22px', fontWeight: '800', color: '#059669' }}>₹{plant.price}</span>
                <span style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>✓ {plant.category}</span>
              </div>
              <h3 style={{ fontSize: '13px', color: '#6b7280', marginTop: '20px' }}>BOTANICAL BACKGROUND</h3>
              <p style={{ lineHeight: '1.7', color: '#374151', fontSize: '14px' }}>{plant.fullHistory || plant.description}</p>
              <h3 style={{ fontSize: '13px', color: '#6b7280', marginTop: '20px' }}>CARE GUIDE</h3>
              <div style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '12px', padding: '14px', marginBottom: '10px' }}>
                <strong>☀ Lighting:</strong> {plant.careLight || plant.light}
              </div>
              <div style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '12px', padding: '14px', marginBottom: '10px' }}>
                <strong>💧 Water:</strong> {plant.careWater || plant.water}
              </div>
              <button onClick={handleAddToCart} style={{ background: '#111827', color: 'white', border: 'none', borderRadius: '12px', padding: '16px', width: '100%', fontWeight: '800', cursor: 'pointer', marginTop: '16px' }}>🛒 Add to Cart • ₹{plant.price}</button>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={() => navigate('/cart')} style={{ flex: 1, background: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '12px', cursor: 'pointer' }}>🛒 Go to Cart</button>
                <button onClick={() => navigate('/shop')} style={{ flex: 1, background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '10px', padding: '12px', cursor: 'pointer' }}>Continue Shopping</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}