'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string | null) => void;
  removeFromCart: (productId: string, size?: string | null) => void;
  updateQuantity: (productId: string, size: string | null, newQuantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gargi_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    try {
      localStorage.setItem('gargi_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart to localStorage', e);
    }
  }, [cart, initialized]);

  const addToCart = (product: Product, quantity = 1, size: string | null = null) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, size }];
    });
  };

  const removeFromCart = (productId: string, size: string | null = null) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.size === size)));
  };

  const updateQuantity = (productId: string, size: string | null, newQuantity: number) => {
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

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
