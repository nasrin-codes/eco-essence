import React, { useState } from 'react';
// TAILWIND ONLY - koi alag CSS file nahi chahiye. Purani Contact.css ko delete kar do.
// FRESH STRUCTURE - hero + form card + sidebar cards + FAQ. Purane dark-left/white-right layout se alag.

const INTERESTS = [
  { value: 'houseplant', label: 'Indoor Houseplants', icon: '🌿', sub: 'For home & office' },
  { value: 'outdoor', label: 'Outdoor / Garden Landscaping', icon: '🌳', sub: 'Balcony, terrace & garden' },
  { value: 'sick-plant', label: 'Sick Plant Diagnostic Help', icon: '💚', sub: 'Watering, light & repotting' },
  { value: 'wholesale', label: 'Wholesale & B2B Orders', icon: '📦', sub: 'Offices, cafes & events' },
];

const QUICK_QUESTIONS = [
  'My plant leaves are turning yellow, what should I do?',
  'I want a bulk order for my office / cafe',
  'What is the status of my delivery?',
  'Which pot size is best for my plant?',
];

const FAQS = [
  { q: 'How fast will I get a reply?', a: 'Within one business day. Messages sent before 5 PM usually get a reply the same evening.' },
  { q: 'Can I visit the nursery in person?', a: 'Yes! We are right opposite Kankaria Gate No. 1, Kankaria, Ahmedabad. Open Mon to Sat, 9 AM to 7 PM. Sunday closed.' },
  { q: 'Do you deliver outside Ahmedabad?', a: 'Yes, we deliver pan-India. Plants travel in protective packaging, and pots are packed separately so nothing breaks.' },
  { q: 'My plant arrived damaged. What now?', a: 'Send us a photo on WhatsApp within 48 hours of delivery and we will arrange a replacement or refund.' },
];

