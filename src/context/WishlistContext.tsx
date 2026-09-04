'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';

interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gargi_wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    try {
      localStorage.setItem('gargi_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to sync wishlist to localStorage', e);
    }
  }, [wishlist, initialized]);

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider value={{
      wishlist,
      isInWishlist,
      toggleWishlist,
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
