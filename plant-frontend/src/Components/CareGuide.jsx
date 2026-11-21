import React, { useEffect, useState } from 'react';

export default function CareGuide() {
  const [active, setActive] = useState('light');

  useEffect(() => {
    const hash = window.location.hash.replace('#','');
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(hash);
      }, 150);
    }

    const onScroll = () => {
      const sections = ['light','water','soil','pet','humidity','propagation','troubleshoot'];
      for (let id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) setActive(id);
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setActive(id);
    window.location.hash = id;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap');
        .font-serif { font-family: "Instrument Serif", serif; }
        .font-sans { font-family: "Inter", sans-serif; }
      `}</style>
      
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[#1a5a3a]"></span>
              <span className="font-sans text-[10px] tracking-[0.2em] font-bold text-[#1a5a3a]">ECO-ESSENCE. CARE ARCHIVE • JOURNAL VOL.02</span>
            </div>
            <h1 className="font-serif text-[56px] leading-[0.95] font-bold tracking-tight mt-4">
              Plants that<br/>live longer<br/><span className="italic font-normal text-[#1a5a3a]">than trends.</span>
            </h1>
            <p className="font-sans text-[14px] text-[#6B7280] leading-6 mt-6 max-w-[420px]">
              No green thumb needed. Just light, water, and a little attention. 
              Here is everything we learned growing 17 plants in Ahmedabad. <br/>
              <span className="font-bold text-black">Hover CARE GUIDE ↑ for quick jump 🌿</span>
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                {id:'light', label:'☀ Sunlight'},
                {id:'water', label:'💧 Water'},
                {id:'pet', label:'🐾 Pet Safe'},
                {id:'humidity', label:'🌫 Humidity'},
                {id:'soil', label:'🪴 Soil'},
                {id:'propagation', label:'🌱 Propagation'},
                {id:'troubleshoot', label:'🩺 Fix'},
              ].map(p => (
                <button key={p.id} onClick={()=>scrollTo(p.id)} className={`px-4 py-2 rounded-full text-[11px] font-sans font-bold border transition ${active===p.id ? 'bg-black text-white border-black' : 'bg-white border-black/10 hover:bg-[#1a5a3a] hover:text-white'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="bg-white border rounded-[20px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)]">
              <div className="font-sans text-[11px] tracking-widest font-bold opacity-40">QUICK CHECK</div>
              <div className="mt-3 space-y-3 font-sans text-[13px]">
                <div className="flex justify-between"><span>☀ Light</span><span className="font-medium">Bright indirect for 14/17</span></div>
                <div className="flex justify-between"><span>💧 Water</span><span className="font-medium">Weekly, let top dry</span></div>
                <div className="flex justify-between"><span>🌡 Temp</span><span className="font-medium">18-26°C ideal</span></div>
              </div>
            </div>
            <div className="bg-[#111111] text-white rounded-[20px] p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-[#1a5a3a] blur-[30px] opacity-50 rounded-full"></div>
              <div className="font-serif text-[18px] relative z-10">New plant parent?</div>
              <div className="font-sans text-[12px] opacity-60 mt-2 relative z-10">Start with Money Plant, Tulip, Mint — hard to kill.</div>
              <button onClick={()=>window.location.href='/shop'} className="mt-4 h-9 px-5 rounded-full bg-white text-black text-[11px] font-bold tracking-wide relative z-10 hover:bg-[#FAF8F5]">SHOP EASY PLANTS</button>
            </div>
          </div>
        </div>

        <div className="sticky top-[64px] z-30 mt-10 -mx-6 lg:-mx-8 px-6 lg:px-8 py-3 bg-[#FAF8F5]/90 backdrop-blur-md border-y border-black/5 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            {id:'light', l:'Light Guide'},
            {id:'water', l:'Water Guide'},
            {id:'soil', l:'Soil & Pot'},
            {id:'pet', l:'Pet Safety'},
            {id:'humidity', l:'Humidity'},
            {id:'propagation', l:'Propagation'},
            {id:'troubleshoot', l:'Troubleshoot'},
          ].map(t => (
            <button key={t.id} onClick={()=>scrollTo(t.id)} className={`whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-sans font-bold tracking-wide transition ${active===t.id ? 'bg-[#1a5a3a] text-white' : 'bg-white border border-black/10 hover:bg-black hover:text-white'}`}>{t.l}</button>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { id:"light", icon: "☀", title: "Light Guide", desc: "Indoor plants love bright indirect. Flowering needs 6h sun.", bullets: ["Monstera, Mogra, Orchids → Bright indirect", "Petunia, Sunflower, Lavender → Full sun", "Mint, Kale → Partial shade", "Tip: South-facing window in Ahmedabad = strong, use sheer curtain"] },
            { id:"water", icon: "💧", title: "Water Guide", desc: "Overwatering kills more than underwatering.", bullets: ["Check top 1 inch — dry? Water.", "Terracotta dries faster than ceramic", "Winter: Weekly, Summer: Every 3-4 days", "Use finger test, not schedule"] },
            { id:"soil", icon: "🪴", title: "Soil & Pot", desc: "When roots circle the bottom, time to repot.", bullets: ["Spring is best time", "Go 2 inches bigger only", "Terracotta for succulents, ceramic for ferns", "Add drainage layer + pebbles"] },
            { id:"pet", icon: "🐾", title: "Pet Safety", desc: "Safe for cats/dogs vs toxic.", bullets: ["Safe: Spider plant, Parlor palm, Basil", "Toxic: Monstera, Ficus, Tulip, Orchids", "Keep toxic on high shelf", "If pet chews → vet immediately"] },
            { id:"humidity", icon: "🌬", title: "Humidity & Air", desc: "NASA tested — these clean air best.", bullets: ["Monstera, Ficus, Peace Lily (add later)", "Snake plant (add) — bedroom safe at night", "Basil, Mint — kitchen air", "1 large plant per 10m²"] },
            { id:"propagation", icon: "🍃", title: "Propagation", desc: "Grow what you eat — from balcony to plate.", bullets: ["Basil → Pesto, Pizza", "Mint → Chutney, Tea", "Thyme, Rosemary → Roasts", "Cut from top, plant bushes out"] },
            { id:"troubleshoot", icon: "🩺", title: "Troubleshoot", desc: "Yellow leaves? Brown tips? Fix fast.", bullets: ["Yellow leaves → Overwatering", "Brown tips → Low humidity", "Drooping → Needs water + shade", "No growth → Needs repot + light"] },
          ].map(card => (
            <div key={card.id} id={card.id} className={`bg-white border rounded-[20px] p-7 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition scroll-mt-[120px] ${active===card.id ? 'ring-2 ring-[#1a5a3a] ring-offset-2' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="text-[20px]">{card.icon}</div>
                {active===card.id && <span className="px-2 py-1 rounded-full bg-[#1a5a3a] text-white text-[9px] font-bold">ACTIVE</span>}
              </div>
              <h3 className="font-serif text-[20px] font-bold mt-3">{card.title}</h3>
              <p className="font-sans text-[12px] text-[#6B7280] mt-2 leading-5">{card.desc}</p>
              <div className="mt-4 space-y-2">
                {card.bullets.map(b => <div key={b} className="font-sans text-[11px] leading-5 flex gap-2"><span className="opacity-40">•</span><span>{b}</span></div>)}
              </div>
            </div>
          ))}
        </div>

        {/* GIFT EDIT - REPLACES AHMEDABAD CALENDAR */}
        <div className="mt-20 rounded-[32px] bg-[#111111] text-[#FAF8F5] p-8 lg:p-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center overflow-hidden relative">
          <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-[#1a5a3a] blur-[90px] opacity-30 rounded-full translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 font-sans text-[10px] tracking-[0.15em] font-bold">GIFT EDIT • VOL.03</span>
              <span className="w-8 h-[1px] bg-white/20"></span>
            </div>
            <h3 className="font-serif text-[40px] lg:text-[48px] leading-[0.9] tracking-[-0.02em]">
              <span className="italic font-light">Give growth,</span><br/>
              <span className="font-bold">not things.</span>
            </h3>
            <p className="font-sans text-[13px] leading-[1.7] text-white/60 mt-5 max-w-[400px]">
              A plant is a memory that grows. Each gift comes with handwritten care note, birth certificate, and 100% biodegradable wrap — ready to gift.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 font-sans text-[11px]"><span className="w-5 h-5 rounded-full bg-white/10 grid place-items-center">✓</span> Handwritten note</div>
              <div className="flex items-center gap-2 font-sans text-[11px]"><span className="w-5 h-5 rounded-full bg-white/10 grid place-items-center">✓</span> Gift wrap</div>
              <div className="flex items-center gap-2 font-sans text-[11px]"><span className="w-5 h-5 rounded-full bg-white/10 grid place-items-center">✓</span> Care card</div>
            </div>
          </div>

          <div className="relative z-10 grid gap-4">
            <div className="bg-white text-black rounded-[20px] p-6 flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] grid place-items-center text-[20px]">🎁</div>
              <div className="flex-1">
                <div className="font-serif text-[15px] font-bold">The Impossible-to-Kill Gift</div>
                <div className="font-sans text-[11px] opacity-60 mt-1">Money Plant + Terracotta + Care Card • ₹799</div>
              </div>
              <button onClick={()=>window.location.href='/shop'} className="w-8 h-8 rounded-full bg-black text-white grid place-items-center text-[12px] hover:bg-[#1a5a3a]">→</button>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/10 rounded-[20px] p-6 flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-white/10 grid place-items-center text-[20px]">💚</div>
              <div className="flex-1">
                <div className="font-serif text-[15px] font-bold">The Air Purifier Gift</div>
                <div className="font-sans text-[11px] text-white/60 mt-1">Monstera + Ceramic Pot + Note • ₹1,499</div>
              </div>
              <button onClick={()=>window.location.href='/shop'} className="w-8 h-8 rounded-full bg-white text-black grid place-items-center text-[12px]">→</button>
            </div>
            <button onClick={()=>window.location.href='/shop'} className="mt-2 w-full h-12 rounded-full bg-[#FAF8F5] text-black font-sans text-[12px] font-bold tracking-[0.08em] hover:bg-white transition">SHOP ALL GIFTS —</button>
          </div>
        </div>

      </div>
    </div>
  );
}