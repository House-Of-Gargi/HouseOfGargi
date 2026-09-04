'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import { products } from '@/data/products';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { customer, isLoggedIn, openLoginModal } = useCustomerAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [currentLoadedPhone, setCurrentLoadedPhone] = useState<string | null>(null);

  // Load wishlist uniquely keyed to the logged-in customer's phone number
  useEffect(() => {
    if (!isLoggedIn || !customer?.phone) {
      setWishlist([]);
      setCurrentLoadedPhone(null);
      return;
    }

    const phone = customer.phone;
    try {
      const storageKey = `gargi_wishlist_${phone}`;
      let saved = localStorage.getItem(storageKey);

      // Migrate legacy global wishlist if existing
      if (!saved) {
        const legacy = localStorage.getItem('gargi_wishlist');
        if (legacy) {
          saved = legacy;
          localStorage.setItem(storageKey, legacy);
          localStorage.removeItem('gargi_wishlist');
        }
      }

      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        // Hydrate items with fresh catalog so latest product images are always used
        const refreshed = parsed.map(item => {
          const fresh = products.find(p => p.id === item.id);
          return fresh ? { ...fresh } : item;
        });
        setWishlist(refreshed);
      } else {
        setWishlist([]);
      }
    } catch {
      setWishlist([]);
    }
    setCurrentLoadedPhone(phone);
  }, [isLoggedIn, customer?.phone]);

  // Persist wishlist uniquely to the logged-in customer's storage key
  useEffect(() => {
    if (!isLoggedIn || !customer?.phone || currentLoadedPhone !== customer.phone) return;
    try {
      localStorage.setItem(`gargi_wishlist_${customer.phone}`, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to sync user wishlist to localStorage', e);
    }
  }, [wishlist, isLoggedIn, customer?.phone, currentLoadedPhone]);

  const isInWishlist = (productId: string) => {
    if (!isLoggedIn || !customer?.phone) return false;
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (!isLoggedIn || !customer?.phone) {
      openLoginModal();
      return;
    }

    const fresh = products.find(p => p.id === product.id) || product;
    setWishlist(prev => {
      const exists = prev.some(item => item.id === fresh.id);
      if (exists) {
        return prev.filter(item => item.id !== fresh.id);
      } else {
        return [...prev, fresh];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    if (!isLoggedIn || !customer?.phone) return;
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const clearWishlist = () => {
    if (!isLoggedIn || !customer?.phone) return;
    setWishlist([]);
    try {
      localStorage.removeItem(`gargi_wishlist_${customer.phone}`);
    } catch (e) {
      console.error('Failed to clear wishlist storage', e);
    }
  };

  const wishlistCount = isLoggedIn ? wishlist.length : 0;

  return (
    <WishlistContext.Provider value={{
      wishlist,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
      wishlistCount
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
