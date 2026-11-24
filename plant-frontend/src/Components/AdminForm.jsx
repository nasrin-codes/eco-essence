import React, { useState, useEffect } from 'react';
import Bill from "./BillNew";
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// ADMIN GATE: admin login only. No separate access key.
// PlantAuthJWT sets eco_admin_verified + eco_user_role='admin' on admin login.

const FALLBACK_17 = [
  { _id:'1', id:1, name:'Tulip', price:199, category:'Flower', description:'Cheerful spring bloomer.', image:'https://images.unsplash.com/photo-1524386416438-a8a4c4f04b8d?w=400', images:['https://images.unsplash.com/photo-1524386416438-a8a4c4f04b8d?w=400'], potStatus:'No Pot' },
  { _id:'2', id:2, name:'Cascading Petunia', price:24.99, category:'Flower', description:'Non-stop bloomer.', image:'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400', images:['https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400'], potStatus:'No Pot' },
  { _id:'3', id:3, name:'Sunflower Mini', price:15.99, category:'Flower', description:'Mini sunflower.', image:'https://images.unsplash.com/photo-1597840213384-948081a8d214?w=400', images:['https://images.unsplash.com/photo-1597840213384-948081a8d214?w=400'], potStatus:'No Pot' },
  { _id:'4', id:4, name:'Mogra Jasmine', price:45, category:'Fragrant', description:'Evening fragrance king.', image:'https://images.unsplash.com/photo-1596438459194-f275f413d6ff?w=400', images:['https://images.unsplash.com/photo-1596438459194-f275f413d6ff?w=400'], potStatus:'With Pot' },
  { _id:'5', id:5, name:'French Lavender', price:32.45, category:'Herb', description:'Mediterranean soul.', image:'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400', images:['https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400'], potStatus:'No Pot' },
  { _id:'6', id:6, name:'English Thyme', price:18.5, category:'Herb', description:'Culinary herb.', image:'https://images.unsplash.com/photo-1506368249639-73a05d4f6488?w=400', images:['https://images.unsplash.com/photo-1506368249639-73a05d4f6488?w=400'], potStatus:'No Pot' },
  { _id:'7', id:7, name:'Rosemary Shrub', price:29.99, category:'Herb', description:'Woody herb.', image:'https://images.unsplash.com/photo-1518568403628-df60788af197?w=400', images:['https://images.unsplash.com/photo-1518568403628-df60788af197?w=400'], potStatus:'No Pot' },
  { _id:'8', id:8, name:'Fresh Mint', price:19.99, category:'Herb', description:'Kitchen essential.', image:'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400', images:['https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400'], potStatus:'No Pot' },
  { _id:'9', id:9, name:'Basil Tub', price:51.55, category:'Herb', description:'Genovese basil tub.', image:'https://images.unsplash.com/photo-1618164435735-413d3abafc23?w=400', images:['https://images.unsplash.com/photo-1618164435735-413d3abafc23?w=400'], potStatus:'No Pot' },
  { _id:'10', id:10, name:'Cherry Tomatoes', price:21.55, category:'Fruits', description:'Sweet cherry tomatoes.', image:'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400', images:['https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400'], potStatus:'No Pot' },
  { _id:'11', id:11, name:'Avocado', price:19.55, category:'Fruits', description:'Grow avocado tree. Tropical evergreen.', image:'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=400', images:['https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=400'], potStatus:'No Pot' },
  { _id:'12', id:12, name:'Strawberry Alpine', price:27.75, category:'Fruits', description:'Alpine strawberries.', image:'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', images:['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400'], potStatus:'No Pot' },
  { _id:'13', id:13, name:'Monstera', price:399, category:'Indoor', description:'Statement plant.', image:'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400', images:['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400'], potStatus:'No Pot' },
  { _id:'14', id:14, name:'Ficus Lyrata', price:599, category:'Indoor', description:'Fiddle leaf fig.', image:'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400', images:['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400'], potStatus:'No Pot' },
  { _id:'15', id:15, name:'Kale', price:25, category:'Veggie', description:'Superfood kale.', image:'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=400', images:['https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=400'], potStatus:'No Pot' },
  { _id:'16', id:16, name:'Orchids', price:499, category:'Flower', description:'Phalaenopsis orchid.', image:'https://images.unsplash.com/photo-1560717845-387ad1bc3b34?w=400', images:['https://images.unsplash.com/photo-1560717845-387ad1bc3b34?w=400'], potStatus:'No Pot' },
  { _id:'17', id:17, name:'Pumpkin', price:35, category:'Veggie', description:'Mini pumpkin.', image:'https://images.unsplash.com/photo-1570586437263-160f0d0d1d8a?w=400', images:['https://images.unsplash.com/photo-1570586437263-160f0d0d1d8a?w=400'], potStatus:'No Pot' },
];

