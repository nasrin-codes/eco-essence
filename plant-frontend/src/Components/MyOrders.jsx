import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);
  // PRIVACY: sirf is user ka order - email match, ya purane (bina email) order me naam match
  const isMine = (o, email, name) => {
    if (!email) return false; // guest ko kisi ka order nahi
    const em = String(o.customerEmail||'').trim().toLowerCase();
    if (em) return em === String(email).trim().toLowerCase();
    const nm = String(o.customerName||o.name||'').trim().toLowerCase();
    return !!nm && !!name && nm === String(name).trim().toLowerCase();
  };
  const [editAddress, setEditAddress] = useState({ name:'', phone:'', address1:'', city:'', pincode:'', full:'' });

  useEffect(()=>{
    const name = localStorage.getItem('plant_user_name')||'';
    const email = localStorage.getItem('plant_user_email')||'';
    setUserName(name);
    setUserEmail(email);

    const loadOrders = () => {
      try {
        const all = JSON.parse(localStorage.getItem('eco_orders')||'[]');
        // SIRF is user ke orders - dusre user ke purane orders kabhi nahi
        const mine = all.filter(o=>isMine(o, email, name));
        // sort newest first
        mine.sort((a,b)=> new Date(b.date||b.createdAt||0) - new Date(a.date||a.createdAt||0));
        setOrders(mine);
      } catch { setOrders([]); }
    };
    loadOrders();
    // try backend
    fetch(`${API_URL}/api/orders`, { headers: { 'x-admin-key': 'eco2025' } })
      .then(r=>r.ok?r.json():[])
      .then(data=>{
        if(Array.isArray(data)&&data.length>0){
          const filtered = data.filter(o=>isMine(o, email, name));
          if(filtered.length>0){
            filtered.sort((a,b)=> new Date(b.date||b.createdAt||0) - new Date(a.date||a.createdAt||0));
            setOrders(filtered);
            // localStorage me sabke orders wapas mat likho - sirf dikhao, baaki ka data mat chhedo
          }
        }
      }).catch(()=>{});
  },[]);

  const getInitial = () => userName ? userName.trim()[0].toUpperCase() : userEmail ? userEmail[0].toUpperCase() : 'U';
  const getDisplay = () => userName || (userEmail? userEmail.split('@')[0] : 'USER');

  const getExpected = (orderDate) => {
    try{
      const d = new Date(orderDate);
      d.setDate(d.getDate()+2);
      const now = new Date();
      const diff = Math.ceil((d-now)/(1000*60*60*24));
      if(diff<=0) return 'Arriving today';
      if(diff===1) return 'Expected tomorrow';
      return `Expected in ${diff} days — ${d.toLocaleDateString('en-IN', { day:'numeric', month:'short' })}`;
    }catch{ return 'Expected in 2 days'; }
  };

  const handleEditAddress = (order) => {
    setEditingOrder(order.id||order._id);
    setEditAddress({
      name: order.customerName||order.name||userName,
      phone: order.phone||'',
      address1: order.address?.address1||order.address?.full||order.address1||'',
      city: order.address?.city||'',
      pincode: order.address?.pincode||'',
      full: order.address?.full||'',
    });
  };

  const handleSaveAddress = () => {
    if(!editAddress.address1 || !editAddress.pincode){
      alert('Fill address & pincode'); return;
    }
    const all = JSON.parse(localStorage.getItem('eco_orders')||'[]');
    const updated = all.map(o=>{
      if(String(o.id)===String(editingOrder) || String(o._id)===String(editingOrder)){
        return {
          ...o,
          customerName: editAddress.name,
          phone: editAddress.phone,
          address: {
            ...o.address,
            address1: editAddress.address1,
            city: editAddress.city,
            pincode: editAddress.pincode,
            full: `${editAddress.address1}, ${editAddress.city} ${editAddress.pincode}`
          }
        };
      }
      return o;
    });
    localStorage.setItem('eco_orders', JSON.stringify(updated));
    // reload filtered - sirf is user ke
    const mine = updated.filter(o=>isMine(o, userEmail, userName));
    mine.sort((a,b)=> new Date(b.date||0)-new Date(a.date||0));
    setOrders(mine);
    setEditingOrder(null);
    alert('✅ Delivery address updated!');
  };

  const handleCancel = (id) => {
    if(!confirm('Cancel this order?')) return;
    const all = JSON.parse(localStorage.getItem('eco_orders')||'[]');
    const filtered = all.filter(o=> String(o.id)!==String(id) && String(o._id)!==String(id));
    localStorage.setItem('eco_orders', JSON.stringify(filtered));
    setOrders(orders.filter(o=> String(o.id)!==String(id) && String(o._id)!==String(id)));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap'); .font-serif{font-family:"Instrument Serif",serif} .font-sans{font-family:"Inter",sans-serif}`}</style>

      <div className="max-w-[900px] mx-auto px-6 py-10">
        {/* Header with Y icon */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-black text-white grid place-items-center font-bold text-[18px]">{getInitial()}</div>
          <div>
            <div className="font-serif text-[24px] font-bold">My Orders • {getDisplay()} 🌿</div>
            <div className="font-sans text-[12px] opacity-60">{userEmail} • {orders.length} orders • Pan-India delivery</div>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={()=>navigate('/shop')} className="h-10 px-5 rounded-full bg-white border text-[12px] font-bold">Continue Shopping</button>
            <button onClick={()=>navigate('/')} className="h-10 px-5 rounded-full bg-black text-white text-[12px] font-bold">Home</button>
          </div>
        </div>

        {orders.length===0 && (
          <div className="bg-white border border-black/5 rounded-[24px] p-12 text-center">
            <div className="text-[40px]">🛒</div>
            <div className="font-serif text-[20px] font-bold mt-4">No orders yet</div>
            <div className="font-sans text-[13px] opacity-60 mt-2">Your orders will appear here. Plant name, price, total, delivery address & expected time.</div>
            <button onClick={()=>navigate('/shop')} className="mt-6 h-11 px-7 rounded-full bg-black text-white text-[13px] font-bold">Shop Plants →</button>
          </div>
        )}

        <div className="space-y-5">
          {orders.map(order=>{
            const items = order.items||order.products||[{ name: order.name||'Plant', price: order.price||99, img: order.image, qty:1 }];
            const total = order.total || items.reduce((s,i)=> s + (Number(i.total||i.price||0)*(i.qty||1)),0);
            const addr = order.address || {};
            const fullAddr = addr.full || `${addr.address1||''} ${addr.city||''} ${addr.pincode||''}`.trim() || order.deliveryAddress || 'No address';
            const isEditing = String(editingOrder)===String(order.id||order._id);
            
            return (
              <div key={order.id||order._id} className="bg-white border border-black/5 rounded-[20px] overflow-hidden">
                <div className="p-5 flex justify-between items-start bg-[#FAF8F5]/50 border-b border-black/5">
                  <div className="font-sans">
                    <div className="text-[11px] font-bold tracking-[0.1em] opacity-40">ORDER #{String(order.id||order._id).slice(-6).toUpperCase()} • {new Date(order.date||order.createdAt||Date.now()).toLocaleDateString('en-IN')}</div>
                    <div className="text-[13px] font-bold mt-1 text-[#1a5a3a]">{getExpected(order.date||order.createdAt)}</div>
                    <div className="text-[11px] mt-1 opacity-60">Status: <span className="font-bold capitalize">{order.status||'pending'} • {order.paymentStatus||'COD'}</span></div>
                  </div>
                  <div className="text-right">
                    <div className="font-sans text-[11px] opacity-50">Total Amount</div>
                    <div className="font-serif text-[20px] font-bold">₹{total}</div>
                    <button onClick={()=>handleCancel(order.id||order._id)} className="mt-1 text-[11px] text-red-500 underline font-sans">Cancel</button>
                  </div>
                </div>

                <div className="p-5 grid md:grid-cols-[1.2fr_0.8fr] gap-6">
                  {/* Plants detail */}
                  <div>
                    <div className="font-sans text-[11px] font-bold tracking-[0.1em] opacity-40 mb-3">PLANTS • {items.length} ITEMS</div>
                    <div className="space-y-3">
                      {items.map((it, idx)=>(
                        <div key={idx} className="flex gap-3 p-3 rounded-[14px] bg-[#FAF8F5] border border-black/5">
                          <img src={it.img||it.image||'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200'} className="w-14 h-14 rounded-[10px] object-cover bg-white border" alt={it.name} />
                          <div className="flex-1">
                            <div className="font-sans text-[13px] font-bold">{it.name}</div>
                            <div className="font-sans text-[11px] opacity-60 mt-0.5">{it.pot||it.category||'Potted • Terracotta'}</div>
                            <div className="flex justify-between mt-1">
                              <span className="font-sans text-[12px]">₹{it.price||it.total} {it.qty?`x ${it.qty}`:''}</span>
                              <span className="font-sans text-[12px] font-bold">₹{it.total||it.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery address + editable */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-sans text-[11px] font-bold tracking-[0.1em] opacity-40">DELIVERY ADDRESS</div>
                      <button onClick={()=> isEditing? setEditingOrder(null) : handleEditAddress(order)} className="font-sans text-[11px] font-bold text-[#1a5a3a] underline">{isEditing?'Close':'Change address'}</button>
                    </div>
                    
                    {!isEditing ? (
                      <div className="p-4 rounded-[14px] border bg-[#FFFEF9] border-[#E5E7EB]">
                        <div className="font-sans text-[13px] font-bold">{order.customerName||userName} • {order.phone||''}</div>
                        <div className="font-sans text-[12px] mt-1 leading-5 opacity-70">{fullAddr}</div>
                        <div className="mt-3 p-2 rounded-[10px] bg-white border text-[11px] font-sans">
                          <div>📦 Expected: <b>{getExpected(order.date)}</b></div>
                          <div className="mt-1 opacity-60">🚚 Pan-India • 48h delivery • Free above ₹499</div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-[14px] border bg-white space-y-2">
                        <input value={editAddress.name} onChange={e=>setEditAddress({...editAddress,name:e.target.value})} placeholder="Full Name" className="w-full h-9 rounded-full border px-4 text-[12px]" />
                        <input value={editAddress.phone} onChange={e=>setEditAddress({...editAddress,phone:e.target.value})} placeholder="Phone" className="w-full h-9 rounded-full border px-4 text-[12px]" />
                        <input value={editAddress.address1} onChange={e=>setEditAddress({...editAddress,address1:e.target.value})} placeholder="Address Line 1" className="w-full h-9 rounded-full border px-4 text-[12px]" />
                        <div className="grid grid-cols-2 gap-2">
                          <input value={editAddress.city} onChange={e=>setEditAddress({...editAddress,city:e.target.value})} placeholder="City" className="h-9 rounded-full border px-4 text-[12px]" />
                          <input value={editAddress.pincode} onChange={e=>setEditAddress({...editAddress,pincode:e.target.value})} placeholder="Pincode" className="h-9 rounded-full border px-4 text-[12px]" />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button onClick={handleSaveAddress} className="flex-1 h-9 rounded-full bg-black text-white text-[11px] font-bold">Save Address</button>
                          <button onClick={()=>setEditingOrder(null)} className="h-9 px-4 rounded-full border text-[11px]">Cancel</button>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 p-3 rounded-[12px] bg-[#F0F7F0] border text-[11px] font-sans">
                      <div className="font-bold">Payment: Cash on Delivery</div>
                      <div className="opacity-60 mt-1">Total: ₹{total} • {items.length} plants • Delivery free</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center font-sans text-[11px] opacity-40">Need help? Contact • Pan-India support</div>
      </div>
    </div>
  );
}
