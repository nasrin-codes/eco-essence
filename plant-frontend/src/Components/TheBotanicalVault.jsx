import React, { useState } from 'react';

// 1. Direct local assets imports from your project folder
import Monasteria from '../assets/Monasteria.jpg';
import lavendar from '../assets/lavendar.jpg';
import petunia from '../assets/petunia.jpg';
import Fig from '../assets/Fig.jpg';

const VAULT_ITEMS = [
  { id: "01", name: "Monstera Deliciosa", tag: "ARCHITECTURAL", price: 48, img: Monasteria, light: "Filtered Sun", care: "Low Care" },
  { id: "02", name: "Cascading Petunia", tag: "GEOMETRIC REFINEMENT", price: 36, img: petunia, light: "Soft Shade", care: "Attentive" },
  { id: "03", name: "French Lavendar", tag: "INDESTRUCTIBLE FORM", price: 29, img: lavendar, light: "Any Light", care: "Drought Safe" },
  { id: "04", name: "Fiddle Leaf Fig", tag: "INTERIOR DESIGNS", price: 64, img: Fig, light: "Bright Light", care: "Routine" }
];

export default function TheBotanicalVault() {
  const [active, setActive] = useState(0);
  const current = VAULT_ITEMS[active];
    return (
    <div style={st.wrap}>
      <div style={st.header}>
        <span style={st.fine}>INVENTORY // ISSUE 04</span>
        <span style={st.status}>● SHIPS FRESH</span>
      </div>

      <div style={st.grid}>
        {/* INTERACTIVE MENU COLUMN */}
        <div style={st.menu}>
          {VAULT_ITEMS.map((item, idx) => (
            <div 
              key={item.id} 
              onMouseEnter={() => setActive(idx)}
              style={{ ...st.row, ...(idx === active ? st.activeRow : {}) }}
            >
              <div style={st.meta}>
                <span style={st.idx}>{item.id}</span>
                <span style={{...st.tag, ...(idx === active ? {color: '#2C4A3E'} : {})}}>{item.tag}</span>
              </div>
              <h3 style={{ ...st.name, ...(idx === active ? st.activeName : {}) }}>{item.name}</h3>
            </div>
          ))}
        </div>
              {/* PREMIUM VISUAL PANEL */}
        <div style={st.display}>
          <div style={st.frame}>
            <img src={current.img} alt={current.name} style={st.img} />
            <div style={st.blueprint}>VERIFIED RESILIENT OK // 2026</div>
          </div>

          <div style={st.strip}>
            <div style={st.spec}>
              <div><span style={st.lbl}>LIGHT</span><span style={st.val}>{current.light}</span></div>
              <div><span style={st.lbl}>COMMITMENT</span><span style={st.val}>{current.care}</span></div>
            </div>
            <div style={st.action}>
              <span style={st.price}>${current.price.toFixed(2)}</span>
              <button style={st.btn}>Adopt Object →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  /* --- Ultra-Clean Layout Architecture --- */
const st = {
  wrap: { maxWidth: '1200px', margin: '60px auto', padding: '0 20px', fontFamily: '"Inter", sans-serif', backgroundColor: '#FBFBFA' },
  header: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E6E8E6', paddingBottom: '12px', marginBottom: '32px' },
  fine: { fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', color: '#1A2E26' },
  status: { fontSize: '10px', fontWeight: '600', color: '#2C4A3E', letterSpacing: '1px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '50px', alignItems: 'center' },
  menu: { display: 'flex', flexDirection: 'column', gap: '4px' },
  row: { padding: '20px 24px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease' },
  activeRow: { backgroundColor: '#FFFFFF', border: '1px solid #E6E8E6', boxShadow: '0 15px 30px rgba(26,46,38,0.03)', transform: 'translateX(8px)' },
  meta: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' },
  idx: { fontFamily: 'Georgia, serif', fontSize: '12px', fontStyle: 'italic', color: '#A0A8A4' },
  tag: { fontSize: '9px', fontWeight: '700', letterSpacing: '1px', color: '#8A948F' },
  name: { fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: '400', margin: 0, color: '#8A948F', transition: 'color 0.2s ease' },
  activeName: { color: '#1A2E26' },
  display: { backgroundColor: '#FFFFFF', border: '1px solid #E6E8E6', borderRadius: '20px', padding: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.01)' },
  frame: { position: 'relative', width: '100%', height: '360px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F3F4F3' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  blueprint: { position: 'absolute', bottom: '16px', left: '16px', backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)', padding: '5px 10px', fontSize: '8px', fontWeight: '700', letterSpacing: '0.5px', borderRadius: '3px' },
  strip: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' },
  spec: { display: 'flex', gap: '24px' },
  lbl: { display: 'block', fontSize: '8px', fontWeight: '700', color: '#8A948F', letterSpacing: '0.5px' },
  val: { fontSize: '12px', fontWeight: '600', color: '#1A2E26' },
  action: { display: 'flex', alignItems: 'center', gap: '16px' },
  price: { fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '600', color: '#1A2E26' },
  btn: { backgroundColor: '#2C4A3E', color: '#FFFFFF', border: 'none', padding: '10px 18px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 8px 16px rgba(44,74,62,0.1)' }
    };
  }