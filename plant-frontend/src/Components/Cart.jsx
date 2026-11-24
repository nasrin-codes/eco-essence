import Bill from "./BillNew";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [delivery, setDelivery] = useState({ name: '', phone: '', address1: '', address2: '', city: '', state: '', pincode: '', landmark: '' });

  // ===== PAYMENT OPTIONS - DROPDOWN: user choose karega, phir uske fields khulenge =====
  const [payMethod, setPayMethod] = useState('');
  const [upiPaid, setUpiPaid] = useState(false);

  /* ⚠️ PAYMENT QR CONFIG: yahan apna ASLI UPI ID daalo (live karne se pehle).
     Placeholder se payment kahin nahi jayega. Pehle ₹1 se test karo. */
  const MERCHANT_UPI_ID = 'ecoessence@upi';
  const MERCHANT_NAME = 'Eco-Essence';
  const [payOpen, setPayOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const [pay, setPay] = useState({ upiId: '', cardNumber: '', cardName: '', expiry: '', cvv: '', bank: '' });
  const PAY_METHODS = [
    { id: 'upi', label: 'UPI', sub: 'GPay • PhonePe • Paytm', icon: '📱', color: '#5B2E91' },
    { id: 'card', label: 'Credit / Debit Card', sub: 'Visa • Mastercard • RuPay', icon: '💳', color: '#1a5a3a' },
    { id: 'netbanking', label: 'NetBanking', sub: 'All major banks', icon: '🏦', color: '#2B4C8C' },
    { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when order arrives', icon: '💵', color: '#B97A0A' },
  ];
  const payLabel = (PAY_METHODS.find(m=>m.id===payMethod)||{}).label || '';

  // ===== ORDER MESSAGE - jo number delivery me diya, usi pe jayega (WhatsApp / SMS) =====
  const orderMsgText = (o) => `Hello ${o.customerName}! Your Eco-Essence order is confirmed.\n\nOrder ID: ${o.id}\nItems: ${o.items.map(i=>`${i.name} x ${i.qty||i.quantity||1}`).join(', ')}\nTotal: ₹${o.total} (${o.payment.methodLabel})\nDelivery: ${o.address.full}\n\nThank you for shopping with Eco-Essence!`;
  const msgPhone = (phone) => { const d = String(phone||'').replace(/\D/g,''); return d.length===10 ? '91'+d : d; };
  const sendWhatsApp = (o) => window.open(`https://wa.me/${msgPhone(o.phone)}?text=${encodeURIComponent(orderMsgText(o))}`, '_blank');
  const sendSMS = (o) => { window.location.href = `sms:+${msgPhone(o.phone)}?body=${encodeURIComponent(orderMsgText(o))}`; };
  const fmtCard = (v) => v.replace(/\D/g,'').slice(0,16).replace(/(\d{4})(?=\d)/g,'$1 ');
  const fmtExpiry = (v) => { const d=v.replace(/\D/g,'').slice(0,4); return d.length>2 ? d.slice(0,2)+'/'+d.slice(2) : d; };

  // LOGIN CHECK - SAME AS SHOP
  const isLoggedIn = () => {
    const token = localStorage.getItem('plant_jwt_token') || localStorage.getItem('jwt_token') || localStorage.getItem('user_token');
    const userName = localStorage.getItem('plant_user_name') || localStorage.getItem('user_name');
    const userEmail = localStorage.getItem('plant_user_email') || localStorage.getItem('user_email');
    // If name is USER or U USER generic, treat as NOT logged in
    if (userName && (userName === 'USER' || userName.toUpperCase() === 'U USER' || userName.trim().toUpperCase() === 'U')) return false;
    return !!(token || (userName && userName.length > 1 && userName !== 'USER') || userEmail);
  };

  const requireLogin = (action = 'buy items') => {
    if (isLoggedIn()) return true;
    alert(`🔒 Please login first to ${action}! Browsing is free, buying needs profile.`);
    navigate(`/auth?next=/cart&action=${encodeURIComponent(action)}`);
    return false;
  };

  // CART SOURCE OF TRUTH: eco_cart_<user email> - Navbar bhi wahi key padhta hai.
  // Pehle Cart page sirf generic eco_cart padhta tha, Navbar per-user key - isliye Navbar 4, Cart page 0 dikhta tha.
  const getEmail = () => (localStorage.getItem('plant_user_email') || localStorage.getItem('user_email') || '').trim().toLowerCase();
  const cartKey = () => `eco_cart_${getEmail()}`;
  const loadCart = () => {
    const email = getEmail();
    if (!email) { setCart([]); return; }
    try {
      const raw = localStorage.getItem(`eco_cart_${email}`);
      let arr = raw ? JSON.parse(raw) : null;
      if (!Array.isArray(arr)) arr = [];
      // Migrate: SIRF tab jab per-user key kabhi bani hi nahi (pehli baar). Key '[]' hai to matlab cart jaanboojh kar khali hai - migrate karke wapas mat bharo
      if (raw === null) {
        for (const gk of ['eco_cart', 'cart', 'eco_shop_cart']) {
          try {
            const g = JSON.parse(localStorage.getItem(gk) || '[]');
            if (Array.isArray(g) && g.length > 0) { arr = g; localStorage.setItem(`eco_cart_${email}`, JSON.stringify(g)); localStorage.removeItem(gk); break; }
          } catch {}
        }
      }
      setCart(arr);
    } catch { setCart([]); }
  };
  const saveCart = (arr) => {
    setCart(arr);
    const email = getEmail();
    if (email) localStorage.setItem(cartKey(), JSON.stringify(arr));
    window.dispatchEvent(new Event('eco-cart-updated'));
  };

  useEffect(() => {
    loadCart();
    const onUpdate = () => loadCart();
    window.addEventListener('eco-cart-updated', onUpdate);
    window.addEventListener('storage', onUpdate);
    window.addEventListener('focus', onUpdate);
    return () => { window.removeEventListener('eco-cart-updated', onUpdate); window.removeEventListener('storage', onUpdate); window.removeEventListener('focus', onUpdate); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const qtyOf = (i) => Number(i.qty || i.quantity || 1);
  const cartCount = cart.reduce((s, i) => s + qtyOf(i), 0);
  const changeQty = (id, delta) => {
    const nc = cart.map(c => (String(c.id) === String(id) || String(c._id) === String(id)) ? { ...c, qty: Math.max(1, qtyOf(c) + delta) } : c);
    saveCart(nc);
  };
  const subtotal = cart.reduce((s, i) => s + (i.total || i.price || 0) * qtyOf(i), 0);
  const deliveryFee = subtotal > 0 ? 49 : 0;
  const total = subtotal + deliveryFee;
  // UPI link - total ke BAAD hi bane, warna blank page (TDZ crash) aata tha
  const upiPayLink = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${total}&cu=INR&tn=${encodeURIComponent('Eco-Essence Order')}`;
  const upiQrImg = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=12&color=0F2A1D&bgcolor=FFFFFF&data=${encodeURIComponent(upiPayLink)}`;
  // BUY button ka label - total ke BAAD, warna 'Cannot access total before initialization' aayega
  const buyBtnLabel = !payMethod ? `BUY NOW — ₹${total}` : payMethod==='cod' ? `PLACE ORDER — ₹${total} (Pay on Delivery)` : `PAY ₹${total} VIA ${payLabel.toUpperCase()}`;

  const handleRemove = (id) => {
    if (!requireLogin('remove items')) return;
    const nc = cart.filter(c => String(c.id) !== String(id) && String(c._id) !== String(id));
    saveCart(nc);
  };

  const handleBuyNow = () => {
    // BLOCK BUY IF NOT LOGGED IN
    if (!requireLogin('buy items')) return;

    if (!delivery.name || !delivery.phone || !delivery.address1 || !delivery.pincode) {
      alert('Please fill all required fields *');
      return;
    }

    // PAYMENT VALIDATION - pehle method choose karna hi hoga
    if(!payMethod){ alert('Please select a payment method first'); return; }
    if(payMethod==='upi' && !upiPaid && (!pay.upiId || !pay.upiId.includes('@'))){ alert('Scan the QR to pay, OR enter your UPI ID for a collect request'); return; }
    if(payMethod==='card'){
      if(pay.cardNumber.replace(/\s/g,'').length!==16){ alert('Please enter a valid 16-digit card number'); return; }
      if(!pay.cardName.trim()){ alert('Please enter the name on card'); return; }
      if(pay.expiry.length!==5){ alert('Please enter card expiry as MM/YY'); return; }
      if(pay.cvv.length!==3){ alert('Please enter the 3-digit CVV'); return; }
    }
    if(payMethod==='netbanking' && !pay.bank){ alert('Please select your bank'); return; }

    // PAYMENT INFO - card ke sensitive details kabhi save nahi hote, sirf last 4 digits
    const paymentInfo = payMethod==='upi'
      ? { method: 'upi', methodLabel: upiPaid ? 'UPI • Scan & Pay (Paid)' : 'UPI • ' + pay.upiId, status: 'Paid' }
      : payMethod==='card'
      ? { method: 'card', methodLabel: 'Card •••• ' + pay.cardNumber.replace(/\s/g,'').slice(-4), status: 'Paid' }
      : payMethod==='netbanking'
      ? { method: 'netbanking', methodLabel: 'NetBanking • ' + pay.bank, status: 'Paid' }
      : { method: 'cod', methodLabel: 'Cash on Delivery', status: 'Pay on Delivery' };

    const orders = JSON.parse(localStorage.getItem('eco_orders') || '[]');
    const newOrder = {
      paymentMethod: payMethod,
      payment: paymentInfo,
      id: Date.now().toString(),
      customerName: delivery.name,
      customerEmail: localStorage.getItem('plant_user_email') || localStorage.getItem('user_email') || '',
      phone: delivery.phone,
      address: {
        address1: delivery.address1,
        address2: delivery.address2,
        city: delivery.city,
        state: delivery.state,
        pincode: delivery.pincode,
        landmark: delivery.landmark,
        full: `${delivery.address1}, ${delivery.city} ${delivery.pincode}`
      },
      items: cart,
      total: total,
      date: new Date().toISOString(),
      status: 'pending'
    };
    localStorage.setItem('eco_orders', JSON.stringify([...orders, newOrder]));
    // SERVER PE BHI ORDER BHEJO - warna dusre device ke Admin ko order kabhi nahi dikhega.
    // Items se photo hatao - photo badi hoti hai, server ko sirf naam/price/qty chahiye.
    try{
      const serverOrder = { ...newOrder, items: (newOrder.items||[]).map(it => { const { img, image, imageUrl, photo, ...rest } = it || {}; return rest; }) };
      fetch(`${API_URL}/api/orders`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(serverOrder) }).catch(()=>{});
    }catch{}
    // Cart EMPTY: pehle SAARI cart keys clear karo, TABHI event bhejo - warna event pe loadCart purane generic key se items wapas le aata tha
    const buyerEmail = getEmail();
    if (buyerEmail) localStorage.setItem(`eco_cart_${buyerEmail}`, '[]');
    localStorage.setItem('eco_cart', '[]');
    localStorage.setItem('cart', '[]');
    localStorage.removeItem('eco_shop_cart');
    setCart([]);
    window.dispatchEvent(new Event('eco-cart-updated'));
    setPlacedOrder(newOrder); // success screen: message preview + Send button
  };

  // IF NOT LOGGED IN - SHOW LOGIN REQUIRED OVERLAY
  if (!isLoggedIn()) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A]">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500&display=swap'); .font-serif{font-family:"Instrument Serif",serif} .font-sans{font-family:"Inter",sans-serif}`}</style>
        <div className="max-w-[1280px] mx-auto px-6 py-12">
          <h1 className="font-serif text-[28px]">Cart ({cartCount})</h1>
          
          <div className="mt-8 grid lg:grid-cols-[1fr_380px] gap-8">
            {/* LEFT - Show cart items blurred */}
            <div className="relative">
              <div className="space-y-3 opacity-40 pointer-events-none">
                {cart.length > 0 ? cart.map(item => (
                  <div key={item.id||item._id} className="flex gap-4 p-4 bg-white border rounded-[12px]">
                    <img src={item.img||item.image} className="w-16 h-16 rounded-[10px] object-cover" alt="" />
                    <div><div className="font-sans text-[13px] font-medium">{item.name}</div><div className="font-sans text-[13px] font-bold">₹{item.total||item.price}</div></div>
                  </div>
                )) : (
                  <div className="p-8 bg-white border rounded-[12px] text-center font-sans text-[13px]">Your cart has {cart.length} items — login to view</div>
                )}
              </div>

              {/* LOGIN OVERLAY */}
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] grid place-items-center rounded-[16px] border">
                <div className="bg-white rounded-[20px] border shadow-xl p-8 max-w-[360px] w-full text-center">
                  <div className="w-14 h-14 rounded-full bg-[#1a5a3a]/10 grid place-items-center mx-auto text-[20px]">🔒</div>
                  <h2 className="font-serif text-[22px] font-bold mt-4">Login Required</h2>
                  <p className="font-sans text-[12px] text-black/60 mt-2 leading-[1.6]">You are viewing as <b>USER</b> — browsing is free, but you need to login to add or buy items. Your login will be tracked for admin.</p>
                  <div className="mt-6 grid gap-2">
                    <button onClick={() => navigate('/auth?next=/cart')} className="h-12 rounded-full bg-[#1A1A1A] text-white font-sans text-[13px] font-[500]">Login / Signup to Buy →</button>
                    <button onClick={() => navigate('/shop')} className="h-10 rounded-full border font-sans text-[12px]">Continue Browsing Shop</button>
                  </div>
                  <div className="mt-4 font-sans text-[10px] opacity-40">Free 2h delivery on 380054 • Pan-India</div>
                </div>
              </div>
            </div>

            {/* RIGHT - Delivery blocked */}
            <div className="bg-white rounded-[16px] border p-6 opacity-40 pointer-events-none">
              <h3 className="font-serif text-[16px] font-bold">Delivery Address</h3>
              <div className="mt-4 space-y-3">
                <div className="h-11 rounded-full border bg-[#FAF8F5]"></div>
                <div className="h-11 rounded-full border bg-[#FAF8F5]"></div>
                <div className="h-11 rounded-full border bg-[#FAF8F5]"></div>
                <div className="h-12 rounded-full bg-black"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ORDER PLACED - SUCCESS + SEND MESSAGE TO THAT NUMBER
  if (placedOrder) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A]">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500&display=swap'); .font-serif{font-family:"Instrument Serif",serif} .font-sans{font-family:"Inter",sans-serif} @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div className="max-w-[640px] mx-auto px-6 py-12" style={{animation:'fadeUp .4s ease both'}}>
          <div className="bg-white rounded-[24px] border border-black/5 shadow-sm p-7 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a5a3a] text-white grid place-items-center mx-auto text-[28px] ring-4 ring-[#C9A227]/30">✓</div>
            <h1 className="font-serif text-[28px] font-bold mt-4">Order Confirmed!</h1>
            <p className="font-sans text-[12px] opacity-60 mt-1">Order ID: <b>{placedOrder.id}</b> • Total: <b>₹{placedOrder.total}</b> • {placedOrder.payment.methodLabel}</p>
            <div className="mt-5 text-left p-4 rounded-[16px] bg-[#F0F7F0] border border-[#1a5a3a]/15">
              <div className="font-sans text-[10px] tracking-[0.18em] font-bold opacity-50">MESSAGE TO BE SENT • 📱 +91 {placedOrder.phone}</div>
              <pre className="font-sans text-[12px] leading-[1.7] whitespace-pre-wrap mt-2">{orderMsgText(placedOrder)}</pre>
            </div>
            <div className="mt-4 p-3 rounded-[14px] bg-[#FFFEF9] border font-sans text-[12px] leading-[1.6]">📱 Order confirmation aapke WhatsApp number <b>+91 {placedOrder.phone}</b> pe shop se bheja jayega.</div>
            <div className="mt-4 grid gap-2">
              <button onClick={()=>navigate('/orders')} className="h-12 rounded-full bg-[#1a5a3a] text-white font-sans text-[13px] font-bold hover:bg-black transition">View My Orders →</button>
              <button onClick={()=>setShowBill(true)} className="h-12 rounded-full bg-[#0F2A1D] text-white font-sans text-[13px] font-bold hover:bg-[#1a5a3a] transition">🧾 View / Print Bill</button>
              <button onClick={()=>navigate('/shop')} className="h-11 rounded-full border font-sans text-[12px]">Continue Shopping</button>
            </div>
            <div className="font-sans text-[10px] opacity-40 mt-3">Message usi number pe jayega jo aapne delivery me diya hai</div>
          </div>
        </div>
        {showBill && <Bill order={placedOrder} onClose={()=>setShowBill(false)} />}
      </div>
    );
  }

  // LOGGED IN - NORMAL CART
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500&display=swap'); .font-serif{font-family:"Instrument Serif",serif} .font-sans{font-family:"Inter",sans-serif} @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <h1 className="font-sans text-[14px] font-bold tracking-[0.04em]">Cart ({cartCount})</h1>

        <div className="mt-6 grid lg:grid-cols-[1fr_380px] gap-8">
          {/* LEFT - ITEMS */}
          <div className="space-y-3">
            {cart.length === 0 ? (
              <div className="bg-white border rounded-[16px] p-12 text-center">
                <div className="font-serif text-[20px]">Your cart is empty</div>
                <button onClick={() => navigate('/shop')} className="mt-4 h-10 px-6 rounded-full bg-black text-white font-sans text-[12px]">Shop Plants →</button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id||item._id} className="flex gap-4 p-4 bg-white border rounded-[12px]">
                  <img src={item.img||item.image} className="w-16 h-16 rounded-[10px] object-cover" alt="" />
                  <div className="flex-1">
                    <div className="font-sans text-[13px] font-semibold">{item.name}</div>
                    <div className="font-sans text-[13px] font-bold mt-1">₹{item.total||item.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => changeQty(item.id||item._id, -1)} className="w-7 h-7 rounded-full border font-bold">−</button>
                    <span className="font-sans text-[12px] font-bold w-4 text-center">{qtyOf(item)}</span>
                    <button onClick={() => changeQty(item.id||item._id, 1)} className="w-7 h-7 rounded-full border font-bold">+</button>
                  </div>
                  <button onClick={() => handleRemove(item.id||item._id)} className="self-start px-3 py-1 rounded-full bg-[#FEF2F2] text-[#991B1B] font-sans text-[11px]">Remove</button>
                </div>
              ))
            )}
          </div>

          {/* RIGHT - DELIVERY */}
          <div className="bg-white rounded-[24px] border border-black/5 border-t-4 border-t-[#C9A227] shadow-sm p-6 h-fit sticky top-6" style={{animation:'fadeUp .4s ease both'}}>
            <div className="font-sans text-[10px] tracking-[0.22em] font-bold opacity-40">CHECKOUT</div>
            <h3 className="font-serif text-[20px] font-bold mt-1">Delivery Address</h3>
            <div className="h-[2px] bg-[#C9A227]/70 rounded-full mt-2 w-[80px]" />
            <div className="mt-4 grid gap-3">
              <input placeholder="Full Name *" value={delivery.name} onChange={e=>setDelivery({...delivery,name:e.target.value})} className="h-11 rounded-full border border-black/15 px-5 text-[13px] font-sans bg-white outline-none focus:border-[#1a5a3a] focus:ring-2 focus:ring-[#1a5a3a]/15 transition placeholder:text-black/35"/>
              <input placeholder="Phone *" value={delivery.phone} onChange={e=>setDelivery({...delivery,phone:e.target.value})} className="h-11 rounded-full border border-black/15 px-5 text-[13px] font-sans bg-white outline-none focus:border-[#1a5a3a] focus:ring-2 focus:ring-[#1a5a3a]/15 transition placeholder:text-black/35"/>
              <input placeholder="Address Line 1 *" value={delivery.address1} onChange={e=>setDelivery({...delivery,address1:e.target.value})} className="h-11 rounded-full border border-black/15 px-5 text-[13px] font-sans bg-white outline-none focus:border-[#1a5a3a] focus:ring-2 focus:ring-[#1a5a3a]/15 transition placeholder:text-black/35"/>
              <input placeholder="Address Line 2" value={delivery.address2} onChange={e=>setDelivery({...delivery,address2:e.target.value})} className="h-11 rounded-full border border-black/15 px-5 text-[13px] font-sans bg-white outline-none focus:border-[#1a5a3a] focus:ring-2 focus:ring-[#1a5a3a]/15 transition placeholder:text-black/35"/>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="City" value={delivery.city} onChange={e=>setDelivery({...delivery,city:e.target.value})} className="h-11 rounded-full border border-black/15 px-5 text-[13px] font-sans bg-white outline-none focus:border-[#1a5a3a] focus:ring-2 focus:ring-[#1a5a3a]/15 transition placeholder:text-black/35"/>
                <input placeholder="Pincode * (6-digit)" value={delivery.pincode} onChange={e=>setDelivery({...delivery,pincode:e.target.value})} className="h-11 rounded-full border border-black/15 px-5 text-[13px] font-sans bg-white outline-none focus:border-[#1a5a3a] focus:ring-2 focus:ring-[#1a5a3a]/15 transition placeholder:text-black/35"/>
              </div>
              <input placeholder="Landmark" value={delivery.landmark} onChange={e=>setDelivery({...delivery,landmark:e.target.value})} className="h-11 rounded-full border border-black/15 px-5 text-[13px] font-sans bg-white outline-none focus:border-[#1a5a3a] focus:ring-2 focus:ring-[#1a5a3a]/15 transition placeholder:text-black/35"/>

              {/* PAYMENT METHOD - DROPDOWN, vibrant */}
              <div className="mt-2 pt-4 border-t">
                <div className="font-sans text-[10px] tracking-[0.22em] font-bold opacity-40">SECURE PAYMENT</div>
                <div className="font-serif text-[18px] font-bold mt-1">Payment Method</div>
                <div className="h-[2px] bg-[#C9A227]/70 rounded-full mt-2 w-[80px]" />
                <div className="font-sans text-[11px] opacity-50 mt-2">Choose how you want to pay • 100% secure</div>
                <div className="relative mt-3">
                  {payOpen && <div className="fixed inset-0 z-10" onClick={()=>setPayOpen(false)} />}
                  <button type="button" onClick={()=>setPayOpen(o=>!o)} className={`relative z-20 w-full h-12 rounded-[14px] border-2 px-4 font-sans text-[13px] font-bold bg-white transition flex items-center gap-3 text-left cursor-pointer ${payOpen ? 'border-[#1a5a3a] ring-2 ring-[#1a5a3a]/15' : payMethod ? 'border-[#1a5a3a] text-[#1a5a3a]' : 'border-black/15 text-black/50 hover:border-black/30'}`}>
                    {payMethod ? (<><span className="w-8 h-8 rounded-full grid place-items-center text-[15px] shrink-0" style={{background: (PAY_METHODS.find(m=>m.id===payMethod)||{}).color+'1A'}}>{(PAY_METHODS.find(m=>m.id===payMethod)||{}).icon}</span><span className="flex-1 truncate">{payLabel}</span></>) : <span className="flex-1">Select Payment Method</span>}
                    <span className={`text-[11px] transition-transform ${payOpen ? 'rotate-180' : ''}`}>▾</span>
                  </button>
                  {payOpen && (
                    <div className="absolute left-0 right-0 top-full mt-2 z-20 bg-white rounded-[16px] border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden" style={{animation:'fadeUp .25s ease both'}}>
                      {PAY_METHODS.map(m=>(
                        <button key={m.id} type="button" onClick={()=>{setPayMethod(m.id); setPayOpen(false); setUpiPaid(false);}} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${payMethod===m.id ? 'bg-[#F0F7F0]' : 'hover:bg-[#FAF8F5]'}`}>
                          <span className="w-9 h-9 rounded-full grid place-items-center text-[16px] shrink-0" style={{background: m.color+'1A'}}>{m.icon}</span>
                          <span className="flex-1"><span className="block font-sans text-[12px] font-bold">{m.label}</span><span className="block font-sans text-[10px] opacity-50">{m.sub}</span></span>
                          {payMethod===m.id && <span className="w-5 h-5 rounded-full bg-[#1a5a3a] text-white grid place-items-center text-[10px] shrink-0">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {payMethod && (
                  <div className="mt-2 p-3 rounded-[14px] bg-[#F0F7F0] border border-[#1a5a3a]/20 flex items-center gap-2" style={{animation:'fadeUp .3s ease both'}}>
                    <span className="text-[16px]">{(PAY_METHODS.find(m=>m.id===payMethod)||{}).icon}</span>
                    <span className="font-sans text-[12px] font-bold text-[#1a5a3a]">{payLabel}</span>
                    <span className="font-sans text-[10px] opacity-60">• {(PAY_METHODS.find(m=>m.id===payMethod)||{}).sub}</span>
                  </div>
                )}
                {payMethod==='upi' && (
                  <div className="mt-2 space-y-3" style={{animation:'fadeUp .3s ease both'}}>
                    {/* SCAN TO PAY QR - customer aapke UPI ID pe pay karega */}
                    <div className="p-4 rounded-[16px] bg-white border border-[#1a5a3a]/20 flex gap-4 items-center">
                      <a href={upiPayLink} className="shrink-0 block leading-[0]" title="Tap to open UPI app">
                        <img src={upiQrImg} alt="Scan to pay Eco-Essence" width="110" height="110" className="rounded-[10px] border border-black/5" loading="lazy" />
                      </a>
                      <div className="min-w-0">
                        <div className="font-sans text-[13px] font-bold">Scan to Pay <span className="text-[#1a5a3a]">₹{total}</span></div>
                        <div className="font-sans text-[11px] opacity-60 mt-1 leading-relaxed">GPay / PhonePe / Paytm se scan karo. Pay to: <b>{MERCHANT_NAME}</b><br />UPI ID: <b>{MERCHANT_UPI_ID}</b></div>
                        <label className="flex items-center gap-2 mt-2.5 cursor-pointer select-none">
                          <input type="checkbox" checked={upiPaid} onChange={e=>setUpiPaid(e.target.checked)} className="w-4 h-4 accent-[#1a5a3a]" />
                          <span className="font-sans text-[11px] font-bold">I have paid via QR</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center gap-3"><span className="flex-1 h-px bg-black/10" /><span className="font-sans text-[10px] font-bold opacity-40">OR</span><span className="flex-1 h-px bg-black/10" /></div>
                    {/* COLLECT REQUEST - purana tareeka, abhi bhi available */}
                    <div><input placeholder="UPI ID • e.g. name@okhdfc" value={pay.upiId} onChange={e=>setPay({...pay, upiId: e.target.value})} className="w-full h-11 rounded-full border border-black/15 px-5 text-[13px] font-sans bg-white outline-none focus:border-[#1a5a3a] focus:ring-2 focus:ring-[#1a5a3a]/15 transition placeholder:text-black/35" /><div className="font-sans text-[10px] opacity-50 mt-1.5">Collect request: aapke UPI app me ₹{total} approve karne ka request aayega</div></div>
                  </div>
                )}
                {payMethod==='card' && (
                  <div className="mt-2 space-y-2" style={{animation:'fadeUp .3s ease both'}}>
                    <input placeholder="Card number • 16 digits" value={pay.cardNumber} onChange={e=>setPay({...pay, cardNumber: fmtCard(e.target.value)})} inputMode="numeric" className="w-full h-11 rounded-full border border-black/15 px-5 text-[13px] font-sans bg-white outline-none focus:border-[#1a5a3a] focus:ring-2 focus:ring-[#1a5a3a]/15 transition placeholder:text-black/35" />
                    <input placeholder="Name on card" value={pay.cardName} onChange={e=>setPay({...pay, cardName: e.target.value})} className="w-full h-11 rounded-full border border-black/15 px-5 text-[13px] font-sans bg-white outline-none focus:border-[#1a5a3a] focus:ring-2 focus:ring-[#1a5a3a]/15 transition placeholder:text-black/35" />
                    <div className="grid grid-cols-2 gap-2"><input placeholder="Expiry • MM/YY" value={pay.expiry} onChange={e=>setPay({...pay, expiry: fmtExpiry(e.target.value)})} inputMode="numeric" className="h-11 rounded-full border border-black/15 px-5 text-[13px] font-sans bg-white outline-none focus:border-[#1a5a3a] focus:ring-2 focus:ring-[#1a5a3a]/15 transition placeholder:text-black/35" /><input placeholder="CVV • 3 digits" value={pay.cvv} onChange={e=>setPay({...pay, cvv: e.target.value.replace(/\D/g,'').slice(0,3)})} inputMode="numeric" type="password" className="h-11 rounded-full border border-black/15 px-5 text-[13px] font-sans bg-white outline-none focus:border-[#1a5a3a] focus:ring-2 focus:ring-[#1a5a3a]/15 transition placeholder:text-black/35" /></div>
                    <div className="font-sans text-[10px] opacity-50">Card details are never stored — only the last 4 digits are saved with your order.</div>
                  </div>
                )}
                {payMethod==='netbanking' && (
                  <div className="mt-2" style={{animation:'fadeUp .3s ease both'}}><select value={pay.bank} onChange={e=>setPay({...pay, bank: e.target.value})} className="w-full h-11 rounded-full border px-4 text-[13px] font-sans bg-white"><option value="">Select your bank</option><option>HDFC Bank</option><option>ICICI Bank</option><option>State Bank of India</option><option>Axis Bank</option><option>Kotak Mahindra Bank</option><option>Punjab National Bank</option><option>Bank of Baroda</option><option>Other Bank</option></select></div>
                )}
                {payMethod==='cod' && (
                  <div className="mt-2 p-3 rounded-[14px] bg-[#FFFEF9] border font-sans text-[11px] opacity-80" style={{animation:'fadeUp .3s ease both'}}>Pay <b>₹{total}</b> in cash or UPI when your order arrives. Please keep the amount ready.</div>
                )}
              </div>

              <div className="mt-2 pt-4 border-t space-y-2 font-sans text-[12px]">
                <div className="flex justify-between"><span className="opacity-60">Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between"><span className="opacity-60">Delivery</span><span>₹{deliveryFee}</span></div>
                <div className="flex justify-between font-bold text-[13px] bg-[#F0F7F0] rounded-[10px] px-3 py-2.5"><span>Total to Pay</span><span className="text-[#1a5a3a]">₹{total}</span></div>
              </div>

              <button onClick={handleBuyNow} className="mt-4 w-full h-12 rounded-full bg-black text-white font-sans text-[13px] font-bold hover:bg-[#1a5a3a] transition shadow-[0_10px_25px_rgba(26,90,58,0.3)]">
                {buyBtnLabel}
              </button>
              <div className="text-center font-sans text-[11px] opacity-50 mt-2">🔒 100% Secure Checkout • Free 2h delivery on 380054 • Pan-India</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
