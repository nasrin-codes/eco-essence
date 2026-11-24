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
  { id: 1, _id: '1', name: "Tulip", price: 199, img: purple_daisy, image: purple_daisy, images: [purple_daisy], category: "Flower", tags: ["flower"], desc: "Cheerful spring bloomer.", description: "Cheerful spring bloomer." },
  { id: 2, _id: '2', name: "Cascading Petunia", price: 1199, img: petunia, image: petunia, images: [petunia], category: "Flower", tags: ["flower"], desc: "Non-stop bloomer, balcony favourite.", description: "Non-stop bloomer." },
  { id: 3, _id: '3', name: "Sunflower Mini", price: 15.99, img: sun, image: sun, images: [sun], category: "Flower", tags: ["flower"], desc: "Mini sunflower.", description: "Mini sunflower." },
  { id: 4, _id: '4', name: "Mogra Jasmine", price: 45, img: Mogra, image: Mogra, images: [Mogra], category: "Fragrant", tags: ["fragrant"], desc: "Evening fragrance king.", description: "Evening fragrance king." },
  { id: 5, _id: '5', name: "French Lavender", price: 32.45, img: lavendar, image: lavendar, images: [lavendar], category: "Herb", tags: ["herb"], desc: "Mediterranean soul.", description: "Mediterranean soul." },
  { id: 6, _id: '6', name: "English Thyme", price: 18.5, img: thyme, image: thyme, images: [thyme], category: "Herb", tags: ["herb"], desc: "Culinary herb.", description: "Culinary herb." },
  { id: 7, _id: '7', name: "Rosemary Shrub", price: 29.99, img: rosemary, image: rosemary, images: [rosemary], category: "Herb", tags: ["herb"], desc: "Woody herb.", description: "Woody herb." },
  { id: 8, _id: '8', name: "Fresh Mint", price: 19.99, img: mint, image: mint, images: [mint], category: "Herb", tags: ["herb"], desc: "Kitchen essential.", description: "Kitchen essential." },
  { id: 9, _id: '9', name: "Basil Tub", price: 51.55, img: basil, image: basil, images: [basil], category: "Herb", tags: ["herb"], desc: "Genovese basil.", description: "Genovese basil." },
  { id: 10, _id: '10', name: "Cherry Tomatoes", price: 21.55, img: cherry, image: cherry, images: [cherry], category: "Fruits", tags: ["fruits"], desc: "Sweet cherry tomatoes.", description: "Sweet cherry tomatoes." },
  { id: 11, _id: '11', name: "Avocado", price: 19.55, img: avocado, image: avocado, images: [avocado], category: "Fruits", tags: ["fruits"], desc: "Grow avocado tree.", description: "Grow avocado tree." },
  { id: 12, _id: '12', name: "Strawberry Alpine", price: 27.75, img: alpine, image: alpine, images: [alpine], category: "Fruits", tags: ["fruits"], desc: "Alpine strawberries.", description: "Alpine strawberries." },
  { id: 13, _id: '13', name: "Monstera", price: 399, img: Monasteria, image: Monasteria, images: [Monasteria], category: "Indoor", tags: ["indoor"], desc: "Statement plant — air purifying.", description: "Statement plant — air purifying." },
  { id: 14, _id: '14', name: "Ficus Lyrata", price: 599, img: Fig, image: Fig, images: [Fig], category: "Indoor", tags: ["indoor"], desc: "Fiddle leaf fig.", description: "Fiddle leaf fig." },
  { id: 15, _id: '15', name: "Kale", price: 25, img: kale, image: kale, images: [kale], category: "Veggie", tags: ["veggies"], desc: "Superfood kale.", description: "Superfood kale." },
  { id: 16, _id: '16', name: "Orchids", price: 499, img: Orchids, image: Orchids, images: [Orchids], category: "Flower", tags: ["flower"], desc: "Phalaenopsis orchid.", description: "Phalaenopsis orchid." },
  { id: 17, _id: '17', name: "Pumpkin", price: 35, img: pumpkin, image: pumpkin, images: [pumpkin], category: "Veggie", tags: ["veggies"], desc: "Mini pumpkin.", description: "Mini pumpkin." },
];

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
  const [delivery, setDelivery] = useState({ name: '', phone: '', address1: '', city: 'Ahmedabad', pincode: '' });

  // ===== LOGIN LOGIC INSIDE SAME FILE - NO DIFF FILE NEEDED =====
  const isLoggedIn = () => {
    const token = localStorage.getItem('plant_jwt_token') || localStorage.getItem('jwt_token') || localStorage.getItem('user_token');
    const userName = localStorage.getItem('plant_user_name') || localStorage.getItem('user_name');
    const userEmail = localStorage.getItem('plant_user_email') || localStorage.getItem('user_email');
    return !!(token || (userName && userName !== 'USER' && userName.length > 1) || userEmail);
  };

  // CART KEY - Cart page / Navbar / Pot / ProductDetail jaisa per-user key.
  // Pehle Shop generic 'eco_cart' padhta tha, baaki sab eco_cart_<email> - isliye sign-in ke baad cart khaali dikhta tha.
  const getCartEmail = () => (localStorage.getItem('plant_user_email') || localStorage.getItem('user_email') || '').trim().toLowerCase();
  const cartKey = () => `eco_cart_${getCartEmail()}`;
  const loadShopCart = () => {
    try {
      const email = getCartEmail();
      if (!email) { setCart([]); return; }
      const raw = localStorage.getItem(cartKey());
      let arr = raw ? JSON.parse(raw) : null;
      if (!Array.isArray(arr)) arr = [];
      if (raw === null) {
        for (const gk of ['eco_cart', 'cart', 'eco_shop_cart']) {
          try { const g = JSON.parse(localStorage.getItem(gk) || '[]'); if (Array.isArray(g) && g.length > 0) { arr = g; localStorage.setItem(cartKey(), JSON.stringify(g)); localStorage.removeItem(gk); break; } } catch {}
        }
      }
      setCart(arr);
    } catch { setCart([]); }
  };

  const requireLogin = (action = 'add to cart') => {
    if (isLoggedIn()) return true;
    localStorage.setItem('eco_redirect_after_login', '/shop');
    alert(`🌿 Please login to ${action} — browsing is free, buying needs profile!`);
    navigate(`/auth?next=/shop&action=${encodeURIComponent(action)}`);
    return false;
  };
  // ===== END LOGIN LOGIC =====

  const getAllImages = (p) => {
    if(p.images && p.images.length>0) return p.images.filter(Boolean);
    const arr = [];
    if(p.imageUrl) arr.push(p.imageUrl);
    if(p.image) arr.push(p.image);
    if(p.img) arr.push(p.img);
    for(let i=2;i<=10;i++){ if(p[`image${i}`]) arr.push(p[`image${i}`]); }
    return arr.length>0 ? arr : [p.img||p.image];
  };
  const getFirstImage = (p) => getAllImages(p)[0];

  const dedupe = (arr) => {
    const map = new Map();
    arr.forEach(p=>{
      const key = String(p._id||p.id||p.name||'').toLowerCase().trim();
      if(!map.has(key)) map.set(key,p);
      else {
        const e = map.get(key);
        if((p.images?.length||0) > (e.images?.length||0)) map.set(key,p);
      }
    });
    return Array.from(map.values());
  };

  useEffect(()=>{
    async function fetchPlants(){
      try{
        const res=await fetch(`${API_URL}/api/plants`, { headers: { 'x-admin-key': localStorage.getItem('admin_key_value') || 'eco2025' } });
        if(res.ok){
          const json=await res.json();
          const data=Array.isArray(json)?json:json.plants||[];
          if(data.length>0){
            const mapped=data.map((p,idx)=>{
              const fb = FALLBACK_PLANTS.find(f=> String(f._id)===String(p._id) || f.name.toLowerCase()===p.name?.toLowerCase()) || FALLBACK_PLANTS[idx%FALLBACK_PLANTS.length];
              let imgs = p.images?.length ? p.images : [];
              if(imgs.length===0){
                if(p.imageUrl) imgs.push(p.imageUrl);
                if(p.image) imgs.push(p.image);
              }
              if(imgs.length===0) imgs=[fb.img];
              return { id: p._id||idx, _id: p._id, name: p.name||fb.name, price: p.price||fb.price, img: imgs[0], image: imgs[0], images: imgs, category: p.category||fb.category, tags: p.tags||fb.tags, description: p.description||fb.description };
            });
            setPlants(dedupe([...mapped, ...FALLBACK_PLANTS]));
            return;
          }
        }
      }catch{}
      try{
        const keys=['eco_my_plants','plants','eco_admin_plants'];
        let max=FALLBACK_PLANTS; let maxLen=0;
        keys.forEach(k=>{ try{ const a=JSON.parse(localStorage.getItem(k)||'[]'); if(a.length>maxLen){maxLen=a.length; max=a;} }catch{} });
        setPlants(dedupe([...max, ...FALLBACK_PLANTS]));
      }catch{}
    }
    fetchPlants();
    loadShopCart();
    const catFromUrl = searchParams.get('category');
    if(catFromUrl) setFilter(catFromUrl);
  },[searchParams]);

  useEffect(()=>{
    const check=()=>{ loadShopCart(); };
    window.addEventListener('storage',check);
    const iv=setInterval(check,1000);
    return()=>{ window.removeEventListener('storage',check); clearInterval(iv); };
  },[]);

  const filtered = plants.filter(p=> filter==="All" || p.category?.toLowerCase()===filter.toLowerCase() || p.tags?.some(t=>t.toLowerCase()===filter.toLowerCase()) );

  const handleProductClick = (p) => {
    // VIEW ALLOWED WITHOUT LOGIN — only buy needs login
    const full = { ...p, images: getAllImages(p), image: getFirstImage(p), description: p.description||p.desc||'' };
    localStorage.setItem('eco_selected_product', JSON.stringify(full));
    navigate(`/product/${p.id||p._id||p.name}`);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#1A1A1A]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500&display=swap'); .font-serif{font-family:"Instrument Serif",serif} .font-sans{font-family:"Inter",sans-serif}`}</style>

      <div className="max-w-[1280px] mx-auto px-4 md:px-5 lg:px-8 py-6 md:py-10">
        {/* HEADER - CLEAN, NO "Your Images" */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-6 pb-6 md:pb-8 border-b border-black/[0.06]">
          <div>
            <div className="font-sans text-[10px] tracking-[0.22em] opacity-30">ECO-ESSENCE. SHOP — EST. 2024</div>
            <h1 className="font-serif text-[40px] md:text-[48px] lg:text-[56px] leading-[0.9] tracking-[-0.02em] mt-2">The Nursery.</h1>
            <p className="font-sans text-[13px] text-black/50 mt-3 max-w-[400px] font-[300]">Curated resilient plants, acclimatized for Indian light. Pan-India delivery.</p>
            {!isLoggedIn() && (
              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FFF7ED] border border-[#FDBA74] font-sans text-[11px]">
                <span>🔒</span> Login to add to cart — browsing is free
              </div>
            )}
          </div>
          <button onClick={()=>{ if(!requireLogin('view your cart')) return; setShowCart(true); }} className="h-10 px-5 rounded-full bg-[#1A1A1A] text-white font-sans text-[12px] flex items-center gap-2 self-start lg:self-auto hover:bg-black transition">
            Cart {isLoggedIn() && cart.length>0 && <span className="bg-white text-black w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold">{cart.length}</span>}
          </button>
        </div>

        {/* FILTER - EDITORIAL, NO EMOJIS */}
        <div className="sticky top-[68px] z-30 bg-[#FCFBF8]/95 backdrop-blur-md -mx-4 px-4 md:mx-0 md:px-0 py-4 md:py-6 flex gap-5 md:gap-6 overflow-auto scrollbar-hide snap-x border-b border-black/[0.06]">
          <span className="font-sans text-[10px] tracking-[0.2em] opacity-30 mt-1 shrink-0">BROWSE —</span>
          {CATEGORIES.map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} className={`shrink-0 snap-start flex items-baseline gap-1.5 ${filter===f.id?'text-black':'text-black/40 hover:text-black/70'} transition`}>
              <span className={`font-serif text-[20px] ${filter===f.id?'font-[500]':'font-[400]'}`}>{f.label}</span>
              {filter===f.id && <span className="w-[14px] h-[1px] bg-[#1a5a3a] ml-1 inline-block"></span>}
            </button>
          ))}
        </div>

        {/* GRID - PURE IMAGE, NO BADGES, NO "1 imgs", NO "77% OFF" */}
        <div className="mt-6 md:mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 md:gap-x-5 gap-y-8 md:gap-y-10">
          {filtered.map(p=>{
            const first = getFirstImage(p);
            return (
            <div key={p.id||p._id} className="group cursor-pointer" onClick={()=>handleProductClick(p)}>
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F6F3EE] rounded-[4px]">
                <img src={first} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[1.2s]" />
              </div>
              <div className="mt-4 px-1">
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="font-serif text-[15px] md:text-[17px] leading-[1.15] truncate">{p.name}</h3>
                  <span className="font-sans text-[13px] font-[500] shrink-0">₹{p.price}</span>
                </div>
                <div className="font-serif italic text-[11px] opacity-40 mt-1">{p.category}</div>
              </div>
              {/* ONE BUTTON ONLY - VIEW, NO POT+CART, NO VIEW 2 */}
              <button onClick={(e)=>{ e.stopPropagation(); handleProductClick(p); }} className="mt-3 md:mt-4 w-full h-[36px] md:h-[40px] rounded-full bg-[#1A1A1A] text-white font-sans text-[12px] tracking-[0.06em] font-[500] flex items-center justify-center gap-2 hover:bg-black active:scale-[0.98] transition-all group/btn">
                <span>View Plant</span>
                <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          )})}
        </div>

        {filtered.length===0 && <div className="mt-12 text-center py-16 bg-white rounded-[20px] border"><div className="font-serif text-[18px]">No plants in {filter}</div><button onClick={()=>setFilter('All')} className="mt-4 h-9 px-5 rounded-full bg-black text-white text-[12px]">Show All</button></div>}
      </div>

      {/* CART - ONLY IF LOGGED IN */}
      {showCart && isLoggedIn() && (
        <div className="fixed inset-0 z-[100] flex justify-end"><div className="flex-1 bg-black/30" onClick={()=>setShowCart(false)}></div><div className="w-full max-w-[420px] bg-white h-full p-6 flex flex-col"><div className="flex justify-between"><h3 className="font-serif text-[18px] font-bold">Cart • {cart.length}</h3><button onClick={()=>setShowCart(false)} className="w-9 h-9 rounded-full border grid place-items-center">✕</button></div><div className="mt-5 space-y-3 flex-1 overflow-auto">{cart.map(i=><div key={i.id} className="flex gap-3 p-3 border rounded-[14px]"><img src={i.img||i.image} className="w-14 h-14 rounded-[10px] object-cover"/><div className="flex-1"><div className="text-[13px] font-medium">{i.name}</div><div className="text-[13px] font-bold mt-1">₹{i.total||i.price}</div></div><button onClick={()=>{ const nc=cart.filter(c=>c.id!==i.id); setCart(nc); localStorage.setItem(cartKey(), JSON.stringify(nc)); }} className="text-[11px] text-red-500">Remove</button></div>)}</div><div className="mt-6"><button onClick={()=>{setShowCart(false); setShowCheckout(true);}} className="w-full h-12 rounded-full bg-black text-white font-semibold">Proceed to Buy →</button><button onClick={()=>{setShowCart(false); navigate('/cart');}} className="w-full mt-2 h-10 rounded-full border text-[12px]">View Full Cart</button></div></div></div>
      )}

      {showCheckout && isLoggedIn() && (
        <div className="fixed inset-0 z-[110] bg-black/50 grid place-items-center p-4">
          <div className="bg-white rounded-[20px] w-full max-w-[480px] p-6">
            <h3 className="font-serif text-[20px] font-bold">Delivery Address</h3>
            <div className="mt-4 grid gap-3">
              <input placeholder="Full Name *" value={delivery.name} onChange={e=>setDelivery({...delivery,name:e.target.value})} className="h-11 rounded-full border px-5 text-[13px]"/>
              <input placeholder="Phone *" value={delivery.phone} onChange={e=>setDelivery({...delivery,phone:e.target.value})} className="h-11 rounded-full border px-5 text-[13px]"/>
              <input placeholder="Address Line 1 *" value={delivery.address1} onChange={e=>setDelivery({...delivery,address1:e.target.value})} className="h-11 rounded-full border px-5 text-[13px]"/>
              <div className="grid grid-cols-2 gap-3"><input placeholder="City *" value={delivery.city} onChange={e=>setDelivery({...delivery,city:e.target.value})} className="h-11 rounded-full border px-5 text-[13px]"/><input placeholder="Pincode *" value={delivery.pincode} onChange={e=>setDelivery({...delivery,pincode:e.target.value})} className="h-11 rounded-full border px-5 text-[13px]"/></div>
              <div className="flex gap-2 mt-2"><button onClick={()=>{ if(!delivery.name||!delivery.phone||!delivery.address1||!delivery.pincode){ alert('Fill required *'); return; } const orders=JSON.parse(localStorage.getItem('eco_orders')||'[]'); const newOrder={ id:Date.now().toString(), customerName: delivery.name, phone: delivery.phone, address: { address1: delivery.address1, city: delivery.city, pincode: delivery.pincode, full: `${delivery.address1}, ${delivery.city} ${delivery.pincode}` }, items:cart, total:cart.reduce((s,i)=>s+(i.total||i.price||0),0), date: new Date().toISOString(), status:'pending'}; localStorage.setItem('eco_orders', JSON.stringify([...orders,newOrder])); setCart([]); localStorage.setItem(cartKey(),'[]'); localStorage.setItem('eco_cart','[]'); localStorage.setItem('cart','[]'); setShowCheckout(false); alert(`Order placed!`); navigate('/orders'); }} className="flex-1 h-11 rounded-full bg-black text-white text-[12px]">Place Order • ₹{cart.reduce((s,i)=>s+(i.total||i.price||0),0)}</button><button onClick={()=>setShowCheckout(false)} className="h-11 px-6 rounded-full border text-[12px]">Cancel</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
