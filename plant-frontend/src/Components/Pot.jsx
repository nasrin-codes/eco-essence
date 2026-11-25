import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FALLBACK = [
  { _id: 'terracotta', name: 'Terracotta Pots', desc: 'Classic brown clay', category: 'Terracotta Pots', color: '#C17A52', price: 299, images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'], colours: [{ name: 'Terracotta Brown', hex: '#C17A52', extra: 0, image: '' }, { name: 'Clay Red', hex: '#A0522D', extra: 50, image: '' }] },
  { _id: 'ceramic', name: 'Ceramic Pots', desc: 'White minimal design', category: 'Ceramic Pots', color: '#EDE8DF', price: 499, images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'], colours: [{ name: 'White', hex: '#EDE8DF', extra: 0, image: '' }, { name: 'Sage Green', hex: '#A8B8A0', extra: 100, image: '' }] },
  { _id: 'metal', name: 'Metal Planters', desc: 'Black matte finish', category: 'Metal Planters', color: '#2B2B2B', price: 699, images: ['https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800'], colours: [{ name: 'Black Matte', hex: '#2B2B2B', extra: 0, image: '' }, { name: 'Brass', hex: '#C9A86A', extra: 150, image: '' }] },
  { _id: 'self-watering', name: 'Self-Watering Pots', desc: 'Auto water system', category: 'Self-Watering Pots', color: '#7AA8A0', price: 799, images: ['https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800'], colours: [{ name: 'White', hex: '#EDE8DF', extra: 0, image: '' }] },
  { _id: 'plastic', name: 'Plastic Pots', desc: 'Lightweight & durable', category: 'Plastic Pots', color: '#A8B8A0', price: 199, images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'], colours: [{ name: 'Sage', hex: '#A8B8A0', extra: 0, image: '' }] },
  { _id: 'hanging', name: 'Hanging Planters', desc: 'For balcony & wall', category: 'Hanging Planters', color: '#D9C7A7', price: 599, images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'], colours: [{ name: 'Beige', hex: '#D9C7A7', extra: 0, image: '' }] },
  { _id: 'basket', name: 'Basket Planters', desc: 'Woven natural look', category: 'Basket Planters', color: '#C9A86A', price: 549, images: ['https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800'], colours: [{ name: 'Natural', hex: '#C9A86A', extra: 0, image: '' }] },
  { _id: 'stands', name: 'Plant Stands', desc: 'Wood & metal stands', category: 'Plant Stands', color: '#8B6F47', price: 899, images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800'], colours: [{ name: 'Wood', hex: '#8B6F47', extra: 0, image: '' }] },
];
const FILTERS = ['Terracotta Pots', 'Ceramic Pots', 'Metal Planters', 'Self-Watering Pots', 'Plastic Pots', 'Hanging Planters', 'Basket Planters', 'Plant Stands'];
const SIZES = [{ label: '4"', extra: 0 }, { label: '6"', extra: 100 }, { label: '8"', extra: 200 }];

export default function Pot() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pots, setPots] = useState(FALLBACK);
  // Read category from URL once - no location loop
  const [filter, setFilter] = useState(() => {
    try { return new URLSearchParams(window.location.search).get('category') || 'all'; } catch (e) { return 'all'; }
  });
  // Filter changes -> close any open pot detail.
  // Filter changes -> close any open pot detail, so the old pot does not stay on top.
  useEffect(() => { setSelected(null); }, [filter]);
  // Navbar category click while already on /pots must also change the filter - the page does not remount.
  useEffect(() => {
    try {
      const c = new URLSearchParams(location.search).get('category');
      if (c) setFilter(c);
    } catch (e) {}
  }, [location.search]);
  const [selected, setSelected] = useState(null);
  const [size, setSize] = useState('6"');
  const [showStudio, setShowStudio] = useState(false);
  const [imgIndex, setImgIndex] = useState({});
  const [colourIndex, setColourIndex] = useState({});
  const [detailImg, setDetailImg] = useState(0);
  const [detailColour, setDetailColour] = useState(0);
  const [withPlant, setWithPlant] = useState(false);

  // Pots load order - BACKEND FIRST (same pots on every PC / browser).
  // localStorage is only a cache / offline backup - it never moves to another PC,
  // so reading only localStorage showed default pots the next day.
  useEffect(() => {
        const applyPots = (best) => {
          const normalized = best.map((p, i) => ({
            _id: p._id || p.id || ('pot-' + i),
            id: p.id || p._id || ('pot-' + i),
            name: p.name || p.title || 'Pot',
            desc: p.description || p.desc || p.subtitle || '',
            subtitle: p.subtitle || p.description || '',
            category: p.category || p.name || '',
            color: (p.colours && p.colours[0] && p.colours[0].hex) || p.colour || '#C17A52',
            price: Number(p.price || 0),
            images: (p.images && p.images.length > 0) ? p.images : ([p.image || p.imageUrl || ''].filter(Boolean)),
            colours: (p.colours && p.colours.length > 0) ? p.colours : [{ name: p.colour || 'Default', hex: p.colour || '#C17A52', extra: 0, image: '' }],
            // Preserve - otherwise Pot Status / stock / care would be lost in detail
            potStatus: p.potStatus || 'Pot Only',
            stock: p.stock || 'In Stock',
            care: p.care || p.careGuide || '',
            careGuide: p.careGuide || p.care || '',
            sizes: p.sizes || ['4"', '6"', '8"'],
            qty: Number(p.qty || 0),
            material: p.material || '',
            size: p.size || '6"',
            featured: !!p.featured,
          }));
          setPots(normalized);
        };
    const loadAdminPots = async () => {
      try {
        // MERGE - backend + is browser ke local pots, naam se dedupe (backend wala jeetta hai).
        // Pehle wala code backend milte hi local ko mita deta tha - isliye TEST POT gayab ho jata tha.
        // Ab TEST POT backend me na bhi ho, tab bhi POTS page pe dikhega.
        let backend = [];
        // Render free backend sota hai (cold start ~50s) - ek baar me na mile to 3 baar try karo.
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const res = await fetch(`${API_URL}/api/pots`);
            if (res.ok) {
              const data = await res.json();
              const arr = Array.isArray(data) ? data : (data.pots || []);
              if (Array.isArray(arr)) { backend = arr; break; }
            }
          } catch (e) { /* retry */ }
          if (attempt < 2) await new Promise(r => setTimeout(r, 4000));
        }
        let local = [];
        const keys = ['eco_admin_pots', 'eco_my_pots', 'admin-pots', 'eco_shop_pots'];
        for (const k of keys) {
          try {
            const raw = localStorage.getItem(k);
            if (!raw) continue;
            const a = JSON.parse(raw);
            if (Array.isArray(a) && a.length > 0) { local = a; break; }
          } catch (e) { /* ignore bad json */ }
        }
        const names = new Set(backend.map(p => String(p.name || p.title || '').toLowerCase().trim()));
        const backendIds = new Set(backend.map(p => String(p._id || p.id || '')));
        // Local pot jiska _id backend me hai = wahi pot (rename hua hoga) - backend wala rakho, duplicate nahi.
        const merged = [...backend, ...local.filter(p => p && (p.name || p.title) && !names.has(String(p.name || p.title).toLowerCase().trim()) && !backendIds.has(String(p._id || p.id || '')))];
        if (merged.length > 0) { applyPots(merged); return; }
        // 3) FALLBACK - backend + cache dono khaali, default pots in useState rehte hain

      } catch (e) { /* keep fallback */ }
    };
    loadAdminPots();
    const onUpdate = () => loadAdminPots();
    window.addEventListener('eco-pots-updated', onUpdate);
    window.addEventListener('storage', onUpdate);
    window.addEventListener('focus', onUpdate);
    // LIVE / DYNAMIC - har 15 second me server se naye pots khud poochho.
    // Admin kisi bhi device se pot add/edit/delete kare, is page pe khula har device apne aap update ho jayega - refresh dabane ki zaroorat nahi.
    // (Tab chhupa ho to poochna band - battery/data bachega, tab khulte hi turant update hoga.)
    const liveTimer = setInterval(() => { if (!document.hidden) loadAdminPots(); }, 3000);
    const onVisible = () => { if (!document.hidden) loadAdminPots(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { window.removeEventListener('eco-pots-updated', onUpdate); window.removeEventListener('storage', onUpdate); window.removeEventListener('focus', onUpdate); clearInterval(liveTimer); document.removeEventListener('visibilitychange', onVisible); };
  }, []);

  // Filter match: lowercase + trim extra spaces, and also match the first word of the category
  // ('ceramic pots' / 'Ceramic Pots ' must both match).
  const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const firstWord = (s) => norm(s).split(' ')[0] || '';
  const filtered = filter === 'all' ? pots : pots.filter((p) => {
    const cat = norm(p.category || p.name);
    const f = norm(filter);
    return cat === f || firstWord(cat) === firstWord(f) || norm(p.name) === f;
  });
  const sizeExtra = (SIZES.find((s) => s.label === size) || {}).extra || 0;
  const getImages = (pot) => (pot.images && pot.images.length > 0 ? pot.images : (pot.image ? [pot.image] : []));
  const getColours = (pot) => (pot.colours && pot.colours.length > 0 ? pot.colours : [{ name: 'Default', hex: pot.color || '#C17A52', extra: 0, image: '' }]);
  const getDisplayImage = (pot, cIdx, iIdx) => {
    const imgs = getImages(pot);
    // CARD ka main image HAMESHA pot ki main photo hai (Admin ki 1st photo).
    // Colour ki photo kabhi main image nahi banegi - wo sirf Detail view me
    // colour dot dabane pe / thumbnails me dikhegi. Isliye Chevron jaisa
    // terracotta pot uske green colour variant ki photo se nahi dikhega.
    if (iIdx !== undefined && iIdx !== null) return imgs[iIdx] || imgs[0] || '';
    return imgs[0] || '';
  };
  const openDetail = (pot) => { setSelected(pot); setSize('6"'); setDetailImg(0); setDetailColour(0); setWithPlant(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleAdd = (pot, asWithPlant) => {
    const token = localStorage.getItem('plant_jwt_token');
    if (!token) { navigate('/auth'); return; }
    const email = localStorage.getItem('plant_user_email') || '';
    const cartKey = email ? ('eco_cart_' + email) : 'eco_cart';
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem(cartKey) || '[]') || []; } catch (e) { cart = []; }
    const cIdx = pot === selected ? detailColour : (colourIndex[pot._id || pot.id] || 0);
    const colours = getColours(pot);
    const colour = colours[cIdx] || colours[0];
    const price = Number(pot.price || 0) + sizeExtra + Number((colour && colour.extra) || 0);
    cart.push({ _id: 'pot-' + (pot._id || pot.id) + '-' + size + '-' + ((colour && colour.name) || ''), id: 'pot-' + (pot._id || pot.id) + '-' + size, name: pot.name, price: price, total: price, image: getDisplayImage(pot, cIdx, imgIndex[pot._id || pot.id] || 0), qty: 1, quantity: 1, potStatus: asWithPlant ? 'Pot with Plant' : 'Pot Only', potColor: (colour && colour.name) || '', potColourHex: (colour && colour.hex) || pot.color, potSize: size, description: pot.desc || '', type: 'pot', withPlant: asWithPlant });
    // Only the per-user key - never write the generic key, it creates ghost cart counts.
    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.dispatchEvent(new Event('eco-cart-updated'));
    alert(asWithPlant ? (pot.name + ' (' + size + ') added with plant') : (pot.name + ' (' + size + ') added separately'));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A]">
      <div className="max-w-[1160px] mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="font-sans text-[11px] tracking-[0.2em] text-black/40">ECO-ESSENCE.</div>
        <h1 className="font-serif text-[38px] md:text-[48px] leading-[0.95] font-bold mt-3 md:mt-4">Pots that let plants<br /><span className="italic font-normal">breathe.</span></h1>
        <p className="font-sans text-[13px] text-black/50 mt-4 max-w-[440px] leading-6">Choose from 8 pot styles. Pot price is separate — plant price never changes automatically.</p>
        <div className="flex gap-2 flex-nowrap overflow-x-auto scrollbar-hide snap-x -mx-4 px-4 md:mx-0 md:px-0 py-1 mt-6 md:mt-8">
          <button onClick={() => { setFilter('all'); setSelected(null); }} className={'h-9 px-4 md:px-5 rounded-full font-sans text-[12px] font-bold shrink-0 snap-start active:scale-95 transition ' + (filter === 'all' ? 'bg-black text-white' : 'bg-white border border-black/10')}>All Pots</button>
          {FILTERS.map((f) => (
            <button key={f} onClick={() => { setFilter(f); setSelected(null); }} className={'h-9 px-4 md:px-5 rounded-full font-sans text-[12px] font-bold shrink-0 snap-start active:scale-95 transition ' + (filter === f ? 'bg-black text-white' : 'bg-white border border-black/10')}>{f}</button>
          ))}
        </div>
        <button onClick={() => setShowStudio(true)} className="mt-5 md:mt-6 w-full bg-gradient-to-r from-[#1a5a3a] to-[#2f8f5b] text-white rounded-[20px] p-4 flex items-center justify-between gap-3 text-left shadow-[0_10px_30px_rgba(26,90,58,0.25)] active:scale-[0.99] transition">
          <span className="font-serif text-[15px] md:text-[18px] font-bold leading-snug">Pot Studio — Free Pot with 2 plants</span>
          <span className="font-sans text-[12px] font-bold shrink-0 whitespace-nowrap">View Offer →</span>
        </button>
        {showStudio && (
          <div className="mt-4 bg-white border rounded-[20px] p-6">
            <div className="font-serif text-[20px] font-bold">Pot Studio Offer</div>
            <p className="font-sans text-[13px] text-black/60 mt-2 leading-6">Buy any 2 plants, get 1 pot free. Add 2 plants to cart, then choose your free pot at checkout.</p>
            <button onClick={() => navigate('/shop')} className="mt-4 h-10 px-6 rounded-full bg-black text-white font-sans text-[12px] font-bold">Shop Plants →</button>
            <button onClick={() => setShowStudio(false)} className="ml-3 font-sans text-[12px] underline">Close</button>
          </div>
        )}
        {selected && (() => {
          const colours = getColours(selected);
          const colour = colours[detailColour] || colours[0];
          const imgs = getImages(selected);
          // Thumbnails = main photos + har colour ki photo (duplicate hatake) - warna colour photos kabhi dikhti hi nahi.
          const allImgs = [...imgs, ...colours.map(c => c.image).filter(Boolean).filter(im => !imgs.includes(im))];
          const mainImg = allImgs[detailImg] || allImgs[0] || (colour && colour.image) || '';
          const finalPrice = Number(selected.price || 0) + sizeExtra + Number((colour && colour.extra) || 0);
          return (
            <div className="mt-8 bg-white rounded-[28px] border p-4 md:p-6 grid md:grid-cols-[110px_1fr_1fr] gap-4 md:gap-6">
              <div className="flex md:flex-col gap-2 overflow-auto">
                {allImgs.map((im, i) => (
                  <button key={i} onClick={() => { setDetailImg(i); }} className={'w-[80px] h-[80px] rounded-[12px] overflow-hidden border-2 shrink-0 ' + (detailImg === i ? 'border-black' : 'border-transparent')}>
                    <img src={im} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
              <div className="rounded-[20px] bg-[#FAF8F5] overflow-hidden min-h-[320px] grid place-items-center">
                {mainImg ? <img src={mainImg} className="w-full h-[300px] md:h-[380px] object-contain" alt={selected.name} /> : <div className="w-[130px] h-[150px] rounded-b-[40px] rounded-t-[10px]" style={{ background: (colour && colour.hex) || selected.color }} />}
              </div>
              <div>
                <div className="font-sans text-[11px] tracking-[0.15em] text-black/40">{String(selected.category || selected.name || '').toUpperCase()}</div>
                <h2 className="font-serif text-[30px] font-bold leading-tight mt-1">{selected.name}</h2>
                <p className="font-sans text-[13px] text-black/50 mt-2 leading-6">{selected.desc} • Drainage hole included • Hand-finished</p>
                <div className="font-sans text-[11px] font-bold tracking-widest text-black/60 mt-5">COLOUR — {colour && colour.name}</div>
                <div className="flex gap-2 mt-2">{colours.map((c, i) => (
                  <button key={i} title={c.name} onClick={() => { setDetailColour(i); if (c.image) { const idx = allImgs.indexOf(c.image); if (idx >= 0) setDetailImg(idx); } }} className={'w-8 h-8 rounded-full border-2 ' + (detailColour === i ? 'border-black scale-110' : 'border-black/10')} style={{ background: c.hex }} />
                ))}</div>
                <div className="font-sans text-[11px] font-bold tracking-widest text-black/60 mt-4">TYPE</div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setWithPlant(false)} className={'h-9 px-4 rounded-full font-sans text-[12px] font-bold ' + (!withPlant ? 'bg-black text-white' : 'border border-black/10')}>Pot Only</button>
                  <button onClick={() => setWithPlant(true)} className={'h-9 px-4 rounded-full font-sans text-[12px] font-bold ' + (withPlant ? 'bg-black text-white' : 'border border-black/10')}>Pot with Plant</button>
                </div>
                <div className="font-sans text-[11px] font-bold tracking-widest text-black/60 mt-4">SIZE</div>
                <div className="flex gap-2 mt-2">{SIZES.map((s) => <button key={s.label} onClick={() => setSize(s.label)} className={'h-9 px-4 rounded-full font-sans text-[12px] font-bold ' + (size === s.label ? 'bg-black text-white' : 'border border-black/10')}>{s.label}{s.extra > 0 ? (' +₹' + s.extra) : ''}</button>)}</div>
                <div className="font-sans text-[20px] font-bold mt-4">₹{finalPrice} <span className="text-[12px] font-normal text-black/40">• {withPlant ? 'Pot with Plant' : 'Pot only'}</span></div>
                <button onClick={() => handleAdd(selected, withPlant)} className="h-11 px-6 rounded-full bg-black text-white font-sans text-[12px] font-bold hover:bg-[#1a5a3a] mt-5">{withPlant ? 'Add Pot with Plant' : 'Buy Pot Separately'}</button>
                <button onClick={() => setSelected(null)} className="font-sans text-[11px] text-black/50 mt-4 underline block">Close</button>
              </div>
            </div>
          );
        })()}
        {filter !== 'all' && (
          <div className="mt-6 flex items-center gap-3">
            <span className="font-sans text-[12px] font-bold">Showing {filtered.length} {filter} {filtered.length === 1 ? 'pot' : 'pots'}</span>
            <button onClick={() => setFilter('all')} className="h-7 px-3 rounded-full border bg-white font-sans text-[11px] font-bold">Clear filter ×</button>
          </div>
        )}
        <div id="pots-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mt-6 md:mt-8">
          {filtered.map((pot) => {
            const key = pot._id || pot.id;
            const imgs = getImages(pot);
            const colours = getColours(pot);
            const cIdx = colourIndex[key] || 0;
            const iIdx = imgIndex[key] || 0;
            const displayImg = getDisplayImage(pot, cIdx, iIdx);
            const colour = colours[cIdx] || colours[0];
            const price = Number(pot.price || 0) + Number((colour && colour.extra) || 0);
            return (
              <div key={key} onClick={() => openDetail(pot)} className="bg-white rounded-[20px] md:rounded-[24px] border border-black/[0.06] p-3 md:p-5 cursor-pointer hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] active:scale-[0.98] transition">
                <div className="relative h-[150px] md:h-[190px] rounded-[14px] md:rounded-[18px] bg-[#F0F7F0] overflow-hidden grid place-items-center">
                  {displayImg ? <img src={displayImg} className="w-full h-full object-cover" alt={pot.name} /> : <div className="w-[70px] h-[80px] rounded-b-[28px] rounded-t-[6px]" style={{ background: (colour && colour.hex) || pot.color }} />}
                  {imgs.length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setImgIndex((prev) => ({ ...prev, [key]: (iIdx - 1 + imgs.length) % imgs.length })); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow grid place-items-center text-[14px]">‹</button>
                      <button onClick={(e) => { e.stopPropagation(); setImgIndex((prev) => ({ ...prev, [key]: (iIdx + 1) % imgs.length })); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow grid place-items-center text-[14px]">›</button>
                    </>
                  )}
                </div>
                <div className="font-sans text-[10px] tracking-[0.15em] text-black/40 mt-3 md:mt-4 truncate">{String(pot.category || '').toUpperCase()}</div>
                <h3 className="font-serif text-[19px] font-bold mt-1">{pot.name}</h3>
                <p className="font-sans text-[11px] md:text-[12px] text-black/50 mt-1 line-clamp-2 leading-relaxed">{pot.desc}</p>
                <div className="flex gap-1.5 mt-3">{colours.map((c, ci) => (
                  <button key={ci} title={c.name} onClick={(e) => { e.stopPropagation(); setColourIndex((prev) => ({ ...prev, [key]: ci })); setImgIndex((prev) => ({ ...prev, [key]: 0 })); }} className={'w-5 h-5 md:w-6 md:h-6 rounded-full border-2 ' + (cIdx === ci ? 'border-black' : 'border-black/10')} style={{ background: c.hex }} />
                ))}<span className="font-sans text-[11px] text-black/50 ml-1 self-center">{colour && colour.name}</span></div>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-sans text-[14px] md:text-[16px] font-bold">₹{price}</span>
                  <button onClick={(e) => { e.stopPropagation(); handleAdd(pot, false); }} className="h-8 md:h-9 px-3 md:px-4 rounded-full bg-black text-white font-sans text-[11px] md:text-[12px] font-bold hover:bg-[#1a5a3a] active:scale-95 transition">Add Pot</button>
                </div>
                <div className="font-sans text-[11px] font-bold underline mt-3">View with Plant →</div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && <div className="text-center py-12 font-sans text-[13px] text-black/40">No pots in this category yet.</div>}
        <div className="mt-10 bg-[#1a5a3a] text-white rounded-[24px] p-6 text-center font-sans text-[12px]">Drainage hole in every pot • Pot price is separate • Plant price never changes automatically</div>
      </div>
    </div>
  );
}
