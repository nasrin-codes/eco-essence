import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FALLBACK = [
  { _id:'1', name:'Tulsi', scientific:'Ocimum tenuiflorum', price:250, image:'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600', category:'Medicinal', light:'Full Sun', water:'Moderate', featured:true, showInHome:true },
  { _id:'2', name:'Money Plant', scientific:'Epipremnum aureum', price:450, image:'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600', category:'Air Purifying', light:'Low Light', water:'Low', featured:true, showInHome:true },
  { _id:'3', name:'Monstera', scientific:'Monstera deliciosa', price:799, image:'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600', category:'Indoor', light:'Bright Indirect', water:'Moderate', featured:true, showInHome:true },
];

export default function Home(){
  const [plants,setPlants] = useState(FALLBACK);
  const [featured, setFeatured] = useState(FALLBACK);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchPlants = async ()=>{
      try {
        const adminKey = localStorage.getItem('admin_key_value') || 'eco2025';
        const token = localStorage.getItem('plant_jwt_token');
        const headers = { 'x-admin-key': adminKey };
        if(token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch('http://localhost:5000/api/plants', { headers });
        if(res.ok){ 
          const data=await res.json(); 
          const arr = Array.isArray(data)? data : data.plants||[];
          if(arr.length>0) {
            setPlants(arr);
            let feat = arr.filter(p=> p.featured===true || p.showInHome===true || p.isFeatured===true);
            if(feat.length===0) feat = arr.slice(0,3);
            setFeatured(feat.slice(0,3));
          }
        }
      } catch(e){ console.log('Using fallback'); }
      try{
        const local = JSON.parse(localStorage.getItem('eco_my_plants')||localStorage.getItem('plants')||'[]');
        if(local.length>0){
          let feat = local.filter(p=> p.featured || p.showInHome);
          if(feat.length>0) setFeatured(feat.slice(0,3));
        }
      }catch{}
    };
    fetchPlants();
  },[]);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap'); .font-serif{font-family:"Instrument Serif",serif} .font-sans{font-family:"Inter",sans-serif}`}</style>
      
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/5 text-[10px] tracking-[0.15em] font-sans font-bold opacity-60">THE ATELIER • SLOW-GROWN IN INDIA</div>
          <h1 className="font-serif text-[56px] leading-[0.9] font-bold tracking-tight mt-5">
            Plants that<br/>live longer<br/><span className="italic font-normal">than trends.</span>
          </h1>
          <p className="mt-6 text-[14px] text-[#6B7280] max-w-[360px] leading-6 font-sans">We grow slow, local, and in terracotta. Curated for Indian homes — from balcony to backyard, pan-India delivery.</p>
          <div className="mt-8 flex gap-3">
            <button onClick={()=>navigate('/shop?category=All')} className="h-11 px-7 rounded-full bg-black text-white text-[12px] font-bold tracking-wide hover:bg-[#1a5a3a] transition">SHOP NOW →</button>
            <button onClick={()=>navigate('/care-guide')} className="h-11 px-7 rounded-full bg-white border border-black/10 text-[12px] font-bold tracking-wide hover:bg-[#FAF8F5]">CARE GUIDE</button>
          </div>
          <div className="mt-8 font-sans text-[11px] tracking-[0.05em] opacity-50">Curated Atelier • 3 picks • Pan-India delivery</div>
        </div>

        <div className="grid grid-cols-[1.2fr_0.8fr] gap-4">
          <div className="rounded-[24px] overflow-hidden h-[520px] bg-white border border-black/5 cursor-pointer group relative" onClick={()=>navigate(`/shop?plant=${featured[0]?._id}`)}>
            <img src={featured[0]?.image||featured[0]?.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={featured[0]?.name} />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-sans font-bold">{featured[0]?.name} • Curated</div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-[24px] overflow-hidden h-[280px] bg-white border border-black/5 cursor-pointer group" onClick={()=>navigate(`/shop?plant=${featured[1]?._id}`)}>
              <img src={featured[1]?.image||featured[1]?.imageUrl||featured[0]?.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={featured[1]?.name} />
            </div>
            <div className="rounded-[24px] bg-[#F5F1EB] border border-black/5 p-5">
              <div className="font-serif font-bold text-[14px]">Potted on demand</div>
              <div className="font-sans text-[11px] opacity-60 mt-1 leading-4">Terracotta, ceramic, self-watering. Chosen in Shop, not dumped on Home. Pan-India delivery.</div>
              <button onClick={()=>navigate('/shop')} className="mt-3 font-sans text-[11px] font-bold underline">Browse Shop →</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pb-16">
        <div className="flex justify-between items-end mb-5">
          <div>
            <div className="font-sans text-[10px] tracking-[0.2em] font-bold opacity-30">NURSERY EDIT</div>
            <h2 className="font-serif text-[24px] font-bold mt-1">Atelier — 3 live picks, not all flowers</h2>
            <p className="font-sans text-[12px] text-[#6B7280] mt-1">Admin marks Featured → shows here. Others stay Shop-only. Pan-India.</p>
          </div>
          <button onClick={()=>navigate('/shop')} className="font-sans text-[12px] font-medium underline">View full catalog →</button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {featured.map(p=>(
            <div key={p._id} onClick={()=>navigate(`/shop?plant=${p._id}`)} className="bg-white border border-black/5 rounded-[20px] p-4 flex gap-4 cursor-pointer hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition group">
              <img src={p.image||p.imageUrl} className="w-20 h-20 rounded-[12px] object-cover group-hover:scale-105 transition duration-500" alt={p.name} />
              <div><div className="font-serif font-bold text-[14px]">{p.name}</div><div className="font-sans text-[11px] opacity-60">{p.category} • Featured</div><div className="mt-2 font-sans font-bold text-[13px]">₹{p.price}</div><div className="mt-1 font-sans text-[10px] font-bold underline opacity-60">View in Shop →</div></div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 rounded-[16px] bg-white border border-black/5 font-sans text-[11px] text-[#6B7280] text-center">💡 Atelier (Home) → Hover SHOP in Navbar → Pick Category (Fruits/Indoor/Veggies/Flower/Herb/Fragrant) → Shop → Care Guide → Cart. Pan-India delivery. Every new flower = Shop only unless you tick Featured in Admin.</div>
      </div>
    </div>
  );
}