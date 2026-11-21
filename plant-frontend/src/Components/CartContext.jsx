import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();

// Helpers - single source of truth
const getToken = () => localStorage.getItem('plant_jwt_token');
const getEmail = () => localStorage.getItem('plant_user_email') || '';
const getCartKey = () => {
  const email = getEmail();
  return email ? `eco_cart_${email}` : null; // NO generic key for guest
};
const loadCartForUser = () => {
  if (!getToken()) return []; // Guest = ALWAYS 0, no leak from previous user
  const key = getCartKey();
  if (!key) return [];
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch { return []; }
};

export const CartProvider = ({ children }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => loadCartForUser());

  // Sync cart -> ONLY per-user key when logged in. Never save guest cart.
  useEffect(() => {
    if (!getToken()) return;
    const key = getCartKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(cart));
    // Keep Navbar in sync - it reads these keys
    localStorage.setItem('eco_cart', JSON.stringify(cart));
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('eco-cart-updated'));
  }, [cart]);

  // Listen for login / logout - reload or clear cart instantly
  useEffect(() => {
    const sync = () => {
      if (!getToken()) {
        setCart([]); // Logout -> next user sees CART 0
      } else {
        setCart(loadCartForUser());
      }
    };
    window.addEventListener('storage', sync);
    window.addEventListener('eco-cart-updated', sync);
    window.addEventListener('eco-login', sync);
    window.addEventListener('eco-logout', sync);
    const iv = setInterval(sync, 1000);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('eco-cart-updated', sync);
      window.removeEventListener('eco-login', sync);
      window.removeEventListener('eco-logout', sync);
      clearInterval(iv);
    };
  }, []);

  // Clear old wrong key once - this was the duplicate Cart 1 source
  useEffect(() => {
    localStorage.removeItem('green_roots_cart');
    if (!getToken()) {
      localStorage.removeItem('eco_cart');
      localStorage.removeItem('cart');
    }
  }, []);

  // BLOCKED for guest - returns false, Shop/ProductDetail will redirect to /auth
  const addToCart = useCallback((plant) => {
    if (!getToken()) {
      window.dispatchEvent(new Event('eco-login-required'));
      return false;
    }
    const key = `${plant._id || plant.id || plant.name}|${plant.potStatus || ''}`;
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => `${item._id || item.id || item.name}|${item.potStatus || ''}` === key);
      if (existingItem) {
        return prevCart.map((item) =>
          `${item._id || item.id || item.name}|${item.potStatus || ''}` === key
            ? { ...item, quantity: (item.quantity || item.qty || 1) + 1, qty: (item.qty || item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevCart, {
        ...plant,
        quantity: 1,
        qty: 1,
        image: plant.displayImage || plant.image || plant.imageUrl,
        displayImage: plant.displayImage || plant.image,
      }];
    });
    return true;
  }, []);

  // Buy Now also blocked for guest
  const buyNow = useCallback((plant) => {
    if (!getToken()) {
      window.dispatchEvent(new Event('eco-login-required'));
      return false;
    }
    addToCart(plant);
    return true;
  }, [addToCart]);

  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === id);
      if (!existingItem) return prevCart;
      const q = existingItem.quantity || existingItem.qty || 1;
      if (q === 1) return prevCart.filter((item) => item._id !== id);
      return prevCart.map((item) =>
        item._id === id ? { ...item, quantity: q - 1, qty: q - 1 } : item
      );
    });
  };

  const increaseQty = (id) => {
    setCart((prev) => prev.map((item) =>
      item._id === id ? { ...item, quantity: (item.quantity || item.qty || 1) + 1, qty: (item.qty || item.quantity || 1) + 1 } : item
    ));
  };

  const removeCompletely = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, delta) => {
    if (delta === -1) removeFromCart(id);
    else if (delta === 1) increaseQty(id);
  };

  const clearCart = () => {
    setCart([]);
    const key = getCartKey();
    if (key) localStorage.removeItem(key);
    localStorage.removeItem('eco_cart');
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('eco-cart-updated'));
  };

  const getCartCount = () => cart.reduce((total, item) => total + (item.quantity || item.qty || 1), 0);
  const getCartTotal = () => cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || item.qty || 1)), 0);

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      buyNow,
      removeFromCart,
      removeCompletely,
      increaseQty,
      updateQuantity,
      clearCart,
      getCartCount,
      getCartTotal,
      cartCount,
      cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export { CartContext };