import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        .font-serif{font-family:"Instrument Serif",serif}
        .font-sans{font-family:"Inter",sans-serif}
        .no-scrollbar::-webkit-scrollbar{display:none}
      `}</style>

      <div className="w-full bg-[#FAF8F5] text-[#1A1A1A] overflow-x-hidden">
        
        {/* HERO - Catchy Hook */}
        <section className="max-w-[1440px] mx-auto px-6 lg:px-10 pt-[60px] pb-[80px] grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-end">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-10 h-[1px] bg-[#1a5a3a]"></span>
              <span className="font-sans text-[10px] tracking-[0.2em] font-bold text-[#1a5a3a]">JOURNAL — VOL. 01 / ARCHIVE</span>
            </div>
            <h1 className="font-serif text-[56px] lg:text-[88px] leading-[0.85] tracking-[-0.04em]">
              <span className="italic font-light">We don't</span><br/>
              <span className="italic font-light">just sell</span><br/>
              <span className="font-[500] text-[#1a5a3a] italic">plants.</span><br/>
              <span className="text-[40px] lg:text-[56px] mt-4 block font-light not-italic tracking-[-0.02em]">We archive<br/>living history. 🌿</span>
            </h1>
          </div>
          <div className="lg:pb-4">
            <p className="font-sans text-[14px] leading-[1.7] text-black/60 max-w-[380px] mb-6">
              Most nurseries sell you a trend. We give you a companion that has been in our studio for 147 days, tested for Ahmedabad light, air, and neglect.
            </p>
            <div className="flex gap-3 text-[10px] font-sans font-bold tracking-[0.12em] uppercase">
              <span className="px-4 py-2 rounded-full bg-black text-white">Read the Chronicles ↓</span>
              <span className="px-4 py-2 rounded-full border border-black/10">17 Species • 3 Years</span>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-black/10 pt-6">
              <div><div className="font-serif text-[28px] leading-none">147</div><div className="font-sans text-[9px] tracking-[0.15em] opacity-60 mt-1">DAYS AVG. IN STUDIO</div></div>
              <div><div className="font-serif text-[28px] leading-none">100%</div><div className="font-sans text-[9px] tracking-[0.15em] opacity-60 mt-1">BIODEGRADABLE</div></div>
              <div><div className="font-serif text-[28px] leading-none">01</div><div className="font-sans text-[9px] tracking-[0.15em] opacity-60 mt-1">CITY • AHMEDABAD</div></div>
            </div>
          </div>
        </section>

        {/* STORY 01 */}
        <section className="max-w-[1440px] mx-auto px-6 lg:px-10 py-[80px] border-t border-black/5 grid lg:grid-cols-[420px_1fr] gap-12">
          <div className="lg:sticky lg:top-[100px] h-fit">
            <div className="font-sans text-[10px] tracking-[0.2em] font-bold mb-4 text-black/40">01 / THE MISSION</div>
            <h2 className="font-serif text-[36px] lg:text-[44px] leading-[0.95] tracking-[-0.02em] italic">
              Restoring<br/>Biological<br/><span className="text-[#1a5a3a]">Balance.</span>
            </h2>
            <Link to="/shop" className="inline-flex mt-6 font-sans text-[11px] tracking-[0.12em] font-bold underline underline-offset-4">Explore Studio Inventory —</Link>
          </div>
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
            <div className="bg-white rounded-[24px] p-8 lg:p-10 border border-black/[0.04] shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
              <p className="font-sans text-[13px] leading-[1.8] text-black/70">
                Modern interior layout boundaries isolate us from crucial air purification cycles. Eco Essence was founded to reverse this gap. We began industrial mini-production pipelines.
                <br/><br/>
                <span className="font-bold text-black">Instead, our growers individually calibrate robust roots,</span> giving you resilient indoor companion trees and table florals designed to thrive for decades inside normal household routines.
              </p>
              <div className="mt-8 flex gap-2">
                <span className="px-3 py-1.5 rounded-full bg-[#F0F7F0] text-[#1a5a3a] font-sans text-[10px] font-bold">✓ Lab Tested</span>
                <span className="px-3 py-1.5 rounded-full bg-[#F0F7F0] text-[#1a5a3a] font-sans text-[10px] font-bold">✓ Ahmedabad Ready</span>
              </div>
            </div>
            <div className="relative rounded-[24px] overflow-hidden aspect-[4/5] bg-[#E8E6E1]">
              <img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80" className="w-full h-full object-cover" alt="plant" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur font-sans text-[10px] font-bold">Cyclamen • Studio Archive</div>
                <div className="w-12 h-12 rounded-full bg-black text-white grid place-items-center font-serif text-[12px] font-bold">100%</div>
              </div>
            </div>
          </div>
        </section>

        {/* MID STRIP - Cred */}
        <section className="w-full bg-[#1a5a3a] text-[#FAF8F5] py-4 overflow-hidden">
          <div className="flex gap-10 animate-marquee whitespace-nowrap font-sans text-[11px] tracking-[0.2em] font-bold">
            <span>Curated Taxonomy Batches • Eco-Essence Health Guarantee • Secure Biodegradable Logistics • Studio Grown • No Greenwashing •</span>
            <span>Curated Taxonomy Batches • Eco-Essence Health Guarantee • Secure Biodegradable Logistics • Studio Grown • No Greenwashing •</span>
          </div>
        </section>

        {/* STORY 02 - Timeline - CATCHY */}
        <section className="max-w-[1440px] mx-auto px-6 lg:px-10 py-[100px] grid lg:grid-cols-[420px_1fr] gap-12">
          <div className="lg:sticky lg:top-[100px] h-fit">
            <div className="font-sans text-[10px] tracking-[0.2em] font-bold mb-4 text-black/40">02 / EVOLUTION</div>
            <h2 className="font-serif text-[40px] leading-[0.9] italic">The Nursery<br/>Chronicles.</h2>
            <p className="font-sans text-[13px] leading-[1.6] text-black/50 mt-4 max-w-[300px]">Three years of failures, experiments, and one small isolated glass canopy that changed everything.</p>
          </div>

          <div className="space-y-12 relative pl-8 border-l border-black/10">
            {/* Timeline dot line */}
            <div className="absolute left-[-5px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#1a5a3a] to-transparent"></div>

            {[
              { year: '2023 • APR', title: 'Eco-Essence Inception', desc: 'We began small-batch cultivation of a succulent, robust shade-scent structure in a single isolated glass canopy.', tag: 'Day 01' },
              { year: '2023 • DEC', title: 'Taxonomy Finalization', desc: 'Successfully isolated 17 core plant species across controlled lighting zones to protect indoor genetic resilience.', tag: '17 Species' },
              { year: '2024 • JUN', title: 'The Plant Studio Canvas', desc: 'Launched full digital blueprint synchronization allowing users to map living sculpture into custom floor layouts.', tag: 'Tech Drop' },
              { year: '2025 • NOW', title: 'Journal Vol.01', desc: 'You are reading our first archive. Next: pot atelier, soil lab notes, and Ahmedabad light studies.', tag: 'Live Now 🌿' },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute left-[-37px] w-[10px] h-[10px] rounded-full bg-white border-2 border-[#1a5a3a] group-hover:bg-[#1a5a3a] transition"></div>
                <div className="bg-white rounded-[20px] p-7 border border-black/[0.04] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:translate-x-1 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-sans text-[10px] tracking-[0.15em] font-bold text-[#1a5a3a]">{item.year}</span>
                    <span className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border font-sans text-[9px] font-bold">{item.tag}</span>
                  </div>
                  <h3 className="font-serif text-[18px] font-bold leading-tight">{item.title}</h3>
                  <p className="font-sans text-[12.5px] leading-[1.6] text-black/60 mt-2">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA - Catchy End */}
        <section className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-[120px]">
          <div className="rounded-[32px] bg-black text-[#FAF8F5] p-10 lg:p-16 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-end overflow-hidden relative">
            <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-[#1a5a3a] blur-[80px] opacity-40 rounded-full translate-x-1/3 -translate-y-1/3"></div>
            <div className="relative z-10">
              <div className="font-sans text-[10px] tracking-[0.2em] font-bold opacity-60 mb-6">JOURNAL END • WHAT NEXT?</div>
              <h2 className="font-serif text-[42px] lg:text-[56px] leading-[0.85] tracking-[-0.03em] italic">Bring Home<br/>a Story,<br/>Not Just a Plant.</h2>
            </div>
            <div className="relative z-10">
              <p className="font-sans text-[13px] leading-[1.7] opacity-70 mb-8 max-w-[340px]">Every plant comes with its birth certificate — days in studio, light test, and care notes from the grower who raised it.</p>
              <div className="flex gap-3">
                <Link to="/shop" className="px-8 py-3.5 rounded-full bg-[#FAF8F5] text-black font-sans text-[11px] font-bold tracking-[0.1em] hover:bg-white transition">SHOP THE ARCHIVE —</Link>
                <Link to="/care-guide" className="px-8 py-3.5 rounded-full border border-white/20 text-white font-sans text-[11px] font-bold tracking-[0.1em] hover:bg-white/10 transition">CARE NOTES</Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}