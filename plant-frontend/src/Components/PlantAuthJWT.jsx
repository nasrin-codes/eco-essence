import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Admin login - same Login page, admin email + password.
const ADMIN_EMAIL = ['admin', 'eco-essence.in'].join('@');
const ADMIN_PASSWORD = 'EcoEssence2026';
// Both password variants accepted.
const ADMIN_PASSWORDS = ['EcoEssence2026', 'eco2026'];
// Underscore variant also accepted.
const ADMIN_EMAILS = [ADMIN_EMAIL, 'admin@eco_essence.in', 'admin@eco-essence.in'];

// Helper to track sessions for admin panel
const trackLoginSession = (name, email, phone) => {
  try{
    const loginAt = new Date().toISOString();
    localStorage.setItem('plant_login_time', loginAt);
    localStorage.setItem('plant_last_login_date', loginAt);
    const sessions = JSON.parse(localStorage.getItem('eco_user_sessions')||'[]');
    sessions.forEach(s=>{
      if((s.email===email || s.name===name) && !s.logoutAt){
        s.logoutAt = new Date().toISOString();
      }
    });
    sessions.push({
      id: Date.now().toString(),
      name: name,
      email: email,
      phone: phone,
      loginAt: loginAt,
      logoutAt: null,
      ip: 'India',
      device: navigator.userAgent.slice(0,60)
    });
    const trimmed = sessions.slice(-100);
    localStorage.setItem('eco_user_sessions', JSON.stringify(trimmed));
    const allUsers = JSON.parse(localStorage.getItem('eco_all_users_list')||'[]');
    const exists = allUsers.find(u=> u.email===email);
    if(!exists){
      allUsers.push({ name, email, phone, firstLogin: loginAt, lastLogin: loginAt, totalLogins:1 });
    } else {
      exists.lastLogin = loginAt;
      exists.totalLogins = (exists.totalLogins||0)+1;
    }
    localStorage.setItem('eco_all_users_list', JSON.stringify(allUsers));
  }catch(e){ console.log('session track error', e); }
};

export const trackLogoutSession = (email, name) => {
  try{
    const logoutAt = new Date().toISOString();
    localStorage.setItem('plant_logout_time', logoutAt);
    const sessions = JSON.parse(localStorage.getItem('eco_user_sessions')||'[]');
    for(let i=sessions.length-1; i>=0; i--){
      const s = sessions[i];
      if((!s.logoutAt) && (s.email===email || s.name===name)){
        s.logoutAt = logoutAt;
        break;
      }
    }
    localStorage.setItem('eco_user_sessions', JSON.stringify(sessions));
  }catch(e){ console.log('logout track error', e); }
};

