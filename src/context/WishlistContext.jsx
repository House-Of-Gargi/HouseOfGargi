import React, { createContext, useContext, useState, useEffect } from 'react';
import { products } from '../data/products';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('gargi_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(item => {
          const fresh = products.find(p => p.id === item.id);
          return fresh ? { ...fresh } : item;
        });
      }
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('gargi_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    const fresh = products.find(p => p.id === product.id) || product;
    setWishlist(prev => {
      const exists = prev.some(item => item.id === fresh.id);
      if (exists) {
        return prev.filter(item => item.id !== fresh.id);
      }
      return [...prev, fresh];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      wishlistCount: wishlist.length
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
