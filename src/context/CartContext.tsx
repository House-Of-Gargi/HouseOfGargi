'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '@/types';
import { products } from '@/data/products';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { broadcastPortalSync, subscribeToPortalSync } from '@/lib/realtimeSync';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string | null) => void;
  addMultipleToCart: (items: { product: Product; quantity?: number; size?: string | null }[]) => void;
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
  const [currentLoadedEmail, setCurrentLoadedEmail] = useState<string | null>(null);

  // Load cart uniquely keyed to the logged-in customer's email
  useEffect(() => {
    if (!isLoggedIn || !customer?.email) {
      setCart([]);
      setCurrentLoadedEmail(null);
      return;
    }

    const email = customer.email.toLowerCase().trim();
    try {
      const storageKey = `gargi_cart_${email}`;
      let saved = localStorage.getItem(storageKey);
      
      // Fallback migration
      if (!saved) {
        const legacy = localStorage.getItem('gargi_cart') || localStorage.getItem('gargi_cart_9876543210');
        if (legacy) {
          saved = legacy;
          localStorage.setItem(storageKey, legacy);
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
    setCurrentLoadedEmail(email);
  }, [isLoggedIn, customer?.email]);

  // Persist cart updates uniquely to the logged-in customer's storage key
  useEffect(() => {
    if (!isLoggedIn || !customer?.email || currentLoadedEmail !== customer.email.toLowerCase().trim()) return;
    try {
      localStorage.setItem(`gargi_cart_${customer.email.toLowerCase().trim()}`, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync user cart to localStorage', e);
    }
  }, [cart, isLoggedIn, customer?.email, currentLoadedEmail]);

  // Subscribe to real-time multi-tab cross-synchronization
  useEffect(() => {
    const unsubscribe = subscribeToPortalSync((message) => {
      if (message.type === 'CART_UPDATED' && message.payload) {
        const { email: msgEmail, cart: remoteCart } = message.payload;
        const currentEmail = customer?.email?.toLowerCase().trim();

        if (currentEmail && msgEmail && currentEmail === msgEmail.toLowerCase().trim()) {
          const refreshed = (remoteCart as CartItem[]).map(item => {
            const fresh = products.find(p => p.id === item.id);
            return fresh 
              ? { ...item, ...fresh, images: fresh.images, quantity: item.quantity, size: item.size } 
              : item;
          });
          setCart(refreshed);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [customer?.email]);

  const addToCart = (product: Product, quantity = 1, size: string | null = null) => {
    if (!isLoggedIn || !customer?.email) {
      openLoginModal();
      return;
    }

    const fresh = products.find(p => p.id === product.id) || product;
    const currentEmail = customer.email.toLowerCase().trim();

    setCart(prev => {
      const existing = prev.find(item => item.id === fresh.id && item.size === size);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map(item => 
          item.id === fresh.id && item.size === size
            ? { ...item, ...fresh, images: fresh.images, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...prev, { ...fresh, images: fresh.images, quantity, size }];
      }

      broadcastPortalSync('CART_UPDATED', { email: currentEmail, cart: updated }, currentEmail);
      return updated;
    });
  };

  const addMultipleToCart = (items: { product: Product; quantity?: number; size?: string | null }[]) => {
    if (!isLoggedIn || !customer?.email) {
      openLoginModal();
      return;
    }

    const currentEmail = customer.email.toLowerCase().trim();

    setCart(prev => {
      let updated = [...prev];
      for (const entry of items) {
        const fresh = products.find(p => p.id === entry.product.id) || entry.product;
        const qty = entry.quantity || 1;
        const size = entry.size ?? (fresh.sizes && fresh.sizes.length > 0 ? fresh.sizes[0] : null);
        const existingIndex = updated.findIndex(item => item.id === fresh.id && item.size === size);
        if (existingIndex > -1) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            ...fresh,
            images: fresh.images,
            quantity: updated[existingIndex].quantity + qty,
          };
        } else {
          updated.push({
            ...fresh,
            images: fresh.images,
            quantity: qty,
            size,
          });
        }
      }

      broadcastPortalSync('CART_UPDATED', { email: currentEmail, cart: updated }, currentEmail);
      return updated;
    });
  };

  const removeFromCart = (productId: string, size: string | null = null) => {
    if (!customer?.email) return;
    const currentEmail = customer.email.toLowerCase().trim();

    setCart(prev => {
      const updated = prev.filter(item => !(item.id === productId && item.size === size));
      broadcastPortalSync('CART_UPDATED', { email: currentEmail, cart: updated }, currentEmail);
      return updated;
    });
  };

  const updateQuantity = (productId: string, size: string | null, newQuantity: number) => {
    if (newQuantity < 1) return removeFromCart(productId, size);
    if (!customer?.email) return;
    const currentEmail = customer.email.toLowerCase().trim();

    setCart(prev => {
      const updated = prev.map(item => 
        item.id === productId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      );
      broadcastPortalSync('CART_UPDATED', { email: currentEmail, cart: updated }, currentEmail);
      return updated;
    });
  };

  const clearCart = () => {
    if (!customer?.email) return;
    const currentEmail = customer.email.toLowerCase().trim();
    setCart([]);
    try {
      localStorage.removeItem(`gargi_cart_${currentEmail}`);
    } catch (e) {
      console.error('Failed to clear cart storage', e);
    }
    broadcastPortalSync('CART_UPDATED', { email: currentEmail, cart: [] }, currentEmail);
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      addMultipleToCart,
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