const STORE = {
  address: 'Eco-Essence, Opp. Kankaria Gate No. 1, Kankaria, Ahmedabad, Gujarat',
  shortAddress: 'Opp. Kankaria Gate No. 1, Kankaria, Ahmedabad',
  phone: '+91 55575 26847',
  phoneRaw: '915557526847',
  email: 'hello@ecoessence.com',
  hours: 'Mon - Sat • 9:00 AM - 7:00 PM',
  maps: 'https://www.google.com/maps/search/?api=1&query=Kankaria+Lake+Gate+No.+1+Ahmedabad',
};

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', plantType: 'houseplant', message: '' });
  const [interestOpen, setInterestOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState('');
  const [faqOpen, setFaqOpen] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errs.email = 'Please enter a valid email address';
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits && phoneDigits.length !== 10 && !(phoneDigits.length === 12 && phoneDigits.startsWith('91'))) errs.phone = 'Please enter a valid 10-digit number';
    if (formData.message.trim().length < 10) errs.message = 'Please write a little more (min 10 characters)';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      const all = JSON.parse(localStorage.getItem('eco_contact_messages') || '[]');
      all.push({ ...formData, date: new Date().toISOString() });
      localStorage.setItem('eco_contact_messages', JSON.stringify(all));
    } catch {}
    setSent(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyText = async (key, text) => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(key);
    setTimeout(() => setCopied(''), 1800);
  };

  const selected = INTERESTS.find(i => i.value === formData.plantType) || INTERESTS[0];
  const firstName = formData.name.trim().split(' ')[0] || 'Friend';

  const inputCls = (hasErr) => `w-full h-[52px] rounded-2xl border bg-[#FCFBF8] px-5 font-sans text-[14px] outline-none transition-all duration-300 placeholder:text-black/30 focus:bg-white focus:border-[#1a5a3a] focus:ring-4 focus:ring-[#1a5a3a]/10 ${hasErr ? 'border-red-400 bg-[#FFF5F5]' : 'border-black/10 hover:border-black/25'}`;

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#1A1A1A] overflow-x-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap'); .font-serif{font-family:"Instrument Serif",serif} .font-sans{font-family:"Inter",sans-serif} @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}} @keyframes floaty{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-10px) rotate(-2deg)}} @keyframes popIn{from{opacity:0;transform:scale(.96) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}} @keyframes dropIn{from{opacity:0;transform:translateY(-6px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}} @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>

      {/* ===== HERO - soft cream, big serif, floating leaves ===== */}
      <div className="relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[380px] h-[380px] rounded-full bg-[#DDEBD9] blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute top-10 right-[8%] w-[260px] h-[260px] rounded-full bg-[#F3E3B8] blur-3xl opacity-70 pointer-events-none" />
        <span className="absolute top-8 left-[6%] text-[44px] opacity-25 select-none pointer-events-none" style={{ animation: 'floaty 5s ease-in-out infinite' }}>🌿</span>
        <span className="absolute bottom-2 right-[12%] text-[34px] opacity-20 select-none pointer-events-none" style={{ animation: 'floaty 6s ease-in-out infinite', animationDelay: '1s' }}>🍃</span>

        <div className="relative max-w-[1180px] mx-auto px-5 pt-12 sm:pt-16 pb-8 text-center" style={{ animation: 'fadeUp .5s ease both' }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/[0.06] shadow-sm font-sans text-[11px] font-bold tracking-[0.14em] text-[#1a5a3a]"><span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" /> WE REPLY WITHIN 1 BUSINESS DAY</span>
          <h1 className="font-serif text-[46px] sm:text-[64px] leading-[1.02] font-bold mt-5">Let&apos;s talk <span className="italic text-[#1a5a3a]">plants.</span></h1>
          <p className="font-sans text-[14px] sm:text-[15px] leading-relaxed opacity-55 mt-4 max-w-[560px] mx-auto">A sick monstera, a balcony that needs life, or a bulk order for your cafe — tell us about it. A real plant person replies, not a bot.</p>
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 flex-wrap">
            {[['⚡', 'Replies in 1 day'], ['🚚', 'Pan-India delivery'], ['📍', 'Kankaria, Ahmedabad'], ['💬', 'WhatsApp friendly']].map(([icon, label]) => (
              <span key={label} className="px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-black/[0.06] font-sans text-[12px] font-bold shadow-sm hover:-translate-y-0.5 hover:shadow transition">{icon} {label}</span>
            ))}
          </div>
        </div>

        {/* scrolling strip */}
        <div className="relative border-y border-black/[0.06] bg-white/60 backdrop-blur py-2.5 overflow-hidden">
          <div className="flex whitespace-nowrap font-sans text-[11px] font-bold tracking-[0.18em] text-[#1a5a3a]/70" style={{ animation: 'marquee 26s linear infinite', width: 'max-content' }}>
            {[0, 1].map(n => (
              <span key={n} className="flex"> {['INDOOR PLANTS', 'POTS & PLANTERS', 'BULK ORDERS', 'PLANT CARE HELP', 'GARDEN LANDSCAPING', 'PAN-INDIA DELIVERY'].map(t => (<span key={t + n} className="mx-6">{t} <span className="text-[#C9A227] ml-12">✦</span></span>))} </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MAIN - form card + sidebar ===== */}
      <div className="max-w-[1180px] mx-auto px-5 py-8 sm:py-10 grid lg:grid-cols-[1fr_360px] gap-6 items-start">

        {/* FORM CARD */}
        <div className="bg-white rounded-[32px] border border-black/[0.05] shadow-[0_24px_60px_rgba(15,42,29,0.08)] p-6 sm:p-9" style={{ animation: 'fadeUp .5s ease both', animationDelay: '80ms' }}>
          {sent ? (
            <div className="min-h-[480px] flex flex-col items-center justify-center text-center px-2" style={{ animation: 'popIn .45s cubic-bezier(.22,1,.36,1) both' }}>
              <div className="relative"><div className="w-[84px] h-[84px] rounded-full bg-[#E7F3EA] grid place-items-center text-[36px] ring-8 ring-[#1a5a3a]/[0.06]">✅</div><span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#C9A227] text-[#0F2A1D] grid place-items-center text-[12px] font-bold">🌿</span></div>
              <h3 className="font-serif text-[34px] font-bold mt-6">Message sent, {firstName}!</h3>
              <p className="font-sans text-[13.5px] leading-relaxed opacity-60 mt-2 max-w-[430px]">Thank you for reaching out. We will reply within one business day at <b className="text-[#1a5a3a]">{formData.email}</b>{formData.phone ? <> — or on WhatsApp at <b className="text-[#1a5a3a]">{formData.phone}</b></> : null}.</p>
              <div className="mt-4 px-4 py-2.5 rounded-full bg-[#FFFEF9] border border-[#C9A227]/40 font-sans text-[11.5px] font-bold text-[#8A6D1B]">{selected.icon} {selected.label}</div>
              <div className="flex gap-2.5 mt-8 flex-wrap justify-center">
                <button type="button" className="h-12 px-6 rounded-full border font-sans text-[12.5px] font-bold hover:bg-black hover:text-white transition" onClick={() => { setSent(false); setFormData({ name: '', email: '', phone: '', plantType: 'houseplant', message: '' }); }}>Send Another Message</button>
                <button type="button" className="h-12 px-6 rounded-full bg-[#1a5a3a] text-white font-sans text-[12.5px] font-bold hover:bg-black transition shadow-[0_12px_28px_rgba(26,90,58,0.3)]" onClick={() => { window.location.href = '/shop'; }}>Continue Shopping →</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-sans text-[10px] tracking-[0.22em] text-[#1a5a3a] font-bold">SEND A MESSAGE</div>
                  <h2 className="font-serif text-[32px] font-bold mt-1">How can we help?</h2>
                </div>
                <span className="px-3.5 py-2 rounded-full bg-[#F0F7F0] text-[#1a5a3a] font-sans text-[11px] font-bold">Avg. reply: same day ⚡</span>
              </div>

              <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block font-sans text-[12px] font-bold mb-2">Your Name *</label>
                    <input type="text" id="name" name="name" className={inputCls(!!errors.name)} value={formData.name} onChange={handleChange} placeholder="e.g. Jane Doe" autoComplete="name" />
                    {errors.name && <div className="font-sans text-[11px] text-red-600 mt-1.5">{errors.name}</div>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-sans text-[12px] font-bold mb-2">Email Address *</label>
                    <input type="email" id="email" name="email" className={inputCls(!!errors.email)} value={formData.email} onChange={handleChange} placeholder="jane@example.com" autoComplete="email" />
                    {errors.email && <div className="font-sans text-[11px] text-red-600 mt-1.5">{errors.email}</div>}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block font-sans text-[12px] font-bold mb-2">Phone / WhatsApp <span className="opacity-40 font-medium">(optional — faster reply)</span></label>
                  <input type="tel" id="phone" name="phone" className={inputCls(!!errors.phone)} value={formData.phone} onChange={handleChange} placeholder="98765 43210" autoComplete="tel" />
                  {errors.phone && <div className="font-sans text-[11px] text-red-600 mt-1.5">{errors.phone}</div>}
                </div>

                {/* Interest - custom dropdown */}
                <div>
                  <label className="block font-sans text-[12px] font-bold mb-2">What is this about?</label>
                  <div className="relative">
                    {interestOpen && <div className="fixed inset-0 z-10" onClick={() => setInterestOpen(false)} />}
                    <button type="button" className={`relative z-20 w-full h-[52px] rounded-2xl border bg-[#FCFBF8] px-4 flex items-center gap-3 text-left transition-all duration-300 ${interestOpen ? 'border-[#1a5a3a] ring-4 ring-[#1a5a3a]/10 bg-white' : 'border-black/10 hover:border-black/25'}`} onClick={() => setInterestOpen(o => !o)}>
                      <span className="w-9 h-9 rounded-xl bg-[#F0F7F0] grid place-items-center text-[17px] shrink-0">{selected.icon}</span>
                      <span className="flex-1 min-w-0"><span className="block font-sans text-[14px] font-bold truncate">{selected.label}</span><span className="block font-sans text-[11px] opacity-50">{selected.sub}</span></span>
                      <span className={`text-[13px] transition-transform duration-300 ${interestOpen ? 'rotate-180' : ''}`}>▾</span>
                    </button>
                    {interestOpen && (
                      <div className="absolute z-30 left-0 right-0 mt-2 bg-white rounded-[22px] border border-black/10 shadow-[0_28px_60px_rgba(0,0,0,0.16)] overflow-hidden p-2" style={{ animation: 'dropIn .22s ease both' }}>
                        {INTERESTS.map(it => (
                          <button key={it.value} type="button" className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition ${formData.plantType === it.value ? 'bg-[#F0F7F0]' : 'hover:bg-[#FAF8F5]'}`} onClick={() => { setFormData(prev => ({ ...prev, plantType: it.value })); setInterestOpen(false); }}>
                            <span className="w-9 h-9 rounded-xl bg-[#F6F3EC] grid place-items-center text-[17px] shrink-0">{it.icon}</span>
                            <span className="flex-1 min-w-0"><span className="block font-sans text-[13.5px] font-bold truncate">{it.label}</span><span className="block font-sans text-[11px] opacity-50">{it.sub}</span></span>
                            {formData.plantType === it.value && <span className="w-6 h-6 rounded-full bg-[#1a5a3a] text-white grid place-items-center text-[11px] font-bold shrink-0">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick questions */}
                <div>
                  <div className="font-sans text-[12px] font-bold mb-2.5">Not sure what to write? Tap one:</div>
                  <div className="flex gap-2 flex-wrap">
                    {QUICK_QUESTIONS.map(q => (
                      <button key={q} type="button" onClick={() => { setFormData(prev => ({ ...prev, message: q })); setErrors(prev => ({ ...prev, message: '' })); }} className="px-4 py-2.5 rounded-full bg-[#FAF8F5] border border-black/[0.06] font-sans text-[12px] font-bold hover:bg-[#1a5a3a] hover:text-white hover:border-[#1a5a3a] hover:-translate-y-0.5 transition">+ {q}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block font-sans text-[12px] font-bold mb-2">Your Message *</label>
                  <textarea id="message" name="message" rows={4} className={`w-full p-5 rounded-[22px] border bg-[#FCFBF8] font-sans text-[14px] leading-relaxed outline-none transition-all duration-300 resize-none placeholder:text-black/30 focus:bg-white focus:border-[#1a5a3a] focus:ring-4 focus:ring-[#1a5a3a]/10 ${errors.message ? 'border-red-400 bg-[#FFF5F5]' : 'border-black/10 hover:border-black/25'}`} value={formData.message} onChange={handleChange} placeholder="Tell us about your space, your plant, or your order..." />
                  <div className="flex justify-between items-center mt-2">
                    {errors.message ? <span className="font-sans text-[11px] text-red-600">{errors.message}</span> : <span className="font-sans text-[11px] opacity-45">{formData.message.trim().length < 10 ? `${10 - formData.message.trim().length} more characters needed` : 'Looking good ✓'}</span>}
                    <span className="font-sans text-[11px] opacity-40">{formData.message.length} characters</span>
                  </div>
                </div>

                <button type="submit" className="group w-full h-[54px] rounded-full bg-[#0F2A1D] text-white font-sans text-[14px] font-bold hover:bg-[#1a5a3a] transition-all duration-300 shadow-[0_16px_36px_rgba(15,42,29,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2">Send Message <span className="transition-transform duration-300 group-hover:translate-x-1">→</span></button>
                <div className="text-center font-sans text-[11px] opacity-45">🔒 Your details stay private. No spam, ever.</div>
              </form>
            </>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="space-y-5" style={{ animation: 'fadeUp .5s ease both', animationDelay: '160ms' }}>

          {/* Visit card - deep green */}
          <div className="relative overflow-hidden bg-[#0F2A1D] rounded-[28px] text-white p-6 shadow-[0_20px_44px_rgba(15,42,29,0.3)]">
            <span className="absolute -right-4 -bottom-6 text-[110px] opacity-[0.08] select-none pointer-events-none">🌿</span>
            <div className="font-sans text-[10px] tracking-[0.22em] text-white/50 font-bold">VISIT THE NURSERY</div>
            <div className="font-serif text-[24px] font-bold mt-2 leading-tight">Come say hi in<br />person.</div>
            <p className="font-sans text-[12.5px] leading-relaxed text-white/65 mt-3">{STORE.shortAddress}, Gujarat</p>
            <div className="flex items-center gap-2 mt-4 font-sans text-[11.5px] text-white/70"><span className="px-2.5 py-1 rounded-full bg-white/10 font-bold">🕙 {STORE.hours}</span><span className="opacity-60">Sunday closed</span></div>
            <a href={STORE.maps} target="_blank" rel="noopener noreferrer" className="mt-5 flex items-center justify-center gap-2 h-11 rounded-full bg-[#C9A227] text-[#0F2A1D] font-sans text-[12.5px] font-bold hover:brightness-110 hover:-translate-y-0.5 transition">Get Directions on Maps →</a>
          </div>

          {/* Call + Email card */}
          <div className="bg-white rounded-[28px] border border-black/[0.05] shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3.5">
              <span className="w-11 h-11 rounded-2xl bg-[#FFF6E0] grid place-items-center text-[19px] shrink-0">📞</span>
              <div className="flex-1 min-w-0"><div className="font-sans text-[10px] tracking-[0.16em] opacity-40 font-bold">PLANT HOTLINE</div><div className="font-sans text-[15px] font-bold mt-0.5">{STORE.phone}</div></div>
              <button type="button" onClick={() => copyText('phone', STORE.phone)} className="h-9 px-3.5 rounded-full bg-[#FAF8F5] border border-black/[0.06] font-sans text-[11px] font-bold hover:bg-[#0F2A1D] hover:text-white transition shrink-0">{copied === 'phone' ? 'Copied ✓' : 'Copy'}</button>
            </div>
            <div className="h-px bg-black/[0.06]" />
            <div className="flex items-center gap-3.5">
              <span className="w-11 h-11 rounded-2xl bg-[#EAF3FF] grid place-items-center text-[19px] shrink-0">✉</span>
              <div className="flex-1 min-w-0"><div className="font-sans text-[10px] tracking-[0.16em] opacity-40 font-bold">SUPPORT EMAIL</div><div className="font-sans text-[14px] font-bold mt-0.5 truncate">{STORE.email}</div></div>
              <button type="button" onClick={() => copyText('email', STORE.email)} className="h-9 px-3.5 rounded-full bg-[#FAF8F5] border border-black/[0.06] font-sans text-[11px] font-bold hover:bg-[#0F2A1D] hover:text-white transition shrink-0">{copied === 'email' ? 'Copied ✓' : 'Copy'}</button>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a href={`https://wa.me/${STORE.phoneRaw}?text=Hello%20Eco-Essence!%20I%20have%20a%20question%20about%20plants.`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 bg-gradient-to-br from-[#25D366] to-[#1DA851] rounded-[28px] text-white p-5 shadow-[0_16px_36px_rgba(37,211,102,0.35)] hover:-translate-y-1 transition-all duration-300">
            <span className="w-12 h-12 rounded-2xl bg-white/20 grid place-items-center text-[22px] shrink-0">💬</span>
            <span className="flex-1"><span className="block font-sans text-[14.5px] font-bold">Chat on WhatsApp</span><span className="block font-sans text-[11.5px] text-white/80 mt-0.5">Fastest reply — usually within hours</span></span>
            <span className="text-[18px] transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>

          {/* FAQ accordion */}
          <div className="bg-white rounded-[28px] border border-black/[0.05] shadow-sm p-5">
            <div className="font-sans text-[10px] tracking-[0.22em] text-[#1a5a3a] font-bold px-1">QUICK ANSWERS</div>
            <h3 className="font-serif text-[20px] font-bold mt-1 px-1">Before you ask…</h3>
            <div className="mt-3">
              {FAQS.map((f, i) => {
                const open = faqOpen === i;
                return (
                  <div key={f.q} className="border-b border-black/[0.05] last:border-0">
                    <button type="button" onClick={() => setFaqOpen(open ? -1 : i)} className="w-full flex items-center justify-between gap-3 py-3.5 text-left">
                      <span className="font-sans text-[13px] font-bold">{f.q}</span>
                      <span className={`w-7 h-7 rounded-full grid place-items-center text-[13px] font-bold shrink-0 transition-all duration-300 ${open ? 'bg-[#1a5a3a] text-white rotate-45' : 'bg-[#FAF8F5]'}`}>+</span>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[140px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="font-sans text-[12.5px] leading-relaxed opacity-60 pb-4 pr-6">{f.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center font-sans text-[10.5px] opacity-35">© {new Date().getFullYear()} Eco-Essence • Cultivating care daily.</div>
        </div>
      </div>
    </div>
  );
}