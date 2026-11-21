import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const CARE_MENU = [
  { id: 'water', label: 'Water Guide', icon: '💧', desc: 'How often & how much' },
  { id: 'light', label: 'Sunlight Guide', icon: '☀', desc: 'Direct vs indirect light' },
  { id: 'pet', label: 'Pet Friendly', icon: '🐾', desc: 'Safe for cats & dogs' },
  { id: 'soil', label: 'Soil & Pot', icon: '🪴', desc: 'Best mix & drainage' },
  { id: 'humidity', label: 'Humidity', icon: '🌫', desc: 'Misting & climate' },
  { id: 'propagation', label: 'Propagation', icon: '🌱', desc: 'Grow from cuttings' },
  { id: 'troubleshoot', label: 'Care Fix', icon: '🩺', desc: 'Yellow leaves & pests' },
  { id: 'calendar', label: 'Pan-India Calendar', icon: '📅', desc: 'Season wise care' },
];

const SHOP_MENU = [
  { id: 'All', label: 'All Plants', icon: '🌿', desc: 'Full catalog' },
  { id: 'Fruits', label: 'Fruits', icon: '🍓', desc: 'Strawberry, Avocado' },
  { id: 'Indoor', label: 'Indoor', icon: '🏡', desc: 'Monstera, Ficus' },
  { id: 'Veggie', label: 'Veggie', icon: '🥬', desc: 'Kale, Pumpkin' },
  { id: 'Outdoor', label: 'Outdoor', icon: '☀', desc: 'Sun-loving' },
  { id: 'Flower', label: 'Flower', icon: '🌸', desc: 'Tulip, Petunia' },
  { id: 'Herb', label: 'Herb', icon: '🌿', desc: 'Basil, Mint' },
  { id: 'Fragrant', label: 'Fragrant', icon: '✨', desc: 'Mogra, Lavender' },
];