// POTS - same categories and pots shown on the Pots page (Pot.jsx).
// Saved to eco_admin_pots, the key Pot.jsx reads.
const POT_CATEGORIES = ['Terracotta Pots', 'Ceramic Pots', 'Metal Planters', 'Self-Watering Pots', 'Plastic Pots', 'Hanging Planters', 'Basket Planters', 'Plant Stands'];
const POT_FALLBACK = [
  { _id: 'terracotta', name: 'Terracotta Pots', description: 'Classic brown clay', category: 'Terracotta Pots', price: 299, images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'], colours: [{ name: 'Terracotta Brown', hex: '#C17A52', extra: 0, image: '' }, { name: 'Clay Red', hex: '#A0522D', extra: 50, image: '' }] },
  { _id: 'ceramic', name: 'Ceramic Pots', description: 'White minimal design', category: 'Ceramic Pots', price: 499, images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'], colours: [{ name: 'White', hex: '#EDE8DF', extra: 0, image: '' }, { name: 'Sage Green', hex: '#A8B8A0', extra: 100, image: '' }] },
  { _id: 'metal', name: 'Metal Planters', description: 'Black matte finish', category: 'Metal Planters', price: 699, images: ['https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800'], colours: [{ name: 'Black Matte', hex: '#2B2B2B', extra: 0, image: '' }, { name: 'Brass', hex: '#C9A86A', extra: 150, image: '' }] },
  { _id: 'self-watering', name: 'Self-Watering Pots', description: 'Auto water system', category: 'Self-Watering Pots', price: 799, images: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800'], colours: [{ name: 'White', hex: '#EDE8DF', extra: 0, image: '' }] },
  { _id: 'plastic', name: 'Plastic Pots', description: 'Lightweight & durable', category: 'Plastic Pots', price: 199, images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'], colours: [{ name: 'Sage', hex: '#A8B8A0', extra: 0, image: '' }] },
  { _id: 'hanging', name: 'Hanging Planters', description: 'For balcony & wall', category: 'Hanging Planters', price: 599, images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'], colours: [{ name: 'Beige', hex: '#D9C7A7', extra: 0, image: '' }] },
  { _id: 'basket', name: 'Basket Planters', description: 'Woven natural look', category: 'Basket Planters', price: 549, images: ['https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800'], colours: [{ name: 'Natural', hex: '#C9A86A', extra: 0, image: '' }] },
  { _id: 'stands', name: 'Plant Stands', description: 'Wood & metal stands', category: 'Plant Stands', price: 899, images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'], colours: [{ name: 'Wood', hex: '#8B6F47', extra: 0, image: '' }] },
];

export default function AdminForm() {
  const navigate = useNavigate();
  // Unlocked only when admin login set the flag.
  const [isUnlocked, setIsUnlocked] = useState(()=> localStorage.getItem('eco_admin_verified')==='true' || localStorage.getItem('eco_user_role')==='admin');
  const [plants, setPlants] = useState([]);
  const [deletedBin, setDeletedBin] = useState(()=>{ try{ return JSON.parse(localStorage.getItem('eco_deleted_bin')||'[]'); }catch{ return []; } });
  const [orders, setOrders] = useState([]);
  const [billOrder, setBillOrder] = useState(null);
  const [showOfflineBill, setShowOfflineBill] = useState(false);
  const [offlineForm, setOfflineForm] = useState({ name: '', phone: '', payMethod: 'Cash', deliveryFee: 0, items: [{ name: '', price: '', qty: 1 }] });
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics');
  const [form, setForm] = useState({ name: '', botanical: '', price: '', category: 'Indoor', careLight: 'Bright indirect', careWater: 'Weekly', humidity: 'Medium', petFriendly: 'No', description: '', care: '', featured: false, potStatus:'No Pot', potColor:'No Pot', potSize:'4"', potPrice:'', potNote:'Buy pot separately' });
  const [images, setImages] = useState([{ id: Date.now(), data: '' }]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState('');
  // Admin ka alag record - customers ki list me kabhi nahi ghusega.
  const [adminUser, setAdminUser] = useState(null);
  // Selected user - naam pe click karne pe detail drawer khulta hai.
  const [selectedUser, setSelectedUser] = useState(null);
  // Plants catalogue - search + category filter.
  const [plantSearch, setPlantSearch] = useState('');
  const [plantCat, setPlantCat] = useState('All');
  // POTS state - reads / writes eco_admin_pots.
  const [pots, setPots] = useState(()=>{ try{ const a = JSON.parse(localStorage.getItem('eco_admin_pots')||'[]'); if(Array.isArray(a) && a.length>0) return a; }catch{} return POT_FALLBACK; });
  const [potForm, setPotForm] = useState({ name:'', price:'', category:'Ceramic Pots', description:'' });
  const [potImages, setPotImages] = useState([{ id: Date.now(), data: '' }]);
  const [potColours, setPotColours] = useState([{ id: Date.now()+1, name:'Default', hex:'#C17A52', extra:0, image:'' }]);
  const [editingPotId, setEditingPotId] = useState(null);
  const [potSearch, setPotSearch] = useState('');
  const [potMsg, setPotMsg] = useState('');
  const [potLoading, setPotLoading] = useState(false);

  // On mount, re-check the admin flag.
    useEffect(()=>{
    const isAdmin = localStorage.getItem('eco_admin_verified')==='true' || localStorage.getItem('eco_user_role')==='admin';
    setIsUnlocked(isAdmin);
  },[]);

  useEffect(()=>{ if(isUnlocked){ fetchPlants(); fetchOrdersAndUsers(); } },[isUnlocked]);

  const dedupe = (arr) => {
    const seen = new Map();
    arr.forEach(p=>{
      const key = (p._id||p.id||p.name||'').toString().toLowerCase().trim();
      const existing = seen.get(key);
      if(!existing) seen.set(key, p);
      else {
        const eCount = (existing.images?.length||0) + (existing.description?.length||0);
        const nCount = (p.images?.length||0) + (p.description?.length||0);
        if(nCount >= eCount) seen.set(key, p);
      }
    });
    return Array.from(seen.values());
  };

  const getImageUrl = (p) => p.imageUrl||p.image||p.imagePreview||p.img|| (p.images&&p.images[0]) || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200';

  const saveAll = (arr) => {
    const clean = dedupe(arr);
    localStorage.setItem('eco_my_plants', JSON.stringify(clean));
    localStorage.setItem('plants', JSON.stringify(clean));
    localStorage.setItem('eco_admin_plants', JSON.stringify(clean));
    localStorage.setItem('eco_shop_fallback', JSON.stringify(clean));
    return clean;
  };

  const fetchOrdersAndUsers = () => {
    try{
      const storedOrders = JSON.parse(localStorage.getItem('eco_orders')||'[]');
      const storedOrders2 = JSON.parse(localStorage.getItem('orders')||'[]');
      const allOrders = [...storedOrders, ...storedOrders2].filter((v,i,a)=>a.findIndex(t=>(t.id||t._id)===(v.id||v._id))===i);
      // The same order can sit in 2 keys with different ids - never print an order with the
      // exact same email + total + timestamp + items twice (same customer name twice).
      {
        const seenSigs = new Set();
        for(let i=allOrders.length-1; i>=0; i--){
          const o = allOrders[i];
          const sig = `${(o.customerEmail||o.email||o.customerName||'').toLowerCase()}|${o.total}|${o.date||o.createdAt}|${(o.items||[]).length}`;
          if(seenSigs.has(sig)) allOrders.splice(i,1); else seenSigs.add(sig);
        }
      }
      allOrders.sort((a,b)=> new Date(b.date||b.createdAt||0) - new Date(a.date||a.createdAt||0));
      setOrders(allOrders);

      const sessionsData = JSON.parse(localStorage.getItem('eco_user_sessions')||'[]');
      const allUsersMap = new Map();

      allOrders.forEach(order=>{
        const rawEmail = order.customerEmail || order.email || '';
        const email = rawEmail || `${order.customerName||'guest'}@eco.local`;
        let key = (email||order.customerName||'').toLowerCase().trim();
        // Same customer, 2 rows bug: without an email the key becomes @eco.local (fallback),
        // while the same customer also exists under their real email from sessions.
        // Merge the fallback one into the existing real-email customer by name, never a new row.
        if(!rawEmail || email.endsWith('@eco.local')){
          const byName = Array.from(allUsersMap.values()).find(u => (u.name||'').toLowerCase().trim() === (order.customerName||'').toLowerCase().trim());
          if(byName) key = byName.id;
        }
        if(!key || key==='user@eco.local') return; // skip generic USER
        if(!allUsersMap.has(key)){
          allUsersMap.set(key, {
            id: key, name: order.customerName || order.name || 'Guest User', email: email, phone: order.phone || '',
            totalOrders: 0, totalSpent: 0, lastOrderDate: null, orders: [],
            loginAt: order.date || new Date().toISOString(), logoutAt: null, status: 'Active'
          });
        }
        const u = allUsersMap.get(key);
        u.totalOrders += 1; u.totalSpent += Number(order.total||0); u.orders.push(order);
        if(!u.lastOrderDate || new Date(order.date) > new Date(u.lastOrderDate)) u.lastOrderDate = order.date;
      });

      sessionsData.forEach(s=>{
        if(!s.email && !s.name) return;
        if(s.name==='USER' || s.name==='U USER') return; // skip generic
        // Same customer, 2 rows bug: a session without an email keys by name,
        // while the order keys the same customer by email. Look up by name first and merge.
        let key = (s.email||'').toLowerCase().trim();
        if(!key){
          const byName = Array.from(allUsersMap.values()).find(u => (u.name||'').toLowerCase().trim() === (s.name||'').toLowerCase().trim());
          key = byName ? byName.id : ('name:' + (s.name||'').toLowerCase().trim());
        }
        if(!allUsersMap.has(key)){
          allUsersMap.set(key, {
            id: key, name: s.name||'User', email: s.email||'', phone: s.phone||'',
            totalOrders: 0, totalSpent: 0, lastOrderDate: null, orders: [],
            loginAt: s.loginAt, logoutAt: s.logoutAt, status: s.logoutAt ? 'Logged Out' : 'Active'
          });
        } else {
          const u = allUsersMap.get(key);
          if(s.loginAt) u.loginAt = s.loginAt;
          if(s.logoutAt) u.logoutAt = s.logoutAt;
          u.status = s.logoutAt ? 'Logged Out' : 'Active';
        }
      });

      const curName = localStorage.getItem('plant_user_name');
      const curEmail = localStorage.getItem('plant_user_email');
      if(curName && curName!=='USER' && curName.toUpperCase()!=='U USER'){
        // The current user also merges into an existing same-name customer, never a 2nd row.
        const byName = Array.from(allUsersMap.values()).find(u => (u.name||'').toLowerCase().trim() === curName.toLowerCase().trim());
        const key = byName ? byName.id : (curEmail||curName).toLowerCase();
        if(!allUsersMap.has(key)){
          allUsersMap.set(key, {
            id: key, name: curName, email: curEmail||'', phone: localStorage.getItem('plant_user_phone')||'',
            totalOrders: 0, totalSpent: 0, lastOrderDate: null, orders: [],
            loginAt: localStorage.getItem('plant_login_time') || new Date().toISOString(),
            logoutAt: null, status: 'Active'
          });
        }
      }
      // FINAL MERGE - same naam 2 baar wali asli wajah: ek hi customer ki ek entry
      // order se (fallback email) aur doosri session se (real email) ban jaati hai,
      // kyunki orders sessions se pehle process hote hain. Ab list banne ke baad
      // same naam wali saari entries ko ek row me merge karo - chahe email kuch bhi ho.
      // Yashika Patel: 2 purchases wali + 0 purchases wali -> 1 row, 2 purchases, total spent.
      // Admin: 2 sessions wali 2 rows -> 1 row.
      const byName = new Map();
      for(const u of allUsersMap.values()){
        const nKey = (u.name||'').toLowerCase().trim().replace(/\s+/g,' ');
        if(!nKey || nKey==='user' || nKey==='u user') continue;
        const ex = byName.get(nKey);
        if(!ex){ byName.set(nKey, { ...u, orders: [...(u.orders||[])] }); continue; }
        // Real email wali entry ka email/phone rakho, fallback (@eco.local) wala chhodo.
        const exReal = ex.email && !ex.email.endsWith('@eco.local');
        const uReal = u.email && !u.email.endsWith('@eco.local');
        if(uReal && !exReal){ ex.email = u.email; if(u.phone) ex.phone = u.phone; }
        if(!ex.phone && u.phone) ex.phone = u.phone;
        ex.totalOrders += (u.totalOrders||0);
        ex.totalSpent += Number(u.totalSpent||0);
        ex.orders = [...(ex.orders||[]), ...(u.orders||[])].filter((o,i,a)=>a.findIndex(x=>(x.id||x._id)===(o.id||o._id))===i);
        if(!ex.lastOrderDate || (u.lastOrderDate && new Date(u.lastOrderDate) > new Date(ex.lastOrderDate))) ex.lastOrderDate = u.lastOrderDate;
        if(!ex.loginAt || (u.loginAt && new Date(u.loginAt) < new Date(ex.loginAt))) ex.loginAt = u.loginAt;
        if(!ex.logoutAt || (u.logoutAt && new Date(u.logoutAt) > new Date(ex.logoutAt))) ex.logoutAt = u.logoutAt;
        if(u.status==='Active') ex.status = 'Active';
      }
      // ADMIN ALAG, USERS ALAG - Admin customers ke beech me nahi dikhega, warna sab mess up hota hai.
      // Admin apne alag card me dikhega, Users table + Top Customers me sirf customers rahenge.
      const mergedUsers = Array.from(byName.values());
      const isAdminEntry = (u) => {
        const em = (u.email||'').toLowerCase().trim();
        const nm = (u.name||'').toLowerCase().trim();
        return em === 'admin@eco-essence.in' || em === 'admin@eco_essence.in' || /^admin@/.test(em) || (nm === 'admin' && (!em || em.endsWith('@eco.local')));
      };
      const adminEntry = mergedUsers.find(isAdminEntry) || null;
      setAdminUser(adminEntry);
      setUsers(mergedUsers.filter(u => u !== adminEntry));
    }catch(e){ console.log(e); }
  };

  const fetchPlants = async () => {
    try {
      const res=await fetch(`${API_URL}/api/plants`,{headers:{'x-admin-key': sessionStorage.getItem('admin_code')||''}}); 
      if(res.ok){
        const data=await res.json().catch(()=>[]);
        let arr=Array.isArray(data)?data:data.plants||data.data||[];
        if(arr.length>=3){ arr = dedupe(arr); setPlants(arr); saveAll(arr); return; }
      }
    } catch(e){}
    try{
      const keys=['eco_my_plants','plants','eco_admin_plants','eco_shop_fallback'];
      let max = [];
      keys.forEach(k=>{
        try{ const a=JSON.parse(localStorage.getItem(k)||'[]'); if(a.length>max.length) max=a; }catch{}
      });
      if(max.length>=3){ setPlants(dedupe(max)); }
      else { setPlants(FALLBACK_17); saveAll(FALLBACK_17); }
    }catch{ setPlants(FALLBACK_17); }
  };

  const handleLogoutAdmin = () => {
    // Full clear on logout - no leak to next user
    setIsUnlocked(false);
    localStorage.removeItem('eco_admin_verified');
    localStorage.removeItem('eco_user_role');
    sessionStorage.removeItem('admin_verified');
    localStorage.removeItem('eco_admin');
    // Clear generic cart keys so the next visitor sees CART 0
    localStorage.removeItem('eco_cart');
    localStorage.removeItem('cart');
    // Mark the admin session as logged out for tracking
    try{
      const sessions = JSON.parse(localStorage.getItem('eco_user_sessions')||'[]');
      for(let i=sessions.length-1;i>=0;i--){ if(sessions[i].role==='admin' && !sessions[i].logoutAt){ sessions[i].logoutAt = new Date().toISOString(); break; } }
      localStorage.setItem('eco_user_sessions', JSON.stringify(sessions));
    }catch{}
    window.dispatchEvent(new Event('eco-logout'));
    window.dispatchEvent(new Event('eco-cart-updated'));
    navigate('/shop');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev=>{
      const next={...prev,[name]: type==='checkbox'?checked:value};
      if(name==='potStatus'){
        if(value==='No Pot'){ next.potColor='No Pot'; next.potNote='Buy pot separately'; }
        else { if(next.potColor==='No Pot') next.potColor='Ivory'; next.potNote=`Pot with Plant • ${next.potColor} ${next.potSize}`; }
      }
      if(name==='potColor' || name==='potSize'){
        if(next.potStatus==='With Pot'){ next.potNote=`Pot with Plant • ${next.potColor} ${next.potSize}`; }
      }
      return next;
    });
  };

  const compressImage = (file, callback) => {
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image(); img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max=800; let w=img.width, h=img.height;
        if(w>h){ if(w>max){ h*=max/w; w=max; } } else { if(h>max){ w*=max/h; h=max; } }
        canvas.width=w; canvas.height=h; canvas.getContext('2d').drawImage(img,0,0,w,h);
        const compressed = canvas.toDataURL('image/jpeg',0.7);
        callback(compressed);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleImage = (file, slotId) => { compressImage(file, (compressed)=>{ setImages(prev=> prev.map(img=> img.id===slotId ? {...img, data: compressed} : img)); }); };
  const addImageSlot = () => { setImages(prev=> [...prev, { id: Date.now()+Math.random(), data: '' }]); };
  const removeImageSlot = (slotId) => { if(images.length===1){ alert('At least 1 image required'); return; } setImages(prev=> prev.filter(img=> img.id!==slotId)); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    if(!form.name||!form.price){setMsg('Name & Price required'); setLoading(false); return;}
    const validImages = images.filter(img=> img.data).map(img=> img.data);
    if(validImages.length===0){ setMsg('❌ Add at least 1 image'); setLoading(false); return; }
    const duplicate = plants.find(p=> p.name?.toLowerCase().trim()===form.name.toLowerCase().trim() && String(p._id||p.id)!==String(editingId));
    if(duplicate && !editingId){ setMsg(`⚠ ${form.name} already exists — editing that one instead`); handleEdit(duplicate); setLoading(false); return; }
    try{
      const extraImages = {}; validImages.forEach((img,i)=>{ if(i!==0) extraImages[`image${i+1}`] = img; });
      const payload={
        name:form.name.trim(), title:form.name.trim(), botanical:form.botanical, price:Number(form.price), category:form.category,
        careLight:form.careLight, light:form.careLight, careWater:form.careWater, water:form.careWater,
        humidity:form.humidity, petFriendly:form.petFriendly, description:form.description, desc:form.description, longDescription:form.description,
        care:form.care, careGuide:form.care, image:validImages[0], imageUrl:validImages[0], imagePreview:validImages[0],
        images: validImages, ...extraImages, featured: form.featured, showInHome: form.featured, isFeatured: form.featured,
        potStatus: form.potStatus, potColor: form.potColor, potSize: form.potSize, potPrice: form.potPrice?Number(form.potPrice):'', potNote: form.potStatus==='No Pot'?'Buy pot separately':`Pot with Plant • ${form.potColor} ${form.potSize}`,
      };
      const url=editingId?`${API_URL}/api/plants/${editingId}`:`${API_URL}/api/plants`;
      const method=editingId?'PUT':'POST';
      const res=await fetch(url,{method, headers:{'Content-Type':'application/json','x-admin-key': sessionStorage.getItem('admin_code')||''}, body:JSON.stringify(payload)});
      if(res.ok){
        setMsg(editingId?`✅ Updated ${form.name} with ${validImages.length} images • ${form.potStatus}`:`✅ Added ${form.name} with ${validImages.length} images • ${form.potStatus}`);
        setForm({ name:'', botanical:'', price:'', category:'Indoor', careLight:'Bright indirect', careWater:'Weekly', humidity:'Medium', petFriendly:'No', description:'', care:'', featured:false, potStatus:'No Pot', potColor:'No Pot', potSize:'4"', potPrice:'', potNote:'Buy pot separately' }); 
        setImages([{ id: Date.now(), data: '' }]); setEditingId(null); fetchPlants();
      } else throw new Error('API offline');
    }catch{
      const extraImages = {}; validImages.forEach((img,i)=>{ if(i!==0) extraImages[`image${i+1}`] = img; });
      let arr=[...plants];
      const newPlant={
        _id: editingId||Date.now().toString(), id: editingId||Date.now(), name:form.name.trim(), title:form.name.trim(),
        botanical:form.botanical, price:Number(form.price), category:form.category, careLight:form.careLight, light:form.careLight,
        careWater:form.careWater, water:form.careWater, humidity:form.humidity, petFriendly:form.petFriendly,
        description:form.description, desc:form.description, longDescription:form.description,
        care:form.care, careGuide:form.care, image:validImages[0], imageUrl:validImages[0], imagePreview:validImages[0],
        images: validImages, ...extraImages, featured: form.featured, showInHome: form.featured,
        potStatus: form.potStatus, potColor: form.potColor, potSize: form.potSize, potPrice: form.potPrice?Number(form.potPrice):'', potNote: form.potStatus==='No Pot'?'Buy pot separately':`Pot with Plant • ${form.potColor} ${form.potSize}`,
      };
      if(editingId){ arr=arr.map(p=>String(p._id)===String(editingId)||String(p.id)===String(editingId)?{...p,...newPlant}:p); }
      else { arr.push(newPlant); }
      const cleaned = saveAll(arr); setPlants(cleaned);
      setMsg(`✅ Saved locally • ${validImages.length} images • ${form.potStatus} • ${form.description.length} chars`);
      setForm({ name:'', botanical:'', price:'', category:'Indoor', careLight:'Bright indirect', careWater:'Weekly', humidity:'Medium', petFriendly:'No', description:'', care:'', featured:false, potStatus:'No Pot', potColor:'No Pot', potSize:'4"', potPrice:'', potNote:'Buy pot separately' }); 
      setImages([{ id: Date.now(), data: '' }]); setEditingId(null);
    }finally{setLoading(false);}
  };

  const handleEdit = (p) => {
    setEditingId(p._id||p.id);
    setForm({ name:p.name||p.title||'', botanical:p.botanical||'', price:p.price||'', category:p.category||'Indoor', careLight:p.careLight||p.light||'Bright indirect', careWater:p.careWater||p.water||'Weekly', humidity:p.humidity||'Medium', petFriendly:p.petFriendly||'No', description:p.description||p.desc||p.longDescription||'', care:p.care||p.careGuide||'', featured: p.featured||p.showInHome||false, potStatus:p.potStatus||'No Pot', potColor:p.potColor||'No Pot', potSize:p.potSize||'4"', potPrice:p.potPrice||'', potNote:p.potNote||'Buy pot separately' });
    let existingImages = [];
    if(p.images && Array.isArray(p.images) && p.images.length>0){ existingImages = p.images; }
    else { existingImages = [p.image||p.imageUrl||p.img].filter(Boolean); for(let i=2;i<=10;i++){ if(p[`image${i}`]) existingImages.push(p[`image${i}`]); } }
    if(existingImages.length>0){ setImages(existingImages.map((data,i)=>({ id: Date.now()+i+Math.random(), data }))); }
    else { setImages([{ id: Date.now(), data: p.image||p.imageUrl||'' }]); }
    setActiveTab('plants'); window.scrollTo({top:0, behavior:'smooth'});
  };

  // Cancel edit - reset to NEW PLANT mode.
  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name:'', botanical:'', price:'', category:'Indoor', careLight:'Bright indirect', careWater:'Weekly', humidity:'Medium', petFriendly:'No', description:'', care:'', featured:false, potStatus:'No Pot', potColor:'No Pot', potSize:'4"', potPrice:'', potNote:'Buy pot separately' });
    setImages([{ id: Date.now(), data: '' }]);
    setMsg('');
  };

  const handleDelete = (id) => {
    const p=plants.find(x=>String(x._id)===String(id)||String(x.id)===String(id)); if(!p) return; if(!confirm(`Move ${p.name} to Bin?`)) return;
    const bin=[...deletedBin,{...p,kind:'plant',deletedAt:new Date().toISOString()}]; localStorage.setItem('eco_deleted_bin',JSON.stringify(bin)); setDeletedBin(bin);
    const remaining=plants.filter(x=>String(x._id)!==String(id)&&String(x.id)!==String(id));
    const cleaned = saveAll(remaining); setPlants(cleaned);
    fetch(`${API_URL}/api/plants/${id}`, { method:'DELETE', headers:{ 'x-admin-key': sessionStorage.getItem('admin_code')||'' } }).catch(()=>{});
  };

  // Restore from Bin - pot goes back to Pots, everything else to Plants.
  // Old bin items have no kind, they are plants.
  // Restore MUST also re-save to the backend: Delete already removed it from the backend,
  // so a local-only restore would vanish on the next fetch (backend list wins).
  const handleRestore = async (p) => {
    const bin=deletedBin.filter(x=>String(x._id)!==String(p._id)&&String(x.id)!==String(p.id)); localStorage.setItem('eco_deleted_bin',JSON.stringify(bin)); setDeletedBin(bin);
    const { kind, deletedAt, ...item } = p;
    if(kind==='pot'){ savePots(dedupe([...pots, item])); setPotMsg(`${item.name} restored to Pots`); }
    else { const updated=dedupe([...plants,item]); setPlants(updated); saveAll(updated); setMsg(`${item.name} restored to Plants`); }
    try {
      if (kind === 'pot') {
        // Restore bhi wahi bulletproof POST use karega - galat _id kabhi nahi jayega, fail ho to retry.
        await postPotToBackend(item);
      } else {
        // Plant restore: galat _id (Date.now) hataya, warna Mongo 500 deta hai.
        const cleanItem = isObjectId(item._id) ? item : (({ _id, id, ...rest }) => rest)(item);
        await fetch(`${API_URL}/api/plants`, { method:'POST', headers:{'Content-Type':'application/json', ...authHeaders()}, body: JSON.stringify(cleanItem) });
      }
    } catch {}
  };
  // Delete permanently - also removes it from the backend
  const handlePermanentDelete = (p) => {
    if(!confirm(`Delete ${p.name} permanently? This cannot be undone.`)) return;
    const bin=deletedBin.filter(x=>String(x._id)!==String(p._id)&&String(x.id)!==String(p.id)); localStorage.setItem('eco_deleted_bin',JSON.stringify(bin)); setDeletedBin(bin);
    const endpoint = p.kind==='pot' ? 'pots' : 'plants';
    fetch(`${API_URL}/api/${endpoint}/${p._id||p.id}`, { method:'DELETE', headers:{ 'x-admin-key': sessionStorage.getItem('admin_code')||'' } }).catch(()=>{});
  };

  // ---- POTS: save / edit / delete ----
  // BULLETPROOF SYNC (2 din ke errors ke baad - ab koi pot kabhi nahi khoyega):
  // 1) Backend ko kabhi galat _id mat bhejo - sirf asli 24-char ObjectId, warna Mongo 500 deta hai.
  // 2) Har save pehle backend pe try, fail ho to halki photo ke saath retry, phir bhi fail ho to
  //    local me save + agli baar Admin khulte hi auto-sync. Data kabhi nahi khota.
  // 3) Admin khulte hi local ke wo pots jo backend me nahi hain, khud-ba-khud backend pe chale jaate hain.
  const [potSyncing, setPotSyncing] = useState(false);
  const isObjectId = (v) => /^[0-9a-fA-F]{24}$/.test(String(v || ''));
  const authHeaders = () => {
    const token = localStorage.getItem('jwt_token') || '';
    // Dono header bhejte hain - backend jo bhi check kare, ek to milega.
    return token ? { 'Authorization': 'Bearer ' + token, 'x-admin-key': token } : {};
  };
  const savePots = (arr) => {
    setPots(arr);
    try{ localStorage.setItem('eco_admin_pots', JSON.stringify(arr)); }catch{}
    window.dispatchEvent(new Event('eco-pots-updated'));
    return arr;
  };
  const fetchBackendPots = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pots`);
      if (!res.ok) return null;
      const data = await res.json().catch(() => []);
      const arr = Array.isArray(data) ? data : (data.pots || []);
      return Array.isArray(arr) ? arr : [];
    } catch { return null; }
  };
  // Server ke liye saaf payload - galat _id hataya, warna Mongo "Cast to ObjectId failed" dega.
  const cleanPotForServer = (pot) => {
    const { _id, id, ...rest } = pot || {};
    const clean = { ...rest };
    if (isObjectId(_id)) { clean._id = _id; clean.id = _id; }
    return clean;
  };
  // POST with auto-retry: 3 tareekon se try karo - backend jo bhi maange, ek to chalega.
  // 1) Full photo + login token, 2) Full photo bina token (kuch backend token pe preflight rok dete hain),
  // 3) Halki photo (1 photo, colour photo nahi) bina token - badi photo (413) se bhi save nahi rukega.
  // Jo bhi backend bolega (404 / 401 / 500 / uska error text), wo wapas bhejo taaki message me saaf dikhe.
  const postPotToBackend = async (pot) => {
    const clean = cleanPotForServer(pot);
    const light = { ...clean, images: (clean.images || []).slice(0, 1), image: (clean.images || [])[0] || clean.image || '', imageUrl: (clean.images || [])[0] || clean.image || '', colours: (clean.colours || []).map(c => ({ name: c.name, hex: c.hex, extra: c.extra, image: '' })) };
    const tries = [
      { body: clean, headers: { 'Content-Type': 'application/json', ...authHeaders() } },
      { body: clean, headers: { 'Content-Type': 'application/json' } },
      { body: light, headers: { 'Content-Type': 'application/json' } },
    ];
    let lastStatus = '';
    let lastError = '';
    for (const t of tries) {
      try {
        const res = await fetch(`${API_URL}/api/pots`, { method: 'POST', headers: t.headers, body: JSON.stringify(t.body) });
        lastStatus = String(res.status);
        if (res.ok) return { ok: true, status: lastStatus, error: '' };
        try { lastError = (await res.text()).slice(0, 140); } catch {}
      } catch { lastStatus = 'no reply'; lastError = ''; }
    }
    return { ok: false, status: lastStatus, error: lastError };
  };
  // PUT with auto-retry: edit bhi POST jaisa - 3 tareekon se try, ek to chalega.
  const putPotToBackend = async (id, pot) => {
    const { _id, id: _drop, ...body } = pot || {};
    const clean = { ...body };
    const light = { ...clean, images: (clean.images || []).slice(0, 1), image: (clean.images || [])[0] || clean.image || '', imageUrl: (clean.images || [])[0] || clean.image || '', colours: (clean.colours || []).map(c => ({ name: c.name, hex: c.hex, extra: c.extra, image: '' })) };
    const tries = [
      { body: clean, headers: { 'Content-Type': 'application/json', ...authHeaders() } },
      { body: clean, headers: { 'Content-Type': 'application/json' } },
      { body: light, headers: { 'Content-Type': 'application/json' } },
    ];
    let lastStatus = '', lastError = '';
    for (const t of tries) {
      try {
        const res = await fetch(`${API_URL}/api/pots/${id}`, { method: 'PUT', headers: t.headers, body: JSON.stringify(t.body) });
        lastStatus = String(res.status);
        if (res.ok) return { ok: true, status: lastStatus, error: '' };
        try { lastError = (await res.text()).slice(0, 140); } catch {}
      } catch { lastStatus = 'no reply'; lastError = ''; }
    }
    return { ok: false, status: lastStatus, error: lastError };
  };
  // DELETE with auto-retry: purana pot backend se hatana bhi kabhi na ruke.
  const deletePotFromBackend = async (id) => {
    const tries = [
      { 'Content-Type': 'application/json', ...authHeaders() },
      { 'Content-Type': 'application/json' },
      { 'x-admin-key': sessionStorage.getItem('admin_code') || '' },
    ];
    for (const h of tries) {
      try { const res = await fetch(`${API_URL}/api/pots/${id}`, { method: 'DELETE', headers: h }); if (res.ok) return true; } catch {}
    }
    return false;
  };
  // Backend ke status number ko saaf Hindi me samjhao - user ko number yaad rakhne ki zaroorat nahi.
  const backendHint = (status, error) => {
    if (status === '404' || /cannot post/i.test(error || '')) return 'Backend me POST route nahi mila';
    if (status === '401' || status === '403') return 'Backend login maang raha hai';
    if (status === '413') return 'Photo bahut badi hai';
    if (status === '400' || /valid/i.test(error || '')) return 'Backend ko koi field pasand nahi aaya';
    if (status === '500') return 'Backend ke andar error';
    if (status === 'no reply') return 'Backend se jawab hi nahi aaya (server so raha hai / CORS)';
    return error ? error : ('Backend said ' + status);
  };
  // Local pots jo backend me nahi hain (naam se match) - unhe backend pe bhejo. Duplicate kabhi nahi banega.
  const syncMissingPotsToBackend = async () => {
    const backend = await fetchBackendPots();
    if (backend === null) return { ok: false, synced: 0, reason: 'backend offline' };
    let local = [];
    try { local = JSON.parse(localStorage.getItem('eco_admin_pots') || '[]'); } catch {}
    if (!Array.isArray(local)) local = [];
    const backendNames = new Set(backend.map(p => String(p.name || '').toLowerCase().trim()));
    const missing = local.filter(p => p && p.name && !backendNames.has(String(p.name).toLowerCase().trim()));
    const backendById = new Map(backend.map(p => [String(p._id || p.id), p]));
    let synced = 0;
    // 1) Naye pots jo backend me nahi - POST.
    for (const p of missing) { const r = await postPotToBackend(p); if (r.ok) synced++; }
    // 2) Rename/edit hue pots - backend me purana naam atka hai, wahi _id pe PUT karke theek karo.
    for (const p of local) {
      const bid = String(p._id || p.id || '');
      if (!isObjectId(bid)) continue;
      const b = backendById.get(bid);
      if (!b) continue;
      if (String(b.name || '').trim() !== String(p.name || '').trim() || Number(b.price) !== Number(p.price)) {
        const r = await putPotToBackend(bid, p);
        if (r.ok) synced++;
      }
    }
    const fresh = await fetchBackendPots();
    if (fresh !== null && fresh.length > 0) savePots(fresh);
    return { ok: true, synced, reason: '' };
  };
  const handleSyncPotsClick = async () => {
    setPotSyncing(true);
    const r = await syncMissingPotsToBackend();
    setPotSyncing(false);
    if (!r.ok) setPotMsg('⚠ Backend abhi offline hai • Tumhare pots isi browser me safe hain • Admin dobara khologe to auto-sync ho jayenge');
    else if (r.synced > 0) setPotMsg(`✅ ${r.synced} pot server pe sync ho gaya • Ab sabko dikhega`);
    else setPotMsg('✅ Sab pots pehle se server pe hain • Kuch sync karna baaki nahi');
  };
  // On mount: backend-first, par local ke extra pots (jaise TEST POT 123) auto-sync honge - kabhi nahi khoyenge.
  useEffect(() => {
    (async () => {
      const backend = await fetchBackendPots();
      if (backend === null) return; // offline - local list hi dikhegi, data safe hai
      if (backend.length === 0) {
        const r = await syncMissingPotsToBackend();
        if (r.synced > 0) setPotMsg(`${r.synced} saved pot server pe sync ho gaya • Ab sabko dikhega`);
        return;
      }
      const r = await syncMissingPotsToBackend();
      if (r.synced > 0) setPotMsg(`${r.synced} pot server pe sync ho gaya • Ab sabko dikhega`);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handlePotImage = (file, slotId) => { compressImage(file, (compressed)=>{ setPotImages(prev=> prev.map(img=> img.id===slotId ? {...img, data: compressed} : img)); }); };
  const addPotImageSlot = () => { setPotImages(prev=> [...prev, { id: Date.now()+Math.random(), data: '' }]); };
  const handlePotColourImage = (file, colourId) => { compressImage(file, (compressed)=>{ setPotColours(prev=> prev.map(c=> c.id===colourId ? {...c, image: compressed} : c)); }); };
  const addPotColour = () => { setPotColours(prev=> [...prev, { id: Date.now()+Math.random(), name:'', hex:'#C17A52', extra:0, image:'' }]); };
  const handleEditPot = (pot) => {
    setEditingPotId(pot._id||pot.id);
    setPotForm({ name: pot.name||'', price: pot.price||'', category: pot.category||'Ceramic Pots', description: pot.description||pot.desc||'' });
    const imgs = (pot.images && pot.images.length>0) ? pot.images : [pot.image||pot.imageUrl||''].filter(Boolean);
    setPotImages(imgs.length>0 ? imgs.map((data,i)=>({ id: Date.now()+i+Math.random(), data })) : [{ id: Date.now(), data: '' }]);
    const cols = (pot.colours && pot.colours.length>0) ? pot.colours : [{ name:'Default', hex: pot.colour||'#C17A52', extra:0, image:'' }];
    setPotColours(cols.map((c,i)=>({ id: Date.now()+100+i+Math.random(), name: c.name||'', hex: c.hex||'#C17A52', extra: Number(c.extra||0), image: c.image||'' })));
    setActiveTab('pots'); window.scrollTo({top:0, behavior:'smooth'});
  };
  const cancelEditPot = () => {
    setEditingPotId(null);
    setPotForm({ name:'', price:'', category:'Ceramic Pots', description:'' });
    setPotImages([{ id: Date.now(), data: '' }]);
    setPotColours([{ id: Date.now()+1, name:'Default', hex:'#C17A52', extra:0, image:'' }]);
    setPotMsg('');
  };
  const handleDeletePot = (id) => {
    const pot = pots.find(x=>String(x._id)===String(id)||String(x.id)===String(id)); if(!pot) return;
    if(!confirm(`Move ${pot.name} to Bin? You can restore it anytime.`)) return;
    const bin=[...deletedBin,{...pot,kind:'pot',deletedAt:new Date().toISOString()}]; localStorage.setItem('eco_deleted_bin',JSON.stringify(bin)); setDeletedBin(bin);
    const remaining = pots.filter(x=>String(x._id)!==String(id)&&String(x.id)!==String(id));
    savePots(remaining);
    // Also delete from the backend - otherwise the Pots page (backend-first) would show the binned pot again.
    // Restore re-POSTs it to the backend via handleRestore.
    deletePotFromBackend(id);
    setPotMsg(`${pot.name} moved to Bin • Restore anytime from Bin`);
  };
  const handlePotSubmit = async () => {
    const validImages = potImages.map(i=>i.data).filter(Boolean);
    if(!potForm.name.trim()){ setPotMsg('❌ Pot name required'); return; }
    if(!potForm.price){ setPotMsg('❌ Pot price required'); return; }
    if(validImages.length===0){ setPotMsg('❌ Add at least 1 pot photo'); return; }
    const colours = potColours.filter(c=>c.name.trim()).map(c=>({ name:c.name.trim(), hex:c.hex||'#C17A52', extra:Number(c.extra||0), image:c.image||'' }));
    if(colours.length===0) colours.push({ name:'Default', hex:'#C17A52', extra:0, image:'' });
    setPotLoading(true);
    // Naya pot = NO _id (Mongo khud banayega). Edit = sirf asli ObjectId _id.
    // 'local-...' ya Date.now() wala _id backend ko bheja to Mongo 500 de deta hai.
    const payload = {
      ...(editingPotId && isObjectId(editingPotId) ? { _id: editingPotId, id: editingPotId } : {}),
      name: potForm.name.trim(), title: potForm.name.trim(),
      price: Number(potForm.price), category: potForm.category,
      description: potForm.description, desc: potForm.description,
      images: validImages, image: validImages[0], imageUrl: validImages[0],
      colours, colour: colours[0].hex, potStatus: 'Pot Only', sizes: ['4"', '6"', '8"'],
    };
    let backendOk = false;
    let backendStatus = '';
    let backendError = '';
    try{
      if (editingPotId && isObjectId(editingPotId)) {
        // Asli backend pot ka EDIT - PUT, 3 tareekon se try.
        const r = await putPotToBackend(editingPotId, payload);
        backendOk = r.ok; backendStatus = r.status; backendError = r.error || '';
        if (!backendOk) {
          // PUT na chala to purana delete + naya POST - purana naam backend pe kabhi nahi atkega.
          await deletePotFromBackend(editingPotId);
          const r2 = await postPotToBackend(payload);
          backendOk = r2.ok; backendStatus = r2.status; backendError = r2.error || '';
        }
      } else {
        // Naya pot, ya local-only pot ka edit - POST with auto-retry (3 tareeke).
        const r = await postPotToBackend(payload);
        backendOk = r.ok;
        backendStatus = r.status;
        backendError = r.error || '';
      }
      if(backendOk){
        // Re-fetch the fresh list from the backend - it also carries the Mongo _id
        const fresh = await fetchBackendPots();
        if(fresh !== null && fresh.length>0){ savePots(fresh); setPotMsg(`${editingPotId ? 'Updated' : 'Added'} ${payload.name} • Saved to server • Visible on all devices`); cancelEditPot(); setPotLoading(false); return; }
      }
    }catch{ backendOk = false; backendStatus = 'no reply'; }
    // Backend fail bhi ho gaya to pot KHOTA NAHI - local me save, agli baar Admin khulte hi auto-sync.
    // Local-only pots ko 'local-...' id milti hai taaki wo kabhi backend ke asli _id se na takrayein.
    let arr = [...pots];
    if(editingPotId){ arr = arr.map(x=> (String(x._id)===String(editingPotId)||String(x.id)===String(editingPotId)) ? {...x, ...payload, _id: x._id||x.id, id: x.id||x._id} : x); }
    else { const lid = 'local-' + Date.now().toString(); arr.push({ ...payload, _id: lid, id: lid }); }
    savePots(arr);
    setPotMsg(`${editingPotId ? 'Updated' : 'Added'} ${payload.name} • Saved here • ${backendHint(backendStatus, backendError)} (${backendStatus || 'no reply'}) - Admin dobara khologe to auto-sync ho jayega`);
    cancelEditPot(); setPotLoading(false);
  };

  const handleResetTo17 = () => {
    if(!confirm('Reset to original 17 plants? This will overwrite current list.')) return;
    setPlants(FALLBACK_17); saveAll(FALLBACK_17); setMsg('✅ Reset to 17 original plants');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(o=> o.id===orderId || o._id===orderId ? {...o, status:newStatus} : o);
    setOrders(updated); localStorage.setItem('eco_orders', JSON.stringify(updated));
  };

  const totalRevenue = orders.reduce((sum,o)=> sum + Number(o.total||0), 0);
  const pendingOrders = orders.filter(o=> (o.status||'pending')==='pending').length;
  const completedOrders = orders.filter(o=> o.status==='completed' || o.status==='delivered').length;
  const deliveryOrders = orders.filter(o=> o.status==='out-for-delivery' || o.status==='shipped').length;
  const totalUsers = users.length;
  const avgOrderValue = orders.length>0 ? Math.round(totalRevenue/orders.length) : 0;

  const filteredUsers = users.filter(u=> !searchUser || u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase()));

  const formatDateTime = (iso) => {
    if(!iso) return '—';
    try{ const d = new Date(iso); return d.toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true }); }catch{ return iso; }
  };

  // ===== WHATSAPP TO BUYER - number sahi format me hona zaroori hai, warna wa.me sirf app kholta hai, chat nahi =====
  const getOrderPhone = (o) => o?.phone || o?.customerPhone || o?.phoneNumber || o?.mobile || o?.address?.phone || o?.customer?.phone || '';
  // wa.me ko 12-digit number chahiye (91 + 10-digit). 0 se shuru / adhoora number = invalid
  const waNumber = (o) => {
    let d = String(getOrderPhone(o) || '').replace(/\D/g, '');
    if (d.length === 11 && d.startsWith('0')) d = d.slice(1); // 09876543210 -> 9876543210
    if (d.length === 10) d = '91' + d;
    if (d.length === 12 && d.startsWith('91')) return d;
    return null;
  };
  const saveOfflineBill = () => {
    const name = offlineForm.name.trim();
    const phone = String(offlineForm.phone).replace(/\D/g, '');
    const items = offlineForm.items.map(it => ({ name: String(it.name||'').trim(), price: Number(it.price||0), qty: Math.max(1, Number(it.qty||1)) })).filter(it => it.name && it.price > 0);
    if (!name) { alert('Customer ka naam daalo'); return; }
    if (phone.length !== 10) { alert('Customer ka sahi 10-digit number daalo'); return; }
    if (!items.length) { alert('Kam se kam 1 item (naam + price) daalo'); return; }
    const withTotal = items.map(it => ({ ...it, total: it.price * it.qty }));
    const total = withTotal.reduce((s, it) => s + it.total, 0) + Number(offlineForm.deliveryFee || 0);
    const newOrder = {
      id: 'OFF-' + Date.now().toString().slice(-6),
      customerName: name, customerEmail: '', phone,
      address: { full: 'In-Store Purchase • Eco-Essence, Opp. Kankaria Gate No. 1' },
      items: withTotal, total, date: new Date().toISOString(), status: 'delivered',
      source: 'offline',
      payment: { method: 'offline', methodLabel: offlineForm.payMethod, status: 'Paid' },
      paymentMethod: offlineForm.payMethod,
    };
    const updated = [newOrder, ...orders];
    setOrders(updated); localStorage.setItem('eco_orders', JSON.stringify(updated));
    setShowOfflineBill(false);
    setOfflineForm({ name: '', phone: '', payMethod: 'Cash', deliveryFee: 0, items: [{ name: '', price: '', qty: 1 }] });
    setBillOrder(newOrder);
  };

  const sendOrderWhatsApp = (o) => {
    const num = waNumber(o);
    if (!num) { alert(`Is order me sahi WhatsApp number nahi hai: "${getOrderPhone(o) || '—'}"\n\nBuyer ka sahi 10-digit number order me hona chahiye, tabhi uska chat khulega.`); return; }
    const msg = `Hello ${o.customerName||'Customer'}! Your Eco-Essence order is confirmed.\n\nOrder ID: ${o.id||o._id}\nItems: ${(o.items||[]).map(i=>`${i.name} x ${i.qty||i.quantity||1}`).join(', ')}\nTotal: ₹${o.total} (${(o.payment&&o.payment.methodLabel)||'Cash on Delivery'})\nStatus: ${o.status||'pending'}\nDelivery: ${o.address?.full||''}\n\nThank you for shopping with Eco-Essence!`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  };

  if(!isUnlocked){
    // Not admin - send to Login. No key/code input here.
    return(
      <div className="min-h-screen bg-[#0F1F15] grid place-items-center px-5">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap'); .font-serif{font-family:"Instrument Serif",serif} .font-sans{font-family:"Inter",sans-serif}`}</style>
        <div className="w-[420px] bg-white rounded-[28px] border p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="w-12 h-12 rounded-full bg-[#1a5a3a] text-white grid place-items-center mx-auto text-[20px]">🌿</div>
          <div className="font-serif text-[10px] tracking-[0.25em] opacity-30 mt-4">ECO-ESSENCE • ADMIN</div>
          <h2 className="font-serif text-[28px] mt-2 font-bold">Admin Login Required</h2>
          <p className="font-sans text-[12px] opacity-50 mt-2">Admin access requires admin login.</p>
          <button onClick={()=>navigate('/auth')} className="w-full mt-8 h-12 rounded-full bg-[#1a5a3a] text-white font-sans text-[13px] font-bold hover:bg-black transition">Go to Login →</button>
          <button onClick={()=>navigate('/shop')} className="w-full mt-3 h-12 rounded-full border font-sans text-[13px] font-bold">Back to Shop</button>
          <div className="mt-6 font-sans text-[10px] opacity-30">Protected • Pan-India • Secure • No hints</div>
        </div>
      </div>
    );
  }

  return(
    <div className="min-h-screen bg-[#F8FAF8] text-[#1A1A1A]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap'); .font-serif{font-family:"Instrument Serif",serif} .font-sans{font-family:"Inter",sans-serif}`}</style>
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="bg-white rounded-[20px] border p-6 flex justify-between items-center shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1a5a3a] text-white grid place-items-center font-serif font-bold">E</div>
            <div>
              <div className="font-serif text-[22px] font-bold leading-none">Eco-Essence • Admin Pro</div>
              <div className="font-sans text-[11px] opacity-50 mt-1">{plants.length} plants • {totalUsers} users • ₹{totalRevenue.toLocaleString()} revenue • Secure</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>navigate('/')} className="h-9 px-4 rounded-full bg-[#F8FAF8] border font-sans text-[11px] font-bold">Home</button>
            <button onClick={()=>navigate('/shop')} className="h-9 px-4 rounded-full bg-[#F8FAF8] border font-sans text-[11px] font-bold">Shop</button>
            <button onClick={handleLogoutAdmin} className="h-9 px-4 rounded-full bg-black text-white font-sans text-[11px] font-bold">Logout</button>
          </div>
        </div>

        <div className="mt-6 flex gap-2 flex-wrap">
          {[
            {id:'analytics', label:`Analytics • ₹${(totalRevenue/1000).toFixed(1)}k`, icon:'📊'},
            {id:'users', label:`Users • ${totalUsers}`, icon:'👥'},
            {id:'orders', label:`Orders • ${orders.length}`, icon:'📦'},
            {id:'plants', label:`Plants • ${plants.length}`, icon:'🌿'},
            {id:'pots', label:`Pots • ${pots.length}`, icon:'🪴'},
            {id:'bin', label:`Bin • ${deletedBin.length}`, icon:'🗑'},
          ].map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)} className={activeTab===t.id?'h-10 px-5 rounded-full bg-[#1a5a3a] text-white text-[12px] font-bold shadow flex items-center gap-1.5':'h-10 px-5 rounded-full bg-white border text-[12px] opacity-70 font-sans flex items-center gap-1.5 hover:opacity-100'}><span>{t.icon}</span>{t.label}</button>
          ))}
        </div>

        {activeTab==='analytics' && (
          <div className="mt-6 space-y-6">
            <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
            {/* HERO BAND - modal jaisa deep green + gold divider */}
            <div className="bg-[#0F2A1D] rounded-[24px] px-7 py-7 text-white shadow-[0_20px_50px_rgba(15,42,29,0.25)]" style={{animation:'fadeUp .4s ease both'}}>
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-sans text-[10px] tracking-[0.22em] text-white/60 font-bold">STORE OVERVIEW</div>
                  <div className="font-serif text-[34px] font-bold mt-1 leading-none">Analytics</div>
                  <div className="h-[2px] bg-[#C9A227]/70 rounded-full mt-3 w-[120px]" />
                </div>
                <div className="text-right">
                  <div className="font-sans text-[10px] tracking-[0.18em] text-white/60 font-bold">TOTAL REVENUE</div>
                  <div className="font-serif text-[36px] font-bold mt-1 leading-none text-[#C9A227]">₹{totalRevenue.toLocaleString()}</div>
                  <div className="font-sans text-[11px] text-white/60 mt-1">{orders.length} orders • Avg ₹{avgOrderValue}</div>
                </div>
              </div>
            </div>
            {/* STAT CARDS - har card pe alag vibrant top border, modal jaisa */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-[18px] border border-black/5 shadow-sm p-5 text-center border-t-4 border-t-[#C9A227] hover:-translate-y-1 hover:shadow-md transition" style={{animation:'fadeUp .4s ease both', animationDelay:'60ms'}}><div className="font-sans text-[10px] tracking-[0.18em] text-[#8A6D1B] font-bold">TOTAL REVENUE</div><div className="font-serif text-[30px] font-bold mt-2 text-[#0F2A1D]">₹{totalRevenue.toLocaleString()}</div><div className="font-sans text-[11px] opacity-50 mt-1">{orders.length} orders • Avg ₹{avgOrderValue}</div></div>
              <div className="bg-white rounded-[18px] border border-black/5 shadow-sm p-5 text-center border-t-4 border-t-[#E8A020] hover:-translate-y-1 hover:shadow-md transition" style={{animation:'fadeUp .4s ease both', animationDelay:'120ms'}}><div className="font-sans text-[10px] tracking-[0.18em] text-[#B97A0A] font-bold">PENDING</div><div className="font-serif text-[30px] font-bold mt-2 text-[#0F2A1D]">{pendingOrders}</div><div className="font-sans text-[11px] opacity-50 mt-1">Needs action</div></div>
              <div className="bg-white rounded-[18px] border border-black/5 shadow-sm p-5 text-center border-t-4 border-t-[#1a5a3a] hover:-translate-y-1 hover:shadow-md transition" style={{animation:'fadeUp .4s ease both', animationDelay:'180ms'}}><div className="font-sans text-[10px] tracking-[0.18em] text-[#1a5a3a] font-bold">COMPLETED</div><div className="font-serif text-[30px] font-bold mt-2 text-[#1a5a3a]">{completedOrders}</div><div className="font-sans text-[11px] opacity-50 mt-1">{deliveryOrders} out for delivery</div></div>
              <div className="bg-white rounded-[18px] border border-black/5 shadow-sm p-5 text-center border-t-4 border-t-[#2E7D5B] hover:-translate-y-1 hover:shadow-md transition" style={{animation:'fadeUp .4s ease both', animationDelay:'240ms'}}><div className="font-sans text-[10px] tracking-[0.18em] text-[#2E7D5B] font-bold">TOTAL USERS</div><div className="font-serif text-[30px] font-bold mt-2 text-[#0F2A1D]">{totalUsers}</div><div className="font-sans text-[11px] opacity-50 mt-1">{users.filter(u=>u.status==='Active').length} active now</div></div>
            </div>
            <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
              <div className="bg-white rounded-[20px] border border-black/5 shadow-sm p-6">
                <div className="flex justify-between items-center"><h3 className="font-serif text-[18px] font-bold">Recent Orders</h3><button onClick={()=>setActiveTab('orders')} className="text-[11px] px-3 py-1.5 rounded-full border bg-white font-sans font-bold hover:bg-black hover:text-white transition">View all →</button></div>
                <div className="mt-4 space-y-3 max-h-[400px] overflow-auto">
                  {orders.length===0 && <div className="py-12 text-center opacity-40 font-sans text-[12px]">No orders yet</div>}
                  {orders.slice(0,6).map(o=>(
                    <div key={o.id||o._id} className="flex gap-3 p-3 rounded-[14px] bg-[#FAF8F5] border border-black/[0.04] hover:bg-white hover:shadow-sm transition">
                      <div className="w-12 h-12 rounded-full bg-[#1a5a3a] text-white grid place-items-center font-bold text-[13px] shrink-0 ring-2 ring-[#C9A227]/40">{o.customerName?.[0]||'G'}</div>
                      <div className="flex-1 min-w-0"><div className="flex justify-between gap-2"><span className="font-sans text-[12px] font-bold truncate">{o.customerName||'Guest'} • ₹{o.total}</span><span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold shrink-0 ${(o.status||'pending').toLowerCase()==='delivered' ? 'bg-[#E7F3EA] text-[#1a5a3a]' : (o.status||'pending').toLowerCase()==='pending' ? 'bg-[#FEF3D6] text-[#B97A0A]' : 'bg-[#E8EFFA] text-[#2B4C8C]'}`}>{(o.status||'pending').toUpperCase()}</span></div><div className="font-sans text-[11px] opacity-60 mt-1">{o.items?.length||1} items • {formatDateTime(o.date)}</div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-[20px] border border-black/5 shadow-sm p-6"><h3 className="font-serif text-[18px] font-bold">Top Customers</h3><div className="mt-4 space-y-3">{users.sort((a,b)=>b.totalSpent-a.totalSpent).slice(0,5).map((u,idx)=>(<div key={u.id} className={`flex gap-3 p-2.5 rounded-[12px] border hover:shadow-sm transition ${idx===0 ? 'bg-[#FFFBEF] border-[#C9A227]/40' : 'bg-[#FAF8F5] border-black/[0.04]'}`}><div className="relative shrink-0"><div className="w-9 h-9 rounded-full bg-[#1a5a3a] text-white grid place-items-center font-bold text-[11px] ring-2 ring-[#C9A227]/50">{u.name[0]}</div>{idx===0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#C9A227] text-[#0F2A1D] grid place-items-center text-[9px] font-bold">★</span>}</div><div className="flex-1 min-w-0"><button onClick={()=>setSelectedUser(u)} title="View full history" className="font-sans text-[12px] font-bold text-left hover:text-[#1a5a3a] hover:underline cursor-pointer truncate block">{u.name} →</button><div className="font-sans text-[10px] opacity-60">{u.totalOrders} purchases • ₹{u.totalSpent}</div></div></div>))}{users.length===0 && <div className="py-8 text-center opacity-40 font-sans text-[12px]">No users yet</div>}</div></div>
            </div>
          </div>
        )}

        {activeTab==='users' && (
          <div className="mt-6 space-y-6">
            <div className="bg-[#0F2A1D] rounded-[24px] px-7 py-7 text-white shadow-[0_20px_50px_rgba(15,42,29,0.25)]" style={{animation:'fadeUp .4s ease both'}}>
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div><div className="font-sans text-[10px] tracking-[0.22em] text-white/60 font-bold">CUSTOMER MANAGEMENT</div><div className="font-serif text-[34px] font-bold mt-1 leading-none">Users</div><div className="h-[2px] bg-[#C9A227]/70 rounded-full mt-3 w-[120px]" /></div>
                <div className="text-right"><div className="font-sans text-[10px] tracking-[0.18em] text-white/60 font-bold">TOTAL USERS</div><div className="font-serif text-[36px] font-bold mt-1 leading-none text-[#C9A227]">{totalUsers}</div><div className="font-sans text-[11px] text-white/60 mt-1">{users.filter(u=>u.status==='Active').length} active now</div></div>
              </div>
            </div>
          <div className="bg-white rounded-[20px] border border-black/5 shadow-sm p-6">
            <div className="flex justify-between items-center flex-wrap gap-3"><h3 className="font-serif text-[20px] font-bold">Users • Login • Logout • Purchases</h3><div className="flex gap-2"><input value={searchUser} onChange={e=>setSearchUser(e.target.value)} placeholder="Search user or email" className="h-9 w-[220px] rounded-full border px-4 font-sans text-[11px]" /><button onClick={fetchOrdersAndUsers} className="h-9 px-4 rounded-full border bg-white font-sans text-[11px] font-bold">↻ Refresh</button></div></div>
                  {/* ADMIN - ALAG SECTION. Users table me Admin kabhi nahi aayega. */}
      {adminUser && (
        <button onClick={()=>setSelectedUser(adminUser)} className="w-full mt-5 p-4 rounded-[16px] bg-[#0F2A1D] text-white flex items-center gap-4 text-left hover:bg-[#143523] transition cursor-pointer">
          <div className="w-11 h-11 rounded-full bg-white/15 grid place-items-center font-bold shrink-0">A</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2"><span className="font-sans text-[13px] font-bold">Admin</span><span className="text-[9px] px-2 py-0.5 rounded-full bg-white/20 font-bold tracking-wider">ADMIN ACCOUNT</span></div>
            <div className="font-sans text-[11px] opacity-60 truncate">{adminUser.email || 'admin@eco-essence.in'} • Not counted in customers</div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-sans text-[11px] opacity-60">Login: {formatDateTime(adminUser.loginAt)}</div>
            <div className="font-sans text-[11px] opacity-60">{adminUser.logoutAt ? ('Logout: ' + formatDateTime(adminUser.logoutAt)) : 'Active now'}</div>
          </div>
          <div className="font-sans text-[12px] font-bold shrink-0">View →</div>
        </button>
      )}
<div className="mt-6 overflow-auto"><table className="w-full text-left border-collapse"><thead><tr className="border-b border-black/10"><th className="py-3 font-sans text-[11px] opacity-40">USER</th><th className="py-3 font-sans text-[11px] opacity-40">EMAIL</th><th className="py-3 font-sans text-[11px] opacity-40">LOGIN AT</th><th className="py-3 font-sans text-[11px] opacity-40">LOGOUT AT</th><th className="py-3 font-sans text-[11px] opacity-40">PURCHASES</th><th className="py-3 font-sans text-[11px] opacity-40">TOTAL</th><th className="py-3 font-sans text-[11px] opacity-40">STATUS</th></tr></thead><tbody>{filteredUsers.map(u=>(<tr key={u.id} className="border-b border-black/[0.04] hover:bg-[#FAF8F5] transition"><td className="py-4"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-full bg-[#1a5a3a] text-white grid place-items-center font-bold text-[11px]">{u.name[0]?.toUpperCase()}</div><div><button onClick={()=>setSelectedUser(u)} title="View full history" className="font-sans text-[12px] font-bold text-left hover:text-[#1a5a3a] hover:underline cursor-pointer">{u.name} →</button></div></div></td><td className="py-4 font-sans text-[11px]">{u.email}</td><td className="py-4 font-sans text-[11px]">{formatDateTime(u.loginAt)}</td><td className="py-4 font-sans text-[11px]">{u.logoutAt ? formatDateTime(u.logoutAt) : <span className="px-2 py-0.5 rounded-full bg-[#F0F7F0] text-[#1a5a3a] text-[10px] font-bold">Active now</span>}</td><td className="py-4 font-sans text-[12px] font-bold">{u.totalOrders} orders</td><td className="py-4 font-sans text-[12px] font-bold">₹{u.totalSpent.toLocaleString()}</td><td className="py-4"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#1a5a3a] text-white">{u.status}</span></td></tr>))}</tbody></table>{filteredUsers.length===0 && <div className="py-16 text-center opacity-40 font-sans text-[12px]">No users yet</div>}</div>
          </div>
          </div>
        )}


        {activeTab==='orders' && (
          <div className="mt-6 space-y-6">
            {/* HERO BAND - Analytics page jaisa deep green + gold */}
            <div className="bg-[#0F2A1D] rounded-[24px] px-7 py-7 text-white shadow-[0_20px_50px_rgba(15,42,29,0.25)]" style={{animation:'fadeUp .4s ease both'}}>
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-sans text-[10px] tracking-[0.22em] text-white/60 font-bold">ORDER MANAGEMENT</div>
                  <div className="font-serif text-[34px] font-bold mt-1 leading-none">Orders</div>
                  <div className="h-[2px] bg-[#C9A227]/70 rounded-full mt-3 w-[120px]" />
                </div>
                <div className="text-right">
                  <div className="font-sans text-[10px] tracking-[0.18em] text-white/60 font-bold">TOTAL ORDERS</div>
                  <div className="font-serif text-[36px] font-bold mt-1 leading-none text-[#C9A227]">{orders.length}</div>
                  <div className="font-sans text-[11px] text-white/60 mt-1">{orders.filter(o=>(o.status||'pending').toLowerCase()==='pending').length} pending • ₹{orders.reduce((s,o)=>s+Number(o.total||0),0).toLocaleString()} total</div>
                  <button onClick={()=>setShowOfflineBill(true)} className="mt-3 h-9 px-4 rounded-full bg-[#C9A227] text-[#0F2A1D] font-sans text-[11px] font-bold hover:opacity-90 transition">＋ New Offline Bill</button>
                </div>
              </div>
            </div>
            {/* ORDER CARDS - status ke hisaab se accent colour, Analytics ke stat cards jaisa */}
            <div className="space-y-4">
              {orders.length===0 && <div className="py-16 text-center opacity-40 font-sans text-[12px] bg-white rounded-[20px] border">No orders yet</div>}
              {orders.map((o, idx)=>{ const st=(o.status||'pending').toLowerCase(); const accent = st==='delivered' ? 'border-l-[#1a5a3a]' : st==='pending' ? 'border-l-[#E8A020]' : st==='out-for-delivery' ? 'border-l-[#2B4C8C]' : st==='shipped' ? 'border-l-[#7C5CD6]' : 'border-l-[#C9A227]'; const pill = st==='delivered' ? 'bg-[#E7F3EA] text-[#1a5a3a]' : st==='pending' ? 'bg-[#FEF3D6] text-[#B97A0A]' : st==='out-for-delivery' ? 'bg-[#E8EFFA] text-[#2B4C8C]' : st==='shipped' ? 'bg-[#F1ECFF] text-[#5B3FBF]' : 'bg-[#FFFBEF] text-[#8A6D1B]'; return (
                <div key={o.id||o._id} className={`bg-white rounded-[20px] border border-black/5 border-l-4 ${accent} shadow-sm p-5 flex gap-4 items-center hover:shadow-md hover:-translate-y-0.5 transition`} style={{animation:'fadeUp .4s ease both', animationDelay:(idx*60)+'ms'}}>
                  <div className="w-12 h-12 rounded-full bg-[#1a5a3a] text-white grid place-items-center font-bold text-[14px] shrink-0 ring-2 ring-[#C9A227]/40">{(o.customerName||'G')[0]?.toUpperCase()}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap"><span className="font-sans text-[13px] font-bold">{o.customerName||'Guest'}</span><span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${pill}`}>{(o.status||'pending').toUpperCase()}</span>{o.payment?.methodLabel && <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#F0F7F0] text-[#1a5a3a]">{o.payment.methodLabel}</span>}</div>
                    <div className="font-sans text-[12px] mt-1"><span className="font-bold text-[#0F2A1D]">₹{o.total}</span><span className="opacity-50"> • {o.items?.length||1} items</span></div>
                    <div className="font-sans text-[11px] opacity-60 mt-0.5 truncate">{formatDateTime(o.date)} • 📍 {o.address?.full||'Ahmedabad'}</div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0 items-end">
                    <select value={o.status||'pending'} onChange={e=>updateOrderStatus(o.id||o._id, e.target.value)} className={`h-10 rounded-full border px-4 font-sans text-[11px] font-bold cursor-pointer ${pill}`}><option value="pending">Pending</option><option value="out-for-delivery">Out for Delivery</option><option value="shipped">Shipped</option><option value="completed">Completed</option><option value="delivered">Delivered</option></select>
                    <button onClick={()=>setBillOrder(o)} className="h-9 px-4 rounded-full bg-[#0F2A1D] text-white font-sans text-[11px] font-bold hover:bg-[#1a5a3a] transition">🧾 View Bill</button>
                    <button onClick={()=>sendOrderWhatsApp(o)} className="h-9 px-4 rounded-full bg-[#25D366] text-white font-sans text-[11px] font-bold hover:opacity-90 transition">Send on WhatsApp →</button>
                    <span className="font-sans text-[10px] opacity-50">{waNumber(o) ? `to +${waNumber(o)}` : '⚠ No valid number'}</span>
                  </div>
                </div>
              );})}
            </div>
          </div>
        )}

        {billOrder && <Bill order={billOrder} onClose={()=>setBillOrder(null)} />}

        {showOfflineBill && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[2px] grid place-items-center p-4" onClick={()=>setShowOfflineBill(false)}>
            <div className="bg-white w-full max-w-[520px] rounded-[24px] shadow-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
              <div className="flex justify-between items-center"><h3 className="font-serif text-[22px] font-bold">🏪 New Offline Bill</h3><button onClick={()=>setShowOfflineBill(false)} className="w-8 h-8 rounded-full border grid place-items-center">✕</button></div>
              <p className="font-sans text-[11px] opacity-50 mt-1">Counter pe khade customer ke liye — bharo, bill banao, print karke de do.</p>
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input value={offlineForm.name} onChange={e=>setOfflineForm({...offlineForm, name: e.target.value})} placeholder="Customer naam *" className="h-11 rounded-full border px-4 text-[13px]" />
                  <input value={offlineForm.phone} onChange={e=>setOfflineForm({...offlineForm, phone: e.target.value.replace(/\D/g,'').slice(0,10)})} placeholder="Phone • 10 digit *" inputMode="numeric" className="h-11 rounded-full border px-4 text-[13px]" />
                </div>
                {offlineForm.items.map((it, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input value={it.name} onChange={e=>setOfflineForm({...offlineForm, items: offlineForm.items.map((x,i)=>i===idx?{...x, name:e.target.value}:x)})} placeholder={`Item ${idx+1} naam *`} className="flex-1 h-11 rounded-full border px-4 text-[13px]" />
                    <input value={it.price} onChange={e=>setOfflineForm({...offlineForm, items: offlineForm.items.map((x,i)=>i===idx?{...x, price:e.target.value.replace(/\D/g,'')}:x)})} placeholder="₹ Price" inputMode="numeric" className="w-[90px] h-11 rounded-full border px-3 text-[13px]" />
                    <input value={it.qty} onChange={e=>setOfflineForm({...offlineForm, items: offlineForm.items.map((x,i)=>i===idx?{...x, qty:e.target.value.replace(/\D/g,'').slice(0,2)||1}:x)})} placeholder="Qty" inputMode="numeric" className="w-[60px] h-11 rounded-full border px-3 text-[13px] text-center" />
                    {offlineForm.items.length > 1 && <button onClick={()=>setOfflineForm({...offlineForm, items: offlineForm.items.filter((_,i)=>i!==idx)})} className="w-11 h-11 rounded-full bg-[#FEF2F2] text-red-600 font-bold shrink-0">×</button>}
                  </div>
                ))}
                <button onClick={()=>setOfflineForm({...offlineForm, items: [...offlineForm.items, { name: '', price: '', qty: 1 }]})} className="h-9 px-4 rounded-full border font-sans text-[11px] font-bold">＋ Add Item</button>
                <div className="grid grid-cols-2 gap-2">
                  <select value={offlineForm.payMethod} onChange={e=>setOfflineForm({...offlineForm, payMethod: e.target.value})} className="h-11 rounded-full border px-4 text-[13px]"><option>Cash</option><option>UPI</option><option>Card</option></select>
                  <input value={offlineForm.deliveryFee} onChange={e=>setOfflineForm({...offlineForm, deliveryFee: e.target.value.replace(/\D/g,'')})} placeholder="Delivery ₹ (0 = free)" inputMode="numeric" className="h-11 rounded-full border px-4 text-[13px]" />
                </div>
                <div className="flex justify-between font-bold font-sans text-[13px] bg-[#F0F7F0] rounded-[10px] px-3 py-2.5"><span>Total</span><span className="text-[#1a5a3a]">₹{(offlineForm.items.reduce((s,it)=>s + Number(it.price||0)*Math.max(1,Number(it.qty||1)), 0) + Number(offlineForm.deliveryFee||0)).toLocaleString()}</span></div>
                <button onClick={saveOfflineBill} className="w-full h-12 rounded-full bg-[#0F2A1D] text-white font-sans text-[13px] font-bold hover:bg-[#1a5a3a] transition">🧾 Create Bill & Print →</button>
                <div className="font-sans text-[10px] opacity-50 text-center">Bill banne ke baad Print / Bill Image / WhatsApp ke options khulenge.</div>
              </div>
            </div>
          </div>
        )}

