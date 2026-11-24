import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Shop from "./Components/Shop";
import Journal from "./Components/About"; // keep for fallback
import Contact from "./Components/Contact";
import Cart from "./Components/Cart";
import PlantAuthJWT from "./Components/PlantAuthJWT";
import AdminForm from "./Components/AdminForm";
import CareGuide from "./Components/CareGuide";
import MyOrders from "./Components/MyOrders";
import ProductDetail from "./Components/ProductDetail"; // YOUR PLANT DETAIL (your title, not Aglaonema)
import Pot from "./Components/Pot"; // <-- POT IS HERE - Line 14

function ProtectedBuy({ children }) {
  const token = localStorage.getItem('plant_jwt_token');
  if (!token) return <Navigate to="/auth?next=/shop&msg=login_to_buy" replace />;
  return children;
}

// SECURE: No separate admin code box here.
// Admin logs in via normal Profile Menu Login. /admin-login just sends to /auth.
// FIX: ?next=/admin bhejta hai taaki admin login ke baad seedha panel khule, shop pe na jaye.
function AdminLock() {
  return <Navigate to="/auth?next=/admin" replace />;
}

// FOOTER - isi file me hai, alag Footer.jsx banane ki zaroorat nahi.
function Footer() {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const siteQr = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=10&color=0F2A1D&bgcolor=FFFFFF&data=${encodeURIComponent(siteUrl)}`;

  return (
    <footer className="bg-[#0F2A1D] text-white mt-16">
      <div className="max-w-[1200px] mx-auto px-6 py-10 grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_auto]">
        <div>
          <div className="font-serif text-[24px] font-bold">Eco-Essence <span className="text-[#C9A227]">🌿</span></div>
          <p className="font-sans text-[12px] leading-relaxed text-white/60 mt-2 max-w-[280px]">Healthy plants, honest care, delivered to your doorstep. Cultivating care daily.</p>
          <div className="font-sans text-[11px] text-white/40 mt-4">© {new Date().getFullYear()} Eco-Essence. All rights reserved.</div>
        </div>
        <div>
          <div className="font-sans text-[11px] font-bold tracking-[0.18em] text-[#C9A227]">SHOP</div>
          <ul className="font-sans text-[12px] mt-3 space-y-2 text-white/70">
            <li><Link to="/shop" className="hover:text-white">All Plants</Link></li>
            <li><Link to="/pots" className="hover:text-white">Pots & Planters</Link></li>
            <li><Link to="/care-guide" className="hover:text-white">Care Guide</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-sans text-[11px] font-bold tracking-[0.18em] text-[#C9A227]">HELP</div>
          <ul className="font-sans text-[12px] mt-3 space-y-2 text-white/70">
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/journal" className="hover:text-white">Our Journal</Link></li>
            <li><Link to="/my-orders" className="hover:text-white">My Orders</Link></li>
          </ul>
        </div>
        {/* WEBSITE QR - footer me: scan karke phone pe shop kholo. */}
        <div className="flex flex-col items-start gap-2 self-start">
          <div className="font-sans text-[11px] font-bold tracking-[0.18em] text-[#C9A227]">SCAN TO SHOP</div>
          <a href={siteUrl} target="_blank" rel="noopener noreferrer" title="Scan to shop on Eco-Essence" className="block bg-white rounded-[12px] p-2 leading-[0] hover:opacity-90 transition">
            <img src={siteQr} alt="Scan to shop on Eco-Essence" width="92" height="92" className="rounded-[6px]" loading="lazy" />
          </a>
          <span className="font-sans text-[10px] text-white/50 max-w-[110px] leading-snug">Scan to shop on your phone</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        {/* PRODUCT DETAIL — YOUR PLANT TITLE (not Aglaonema) */}
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/plant/:id" element={<ProductDetail />} />
        {/* POTS — POT ROUTES ARE HERE */}
        <Route path="/pots" element={<Pot />} />
        <Route path="/pot" element={<Pot />} />
        <Route path="/pot-studio" element={<Pot />} />
        <Route path="/pots/:category" element={<Pot />} />
        {/* JOURNAL - NEW NAME */}
        <Route path="/journal" element={<Journal />} />
        <Route path="/about" element={<Navigate to="/journal" replace />} />
        <Route path="/our-story" element={<Navigate to="/journal" replace />} />
        <Route path="/story" element={<Navigate to="/journal" replace />} />
        {/* KEEP OLD ABOUT FILE IF NEEDED */}
        <Route path="/about-old" element={<Journal />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/care-guide" element={<CareGuide />} />
        <Route path="/kitchen" element={<Navigate to="/care-guide" replace />} />
        <Route path="/greeny-kitchen" element={<Navigate to="/greeny-kitchen" replace />} />
        <Route path="/auth" element={<PlantAuthJWT />} />
        <Route path="/admin-login" element={<AdminLock />} />
        <Route path="/admin" element={<AdminForm />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/cart" element={<ProtectedBuy><Cart /></ProtectedBuy>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}
