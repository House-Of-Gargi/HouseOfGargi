import React, { createContext, useContext, useState, useEffect } from 'react';
import { products } from '../data/products';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('gargi_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(item => {
          const fresh = products.find(p => p.id === item.id);
          return fresh
            ? { ...item, ...fresh, images: fresh.images, quantity: item.quantity, size: item.size }
            : item;
        });
      }
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('gargi_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, size = null) => {
    const fresh = products.find(p => p.id === product.id) || product;
    setCart(prev => {
      const existing = prev.find(item => item.id === fresh.id && item.size === size);
      if (existing) {
        return prev.map(item => 
          item.id === fresh.id && item.size === size
            ? { ...item, ...fresh, images: fresh.images, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...fresh, images: fresh.images, quantity, size }];
    });
  };

  const removeFromCart = (productId, size = null) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.size === size)));
  };

  const updateQuantity = (productId, size, newQuantity) => {
    if (newQuantity < 1) return removeFromCart(productId, size);
    setCart(prev => prev.map(item => 
      item.id === productId && item.size === size
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