// IDs must match Pot.jsx FILTERS exactly
const POTS_MENU = [
  { id: 'Terracotta Pots', label: 'Terracotta Pots', desc: 'Classic brown clay' },
  { id: 'Ceramic Pots', label: 'Ceramic Pots', desc: 'White minimal design' },
  { id: 'Metal Planters', label: 'Metal Planters', desc: 'Black matte finish' },
  { id: 'Self-Watering Pots', label: 'Self-Watering Pots', desc: 'Auto water system' },
  { id: 'Plastic Pots', label: 'Plastic Pots', desc: 'Lightweight & durable' },
  { id: 'Hanging Planters', label: 'Hanging Planters', desc: 'For balcony & wall' },
  { id: 'Basket Planters', label: 'Basket Planters', desc: 'Woven natural look' },
  { id: 'Plant Stands', label: 'Plant Stands', desc: 'Wood & metal stands' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [showCare, setShowCare] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showPots, setShowPots] = useState(false);
  const careTimeout = useRef(null);
  const shopTimeout = useRef(null);
  const potsTimeout = useRef(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('plant_jwt_token');
      let name = localStorage.getItem('plant_user_name') || '';
      const email = localStorage.getItem('plant_user_email') || '';
      if(!name || name.toUpperCase()==='USER' || name==='U'){
        if(email && email.includes('@')) name = email.split('@')[0];
        else {
          try{ const o=JSON.parse(localStorage.getItem('eco_orders')||'[]'); if(o[0]?.customerName) name=o[0].customerName.split(' ')[0]; }catch{}
        }
      }
      if(name) name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      setIsLoggedIn(!!token); setUserName(name);
      // ADMIN - true only when admin logged in with the admin password
      const role = localStorage.getItem('eco_user_role');
      const verified = localStorage.getItem('eco_admin_verified') === 'true';
      setIsAdmin(!!token && (role === 'admin' || verified));
      try{
        if(!token){ setCartCount(0); return; }
        // Cart count comes only from this user's key.
        // Never merge generic keys - a leftover item from another user / guest
        // would show a ghost count while the Cart page shows 0.
        if(!email){ setCartCount(0); return; }
        let finalCart = [];
        try{ const a = JSON.parse(localStorage.getItem(`eco_cart_${email}`)||'[]'); if(Array.isArray(a)) finalCart = a; }catch{}
        // Migrate: if an older cart sits in a generic key and this user's cart is empty,
        // move it into this user's cart, otherwise the Cart page shows 0.
        // Never delete cart keys here.
        if(finalCart.length===0){
          try{
            for(const gk of ['eco_cart','cart','eco_shop_cart']){
              const g = JSON.parse(localStorage.getItem(gk)||'[]');
              if(Array.isArray(g) && g.length>0){ finalCart = g; localStorage.setItem(`eco_cart_${email}`, JSON.stringify(g)); localStorage.removeItem(gk); break; }
            }
          }catch{}
        }
        const count = finalCart.reduce((s,i)=>s+(i.qty||i.quantity||1),0);
        setCartCount(count);
      }catch{ setCartCount(0); }
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('eco-cart-updated', checkAuth);
    window.addEventListener('eco-logout', checkAuth);
    const iv=setInterval(checkAuth,1000);
    return()=>{ window.removeEventListener('storage',checkAuth); window.removeEventListener('eco-cart-updated',checkAuth); window.removeEventListener('eco-logout',checkAuth); clearInterval(iv); };
  }, [location.pathname]);

  const handleLogout = () => {
    try{
      const email = localStorage.getItem('plant_user_email') || localStorage.getItem('user_email') || '';
      const name = localStorage.getItem('plant_user_name') || userName || '';
      const logoutAt = new Date().toISOString();
      localStorage.setItem('plant_logout_time', logoutAt);
      const sessions = JSON.parse(localStorage.getItem('eco_user_sessions')||'[]');
      for(let i=sessions.length-1; i>=0; i--){ const s = sessions[i]; if(!s.logoutAt && (s.email===email || s.name===name || s.email===email.toLowerCase())){ s.logoutAt = logoutAt; break; } }
      localStorage.setItem('eco_user_sessions', JSON.stringify(sessions));
    }catch(e){ console.log('logout track error', e); }
    localStorage.removeItem('plant_jwt_token');
    localStorage.removeItem('plant_user_name');
    localStorage.removeItem('plant_user_email');
    localStorage.removeItem('plant_user_phone');
    localStorage.removeItem('plant_login_time');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('eco_user_role');
    localStorage.removeItem('eco_admin_verified');
    setIsAdmin(false);
    // Logout never deletes the cart - it returns when the same user logs in again.
    // The next user never sees the previous cart - the key is per email: eco_cart_<email>.
    // Only reset the displayed count. The saved cart stays in localStorage.
    setIsLoggedIn(false);
    setShowProfile(false);
    setCartCount(0);
    window.dispatchEvent(new Event('eco-cart-updated'));
    navigate('/');
  };

  const isActive = (p) => location.pathname === p || location.pathname.startsWith(p + '/');
  const getInitial = () => userName ? userName[0].toUpperCase() : 'U';
  const getDisplay = () => userName ? (userName.length>10?userName.slice(0,10).toUpperCase():userName.toUpperCase()) : 'USER';

  const handleCareEnter = () => { if(careTimeout.current) clearTimeout(careTimeout.current); setShowCare(true); };
  const handleCareLeave = () => { careTimeout.current=setTimeout(()=>setShowCare(false),200); };
  const handleShopEnter = () => { if(shopTimeout.current) clearTimeout(shopTimeout.current); setShowShop(true); };
  const handleShopLeave = () => { shopTimeout.current=setTimeout(()=>setShowShop(false),200); };
  const handlePotsEnter = () => { if(potsTimeout.current) clearTimeout(potsTimeout.current); setShowPots(true); };
  const handlePotsLeave = () => { potsTimeout.current=setTimeout(()=>setShowPots(false),200); };

  const goToCare = (id,e) => { if(e){e.preventDefault(); e.stopPropagation();} setShowCare(false); setShowMobile(false); navigate(`/care-guide#${id}`); setTimeout(()=>{const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth'});},150); };
  const goToShop = (catId,e) => { if(e){e.preventDefault(); e.stopPropagation();} setShowShop(false); setShowMobile(false); navigate(`/shop?category=${catId}`); };
  // POTS -> /pots?category=...
  const goToPots = (potId,e) => { if(e){e.preventDefault(); e.stopPropagation();} setShowPots(false); setShowMobile(false); window.location.href = `/pots?category=${encodeURIComponent(potId)}`; };
  const goToAllPots = (e) => { if(e){e.preventDefault(); e.stopPropagation();} setShowPots(false); setShowMobile(false); window.location.href = '/pots'; };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');
        .font-serif{font-family:"Instrument Serif",serif} .font-sans{font-family:"Inter",sans-serif}
      `}</style>
      <nav className="w-full h-[68px] bg-[#FAF8F5]/95 backdrop-blur-md border-b border-black/[0.06] sticky top-0 z-[100] flex items-center">
        <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif italic text-[24px] text-[#1a5a3a] tracking-[-0.02em]">Eco-Essence.</span><span className="text-[18px]">🌿</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <div className="relative" onMouseEnter={handleShopEnter} onMouseLeave={handleShopLeave}>
              <Link to="/shop" onClick={()=>{ setShowShop(false); setShowMobile(false); }} className={`font-sans text-[12px] tracking-[0.12em] font-semibold py-3 ${isActive('/shop')?'text-[#1a5a3a]':'text-[#1A1A1A]/60 hover:text-[#1a5a3a]'}`}>SHOP</Link>
              {showShop && (
                <div className="absolute left-1/2 -translate-x-1/2 top-[48px] w-[360px] bg-white rounded-[16px] border border-black/[0.06] shadow-[0_16px_48px_rgba(0,0,0,0.10)] overflow-hidden z-[110] animate-[fadeIn_0.15s_ease]">
                  <div className="px-6 pt-5 pb-3 bg-[#FAF8F5] border-b border-black/[0.04]"><div className="font-serif text-[16px] font-[600]">Shop by Category</div><div className="font-sans text-[11px] text-black/40 mt-0.5">Select a category to explore</div></div>
                  <div className="p-2">{SHOP_MENU.map(item=><button key={item.id} onMouseDown={(e)=>goToShop(item.id,e)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[10px] hover:bg-[#FAF8F5] group text-left transition"><span className="text-[14px]">{item.icon}</span><div className="flex-1"><div className="font-sans text-[13px] font-[500] text-[#1A1A1A]">{item.label}</div><div className="font-sans text-[11px] text-black/40">{item.desc}</div></div></button>)}</div>
                  <div className="px-4 py-3 bg-[#FAF8F5] border-t flex justify-between items-center"><span className="font-sans text-[11px] text-black/50">Full collection</span><button onMouseDown={()=>{setShowShop(false); navigate('/shop');}} className="h-8 px-4 rounded-full bg-black text-white text-[11px] font-[600]">View All</button></div>
                </div>
              )}
            </div>
            <div className="relative" onMouseEnter={handlePotsEnter} onMouseLeave={handlePotsLeave}>
              {/* POTS - click opens /pots. Plain <a href> so the page loads even if the Router stalls. */}
              <a href="/pots" onClick={()=>{ setShowPots(false); setShowMobile(false); }} className={`font-sans text-[12px] tracking-[0.12em] font-semibold py-3 ${isActive('/pots') || isActive('/pot')?'text-[#1a5a3a]':'text-[#1A1A1A]/60 hover:text-[#1a5a3a]'}`}>POTS</a>
              {showPots && (
                <div className="absolute left-0 top-[48px] w-[280px] bg-white border border-black/[0.06] shadow-[0_16px_48px_rgba(0,0,0,0.12)] rounded-[16px] overflow-hidden z-[110] animate-[fadeIn_0.15s_ease]">
                  <div className="py-2">
                    {POTS_MENU.map(pot=>(
                      <button key={pot.label} onMouseDown={(e)=>goToPots(pot.id,e)} className="w-full text-left px-5 py-2.5 hover:bg-[#FAF8F5] group transition-colors">
                        <div className="font-sans text-[13px] font-[400] text-[#1A1A1A] group-hover:text-[#1a5a3a]">{pot.label}</div>
                        <div className="font-sans text-[11px] text-black/40">{pot.desc}</div>
                      </button>
                    ))}
                  </div>
                  <button onMouseDown={goToAllPots} className="w-full px-5 py-3 bg-[#FAF8F5] border-t text-left font-sans text-[11px] font-bold hover:bg-[#F0F7F0]">View All Pots →</button>
                  {/* Pot Studio banner */}
                  <div onMouseDown={goToAllPots} className="border-t bg-[#F0F7F0] cursor-pointer flex items-center gap-3 p-3">
                    <img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200" className="w-[64px] h-[64px] rounded-[12px] object-cover shrink-0" alt="pots"/>
                    <div className="min-w-0">
                      <div className="font-serif text-[14px] font-bold text-[#1a5a3a] leading-tight">Pot Studio</div>
                      <div className="font-sans text-[11px] text-black/60 leading-snug mt-0.5">Free Pot with 2 plants</div>
                      <div className="font-sans text-[11px] font-bold text-black mt-1">Explore →</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link to="/journal" className={`font-sans text-[12px] tracking-[0.12em] font-semibold py-3 ${isActive('/journal')?'text-[#1a5a3a]':'text-[#1A1A1A]/60 hover:text-[#1a5a3a]'}`}>JOURNAL</Link>
            <div className="relative" onMouseEnter={handleCareEnter} onMouseLeave={handleCareLeave}>
              <Link to="/care-guide" onClick={()=>{ setShowCare(false); setShowMobile(false); }} className={`font-sans text-[12px] tracking-[0.12em] font-semibold py-3 ${isActive('/care-guide')?'text-[#1a5a3a]':'text-[#1A1A1A]/60 hover:text-[#1a5a3a]'}`}>CARE GUIDE</Link>
              {showCare && (
                <div className="absolute left-1/2 -translate-x-1/2 top-[48px] w-[360px] bg-white rounded-[16px] border border-black/[0.06] shadow-[0_16px_48px_rgba(0,0,0,0.10)] overflow-hidden z-[110]">
                  <div className="px-6 pt-5 pb-3 bg-[#FAF8F5] border-b"><div className="font-serif text-[16px] font-[600]">Plant Care Archive</div><div className="font-sans text-[11px] text-black/40">Select a guide</div></div>
                  <div className="p-2">{CARE_MENU.map(item=><button key={item.id} onMouseDown={(e)=>goToCare(item.id,e)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[10px] hover:bg-[#FAF8F5] group text-left"><span className="text-[14px]">{item.icon}</span><div className="flex-1"><div className="font-sans text-[13px] font-[500]">{item.label}</div><div className="font-sans text-[11px] text-black/40">{item.desc}</div></div></button>)}</div>
                </div>
              )}
            </div>
            <Link to="/contact" className={`font-sans text-[12px] tracking-[0.12em] font-semibold py-3 ${isActive('/contact')?'text-[#1a5a3a]':'text-[#1A1A1A]/60 hover:text-[#1a5a3a]'}`}>CONTACT</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/cart" className="h-9 px-4 rounded-full border border-black/10 bg-white font-sans text-[11px] font-bold flex items-center gap-1.5 hover:bg-black hover:text-white transition">CART {isLoggedIn && cartCount>0 && <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#1a5a3a] text-white text-[10px] grid place-items-center">{cartCount}</span>}</Link>
            <div className="relative">
              {isLoggedIn ? (
                <button onClick={()=>setShowProfile(!showProfile)} className="h-9 pl-1 pr-3 rounded-full bg-black text-white font-sans text-[11px] font-bold flex items-center gap-2"><span className="w-7 h-7 rounded-full bg-white text-black grid place-items-center text-[11px] font-bold">{getInitial()}</span>{getDisplay()}</button>
              ) : (
                <button onClick={()=>setShowProfile(!showProfile)} className="h-9 px-4 rounded-full bg-black text-white font-sans text-[11px] font-bold">PROFILE</button>
              )}
              {showProfile && (
                <div className="absolute right-0 top-[44px] w-[280px] bg-white rounded-[20px] border border-black/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-0 overflow-hidden z-[110]">
                  {isLoggedIn ? (
                    <>
                      <div className="px-5 pt-5 pb-4 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#1a5a3a] text-white grid place-items-center font-sans font-bold text-[15px] shrink-0">{getInitial()}</div>
                        <div className="min-w-0"><div className="font-serif text-[16px] font-bold leading-none truncate">{getDisplay()}</div><div className="font-sans text-[11px] text-black/45 mt-1">{isAdmin ? 'Admin • Eco-Essence' : 'Member • Pan-India'}</div></div>
                      </div>
                      <div className="px-3 pb-3 space-y-2">
                        {isAdmin && (<button onClick={()=>{setShowProfile(false); navigate('/admin');}} className="w-full h-11 px-4 rounded-full bg-[#1a5a3a] text-white font-sans text-[12px] font-bold flex items-center justify-between hover:bg-black transition"><span>🛠 Admin Panel</span><span>Open →</span></button>)}
                        <button onClick={()=>{setShowProfile(false); navigate('/orders');}} className="w-full h-11 px-4 rounded-full bg-[#F0F7F0] font-sans text-[12px] font-bold flex items-center justify-between hover:bg-[#E6F2E6] transition"><span>📦 My Orders</span><span>→</span></button>
                        <button onClick={()=>{setShowProfile(false); navigate('/cart');}} className="w-full h-11 px-4 rounded-full border border-black/10 font-sans text-[12px] font-bold flex items-center justify-between hover:border-black/30 transition"><span>👜 Cart</span><span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#1a5a3a] text-white text-[10px] grid place-items-center">{cartCount}</span></button>
                        <button onClick={handleLogout} className="w-full h-10 rounded-full font-sans text-[11px] text-black/50 hover:text-red-600 hover:bg-[#FEF2F2] transition">Logout</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-5 pt-5 pb-4 text-center">
                        <div className="w-11 h-11 mx-auto rounded-full bg-[#F0F7F0] grid place-items-center text-[20px]">🌿</div>
                        <div className="font-serif text-[19px] font-bold mt-3 leading-none">Welcome to Eco-Essence</div>
                        <div className="font-sans text-[11px] text-black/45 mt-2 leading-[1.5]">Login to add to cart & buy.<br/>Browsing is free.</div>
                      </div>
                      <div className="px-3 pb-3 space-y-2">
                        <button onClick={()=>{setShowProfile(false); navigate('/auth');}} className="w-full h-11 rounded-full bg-[#1A1A1A] text-white font-sans text-[12px] font-bold hover:bg-[#1a5a3a] transition">Login →</button>
                        <button onClick={()=>{setShowProfile(false); navigate('/auth?mode=signup');}} className="w-full h-11 rounded-full border border-black/10 bg-white font-sans text-[12px] font-bold hover:border-black/30 transition">Create Account</button>
                      </div>
                      <div className="mx-3 mb-3 pt-3 border-t border-black/[0.06] flex items-center justify-center gap-1.5 font-sans text-[10px] text-black/35"><span>✦</span><span>Pan-India • Free browsing</span></div>
                    </>
                  )}
                </div>
              )}
            </div>
            <button onClick={()=>setShowMobile(!showMobile)} className="md:hidden h-9 w-9 rounded-full border bg-white grid place-items-center">☰</button>
          </div>
        </div>
      </nav>
      {showMobile && (
        <div className="md:hidden fixed top-[68px] left-0 w-full bg-[#FAF8F5] border-b z-[99] p-6 space-y-4 max-h-[80vh] overflow-auto">
          <div><div className="font-sans text-[13px] font-bold mb-3">SHOP</div><div className="grid grid-cols-2 gap-2">{SHOP_MENU.map(m=><button key={m.id} onClick={()=>goToShop(m.id)} className="text-left font-sans text-[12px] py-3 px-4 rounded-[12px] bg-white border flex gap-2"><span>{m.icon}</span>{m.label}</button>)}</div></div>
          <div><div className="font-sans text-[13px] font-bold mb-3">POTS</div><div className="grid grid-cols-2 gap-2">{POTS_MENU.map(m=><button key={m.id} onClick={()=>goToPots(m.id)} className="text-left font-sans text-[12px] py-3 px-4 rounded-[12px] bg-white border">{m.label}</button>)}</div>
          <button onClick={goToAllPots} className="mt-2 w-full font-sans text-[12px] font-bold py-3 px-4 rounded-[12px] bg-[#1a5a3a] text-white">View All Pots →</button></div>
          {isAdmin && (<button onClick={()=>{setShowMobile(false); navigate('/admin');}} className="block w-full font-sans text-[13px] font-bold bg-[#1a5a3a] text-white py-3 px-4 rounded-full text-center">🛠 Admin Panel →</button>)}
          <Link to="/orders" onClick={()=>setShowMobile(false)} className="block font-sans text-[13px] font-bold text-[#1a5a3a]">MY ORDERS →</Link>
          <button onClick={()=>{setShowMobile(false); navigate('/auth');}} className="block w-full font-sans text-[13px] font-bold bg-black text-white py-3 px-4 rounded-full text-center">Login / Signin</button>
        </div>
      )}
      {showProfile && <div onClick={()=>setShowProfile(false)} className="fixed inset-0 z-[90]"></div>}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </>
  );
}