{activeTab==='plants' && (
          <div className="mt-6 grid lg:grid-cols-[400px_1fr] gap-6 items-start">
            <div id="plant-form" className="bg-white rounded-[24px] border border-black/5 border-t-4 border-t-[#C9A227] shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[10px] tracking-[0.2em] font-bold opacity-40">{editingId ? ('EDITING • ' + (form.name || 'Plant')) : 'NEW PLANT'}</div>
                {editingId && <button onClick={cancelEdit} className="h-7 px-3 rounded-full border font-sans text-[10px] font-bold">Cancel Edit ×</button>}
              </div>
              {editingId && <div className="mt-2 p-2 rounded-[10px] bg-[#F0F7F0] font-sans text-[11px] font-bold text-[#1a5a3a]">Editing {form.name} — Update to save</div>}
              <div className="mt-4"><div className="flex justify-between mb-2"><div className="text-[11px] font-bold opacity-60 font-sans">PRODUCT IMAGES</div><button type="button" onClick={addImageSlot} className="w-7 h-7 rounded-full bg-black text-white grid place-items-center text-[16px] font-bold">+</button></div><div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto">{images.map((imgSlot, idx)=>(<div key={imgSlot.id} className="relative border-2 border-dashed rounded-[14px] p-2 bg-[#FAF8F5]"><div className="font-sans text-[10px] font-bold">{idx===0 ? 'Main Image *' : `Image ${idx+1}`}</div><div className="mt-1 bg-white rounded-[8px] border overflow-hidden min-h-[60px] grid place-items-center">{imgSlot.data ? <img src={imgSlot.data} className="w-full h-[60px] object-cover" alt=""/> : <span className="opacity-20">🖼</span>}</div><input type="file" accept="image/*" onChange={(e)=>handleImage(e.target.files[0], imgSlot.id)} className="mt-1.5 text-[9px] w-full" /></div>))}</div></div>
              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-[1.2fr_0.8fr] gap-2"><input name="name" value={form.name} onChange={handleChange} placeholder="Name * Tulip" className="h-10 rounded-full border px-4 text-[13px]" /><input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price *" className="h-10 rounded-full border px-4 text-[13px]" /></div>
                <input name="botanical" value={form.botanical} onChange={handleChange} placeholder="Botanical name" className="w-full h-10 rounded-full border px-4 text-[12px]" />
                <div className="grid grid-cols-2 gap-2"><select name="category" value={form.category} onChange={handleChange} className="h-10 rounded-full border px-3 text-[12px]"><option>Indoor</option><option>Flower</option><option>Herb</option><option>Fruits</option><option>Veggie</option><option>Fragrant</option><option>Outdoor</option></select><select name="careLight" value={form.careLight} onChange={handleChange} className="h-10 rounded-full border px-3 text-[12px]"><option>Bright indirect</option><option>Full sun</option><option>Low light</option><option>Direct sun</option></select></div>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description — About The Product" className="w-full p-3 rounded-[14px] border text-[12px] h-[70px]" />
                <textarea name="care" value={form.care} onChange={handleChange} placeholder="Care guide" className="w-full p-3 rounded-[14px] border text-[12px] h-[50px]" />
                <div className="p-4 rounded-[16px] bg-[#FAF8F5] border space-y-3"><div className="font-serif font-bold text-[13px] text-[#1a5a3a]">Pot Status</div><select name="potStatus" value={form.potStatus} onChange={handleChange} className="w-full h-11 rounded-full border px-5 text-[13px] bg-white font-bold"><option value="No Pot">No Pot — Buy pot separately</option><option value="With Pot">With Pot — Image includes pot</option></select>{form.potStatus!=='No Pot' && (<div className="grid grid-cols-3 gap-2"><select name="potColor" value={form.potColor} onChange={handleChange} className="h-11 rounded-full border px-3 text-[12px] bg-white"><option>No Pot</option><option>Ivory</option><option>Terracotta</option><option>Charcoal</option><option>Sage</option></select><select name="potSize" value={form.potSize} onChange={handleChange} className="h-11 rounded-full border px-3 text-[12px] bg-white"><option>4"</option><option>6"</option><option>8"</option></select><input name="potPrice" value={form.potPrice} onChange={handleChange} placeholder="Pot price optional" className="h-11 rounded-full border px-3 text-[12px] bg-white" /></div>)}</div>
                <label className="flex items-center gap-2 p-3 rounded-[14px] bg-[#FFFEF9] border cursor-pointer"><input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4" /><span className="font-sans text-[12px] font-bold">Show in Home? (Featured)</span></label>
                <button onClick={handleSubmit} disabled={loading} className="w-full h-11 rounded-full bg-[#1a5a3a] hover:bg-black transition text-white text-[13px] font-bold shadow-sm">{loading?'Saving...':editingId?`Update ${form.name}`:`Add Plant • ${images.filter(i=>i.data).length||1} Images`}</button>
              </div>
              {msg&&<div className="mt-3 p-3 rounded-[12px] bg-[#F0F7F0] text-[11px] text-center">{msg}</div>}
            </div>
            <div className="bg-white rounded-[24px] border border-black/5 shadow-sm p-6"><div className="flex justify-between items-center"><h3 className="text-[11px] tracking-[0.15em] font-bold opacity-40 font-sans">CATALOGUE • {plants.length} PLANTS</h3><button onClick={fetchPlants} className="text-[11px] px-3 py-1.5 rounded-full border bg-white font-sans">↻ Refresh</button></div>
            <div className="mt-3 flex gap-2">
              <input value={plantSearch} onChange={e=>setPlantSearch(e.target.value)} placeholder="Search plants…" className="flex-1 h-10 rounded-full border px-4 text-[12px]" />
              <select value={plantCat} onChange={e=>setPlantCat(e.target.value)} className="h-10 rounded-full border px-3 text-[12px]"><option>All</option><option>Indoor</option><option>Flower</option><option>Herb</option><option>Fruits</option><option>Veggie</option><option>Fragrant</option><option>Outdoor</option></select>
            </div>
            <div className="mt-2 font-sans text-[11px] opacity-50">Showing {plants.filter(p=>(plantCat==='All'||p.category===plantCat)&&(p.name||p.title||'').toLowerCase().includes(plantSearch.toLowerCase())).length} of {plants.length} plants</div>
            <div className="mt-4 grid md:grid-cols-2 gap-3">{plants.filter(p=>(plantCat==='All'||p.category===plantCat)&&(p.name||p.title||'').toLowerCase().includes(plantSearch.toLowerCase())).map(p=>{ const isEditing = String(editingId)===String(p._id||p.id); const potLabel = (p.potStatus && p.potStatus!=='No Pot') ? ('With Pot • ' + (p.potColor||'')) : 'No Pot'; return (<div key={p._id||p.id} className={'flex gap-3 p-3 rounded-[14px] border hover:shadow-md hover:-translate-y-0.5 transition ' + (isEditing ? 'bg-[#F0F7F0] border-[#1a5a3a] ring-1 ring-[#1a5a3a]' : 'bg-[#FAF8F5]')}><div className="w-14 h-14 rounded-[10px] overflow-hidden border shrink-0 bg-white"><img src={getImageUrl(p)} className="w-full h-full object-cover" alt=""/></div><div className="flex-1 min-w-0"><div className="font-serif text-[13px] font-bold truncate">{p.name||p.title} {isEditing && <span className="text-[10px] text-[#1a5a3a]">• EDITING</span>}</div><div className="text-[11px] opacity-60 font-sans">₹{p.price} • {p.category} • {p.images?.length||1} images • {potLabel}</div><div className="flex gap-2 mt-2"><button onClick={()=>handleEdit(p)} className="h-7 px-3 rounded-full bg-[#1a5a3a] text-white text-[10px] font-bold">{isEditing ? 'Editing...' : 'Edit'}</button><button onClick={()=>handleDelete(p._id||p.id)} className="h-7 px-3 rounded-full bg-[#FEF2F2] text-red-600 text-[10px] font-bold">Delete</button></div></div></div>); })}</div></div>
          </div>
        )}
        {activeTab==='pots' && (
          <div className="mt-6 grid lg:grid-cols-[400px_1fr] gap-6 items-start">
            <div id="pot-form" className="bg-white rounded-[24px] border border-black/5 border-t-4 border-t-[#C9A227] shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[10px] tracking-[0.2em] font-bold opacity-40">{editingPotId ? ('EDITING • ' + (potForm.name || 'Pot')) : 'NEW POT'}</div>
                {editingPotId && <button onClick={cancelEditPot} className="h-7 px-3 rounded-full border font-sans text-[10px] font-bold">Cancel Edit ×</button>}
              </div>
              {editingPotId && <div className="mt-2 p-2 rounded-[10px] bg-[#F0F7F0] font-sans text-[11px] font-bold text-[#1a5a3a]">Editing {potForm.name} — Update to save</div>}
              <div className="mt-4"><div className="flex justify-between mb-2"><div className="text-[11px] font-bold opacity-60 font-sans">POT PHOTOS</div><button type="button" onClick={addPotImageSlot} className="w-7 h-7 rounded-full bg-black text-white grid place-items-center text-[16px] font-bold">+</button></div><div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto">{potImages.map((imgSlot, idx)=>(<div key={imgSlot.id} className="relative border-2 border-dashed rounded-[14px] p-2 bg-[#FAF8F5]"><button type="button" onClick={()=>setPotImages(prev=>prev.filter(x=>x.id!==imgSlot.id))} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black text-white text-[10px] grid place-items-center">×</button><div className="font-sans text-[10px] font-bold">{idx===0 ? 'Main Photo *' : `Photo ${idx+1}`}</div><div className="mt-1 bg-white rounded-[8px] border overflow-hidden min-h-[60px] grid place-items-center">{imgSlot.data ? <img src={imgSlot.data} className="w-full h-[60px] object-cover" alt=""/> : <span className="opacity-20">🖼</span>}</div><input type="file" accept="image/*" onChange={(e)=>handlePotImage(e.target.files[0], imgSlot.id)} className="mt-1.5 text-[9px] w-full" /></div>))}</div></div>
              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-[1.2fr_0.8fr] gap-2"><input value={potForm.name} onChange={e=>setPotForm({...potForm, name: e.target.value})} placeholder="Pot name * Ceramic Pots" className="h-10 rounded-full border px-4 text-[13px]" /><input value={potForm.price} onChange={e=>setPotForm({...potForm, price: e.target.value})} type="number" placeholder="Price *" className="h-10 rounded-full border px-4 text-[13px]" /></div>
                <select value={potForm.category} onChange={e=>setPotForm({...potForm, category: e.target.value})} className="w-full h-10 rounded-full border px-3 text-[12px]">{POT_CATEGORIES.map(c=>(<option key={c}>{c}</option>))}</select>
                <textarea value={potForm.description} onChange={e=>setPotForm({...potForm, description: e.target.value})} placeholder="Description — About this pot" className="w-full p-3 rounded-[14px] border text-[12px] h-[60px]" />
                <div className="p-4 rounded-[16px] bg-[#FAF8F5] border space-y-3">
                  <div className="flex justify-between items-center"><div className="font-serif font-bold text-[13px] text-[#1a5a3a]">Colour Variants</div><button type="button" onClick={addPotColour} className="h-7 px-3 rounded-full bg-black text-white text-[10px] font-bold">+ Add Colour</button></div>
                  {potColours.map((c)=>(
                    <div key={c.id} className="p-3 rounded-[12px] bg-white border space-y-2">
                      <div className="grid grid-cols-[1fr_44px_0.7fr] gap-2 items-center"><input value={c.name} onChange={e=>setPotColours(prev=>prev.map(x=>x.id===c.id?{...x, name:e.target.value}:x))} placeholder="Colour name — e.g. Sage" className="h-9 rounded-full border px-3 text-[12px]" /><input type="color" value={c.hex} onChange={e=>setPotColours(prev=>prev.map(x=>x.id===c.id?{...x, hex:e.target.value}:x))} className="w-11 h-9 rounded-[8px] border cursor-pointer" /><input value={c.extra} onChange={e=>setPotColours(prev=>prev.map(x=>x.id===c.id?{...x, extra:e.target.value}:x))} type="number" placeholder="+ ₹ extra" className="h-9 rounded-full border px-3 text-[12px]" /></div>
                      <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full border shrink-0" style={{background:c.hex}}></span><span className="font-sans text-[11px] opacity-60 flex-1">{c.name||'Colour'} • + ₹{Number(c.extra||0)} {c.image ? '• photo added ✓' : '• no photo'}</span><label className="h-7 px-3 rounded-full border text-[10px] font-bold grid place-items-center cursor-pointer">Photo<input type="file" accept="image/*" className="hidden" onChange={(e)=>handlePotColourImage(e.target.files[0], c.id)} /></label>{potColours.length>1 && <button type="button" onClick={()=>setPotColours(prev=>prev.filter(x=>x.id!==c.id))} className="h-7 px-2 rounded-full bg-[#FEF2F2] text-red-600 text-[11px] font-bold">×</button>}</div>
                    </div>
                  ))}
                </div>
                <button onClick={handlePotSubmit} disabled={potLoading} className="w-full h-11 rounded-full bg-[#1a5a3a] hover:bg-black transition text-white text-[13px] font-bold shadow-sm">{potLoading?'Saving...':editingPotId?`Update ${potForm.name}`:`Add Pot • ${potImages.filter(i=>i.data).length||1} Photos`}</button>
              </div>
              {potMsg&&<div className="mt-3 p-3 rounded-[12px] bg-[#F0F7F0] text-[11px] text-center">{potMsg}</div>}
            </div>
            <div className="bg-white rounded-[24px] border border-black/5 shadow-sm p-6"><div className="flex justify-between items-center"><h3 className="text-[11px] tracking-[0.15em] font-bold opacity-40 font-sans">POTS • {pots.length} POTS</h3><div className="flex gap-2"><button onClick={handleSyncPotsClick} disabled={potSyncing} className="text-[11px] px-3 py-1.5 rounded-full bg-[#1a5a3a] text-white font-sans font-bold">{potSyncing?'Syncing...':'↻ Sync to Server'}</button><button onClick={()=>window.open('/pots','_blank')} className="text-[11px] px-3 py-1.5 rounded-full border bg-white font-sans">View Pots Page →</button></div></div>
            <div className="mt-3"><input value={potSearch} onChange={e=>setPotSearch(e.target.value)} placeholder="Search pots…" className="w-full h-10 rounded-full border px-4 text-[12px]" /></div>
            <div className="mt-2 font-sans text-[11px] opacity-50">Showing {pots.filter(x=>(x.name||'').toLowerCase().includes(potSearch.toLowerCase())).length} of {pots.length} pots</div>
            <div className="mt-4 grid md:grid-cols-2 gap-3">{pots.filter(x=>(x.name||'').toLowerCase().includes(potSearch.toLowerCase())).map(x=>{ const isEditing = String(editingPotId)===String(x._id||x.id); const firstImg = (x.images && x.images[0]) || x.image || x.imageUrl || ''; return (<div key={x._id||x.id} className={'flex gap-3 p-3 rounded-[14px] border hover:shadow-md hover:-translate-y-0.5 transition ' + (isEditing ? 'bg-[#F0F7F0] border-[#1a5a3a] ring-1 ring-[#1a5a3a]' : 'bg-[#FAF8F5]')}><div className="w-14 h-14 rounded-[10px] overflow-hidden border shrink-0 bg-white">{firstImg ? <img src={firstImg} className="w-full h-full object-cover" alt=""/> : <div className="w-full h-full grid place-items-center opacity-20">🪴</div>}</div><div className="flex-1 min-w-0"><div className="font-serif text-[13px] font-bold truncate">{x.name} {isEditing && <span className="text-[10px] text-[#1a5a3a]">• EDITING</span>}</div><div className="text-[11px] opacity-60 font-sans">₹{x.price} • {x.category} • {(x.images||[]).length||1} photos • {(x.colours||[]).length||1} colours</div><div className="flex gap-1.5 mt-1 flex-wrap">{(x.colours||[]).slice(0,5).map((c,i)=>(<span key={i} className="w-4 h-4 rounded-full border inline-block" title={c.name} style={{background:c.hex}}></span>))}</div><div className="flex gap-2 mt-2"><button onClick={()=>handleEditPot(x)} className="h-7 px-3 rounded-full bg-[#1a5a3a] text-white text-[10px] font-bold">{isEditing ? 'Editing...' : 'Edit'}</button><button onClick={()=>handleDeletePot(x._id||x.id)} className="h-7 px-3 rounded-full bg-[#FEF2F2] text-red-600 text-[10px] font-bold">Delete</button></div></div></div>); })}</div></div>
          </div>
        )}

        {activeTab==='bin' && (<div className="mt-6 bg-white rounded-[20px] border border-black/5 border-t-4 border-t-[#B91C1C] shadow-sm p-6"><div className="flex justify-between items-center flex-wrap gap-2"><h3 className="font-serif text-[18px] font-bold">Deleted Bin</h3><div className="font-sans text-[11px] opacity-50">{deletedBin.length} item{deletedBin.length!==1?'s':''} • {deletedBin.filter(x=>x.kind==='pot').length} pots • {deletedBin.filter(x=>x.kind!=='pot').length} plants</div></div><div className="font-sans text-[11px] opacity-50 mt-1">Restore brings it back to Plants or Pots • Delete Permanently removes it forever</div><div className="mt-4 grid md:grid-cols-3 gap-3">{deletedBin.length===0&&<div className="opacity-40 text-[12px]">Bin empty</div>}{deletedBin.map(p=>(<div key={p._id||p.id} className="p-3 rounded-[12px] bg-[#FAF8F5] border hover:bg-white hover:shadow-md transition flex gap-3"><img src={getImageUrl(p)} className="w-12 h-12 rounded-[10px] object-cover shrink-0"/><div className="min-w-0"><div className="flex items-center gap-1.5 flex-wrap"><span className="text-[13px] font-bold truncate">{p.name||p.title}</span><span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#1a5a3a] text-white">{p.kind==='pot' ? 'Pot' : 'Plant'}</span></div><div className="font-sans text-[11px] opacity-60">₹{p.price} • {p.category} {p.deletedAt ? `• Deleted ${new Date(p.deletedAt).toLocaleDateString()}` : ''}</div><div className="flex gap-1.5 mt-1.5 flex-wrap"><button onClick={()=>handleRestore(p)} className="h-7 px-3 rounded-full bg-[#1a5a3a] hover:bg-black transition text-white text-[11px] font-bold">Restore</button><button onClick={()=>handlePermanentDelete(p)} className="h-7 px-3 rounded-full bg-[#FEF2F2] text-red-600 text-[11px] font-bold">Delete Permanently</button></div></div></div>))}</div></div>)}
                  {/* USER DETAIL MODAL - wide, centered, structured, classic + vibrant */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes popIn{from{opacity:0;transform:scale(.96) translateY(14px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
          <div onClick={()=>setSelectedUser(null)} className="fixed inset-0 bg-black/45 backdrop-blur-[2px]" style={{animation:'fadeIn .25s ease'}} />
          <div className="relative min-h-full flex items-center justify-center p-4 sm:p-6">
            <div className="relative w-[720px] max-w-[94vw] max-h-[90vh] overflow-y-auto bg-[#FCFBF8] rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.3)]" style={{animation:'popIn .35s cubic-bezier(.22,1,.36,1)'}}>
              <button onClick={()=>setSelectedUser(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 text-white grid place-items-center font-bold hover:bg-white hover:text-black transition z-10">×</button>
              {/* Header - deep green band, gold divider */}
              <div className="bg-[#0F2A1D] rounded-t-[28px] px-7 pt-8 pb-6 text-center text-white">
                <div className="w-[72px] h-[72px] rounded-full bg-[#1a5a3a] text-white grid place-items-center font-bold text-[26px] mx-auto ring-4 ring-[#C9A227]/70 shadow">{selectedUser.name[0]?.toUpperCase()}</div>
                <div className="font-serif text-[30px] font-bold mt-3 leading-tight">{selectedUser.name}</div>
                <div className="font-sans text-[12px] text-white/70 mt-1">{selectedUser.email || 'No email'}{selectedUser.phone ? ('  •  ' + selectedUser.phone) : ''}</div>
                <div className="mt-4"><span className="inline-block text-[10px] px-4 py-1.5 rounded-full bg-[#C9A227] text-[#0F2A1D] font-bold tracking-[0.15em]">{(selectedUser.status||'Active').toUpperCase()}</span></div>
                <div className="h-[2px] bg-[#C9A227]/60 rounded-full mt-5 mx-auto w-[120px]" />
              </div>
              <div className="p-6 sm:p-7">
                {/* Stats - 3 vibrant cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="rounded-[18px] bg-white border border-black/5 shadow-sm p-4 text-center border-t-4 border-t-[#1a5a3a]"><div className="font-sans text-[9px] tracking-[0.18em] text-[#1a5a3a] font-bold">ORDERS</div><div className="font-serif text-[28px] font-bold mt-1 text-[#0F2A1D]">{selectedUser.totalOrders||0}</div><div className="font-sans text-[10px] opacity-40">Total purchases</div></div>
                  <div className="rounded-[18px] bg-white border border-black/5 shadow-sm p-4 text-center border-t-4 border-t-[#C9A227]"><div className="font-sans text-[9px] tracking-[0.18em] text-[#8A6D1B] font-bold">SPENT</div><div className="font-serif text-[28px] font-bold mt-1 text-[#0F2A1D]">₹{Number(selectedUser.totalSpent||0).toLocaleString()}</div><div className="font-sans text-[10px] opacity-40">Lifetime value</div></div>
                  <div className="rounded-[18px] bg-white border border-black/5 shadow-sm p-4 text-center border-t-4 border-t-[#2E7D5B]"><div className="font-sans text-[9px] tracking-[0.18em] text-[#2E7D5B] font-bold">AVG ORDER</div><div className="font-serif text-[28px] font-bold mt-1 text-[#0F2A1D]">₹{selectedUser.totalOrders ? Math.round(Number(selectedUser.totalSpent||0)/selectedUser.totalOrders).toLocaleString() : 0}</div><div className="font-sans text-[10px] opacity-40">Per order</div></div>
                </div>
                {/* Session - Login / Logout, 2 clean columns */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="rounded-[16px] bg-white border border-black/5 p-4"><div className="font-sans text-[9px] tracking-[0.18em] opacity-40 font-bold">LOGIN</div><div className="font-sans text-[12px] font-bold mt-1">{formatDateTime(selectedUser.loginAt)}</div></div>
                  <div className="rounded-[16px] bg-white border border-black/5 p-4"><div className="font-sans text-[9px] tracking-[0.18em] opacity-40 font-bold">LOGOUT</div><div className="font-sans text-[12px] font-bold mt-1">{selectedUser.logoutAt ? formatDateTime(selectedUser.logoutAt) : 'Active now'}</div></div>
                </div>
                {/* Purchase History */}
                <div className="mt-7 flex items-center justify-between"><div className="font-serif text-[22px] font-bold">Purchase History</div><span className="text-[11px] px-3 py-1 rounded-full bg-[#0F2A1D] text-white font-bold">{(selectedUser.orders||[]).length} orders</span></div>
                {(selectedUser.orders||[]).length===0 && <div className="mt-3 py-10 text-center font-sans text-[12px] opacity-40 rounded-[16px] border border-dashed bg-white">No purchases yet</div>}
                <div className="mt-4 space-y-4">
                  {[...(selectedUser.orders||[])].sort((a,b)=> new Date(b.date||b.createdAt||0) - new Date(a.date||a.createdAt||0)).map((o,i)=>(
                    <div key={o.id||o._id||i} className="rounded-[20px] bg-white border border-black/5 shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-black/5">
                        <div><div className="font-sans text-[13px] font-bold">Order #{i+1}</div><div className="font-sans text-[11px] opacity-50">{formatDateTime(o.date||o.createdAt)} • {(o.items||[]).length||1} items</div></div>
                        <div className="text-right shrink-0"><span className="inline-block text-[10px] px-3 py-1 rounded-full font-bold bg-[#E7F3EA] text-[#1a5a3a]">{(o.status||'pending').toUpperCase()}</span><div className="font-serif text-[18px] font-bold mt-1">₹{o.total}</div></div>
                      </div>
                      <div className="px-5 py-3">
                        {(o.items||[]).map((it,j)=>(
                          <div key={j} className="flex items-center gap-3 py-2 border-b border-black/[0.04] last:border-0">
                            <span className="flex-1 font-sans text-[12px] truncate">{it.name||it.title||'Item'}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF8F5] border font-bold shrink-0">× {it.qty||it.quantity||1}</span>
                            <span className="font-sans text-[12px] font-bold w-[70px] text-right shrink-0">₹{Number(it.price||0) * Number(it.qty||it.quantity||1)}</span>
                          </div>
                        ))}
                      </div>
                      {o.address?.full && <div className="px-5 pb-4 font-sans text-[11px] opacity-60 flex gap-2"><span>📍</span><span className="leading-relaxed">{o.address.full}</span></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
