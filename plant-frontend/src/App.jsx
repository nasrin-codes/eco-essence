import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
        <Route path="/greeny-kitchen" element={<Navigate to="/care-guide" replace />} />
        <Route path="/auth" element={<PlantAuthJWT />} />
        <Route path="/admin-login" element={<AdminLock />} />
        <Route path="/admin" element={<AdminForm />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/cart" element={<ProtectedBuy><Cart /></ProtectedBuy>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}