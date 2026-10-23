'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import ProductDetailSkeleton from '@/components/skeletons/ProductDetailSkeleton';
import CategoryPageSkeleton from '@/components/skeletons/CategoryPageSkeleton';
import StorefrontSkeleton from '@/components/skeletons/StorefrontSkeleton';
import '@/components/skeletons/SkeletonShimmer.css';

type NavigatingType = 'product' | 'category' | 'general' | null;

interface PageTransitionContextType {
  navigatingType: NavigatingType;
  startTransition: (type: 'product' | 'category' | 'general') => void;
  resetTransition: () => void;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  navigatingType: null,
  startTransition: () => {},
  resetTransition: () => {},
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [navigatingType, setNavigatingType] = useState<NavigatingType>(null);
  const pathname = usePathname();

  // Reset skeleton whenever route navigation completes
  useEffect(() => {
    setNavigatingType(null);
  }, [pathname]);

  // Safety fallback: if navigation takes longer than 4.5 seconds, release the skeleton
  useEffect(() => {
    if (!navigatingType) return;
    const timer = setTimeout(() => {
      setNavigatingType(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [navigatingType]);

  // Global instantaneous click detector for /product/ and /category/ links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't intercept special key combinations or non-primary clicks
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      if (target.target === '_blank') return;

      const href = target.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (href === pathname) return;

      // Ignore portal dashboards
      if (
        href.startsWith('/admin') ||
        href.startsWith('/artisan') ||
        href.startsWith('/seller') ||
        href.startsWith('/super-admin')
      ) {
        return;
      }

      if (href.startsWith('/product/')) {
        setNavigatingType('product');
        window.scrollTo({ top: 0, behavior: 'instant' as any });
      } else if (href.startsWith('/category/')) {
        setNavigatingType('category');
        window.scrollTo({ top: 0, behavior: 'instant' as any });
      } else if (href.startsWith('/')) {
        setNavigatingType('general');
        window.scrollTo({ top: 0, behavior: 'instant' as any });
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [pathname]);

  return (
    <PageTransitionContext.Provider
      value={{
        navigatingType,
        startTransition: (type) => {
          setNavigatingType(type);
          window.scrollTo({ top: 0, behavior: 'instant' as any });
        },
        resetTransition: () => setNavigatingType(null),
      }}
    >
      {/* Royal Gold Slim Top Progress Bar */}
      {navigatingType && <div className="royal-top-loader" />}

      {/* Immediate Skeleton View on Click */}
      {navigatingType === 'product' && (
        <div style={{ position: 'relative', zIndex: 90, minHeight: '85vh', background: '#FBF6EE' }}>
          <ProductDetailSkeleton />
        </div>
      )}
      {navigatingType === 'category' && (
        <div style={{ position: 'relative', zIndex: 90, minHeight: '85vh', background: '#FBF6EE' }}>
          <CategoryPageSkeleton />
        </div>
      )}
      {navigatingType === 'general' && (
        <div style={{ position: 'relative', zIndex: 90, minHeight: '85vh', background: '#FBF6EE' }}>
          <StorefrontSkeleton />
        </div>
      )}

      {/* Normal Page Content (Hidden while instant skeleton is active) */}
      <div style={{ display: navigatingType ? 'none' : 'contents' }}>
        {children}
      </div>
    </PageTransitionContext.Provider>
  );
}
