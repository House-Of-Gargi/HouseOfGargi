'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: string;
  link: string;
  desktopWebp: string;
  desktopFallback: string;
  mobileWebp: string;
  mobileFallback: string;
  altText: string;
}

const slides: HeroSlide[] = [
  {
    id: 'hero-1',
    link: '/category/sarees',
    desktopWebp: '/banners/desktop-banner-1.webp',
    desktopFallback: '/banners/desktop-banner-1.jpg',
    mobileWebp: '/banners/mobile-banner-1.webp',
    mobileFallback: '/banners/mobile-banner-1.jpg',
    altText: 'House of Gargi - A Story Woven In Thread Pure Silk Sarees',
  },
  {
    id: 'hero-2',
    link: '/category/lehengas',
    desktopWebp: '/banners/desktop-banner-2.webp',
    desktopFallback: '/banners/desktop-banner-2.jpg',
    mobileWebp: '/banners/mobile-banner-2.webp',
    mobileFallback: '/banners/mobile-banner-2.jpg',
    altText: 'House of Gargi - Crafted for The Queen In You Heritage Couture',
  },
  {
    id: 'hero-3',
    link: '/category/kurta-sets',
    desktopWebp: '/banners/desktop-banner-3.webp',
    desktopFallback: '/banners/desktop-banner-3.jpg',
    mobileWebp: '/banners/mobile-banner-3.webp',
    mobileFallback: '/banners/mobile-banner-3.jpg',
    altText: 'House of Gargi - Own Your Style Handcrafted Menswear & Kurta Sets',
  },
  {
    id: 'hero-4',
    link: '/shop',
    desktopWebp: '/banners/desktop-banner-4.webp',
    desktopFallback: '/banners/desktop-banner-4.jpg',
    mobileWebp: '/banners/mobile-banner-4.webp',
    mobileFallback: '/banners/mobile-banner-4.jpg',
    altText: 'House of Gargi - Little Styles Big Smiles Festive Collections',
  },
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-advance every 4.5 seconds when not hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 4500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Preload all subsequent images in memory for zero-lag instant transitions
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth <= 768;
    slides.forEach((s) => {
      const img = new Image();
      img.src = isMobile ? s.mobileWebp : s.desktopWebp;
    });
  }, []);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      nextSlide();
    } else if (distance < -45) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="House of Gargi Luxury Couture Showcase"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#1E140F',
      }}
    >
      {/* ── BACKGROUND IMAGE STACK WITH SILKY CROSSFADE ── */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className="hero__bg"
            style={{
              position: index === 0 ? 'relative' : 'absolute',
              inset: index === 0 ? undefined : 0,
              width: '100%',
              height: '100%',
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
              transition: 'opacity 750ms cubic-bezier(0.4, 0, 0.2, 1), visibility 750ms ease',
              zIndex: isActive ? 2 : 1,
            }}
          >
            <Link
              href={slide.link}
              tabIndex={isActive ? 0 : -1}
              aria-label={slide.altText}
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                cursor: 'pointer',
              }}
            >
              <picture style={{ display: 'block', width: '100%', height: '100%' }}>
                {/* Mobile View: 4:5 portrait banners */}
                <source media="(max-width: 768px)" srcSet={slide.mobileWebp} type="image/webp" />
                <source media="(max-width: 768px)" srcSet={slide.mobileFallback} />

                {/* Desktop View: 16:9 widescreen banners */}
                <source srcSet={slide.desktopWebp} type="image/webp" />
                <img
                  src={slide.desktopFallback}
                  alt={slide.altText}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  // @ts-ignore
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  decoding="async"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center bottom',
                  }}
                />
              </picture>
            </Link>
          </div>
        );
      })}

      {/* ── MINIMALIST CONTROLS: ELEGANT PIPS & GLASS ARROWS ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '0',
          right: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {/* Pagination Pips */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'auto',
            background: 'rgba(24, 16, 12, 0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '6px 12px',
            borderRadius: '9999px',
            border: '1px solid rgba(228, 211, 174, 0.25)',
          }}
        >
          {slides.map((s, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: isSelected ? '28px' : '8px',
                  height: '5px',
                  borderRadius: '3px',
                  background: isSelected ? 'var(--gargi-gold)' : 'rgba(255, 255, 255, 0.45)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 320ms cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected ? '0 0 8px rgba(184, 142, 24, 0.65)' : 'none',
                }}
              />
            );
          })}
        </div>

        {/* Minimalist Prev/Next Arrow Pair */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto' }}>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(24, 16, 12, 0.55)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(228, 211, 174, 0.3)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(24, 16, 12, 0.55)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(228, 211, 174, 0.3)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
