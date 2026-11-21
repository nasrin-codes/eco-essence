import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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

const FALLBACK_PLANTS = [
  { id: 1, _id: '1', name: "Tulip", price: 199, img: purple_daisy, image: purple_daisy, images: [purple_daisy], light: "Bright indirect", water: "Every 3-4 days", category: "Flower", tags: ["flower","outdoor"], desc: "Cheerful spring bloomer.", description: "Cheerful spring bloomer.", care: "Bright indirect. Water when top 1 inch dry.", originalPrice: 499, potStatus:'No Pot' },
  { id: 2, _id: '2', name: "Cascading Petunia", price: 1199, img: petunia, image: petunia, images: [petunia], light: "Full sun", water: "Daily", category: "Flower", tags: ["flower","outdoor"], desc: "Non-stop bloomer, balcony favourite.", description: "Non-stop bloomer, balcony favourite.", care: "Full sun 6+ hours.", originalPrice: 1499, potStatus:'No Pot' },
  { id: 3, _id: '3', name: "Sunflower Mini", price: 15.99, img: sun, image: sun, images: [sun], light: "Direct sun", water: "Every 2 days", category: "Flower", tags: ["flower","outdoor"], desc: "Mini sunflower.", description: "Mini sunflower.", care: "Direct sun needed.", originalPrice: 299, potStatus:'No Pot' },
  { id: 4, _id: '4', name: "Mogra Jasmine", price: 45, img: Mogra, image: Mogra, images: [Mogra], light: "Bright indirect", water: "Keep moist", category: "Fragrant", tags: ["fragrant","flower"], desc: "Evening fragrance king.", description: "Evening fragrance king.", care: "Bright indirect.", originalPrice: 199, potStatus:'With Pot', potColor:'Ivory' },
  { id: 5, _id: '5', name: "French Lavender", price: 32.45, img: lavendar, image: lavendar, images: [lavendar], light: "Full sun", water: "Weekly", category: "Herb", tags: ["herb","fragrant"], desc: "Mediterranean soul.", description: "Mediterranean soul.", care: "Full sun, weekly.", originalPrice: 299, potStatus:'No Pot' },
  { id: 6, _id: '6', name: "English Thyme", price: 18.5, img: thyme, image: thyme, images: [thyme], light: "Full sun", water: "Low", category: "Herb", tags: ["herb","indoor"], desc: "Culinary herb.", description: "Culinary herb.", care: "Full sun, low water.", originalPrice: 199, potStatus:'No Pot' },
  { id: 7, _id: '7', name: "Rosemary Shrub", price: 29.99, img: rosemary, image: rosemary, images: [rosemary], light: "Full sun", water: "Low", category: "Herb", tags: ["herb","indoor"], desc: "Woody herb.", description: "Woody herb.", care: "Full sun.", originalPrice: 199, potStatus:'No Pot' },
  { id: 8, _id: '8', name: "Fresh Mint", price: 19.99, img: mint, image: mint, images: [mint], light: "Partial", water: "Daily", category: "Herb", tags: ["herb","indoor"], desc: "Kitchen essential.", description: "Kitchen essential.", care: "Partial shade.", originalPrice: 149, potStatus:'No Pot' },
  { id: 9, _id: '9', name: "Basil Tub", price: 51.55, img: basil, image: basil, images: [basil], light: "Full sun", water: "Daily", category: "Herb", tags: ["herb","indoor"], desc: "Genovese basil.", description: "Genovese basil.", care: "Full sun.", originalPrice: 199, potStatus:'No Pot' },
  { id: 10, _id: '10', name: "Cherry Tomatoes", price: 21.55, img: cherry, image: cherry, images: [cherry], light: "Full sun", water: "Daily", category: "Fruits", tags: ["fruits","veggies","outdoor"], desc: "Sweet cherry tomatoes.", description: "Sweet cherry tomatoes.", care: "Full sun 6h+.", originalPrice: 199, potStatus:'No Pot' },
  { id: 11, _id: '11', name: "Avocado", price: 19.55, img: avocado, image: avocado, images: [avocado], light: "Full sun", water: "Weekly", category: "Fruits", tags: ["fruits","outdoor"], desc: "Grow avocado tree.", description: "Grow avocado tree. The avocado plant is a tropical evergreen tree belonging to the Lauraceae family.", care: "Full sun, weekly.", originalPrice: 299, potStatus:'No Pot' },
  { id: 12, _id: '12', name: "Strawberry Alpine", price: 27.75, img: alpine, image: alpine, images: [alpine], light: "Indirect", water: "Twice", category: "Fruits", tags: ["fruits","veggies"], desc: "Alpine strawberries.", description: "Alpine strawberries.", care: "Indirect light.", originalPrice: 199, potStatus:'No Pot' },
  { id: 13, _id: '13', name: "Monstera", price: 399, img: Monasteria, image: Monasteria, images: [Monasteria], light: "Bright indirect", water: "Weekly", category: "Indoor", tags: ["indoor"], desc: "Statement plant — air purifying.", description: "Statement plant — air purifying.", care: "Bright indirect.", originalPrice: 699, potStatus:'No Pot' },
  { id: 14, _id: '14', name: "Ficus Lyrata", price: 599, img: Fig, image: Fig, images: [Fig], light: "Bright", water: "Weekly", category: "Indoor", tags: ["indoor"], desc: "Fiddle leaf fig.", description: "Fiddle leaf fig.", care: "Bright light.", originalPrice: 999, potStatus:'No Pot' },
  { id: 15, _id: '15', name: "Kale", price: 25, img: kale, image: kale, images: [kale], light: "Partial", water: "Daily", category: "Veggie", tags: ["veggies","herb"], desc: "Superfood kale.", description: "Superfood kale.", care: "Partial sun.", originalPrice: 199, potStatus:'No Pot' },
  { id: 16, _id: '16', name: "Orchids", price: 499, img: Orchids, image: Orchids, images: [Orchids], light: "Bright indirect", water: "Weekly", category: "Flower", tags: ["flower","indoor"], desc: "Phalaenopsis orchid.", description: "Phalaenopsis orchid.", care: "Bright indirect.", originalPrice: 799, potStatus:'No Pot' },
  { id: 17, _id: '17', name: "Pumpkin", price: 35, img: pumpkin, image: pumpkin, images: [pumpkin], light: "Full sun", water: "Daily", category: "Veggie", tags: ["veggies","outdoor"], desc: "Mini pumpkin.", description: "Mini pumpkin.", care: "Full sun.", originalPrice: 149, potStatus:'No Pot' },
];