export default function PlantAuthJWT(){
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [mode,setMode] = useState(params.get('mode')==='signup' ? 'signup' : 'login');
  const [form,setForm] = useState({ name:'', phone:'', email:'', password:'' });
  const [msg,setMsg] = useState('');
  const [loading,setLoading] = useState(false);
  const [showPass,setShowPass] = useState(false);

  const handleChange = (e)=>setForm({...form,[e.target.name]:e.target.value});

  const saveUser = (name, email, phone, token, role='user') => {
    let cleanName = (name||'').trim();
    if(!cleanName || cleanName.toUpperCase()==='USER') cleanName = '';
    if(!cleanName && email && email.includes('@')) cleanName = email.split('@')[0];
    if(!cleanName) cleanName = phone || 'User';
    cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
    const fullName = name && name.trim().length>1 ? name.trim() : cleanName;
    const finalToken = token || 'eco-token-'+Date.now();
    const finalEmail = (email||'').trim().toLowerCase();
    localStorage.setItem('plant_jwt_token', finalToken);
    localStorage.setItem('plant_user_name', fullName);
    localStorage.setItem('plant_user_email', finalEmail);
    localStorage.setItem('plant_user_phone', phone || '');
    localStorage.setItem('user_name', fullName);
    localStorage.setItem('user_email', finalEmail);
    localStorage.setItem('user_phone', phone || '');
    localStorage.setItem('jwt_token', finalToken);
    localStorage.setItem('eco_user_role', role);
    if(role==='admin'){ localStorage.setItem('eco_admin_verified', 'true'); } else { localStorage.removeItem('eco_admin_verified'); }
    trackLoginSession(fullName, finalEmail, phone || '');
    // SERVER PE USER DARJ KARO - taaki kisi bhi device ke Admin me ye customer dikhe.
    try{
      fetch(`${API_URL}/api/users/upsert`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: fullName, email: finalEmail, phone: phone || '', role }) }).catch(()=>{});
    }catch{}
    window.dispatchEvent(new Event('eco-login'));
    window.dispatchEvent(new Event('eco-cart-updated'));
    try{
      const orders = JSON.parse(localStorage.getItem('eco_orders')||'[]');
      if(orders.length>0 && !orders[0].customerName){
        orders[0].customerName = fullName;
        localStorage.setItem('eco_orders', JSON.stringify(orders));
      }
    }catch{}
  };

  const handleSubmit = async (e)=>{
    e.preventDefault(); setLoading(true); setMsg('');
    try{
      // Normalize pasted underscore in domain to hyphen.
      let email = form.email.trim().toLowerCase().replace(/\s+/g,'');
      { const at = email.indexOf('@'); if(at >= 0) email = email.slice(0, at+1) + email.slice(at+1).replace(/_/g,'-'); }
      const password = form.password;
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        setMsg('❌ Please enter a valid email address. Email is required.');
        setLoading(false); return;
      }
      if(!password || password.length < 6){
        setMsg('❌ Password must be at least 6 characters.');
        setLoading(false); return;
      }
      if(mode==='signup'){
        const name = form.name.trim();
        const phone = form.phone.trim();
        if(ADMIN_EMAILS.includes(email)){ setMsg('❌ This email is reserved. Please use another email.'); setLoading(false); return; }
        if(!name){ setMsg('❌ Please enter your full name.'); setLoading(false); return; }
        if(!/^[6-9]\d{9}$/.test(phone)){ setMsg('❌ Please enter a valid 10-digit phone number.'); setLoading(false); return; }
        const payload = { name, phone, email, password };
        try{
          const res = await fetch(`${API_URL}/api/auth/register`, {
            method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
          });
          const data = await res.json().catch(()=>({}));
          if(res.ok || data.token || data.accessToken){
            const token = data.token || data.accessToken;
            const userName = data.user?.name || name;
            try{
              const users = JSON.parse(localStorage.getItem('eco_users')||'[]');
              if(!users.find(u=>u.email===email)) users.push({ name, phone, email, password, role:'user', createdAt: new Date().toISOString() });
              localStorage.setItem('eco_users', JSON.stringify(users));
            }catch{}
            saveUser(userName, email, phone, token, data.user?.role || 'user');
            setMsg(`✅ Account created — Welcome ${userName} 🌿`);
            setTimeout(()=>navigate('/shop'),800);
            return;
          }
          throw new Error(data.message||data.error||'Failed');
        }catch(fetchErr){
          try{
            const users = JSON.parse(localStorage.getItem('eco_users')||'[]');
            if(users.find(u=>u.email===email)){ setMsg('❌ This email already has an account. Please login.'); setMode('login'); setLoading(false); return; }
            users.push({ name, phone, email, password, role:'user', createdAt: new Date().toISOString() });
            localStorage.setItem('eco_users', JSON.stringify(users));
          }catch{}
          saveUser(name, email, phone, null, 'user');
          setMsg(`✅ Account created — Welcome ${name} 🌿`);
          setTimeout(()=>navigate('/shop'),800);
          return;
        }
      }
      // --- ADMIN LOGIN first, no backend dependency ---
      // email: trim + lowercase, password: trim
      // Hyphen + underscore variants both accepted.
      let cleanEmail = (email||'').trim().toLowerCase().replace(/\s+/g,'');
      { const at = cleanEmail.indexOf('@'); if(at >= 0) cleanEmail = cleanEmail.slice(0, at+1) + cleanEmail.slice(at+1).replace(/_/g,'-'); }
      const cleanPass = (password||'').trim();
      const isAdminEmail = ADMIN_EMAILS.includes(cleanEmail);
      if(isAdminEmail && ADMIN_PASSWORDS.includes(cleanPass)){
        localStorage.setItem('eco_admin_verified', 'true');
        localStorage.setItem('eco_user_role', 'admin');
        saveUser('Admin', ADMIN_EMAIL, '', 'eco-admin-token-'+Date.now(), 'admin');
        localStorage.setItem('eco_admin_verified', 'true');
        localStorage.setItem('eco_user_role', 'admin');
        setMsg('✅ Welcome back — Admin 🌿');
        // Admin goes to /admin, never /shop.
        setTimeout(()=>navigate('/admin'),800);
        setLoading(false);
        return;
      }
      if(isAdminEmail && !ADMIN_PASSWORDS.includes(cleanPass)){
        setMsg('❌ Incorrect admin password.');
        setLoading(false);
        return;
      }
      // --- LOGIN: Email + Password only ---
      const payload = { email, password };
      try{
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
        });
        const data = await res.json().catch(()=>({ token:'local-fallback-token', user:{ email, name: form.name } }));
        if(res.ok || data.token || data.accessToken){
          const token = data.token || data.accessToken;
          const userName = data.user?.name || email.split('@')[0];
          const role = data.user?.role || 'user';
          saveUser(userName, email, data.user?.phone || '', token, role);
          setMsg(`✅ Welcome back — ${userName} 🌿`);
          setTimeout(()=>navigate((role==='admin' || ADMIN_EMAILS.includes(email)) ? '/admin' : '/shop'),800);
          return;
        }
        throw new Error(data.message||data.error||'Failed');
      }catch(fetchErr){
        const users = JSON.parse(localStorage.getItem('eco_users')||'[]');
        const user = users.find(u=>u.email===email && u.password===password);
        if(user){
          saveUser(user.name, user.email, user.phone||'', null, user.role||'user');
          setMsg(`✅ Welcome back — ${user.name} 🌿`);
          setTimeout(()=>navigate(user.role==='admin' ? '/admin' : '/shop'),800);
          return;
        }
        throw new Error('Incorrect email or password');
      }
    }catch(err){
      setMsg(`❌ ${err.message}. ${mode==='login' ? 'If you are new, please create an account.' : ''}`);
    }finally{ setLoading(false); }
  };

  const switchMode = (m)=>{ setMode(m); setMsg(''); };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');
        .font-serif{font-family:"Instrument Serif",serif} .font-sans{font-family:"Inter",sans-serif}
      `}</style>
      <div className="max-w-[1160px] mx-auto px-6 lg:px-8 py-12 grid lg:grid-cols-[1fr_440px] gap-12 items-start">
        <div className="pt-6 hidden lg:block">
          <div className="font-sans text-[11px] tracking-[0.2em] text-black/40">ECO-ESSENCE.</div>
          <h1 className="font-serif text-[54px] leading-[0.95] font-bold tracking-tight mt-5">
            Plants that<br/>live longer<br/><span className="italic font-normal">than trends.</span>
          </h1>
          <p className="font-sans text-[13px] text-black/50 leading-6 mt-6 max-w-[360px]">
            Browsing is free for everyone. Login only when you want to buy, save your cart and track your orders. Pan-India delivery.
          </p>
          <div className="mt-8 flex gap-3">
            <div className="px-4 py-2 rounded-full bg-white border border-black/[0.06] font-sans text-[11px]">🌿 Curated plants</div>
            <div className="px-4 py-2 rounded-full bg-white border border-black/[0.06] font-sans text-[11px]">📦 Pan-India delivery</div>
          </div>
        </div>
        <div className="bg-white border border-black/[0.06] rounded-[28px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-serif text-[28px] font-bold leading-none">{mode==='login'?'Welcome Back':'Create Account'}</h2>
              <p className="font-sans text-[12px] text-black/45 mt-2">{mode==='login'?'Login to add to cart & buy.':'Join Eco-Essence — it takes less than a minute.'}</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-[#F0F7F0] grid place-items-center text-[20px] shrink-0">🌿</div>
          </div>
          <div className="mt-6 mx-auto w-fit bg-[#FAF8F5] rounded-full p-1 flex gap-1">
            <button type="button" onClick={()=>switchMode('login')} className={`h-9 px-7 rounded-full font-sans text-[12px] font-bold transition ${mode==='login'?'bg-black text-white':'text-black/50'}`}>Login</button>
            <button type="button" onClick={()=>switchMode('signup')} className={`h-9 px-7 rounded-full font-sans text-[12px] font-bold transition ${mode==='signup'?'bg-black text-white':'text-black/50'}`}>Signup</button>
          </div>
          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {mode==='signup' && (
              <>
                <div>
                  <label className="font-sans text-[11px] font-bold tracking-[0.08em] text-black/60">FULL NAME *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="mt-2 w-full h-12 rounded-full border border-black/10 px-5 font-sans text-[13px] outline-none focus:border-[#1a5a3a]" />
                  </div>
                <div>
                  <label className="font-sans text-[11px] font-bold tracking-[0.08em] text-black/60">PHONE NUMBER *</label>
                  <input name="phone" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value.replace(/\D/g,'').slice(0,10)})} placeholder="98765 43210" type="tel" inputMode="numeric" className="mt-2 w-full h-12 rounded-full border border-black/10 px-5 font-sans text-[13px] outline-none focus:border-[#1a5a3a]" />
                </div>
              </>
            )}
            <div>
              <label className="font-sans text-[11px] font-bold tracking-[0.08em] text-black/60">EMAIL *</label>
              {/* Plain text input so the browser never blocks the email field. */}
              <input name="email" value={form.email} onChange={(e)=>{ setForm({...form, email: e.target.value.trimStart().toLowerCase().replace(/\s+/g,'')}); }} placeholder="you@example.com" type="text" inputMode="email" autoComplete="email" className="mt-2 w-full h-12 rounded-full border border-black/10 px-5 font-sans text-[13px] outline-none focus:border-[#1a5a3a]" required />
            </div>
            <div>
              <label className="font-sans text-[11px] font-bold tracking-[0.08em] text-black/60">PASSWORD *</label>
              <div className="relative mt-2">
                <input name="password" value={form.password} onChange={handleChange} placeholder="••••••••" type={showPass?'text':'password'} className="w-full h-12 rounded-full border border-black/10 bg-[#F0F7F0] px-5 pr-14 font-sans text-[13px] outline-none focus:border-[#1a5a3a]" required />
                <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-[11px] font-bold text-black/50">{showPass?'Hide':'Show'}</button>
              </div>
            </div>
            <button disabled={loading} className="w-full h-12 rounded-full bg-black text-white font-sans text-[13px] font-bold hover:bg-[#1a5a3a] transition disabled:opacity-60">
              {loading?'Please wait...':mode==='login'?'Login & Continue →':'Create Account →'}
            </button>
            {msg && <div className={`p-3 rounded-[12px] font-sans text-[12px] ${msg.startsWith('✅')?'bg-[#F0F7F0] text-[#1a5a3a]':'bg-[#FEF2F2] text-red-600'}`}>{msg}</div>}
            <div className="flex justify-center gap-1 pt-1 font-sans text-[12px]">
              <span className="text-black/50">{mode==='login'?'No account?':'Already have an account?'}</span>
              <button type="button" onClick={()=>switchMode(mode==='login'?'signup':'login')} className="font-bold underline">{mode==='login'?'Signup':'Login'}</button>
            </div>
            <div className="pt-4 border-t mt-2 flex justify-center font-sans text-[11px]">
              <Link to="/" className="text-black/50 hover:text-black">← Back to Home</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
