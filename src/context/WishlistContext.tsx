'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '@/types';
import { products } from '@/data/products';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { broadcastPortalSync, subscribeToPortalSync } from '@/lib/realtimeSync';

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
  const [currentLoadedEmail, setCurrentLoadedEmail] = useState<string | null>(null);

  // Load wishlist uniquely keyed to the logged-in customer's email
  useEffect(() => {
    if (!isLoggedIn || !customer?.email) {
      setWishlist([]);
      setCurrentLoadedEmail(null);
      return;
    }

    const email = customer.email.toLowerCase().trim();
    try {
      const storageKey = `gargi_wishlist_${email}`;
      let saved = localStorage.getItem(storageKey);

      // Legacy fallback migration
      if (!saved) {
        const legacy = localStorage.getItem('gargi_wishlist') || localStorage.getItem('gargi_wishlist_9876543210');
        if (legacy) {
          saved = legacy;
          localStorage.setItem(storageKey, legacy);
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
    setCurrentLoadedEmail(email);
  }, [isLoggedIn, customer?.email]);

  // Persist wishlist uniquely to the logged-in customer's storage key
  useEffect(() => {
    if (!isLoggedIn || !customer?.email || currentLoadedEmail !== customer.email.toLowerCase().trim()) return;
    try {
      localStorage.setItem(`gargi_wishlist_${customer.email.toLowerCase().trim()}`, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to sync user wishlist to localStorage', e);
    }
  }, [wishlist, isLoggedIn, customer?.email, currentLoadedEmail]);

  // Subscribe to real-time multi-tab cross-synchronization
  useEffect(() => {
    const unsubscribe = subscribeToPortalSync((message) => {
      if (message.type === 'WISHLIST_UPDATED' && message.payload) {
        const { email: msgEmail, wishlist: remoteWishlist } = message.payload;
        const currentEmail = customer?.email?.toLowerCase().trim();
        
        // If the update belongs to this logged-in customer, instantly sync state
        if (currentEmail && msgEmail && currentEmail === msgEmail.toLowerCase().trim()) {
          const refreshed = (remoteWishlist as Product[]).map(item => {
            const fresh = products.find(p => p.id === item.id);
            return fresh ? { ...fresh } : item;
          });
          setWishlist(refreshed);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [customer?.email]);

  const isInWishlist = (productId: string) => {
    if (!isLoggedIn || !customer?.email) return false;
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (!isLoggedIn || !customer?.email) {
      openLoginModal();
      return;
    }

    const fresh = products.find(p => p.id === product.id) || product;
    const currentEmail = customer.email.toLowerCase().trim();

    setWishlist(prev => {
      const exists = prev.some(item => item.id === fresh.id);
      const updated = exists 
        ? prev.filter(item => item.id !== fresh.id) 
        : [...prev, fresh];

      // Broadcast update to all other open tabs in real-time
      broadcastPortalSync('WISHLIST_UPDATED', { email: currentEmail, wishlist: updated }, currentEmail);

      return updated;
    });
  };

  const removeFromWishlist = (productId: string) => {
    if (!isLoggedIn || !customer?.email) return;
    const currentEmail = customer.email.toLowerCase().trim();

    setWishlist(prev => {
      const updated = prev.filter(item => item.id !== productId);
      broadcastPortalSync('WISHLIST_UPDATED', { email: currentEmail, wishlist: updated }, currentEmail);
      return updated;
    });
  };

  const clearWishlist = () => {
    if (!isLoggedIn || !customer?.email) return;
    const currentEmail = customer.email.toLowerCase().trim();
    setWishlist([]);
    try {
      localStorage.removeItem(`gargi_wishlist_${currentEmail}`);
    } catch (e) {
      console.error('Failed to clear wishlist storage', e);
    }
    broadcastPortalSync('WISHLIST_UPDATED', { email: currentEmail, wishlist: [] }, currentEmail);
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