// CLEAN CATEGORIES — NO EMOJIS, editorial style
const CATEGORIES = [
  { id: 'All', label: 'All' },
  { id: 'Fruits', label: 'Fruit' },
  { id: 'Indoor', label: 'Indoor' },
  { id: 'Veggie', label: 'Veg' },
  { id: 'Flower', label: 'Flower' },
  { id: 'Herb', label: 'Herb' },
  { id: 'Fragrant', label: 'Fragrant' },
];

export default function Shop() {
  const [plants, setPlants] = useState(FALLBACK_PLANTS);
  const [filter, setFilter] = useState("All");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [delivery, setDelivery] = useState({ name: '', phone: '', address1: '', city: 'Ahmedabad', state: 'Gujarat', pincode: '' });

  const requireLoginForBuy = () => {
    const token = localStorage.getItem('plant_jwt_token');
    if (!token) {
      alert('🔒 Please login to buy plants!');
      navigate('/auth?next=/shop&msg=login_to_buy');
      return false;
    }
    return true;
  };

  const getAllImages = (p) => {
    if(p.images && Array.isArray(p.images) && p.images.length>0) return p.images.filter(Boolean);
    const arr = [];
    if(p.imageUrl) arr.push(p.imageUrl);
    else if(p.image) arr.push(p.image);
    else if(p.img) arr.push(p.img);
    for(let i=2;i<=10;i++){ if(p[`image${i}`]) arr.push(p[`image${i}`]); }
    return arr.length>0 ? arr : [p.img||p.image];
  };
  const getFirstImage = (p) => getAllImages(p)[0];

  const dedupe = (arr) => {
    const map = new Map();
    arr.forEach(p=>{
      const key = String(p._id||p.id||p.name||'').toLowerCase().trim();
      const existing = map.get(key);
      if(!existing){ map.set(key,p); }
      else {
        const eCount = (existing.images?.length||0) + (existing.description?.length||0);
        const nCount = (p.images?.length||0) + (p.description?.length||0);
        if(nCount >= eCount) map.set(key,p);
      }
    });
    return Array.from(map.values());
  };

  useEffect(()=>{
    async function fetchPlants(){
      try{
        const adminKey = localStorage.getItem('admin_key_value') || 'eco2025';
        const res=await fetch(`${API_URL}/api/plants`, { headers: { 'x-admin-key': adminKey } });
        if(res.ok){
          const json=await res.json();
          const data=Array.isArray(json)?json:json.plants||[];
          if(data.length>0){
            const mapped=data.map((p,idx)=>{
              const fallback = FALLBACK_PLANTS.find(f=> String(f._id)===String(p._id) || f.name.toLowerCase()===p.name?.toLowerCase()) || FALLBACK_PLANTS[idx%FALLBACK_PLANTS.length];
              let imgs = [];
              if(p.images && p.images.length>0) imgs = p.images;
              else {
                if(p.imageUrl) imgs.push(p.imageUrl);
                if(p.image) imgs.push(p.image);
                for(let i=2;i<=10;i++){ if(p[`image${i}`]) imgs.push(p[`image${i}`]); }
              }
              if(imgs.length===0) imgs = [fallback.img];
              return {
                id: p._id||p.id||idx+1, _id: p._id||p.id, name: p.name||fallback.name, price: p.price||fallback.price,
                img: imgs[0], image: imgs[0], imageUrl: imgs[0], images: imgs,
                light: p.careLight||p.light||fallback.light, water: p.careWater||p.water||fallback.water,
                category: p.category||fallback.category, tags: p.tags||fallback.tags,
                desc: p.description||p.desc||fallback.desc, description: p.description||p.desc||fallback.description,
                potStatus: p.potStatus||fallback.potStatus||'No Pot', potColor: p.potColor||'No Pot',
                featured: p.featured||p.showInHome||false
              };
            });
            setPlants(dedupe([...mapped, ...FALLBACK_PLANTS]));
            localStorage.setItem('eco_my_plants', JSON.stringify(dedupe([...mapped, ...FALLBACK_PLANTS])));
            return;
          }
        }
      }catch(e){ console.log('API fail', e); }
      try{
        const keys=['eco_my_plants','plants','eco_admin_plants','eco_shop_fallback'];
        let maxArr = FALLBACK_PLANTS; let maxLen = 0;
        keys.forEach(k=>{ try{ const a=JSON.parse(localStorage.getItem(k)||'[]'); if(a.length>maxLen){ maxLen=a.length; maxArr=a; } }catch{} });
        if(maxArr.length>0){
          const fixed = maxArr.map(p=>{
            const imgs = getAllImages(p);
            return { ...p, images: imgs, img: imgs[0], image: imgs[0], imageUrl: imgs[0], description: p.description||p.desc||'' };
          });
          setPlants(dedupe([...fixed, ...FALLBACK_PLANTS]));
        }
      }catch{}
    }
    fetchPlants();
    try{ setCart(JSON.parse(localStorage.getItem('eco_cart')||'[]')); }catch{}
    const catFromUrl = searchParams.get('category');
    if(catFromUrl){ setFilter(catFromUrl); }
  },[searchParams]);

  useEffect(()=>{
    const check=()=>{ try{ setCart(JSON.parse(localStorage.getItem('eco_cart')||'[]')); }catch{} };
    window.addEventListener('storage',check); const iv=setInterval(check,1000);
    return()=>{ window.removeEventListener('storage',check); clearInterval(iv); };
  },[]);

  const matchesCategory = (plant, cat) => {
    if(cat==="All") return true;
    const cl = cat.toLowerCase();
    const pCat = (plant.category||'').toLowerCase();
    const pTags = (plant.tags||[]).map(t=>String(t).toLowerCase());
    return pCat===cl || pCat.includes(cl) || pTags.includes(cl);
  };
  const filtered = plants.filter(p=> matchesCategory(p, filter));

  const handleProductClick = (p) => {
    const fullProduct = {
      ...p,
      images: getAllImages(p),
      image: getFirstImage(p),
      imageUrl: getFirstImage(p),
      description: p.description||p.desc||'',
    };
    localStorage.setItem('eco_selected_product', JSON.stringify(fullProduct));
    navigate(`/product/${p.id||p._id||p.name}`);
  };

  const handleCartClick = () => { if (!requireLoginForBuy()) return; setShowCart(true); };

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#1A1A1A]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500&display=swap');
        .font-serif { font-family: "Instrument Serif", serif; }
        .font-sans { font-family: "Inter", sans-serif; }
      `}</style>

      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-10">
        {/* CLEAN HEADER — NO "Your Images" debug text */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-black/[0.06]">
          <div>
            <div className="font-sans text-[10px] tracking-[0.22em] opacity-30">ECO-ESSENCE. SHOP — EST. 2024</div>
            <h1 className="font-serif text-[48px] lg:text-[56px] leading-[0.9] tracking-[-0.02em] mt-2">The Nursery.</h1>
            <p className="font-sans text-[13px] text-black/50 mt-3 max-w-[400px] font-[300] leading-[1.6]">Curated resilient plants, acclimatized for Indian light. Pan-India delivery.</p>
          </div>
          <button onClick={handleCartClick} className="h-10 px-5 rounded-full bg-[#1A1A1A] text-white font-sans text-[12px] flex items-center gap-2 self-start lg:self-auto">Cart {cart.length>0 && <span className="bg-white text-black w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold">{cart.length}</span>}</button>
        </div>

        {/* EDITORIAL FILTER — NO EMOJIS, NO PILL CLUTTER */}
        <div className="py-6 flex gap-6 overflow-auto scrollbar-hide border-b border-black/[0.06]">
          <span className="font-sans text-[10px] tracking-[0.2em] opacity-30 mt-1 shrink-0">BROWSE —</span>
          {CATEGORIES.map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} className={`shrink-0 flex items-baseline gap-1.5 group ${filter===f.id?'text-black':'text-black/40 hover:text-black/70'} transition`}>
              <span className={`font-serif text-[20px] ${filter===f.id?'font-[500]':'font-[400]'}`}>{f.label}</span>
              {filter===f.id && <span className="w-[14px] h-[1px] bg-black ml-1 inline-block"></span>}
            </button>
          ))}
        </div>

        {/* GRID — PURE IMAGE, NO BADGES ON IMAGE AT ALL */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {filtered.map(p=>{
            const first = getFirstImage(p);
            return (
            <div key={p.id||p._id} className="group cursor-pointer" onClick={()=>handleProductClick(p)}>
              {/* IMAGE — CLEAN, NO OVERLAY TEXT, NO "1 imgs", NO "77% OFF", NO "No Pot" */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F6F3EE] rounded-[4px]">
                <img src={first} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
              </div>

              {/* INFO */}
              <div className="mt-4 px-1">
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="font-serif text-[17px] leading-[1.15] tracking-[-0.01em] truncate">{p.name}</h3>
                  <span className="font-sans text-[13px] font-[500] shrink-0">₹{p.price}</span>
                </div>
                <div className="font-serif italic text-[11px] opacity-40 mt-1">{p.category}</div>
              </div>

              {/* ONE CATCHY BUTTON ONLY — NO View 2, NO Pot + Cart */}
              <button onClick={(e)=>{ e.stopPropagation(); handleProductClick(p); }} className="mt-4 w-full h-[40px] rounded-full bg-[#1A1A1A] text-white font-sans text-[12px] tracking-[0.06em] font-[500] flex items-center justify-center gap-2 hover:bg-black transition-all group/btn">
                <span>View Plant</span>
                <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          )})}
        </div>

        {filtered.length===0 && <div className="mt-12 text-center py-16 bg-white rounded-[20px] border"><div className="font-serif text-[18px]">No plants in {filter}</div><button onClick={()=>setFilter('All')} className="mt-4 h-9 px-5 rounded-full bg-black text-white text-[12px]">Show All</button></div>}
      </div>

      {/* CART DRAWER — kept same */}
      {showCart && (
        <div className="fixed inset-0 z-[100] flex justify-end"><div className="flex-1 bg-black/30" onClick={()=>setShowCart(false)}></div><div className="w-full max-w-[420px] bg-white h-full p-6 flex flex-col"><div className="flex justify-between"><h3 className="font-serif text-[18px] font-bold">Cart • {cart.length}</h3><button onClick={()=>setShowCart(false)} className="w-9 h-9 rounded-full border grid place-items-center">✕</button></div><div className="mt-5 space-y-3 flex-1 overflow-auto">{cart.map(i=><div key={i.id} className="flex gap-3 p-3 border rounded-[14px]"><img src={i.img||i.image} className="w-14 h-14 rounded-[10px] object-cover"/><div className="flex-1"><div className="text-[13px] font-medium">{i.name}</div><div className="text-[13px] font-bold mt-1">₹{i.total}</div></div><button onClick={()=>{ const nc=cart.filter(c=>c.id!==i.id); setCart(nc); localStorage.setItem('eco_cart', JSON.stringify(nc)); localStorage.setItem('cart', JSON.stringify(nc)); }} className="text-[11px] text-red-500">Remove</button></div>)}</div><div className="mt-6"><button onClick={()=>{setShowCart(false); setShowCheckout(true);}} className="w-full h-12 rounded-full bg-black text-white font-semibold">Proceed to Buy →</button><button onClick={()=>{setShowCart(false); navigate('/cart');}} className="w-full mt-2 h-10 rounded-full border text-[12px]">View Full Cart</button></div></div></div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 z-[110] bg-black/50 grid place-items-center p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[480px] p-6">
            <h3 className="font-serif text-[20px] font-bold">Delivery Address</h3>
            <div className="mt-4 grid gap-3">
              <input placeholder="Full Name *" value={delivery.name} onChange={e=>setDelivery({...delivery,name:e.target.value})} className="h-11 rounded-full border px-5 text-[13px]"/>
              <input placeholder="Phone *" value={delivery.phone} onChange={e=>setDelivery({...delivery,phone:e.target.value})} className="h-11 rounded-full border px-5 text-[13px]"/>
              <input placeholder="Address Line 1 *" value={delivery.address1} onChange={e=>setDelivery({...delivery,address1:e.target.value})} className="h-11 rounded-full border px-5 text-[13px]"/>
              <div className="grid grid-cols-2 gap-3"><input placeholder="City *" value={delivery.city} onChange={e=>setDelivery({...delivery,city:e.target.value})} className="h-11 rounded-full border px-5 text-[13px]"/><input placeholder="Pincode *" value={delivery.pincode} onChange={e=>setDelivery({...delivery,pincode:e.target.value})} className="h-11 rounded-full border px-5 text-[13px]"/></div>
              <div className="flex gap-2 mt-2"><button onClick={()=>{ if(!delivery.name||!delivery.phone||!delivery.address1||!delivery.pincode){ alert('Fill required *'); return; } const orders=JSON.parse(localStorage.getItem('eco_orders')||'[]'); const newOrder={ id:Date.now().toString(), customerName: delivery.name, phone: delivery.phone, address: { address1: delivery.address1, city: delivery.city, pincode: delivery.pincode, full: `${delivery.address1}, ${delivery.city} ${delivery.pincode}` }, items:cart, total:cart.reduce((s,i)=>s+i.total,0), date: new Date().toISOString(), status:'pending'}; localStorage.setItem('eco_orders', JSON.stringify([...orders,newOrder])); setCart([]); localStorage.setItem('eco_cart','[]'); localStorage.setItem('cart','[]'); setShowCheckout(false); alert(`Order placed!`); navigate('/orders'); }} className="flex-1 h-11 rounded-full bg-black text-white text-[12px]">Place Order • ₹{cart.reduce((s,i)=>s+i.total,0)}</button><button onClick={()=>setShowCheckout(false)} className="h-11 px-6 rounded-full border text-[12px]">Cancel</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}