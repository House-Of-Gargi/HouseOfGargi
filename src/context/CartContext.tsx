'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '@/types';
import { products } from '@/data/products';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

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
  const { customer, isLoggedIn, openLoginModal } = useCustomerAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentLoadedPhone, setCurrentLoadedPhone] = useState<string | null>(null);

  // Load cart uniquely keyed to the logged-in customer's phone number
  useEffect(() => {
    if (!isLoggedIn || !customer?.phone) {
      setCart([]);
      setCurrentLoadedPhone(null);
      return;
    }

    const phone = customer.phone;
    try {
      const storageKey = `gargi_cart_${phone}`;
      let saved = localStorage.getItem(storageKey);
      
      // If new login and legacy cart exists, migrate legacy into this user's private cart
      if (!saved) {
        const legacy = localStorage.getItem('gargi_cart');
        if (legacy) {
          saved = legacy;
          localStorage.setItem(storageKey, legacy);
          localStorage.removeItem('gargi_cart');
        }
      }

      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        // Hydrate items with fresh catalog so latest product images, prices, and specs are always current
        const refreshed = parsed.map(item => {
          const fresh = products.find(p => p.id === item.id);
          return fresh 
            ? { ...item, ...fresh, images: fresh.images, quantity: item.quantity, size: item.size } 
            : item;
        });
        setCart(refreshed);
      } else {
        setCart([]);
      }
    } catch {
      setCart([]);
    }
    setCurrentLoadedPhone(phone);
  }, [isLoggedIn, customer?.phone]);

  // Persist cart updates uniquely to the logged-in customer's storage key
  useEffect(() => {
    if (!isLoggedIn || !customer?.phone || currentLoadedPhone !== customer.phone) return;
    try {
      localStorage.setItem(`gargi_cart_${customer.phone}`, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync user cart to localStorage', e);
    }
  }, [cart, isLoggedIn, customer?.phone, currentLoadedPhone]);

  const addToCart = (product: Product, quantity = 1, size: string | null = null) => {
    if (!isLoggedIn || !customer?.phone) {
      openLoginModal();
      return;
    }

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

  const clearCart = () => {
    setCart([]);
    if (customer?.phone) {
      try {
        localStorage.removeItem(`gargi_cart_${customer.phone}`);
      } catch (e) {
        console.error('Failed to clear cart storage', e);
      }
    }
  };

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
