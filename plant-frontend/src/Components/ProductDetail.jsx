import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState('');
  const [pincode, setPincode] = useState('');
  const [pinMsg, setPinMsg] = useState('');
  const [isGift, setIsGift] = useState(false);
  const [potStatus, setPotStatus] = useState('No Pot');
  const [potColor, setPotColor] = useState('Ivory');
  const [potSize, setPotSize] = useState('4"');
  const [openAcc, setOpenAcc] = useState('about');
  const [allPlants, setAllPlants] = useState([]); // You may also like - neeche aur plants

  // ===== LOGIN CHECK - INSIDE SAME FILE, NO DIFF FILE =====
  const isLoggedIn = () => {
    const token = localStorage.getItem('plant_jwt_token') || localStorage.getItem('jwt_token') || localStorage.getItem('user_token');
    const userName = localStorage.getItem('plant_user_name') || localStorage.getItem('user_name');
    const userEmail = localStorage.getItem('plant_user_email') || localStorage.getItem('user_email');
    // Generic USER / U USER = NOT logged in
    if (userName && (userName === 'USER' || userName.toUpperCase() === 'U USER' || userName.trim().toUpperCase() === 'U')) return false;
    if (userName && userName.length > 1 && userName !== 'USER') return true;
    if (userEmail) return true;
    return !!token;
  };

  const requireLogin = (action = 'add to cart') => {
    if (isLoggedIn()) return true;
    localStorage.setItem('eco_redirect_after_login', `/product/${id}`);
    alert(`🔒 Please login first to ${action}!\n\nBrowsing is free, but adding / buying needs profile.`);
    navigate(`/auth?next=/product/${id}&action=${encodeURIComponent(action)}`);
    return false;
  };
  // ===== END LOGIN CHECK =====

  const getAllImages = (p) => {
    if(!p) return [];
    if(p.images && Array.isArray(p.images) && p.images.length>0) return p.images.filter(Boolean);
    const arr = [];
    if(p.imageUrl) arr.push(p.imageUrl);
    if(p.image && p.image!==p.imageUrl) arr.push(p.image);
    if(p.img && p.img!==p.imageUrl && p.img!==p.image) arr.push(p.img);
    if(p.imagePreview && p.imagePreview!==p.imageUrl) arr.push(p.imagePreview);
    for(let i=2;i<=20;i++){ if(p[`image${i}`]) arr.push(p[`image${i}`]); }
    return arr.filter(Boolean);
  };
  const getDesc = (p) => p ? (p.description || p.desc || p.longDescription || '') : '';
  const getCare = (p) => p ? (p.careGuide || p.care || '') : '';

  // ALL PLANTS - You may also like ke liye. Ek baar load, phir category-wise sort.
  useEffect(()=>{
    try{
      const merged = [];
      const seen = new Set();
      for(let k of ['eco_my_plants','plants','eco_admin_plants','eco_shop_fallback']){
        try{
          const arr = JSON.parse(localStorage.getItem(k)||'[]');
          (Array.isArray(arr)?arr:[]).forEach(p=>{
            const key = String(p._id||p.id||p.name||'').toLowerCase().trim();
            if(key && !seen.has(key)){ seen.add(key); merged.push(p); }
          });
        }catch{}
      }
      setAllPlants(merged);
    }catch{}
  },[]);

  useEffect(()=>{
    setActiveIdx(0); setQty(1); // Naya plant khule to gallery + qty reset
    try{
      const sel = localStorage.getItem('eco_selected_product');
      if(sel){
        const parsed = JSON.parse(sel);
        if(String(parsed._id)===String(id) || String(parsed.id)===String(id) || String(parsed.name).toLowerCase()===String(id).toLowerCase()){
          setProduct(parsed); setPotStatus(parsed.potStatus||'No Pot'); setPotColor(parsed.potColor||'Ivory'); setPotSize(parsed.potSize||'4"'); return;
        }
      }
      const keys=['eco_my_plants','plants','eco_admin_plants','eco_shop_fallback'];
      for(let k of keys){
        try{
          const arr = JSON.parse(localStorage.getItem(k)||'[]');
          const found = arr.find(p=> String(p._id)===String(id) || String(p.id)===String(id) || p.name===id);
          if(found){ setProduct(found); setPotStatus(found.potStatus||'No Pot'); return; }
        }catch{}
      }
    }catch(e){}
  },[id]);

  // RELATED - same category pehle, phir baaki plants, current plant ko chhod ke. Max 8.
  const related = product ? (()=> {
    const curId = String(product._id||product.id||'').toLowerCase();
    const curName = (product.name||'').toLowerCase().trim();
    const curCat = (product.category||'').toLowerCase().trim();
    const others = allPlants.filter(p => String(p._id||p.id||'').toLowerCase()!==curId && (p.name||'').toLowerCase().trim()!==curName);
    const sameCat = others.filter(p => (p.category||'').toLowerCase().trim()===curCat && curCat);
    const rest = others.filter(p => (p.category||'').toLowerCase().trim()!==curCat || !curCat);
    return [...sameCat, ...rest].slice(0, 8);
  })() : [];

  const images = product ? getAllImages(product) : [];
  const desc = product ? getDesc(product) : '';
  const care = product ? getCare(product) : '';

  const checkPincode = () => {
    if(!pincode || pincode.length<6){ setPinMsg('❌ Enter 6-digit pincode'); return; }
    setPinMsg('✅ Delivery available — Pan-India • 3-5 days • COD available');
  };

  const handleAddToCart = () => {
    // FIX: BLOCK ADD TO CART WITHOUT LOGIN
    if (!requireLogin('add to cart')) return;
    if(!product) return;
    try{
      const email = localStorage.getItem('plant_user_email') || localStorage.getItem('user_email') || '';
      const cartKey = email ? `eco_cart_${email}` : 'eco_cart';
      const cart = JSON.parse(localStorage.getItem(cartKey) || localStorage.getItem('eco_cart') || '[]');
      const existing = cart.find(c=> String(c._id||c.id)===String(product._id||product.id) && c.potStatus===potStatus);
      if(existing){ existing.qty = (existing.qty||1)+qty; existing.total = (existing.price||product.price) * existing.qty; }
      else {
        cart.push({ _id: product._id||product.id, id: product._id||product.id, name: product.name, price: product.price, total: product.price*qty, image: images[0], images: images, qty: qty, quantity: qty, potStatus: potStatus, potColor: potColor, potSize: potSize, description: desc, isGift: isGift });
      }
      localStorage.setItem(cartKey, JSON.stringify(cart));
      localStorage.setItem('eco_cart', JSON.stringify(cart));
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('eco-cart-updated'));
      window.dispatchEvent(new Event('storage'));
      setToast(`✓ ${product.name} • ${potStatus} • ${images.length} photos`);
      setTimeout(()=>setToast(''),2500);
    }catch{ setToast('❌ Cart error'); }
  };
  const handleBuyNow = () => {
    // FIX: BLOCK BUY NOW WITHOUT LOGIN
    if (!requireLogin('buy items')) return;
    handleAddToCart();
    // Only navigate if still logged in (requireLogin already checked)
    setTimeout(()=>{ if(isLoggedIn()) navigate('/cart'); }, 400);
  };

  if(!product){
    return <div className="min-h-[70vh] bg-[#FAF8F5] grid place-items-center"><div className="text-center"><div className="text-[40px]">🌿</div><div className="font-serif text-[20px] font-bold mt-3">Plant not found</div><button onClick={()=>navigate('/shop')} className="mt-4 h-10 px-6 rounded-full bg-black text-white text-[12px]">Go to Shop</button></div></div>;
  }

  const mrp = product.originalPrice || Math.round(product.price*1.4);
  const discount = mrp>product.price ? Math.round((1-product.price/mrp)*100) : 28;
  const isNoPot = potStatus==='No Pot';

  const getBenefits = () => {
    const name = (product.name||'').toLowerCase();
    const cat = (product.category||'').toLowerCase();
    const common = [
      { icon:'🍃', title:'Purifies your air', desc:`${product.name} is a natural air purifier — removes toxins, brings fresh oxygen to your home` },
      { icon:'😊', title:'Boosts mood, reduces stress', desc:'Studies show indoor plants reduce anxiety, improve focus and bring calm' },
      { icon:'🌿', title:'Easy to care, thrives in India', desc:'Pan-India suitable — loves bright indirect light, minimal watering, perfect for beginners' },
    ];
    if(cat.includes('fruit') || name.includes('avocado') || name.includes('tomato') || name.includes('strawberry')){
      return [
        { icon:'🍃', title:'Grow your own food', desc:`Harvest fresh ${product.name} at home — organic, healthy, straight from your balcony` },
        { icon:'😊', title:'Joy of growing', desc:'Watching your fruit grow from flower to harvest — therapeutic and rewarding' },
        { icon:'🌿', title:'Pan-India hardy', desc:'Loves Indian sun, thrives in pots, perfect for terrace or balcony garden' },
      ];
    }
    if(cat.includes('herb') || name.includes('basil') || name.includes('mint') || name.includes('rosemary')){
      return [
        { icon:'🍃', title:'Fresh flavours daily', desc:`Snip fresh ${product.name} for cooking — aroma that lifts every dish` },
        { icon:'😊', title:'Natural wellness', desc:'Aromatic herbs reduce stress, aid digestion, and make your kitchen smell divine' },
        { icon:'🌿', title:'Cut-and-come-again', desc:'Harvest often, it grows back fuller — endless supply from one plant' },
      ];
    }
    if(cat.includes('flower') || cat.includes('fragrant')){
      return [
        { icon:'🍃', title:'Blooms that brighten', desc:`${product.name} brings continuous colour and natural fragrance to your space` },
        { icon:'😊', title:'Instant happiness', desc:'Flowers are proven to boost mood, spark creativity and make homes feel alive' },
        { icon:'🌿', title:'Easy bloomer', desc:'Loves sun, rewards you with non-stop flowers — even beginners can bloom it' },
      ];
    }
    return common;
  };

  const benefits = getBenefits();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap'); .font-serif{font-family:"Instrument Serif",serif} .font-sans{font-family:"Inter",sans-serif} .scrollbar-hide::-webkit-scrollbar{display:none} .scrollbar-hide{-ms-overflow-style:none; scrollbar-width:none}`}</style>
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-black text-white px-6 py-3 rounded-full font-sans text-[12px] font-bold shadow-xl">{toast}</div>}
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6">
        <div className="flex items-center gap-2 font-sans text-[11px] opacity-50">
          <button onClick={()=>navigate('/')} className="hover:underline">Home</button><span>/</span><button onClick={()=>navigate('/shop')} className="hover:underline">Shop</button><span>/</span><span className="font-bold text-black">{product.name}</span>
        </div>

        <div className="mt-6 grid lg:grid-cols-[88px_1fr_380px] gap-6 items-start">
          <div className="hidden lg:flex flex-col gap-3 max-h-[560px] overflow-auto scrollbar-hide">
            {images.map((img,idx)=>(
              <button key={idx} onClick={()=>setActiveIdx(idx)} className={`w-[72px] h-[72px] rounded-[14px] overflow-hidden border-2 shrink-0 bg-white grid place-items-center ${activeIdx===idx?'border-black shadow-md':'border-black/10'}`}><img src={img} alt={`thumb ${idx}`} className="w-full h-full object-contain p-1" /></button>
            ))}
          </div>

          <div className="relative bg-white rounded-[20px] border border-black/[0.06] overflow-hidden">
            <div className="w-full h-[520px] lg:h-[560px] bg-white grid place-items-center p-6">
              <img src={images[activeIdx]||images[0]} alt={product.name} className="max-w-full max-h-full w-auto h-auto object-contain" />
            </div>
            <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full font-sans text-[11px] font-bold">{activeIdx+1} / {images.length}</div>
            <div className="lg:hidden absolute bottom-[60px] left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur rounded-full px-3 py-2 border shadow">
              {images.map((img,idx)=>(<button key={idx} onClick={()=>setActiveIdx(idx)} className={`w-10 h-10 rounded-[8px] overflow-hidden border bg-white ${activeIdx===idx?'border-black':'border-black/10'}`}><img src={img} alt="" className="w-full h-full object-contain p-1" /></button>))}
            </div>
          </div>

          <div className="bg-white rounded-[20px] border border-black/[0.06] p-6 sticky top-6">
            <div className="flex items-center gap-1.5 text-[11px]"><span className="text-[#1a5a3a]">★★★★★</span><span className="font-bold">5.0</span><span className="opacity-40">(1 review) • Pan-India</span></div>
            <h1 className="font-serif text-[26px] font-bold leading-tight mt-2">{product.name}</h1>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border font-sans text-[10px]">🌿 {images.length} photos • Pan-India</span>
              {isNoPot ? (
                <span className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-dashed border-[#1a5a3a]/30 font-sans text-[10px] font-bold text-[#1a5a3a]">🪴 No Pot — Buy separately</span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-[#1a5a3a] text-white font-sans text-[10px] font-bold">🌿 Pot Included • {potColor} {potSize}</span>
              )}
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-serif text-[26px] font-bold">₹{product.price}</span>
              {mrp>product.price && <span className="font-sans text-[12px] opacity-40 line-through">₹{mrp}</span>}
              <span className="px-2.5 py-1 rounded-full bg-[#F0F7F0] border border-[#1a5a3a]/20 text-[#1a5a3a] font-sans text-[10px] font-bold">Save {discount}%</span>
            </div>

            {/* LOGIN BANNER - ONLY IF NOT LOGGED IN */}
            {!isLoggedIn() && (
              <div className="mt-4 p-3 rounded-[12px] bg-[#FFF7ED] border border-[#FDBA74] font-sans text-[11px] flex gap-2">
                <span>🔒</span>
                <span>Login to add to cart — browsing is free. <button onClick={()=>navigate(`/auth?next=/product/${id}`)} className="font-bold underline">Login / Signup →</button></span>
              </div>
            )}

            {/* FIX: POT OPTIONS selector hataya - ye har plant pe Ivory/Terracotta/Charcoal/Sage dikhata tha,
                chahe Admin ne us plant me pot lagaya ho ya nahi. Ab pot Admin ke data se fixed hai:
                - Plant me pot NAHI hai (Pink Rose jaisa) -> sirf "No Pot" likha aayega, koi option nahi.
                - Plant me pot HAI -> wahi pot (Admin wala colour + size) dikhega, badalne ka selector nahi. */}
            {isNoPot ? (
              <div className="mt-6 p-4 rounded-[14px] bg-[#FAF8F5] border border-dashed flex items-center justify-between gap-3">
                <div>
                  <div className="font-sans text-[12px] font-bold">🪴 No Pot</div>
                  <div className="font-sans text-[11px] opacity-60 mt-0.5">Plant only — ships in nursery pot</div>
                </div>
                <button onClick={()=>navigate('/pots')} className="shrink-0 h-9 px-4 rounded-full bg-black text-white font-sans text-[11px] font-bold">Buy Pot Separately →</button>
              </div>
            ) : (
              <div className="mt-6 p-4 rounded-[14px] bg-[#F0F7F0] border flex items-center justify-between gap-3">
                <div>
                  <div className="font-sans text-[12px] font-bold">🌿 Pot Included • {potColor} {potSize}</div>
                  <div className="font-sans text-[11px] opacity-60 mt-0.5">{product.potNote || 'Plant comes displayed in this pot'}</div>
                </div>
                <button onClick={()=>navigate('/pots')} className="shrink-0 h-9 px-4 rounded-full border bg-white font-sans text-[11px] font-bold">View Pots →</button>
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <div className="h-11 w-[88px] rounded-full border flex items-center justify-between px-1">
                <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="w-8 h-8 rounded-full grid place-items-center hover:bg-black/5">−</button>
                <span className="font-sans text-[13px] font-bold">{qty}</span>
                <button onClick={()=>setQty(q=>q+1)} className="w-8 h-8 rounded-full grid place-items-center hover:bg-black/5">+</button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 h-11 rounded-full bg-[#1a5a3a] text-white font-sans text-[12px] font-bold hover:bg-black">{isLoggedIn() ? `ADD TO CART — ₹${product.price*qty}` : '🔒 LOGIN TO ADD TO CART'}</button>
            </div>
            <button onClick={handleBuyNow} className="mt-2 w-full h-11 rounded-full bg-black text-white font-sans text-[12px] font-bold">{isLoggedIn() ? 'BUY NOW →' : '🔒 LOGIN TO BUY NOW'}</button>

            <div className="mt-6 pt-5 border-t">
              <div className="font-sans text-[11px] font-bold tracking-[0.1em] opacity-60">CHECK PINCODE</div>
              <div className="mt-2 flex gap-2">
                <input value={pincode} onChange={e=>setPincode(e.target.value)} placeholder="Enter 6-digit pincode" className="flex-1 h-10 rounded-full border px-4 font-sans text-[12px]" />
                <button onClick={checkPincode} className="h-10 px-5 rounded-full bg-black text-white font-sans text-[11px] font-bold">Check</button>
              </div>
              {pinMsg && <div className="mt-2 font-sans text-[11px] p-2 rounded-full bg-[#F0F7F0] text-center">{pinMsg}</div>}
            </div>
          </div>
        </div>

        <div className="mt-8 grid lg:grid-cols-[1fr_380px] gap-6">
          <div className="bg-white rounded-[20px] border p-6">
            <div className="flex gap-2 border-b pb-3 overflow-auto">
              {[{id:'about',label:`About — ${product.name}`},{id:'care',label:'Care Guide'},{id:'why',label:'Why love it'}].map(tab=>(
                <button key={tab.id} onClick={()=>setOpenAcc(tab.id)} className={`h-8 px-4 rounded-full font-sans text-[11px] font-bold whitespace-nowrap ${openAcc===tab.id?'bg-black text-white':'bg-[#FAF8F5] border'}`}>{tab.label}</button>
              ))}
            </div>
            {openAcc==='about' && (
              <div className="mt-5">
                <div className="font-serif text-[20px] font-bold">About {product.name}</div>
                <div className="font-sans text-[10px] tracking-[0.15em] opacity-30 mt-1">{product.botanical||product.name} • {images.length} photos</div>
                <div className="mt-4 font-sans text-[14px] leading-[1.7] whitespace-pre-wrap">{desc}</div>
                {isNoPot && <div className="mt-4 p-3 rounded-[12px] bg-[#FAF8F5] border border-dashed flex gap-2"><span>🪴</span><span className="font-sans text-[11px]"><b>No Pot — Buy pot separately</b> • Plant ships in nursery pot, add decorative pot from Pots page</span></div>}
              </div>
            )}
            {openAcc==='care' && (
              <div className="mt-5">
                <div className="font-serif text-[20px] font-bold">Care Guide — {product.name}</div>
                <div className="mt-4 font-sans text-[14px] leading-[1.7] whitespace-pre-wrap">{care||'Water weekly, bright sun 6+ hours, well-drained soil, mist in summer. Pan-India suitable.'}</div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-[12px] bg-[#FAF8F5] border"><div className="text-[11px] font-bold">💡 Light</div><div className="text-[11px] opacity-60 mt-1">{product.careLight||product.light||'Bright indirect'}</div></div>
                  <div className="p-3 rounded-[12px] bg-[#FAF8F5] border"><div className="text-[11px] font-bold">💧 Water</div><div className="text-[11px] opacity-60 mt-1">{product.careWater||product.water||'Weekly'}</div></div>
                  <div className="p-3 rounded-[12px] bg-[#FAF8F5] border"><div className="text-[11px] font-bold">🐾 Pet</div><div className="text-[11px] opacity-60 mt-1">{product.petFriendly||'No'}</div></div>
                </div>
              </div>
            )}
            {openAcc==='why' && (
              <div className="mt-5">
                <div className="font-serif text-[20px] font-bold">Why you will love {product.name}</div>
                <div className="font-sans text-[11px] opacity-40 mt-1">Benefits of {product.name} • Why this plant?</div>
                <div className="mt-5 space-y-4">
                  {benefits.map((b,i)=>(
                    <div key={i} className="flex gap-4 p-4 rounded-[14px] bg-[#FAF8F5] border border-black/[0.04]">
                      <div className="w-10 h-10 rounded-full bg-white border grid place-items-center text-[18px] shrink-0">{b.icon}</div>
                      <div>
                        <div className="font-sans text-[13px] font-bold">{i+1}. {b.title}</div>
                        <div className="font-sans text-[12px] opacity-60 mt-1 leading-[1.6]">{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-[14px] bg-[#1a5a3a] text-white">
                  <div className="font-serif text-[15px] font-bold">🌿 {product.name} at Eco-Essence</div>
                  <div className="font-sans text-[11px] opacity-80 mt-1">{product.name} is carefully grown, pan-India delivery, {images.length} real photos — what you see is what you get. {isNoPot?'Ships without decorative pot — add pot from Pots page.':'Comes with pot included — ready to display.'}</div>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white rounded-[20px] border p-6">
            <div className="font-serif text-[16px] font-bold">Offers • Pan-India</div>
            <div className="mt-3 space-y-2 font-sans text-[11px]">
              <div className="p-2.5 rounded-[10px] bg-[#F0F7F0] border">🌿 Free delivery above ₹499</div>
              <div className="p-2.5 rounded-[10px] bg-[#FAF8F5] border">📦 {images.length} photos • Your plant • Ready to ship</div>
              <div className="p-2.5 rounded-[10px] bg-[#FFFEF9] border">{isNoPot?'🪴 No Pot — Buy pot separately':'🌿 Pot Included • '+potColor+' '+potSize}</div>
            </div>
          </div>
        </div>
        {/* YOU MAY ALSO LIKE - neeche scroll karne pe aur plants, wapas Shop jaane ki zaroorat nahi */}
        {related.length > 0 && (
          <div className="mt-10 pb-4">
            <div className="flex items-end justify-between gap-3 flex-wrap">
              <div>
                <div className="font-sans text-[10px] tracking-[0.2em] opacity-40 font-bold">KEEP EXPLORING</div>
                <h2 className="font-serif text-[26px] font-bold mt-1">You may also like</h2>
                <div className="font-sans text-[12px] opacity-50 mt-0.5">More {product.category || 'plants'} to explore — tap any plant to open it right here</div>
              </div>
              <button onClick={()=>navigate('/shop')} className="h-10 px-5 rounded-full border bg-white font-sans text-[11px] font-bold hover:bg-black hover:text-white transition">View all plants →</button>
            </div>
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p, idx)=>(
                <button key={p._id||p.id||idx} onClick={()=>{ localStorage.setItem('eco_selected_product', JSON.stringify(p)); navigate(`/product/${p._id||p.id||p.name}`); window.scrollTo({top:0, behavior:'smooth'}); }} className="bg-white rounded-[18px] border border-black/[0.06] overflow-hidden text-left hover:shadow-lg hover:-translate-y-0.5 transition group">
                  <div className="h-[190px] bg-[#FAF8F5] grid place-items-center p-4 overflow-hidden"><img src={getAllImages(p)[0]} alt={p.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition" /></div>
                  <div className="p-4">
                    <div className="font-sans text-[10px] tracking-[0.12em] opacity-40 font-bold uppercase">{p.category || 'Plant'}</div>
                    <div className="font-serif text-[16px] font-bold leading-tight mt-1 truncate">{p.name}</div>
                    <div className="flex items-center justify-between mt-2"><span className="font-serif text-[16px] font-bold">₹{p.price}</span><span className="font-sans text-[11px] font-bold text-[#1a5a3a]">View →</span></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
