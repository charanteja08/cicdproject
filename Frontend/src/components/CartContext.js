import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const key = `${product.name}-${product.price}`;
      const idx = prev.findIndex(p => `${p.name}-${p.price}` === key);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: (updated[idx].quantity || 1) + 1 };
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const incrementItem = (index) => {
    setCart(prev => prev.map((item, i) => i === index ? { ...item, quantity: (item.quantity || 1) + 1 } : item));
  };

  const decrementItem = (index) => {
    setCart(prev => prev.map((item, i) => i === index ? { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) } : item));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, incrementItem, decrementItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
} 