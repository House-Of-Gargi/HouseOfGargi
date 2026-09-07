'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  id: string;
  sanskritLipi: string;
  tagline: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  desktopWebp: string;
  desktopJpg: string;
  mobileWebp: string;
  mobileJpg: string;
  altText: string;
}

const slides: BannerSlide[] = [
  {
    id: 'utsav-anand',
    sanskritLipi: 'गार्गी सूत्रम्',
    tagline: 'Handcrafted Heritage, Worn Today.',
    subtitle: 'Pure crimson Patola & Kadwa gold weaves — crafted by multi-generational master looms for a lifetime of treasured moments.',
    primaryCtaText: 'Explore Sarees',
    primaryCtaLink: '/category/sarees',
    secondaryCtaText: 'Meet Our Artisans',
    secondaryCtaLink: '/our-artisans',
    desktopWebp: '/images/hero-desktop-1.webp',
    desktopJpg: '/images/hero-desktop-1.jpg',
    mobileWebp: '/images/hero-mobile-1.webp',
    mobileJpg: '/images/hero-mobile-1.jpg',
    altText: 'House of Gargi — Utsav Anand Royal Patola Silk Heritage',
  },
  {
    id: 'shwet-raktam',
    sanskritLipi: 'पवित्र परम्परा',
    tagline: 'Ethereal Silk, Timeless Grace.',
    subtitle: 'Sacred ivory Garad-Korial silks with vermilion temple borders, handcrafted with unhurried devotion for sacred celebrations.',
    primaryCtaText: 'Discover Heirlooms',
    primaryCtaLink: '/category/sarees',
    secondaryCtaText: 'Bespoke Trousseau',
    secondaryCtaLink: '/bespoke',
    desktopWebp: '/images/hero-desktop-2.webp',
    desktopJpg: '/images/hero-desktop-2.jpg',
    mobileWebp: '/images/hero-mobile-2.webp',
    mobileJpg: '/images/hero-mobile-2.jpg',
    altText: 'House of Gargi — Shwet-Raktam Sacred Ivory Garad Silk',
  },
  {
    id: 'raj-darbar',
    sanskritLipi: 'राज दरबार',
    tagline: 'Regal Couture for Modern Royalty.',
    subtitle: 'Intricate pure gold zari bridal lehengas and Awadhi zardozi masterpieces hand-embroidered in historic courtly ateliers.',
    primaryCtaText: 'Explore Lehengas',
    primaryCtaLink: '/category/lehengas',
    secondaryCtaText: 'Private Commissions',
    secondaryCtaLink: '/bespoke',
    desktopWebp: '/images/hero-desktop-3.webp',
    desktopJpg: '/images/hero-desktop-3.jpg',
    mobileWebp: '/images/hero-mobile-3.webp',
    mobileJpg: '/images/hero-mobile-3.jpg',
    altText: 'House of Gargi — Raj-Darbar Sandstone Jharokha Bridal Silk',
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

  // Auto-advance every 7 seconds when not hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

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
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
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
      aria-label="House of Gargi Luxury Heritage Hero Slider"
    >
      {/* ── BACKGROUND IMAGE STACK WITH CROSSFADE ── */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className="hero__bg"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
              transition: 'opacity 900ms cubic-bezier(0.4, 0, 0.2, 1), visibility 900ms ease',
              zIndex: 1,
            }}
          >
            <picture>
              <source media="(max-width: 768px)" srcSet={slide.mobileWebp} type="image/webp" />
              <source media="(max-width: 768px)" srcSet={slide.mobileJpg} type="image/jpeg" />
              <source srcSet={slide.desktopWebp} type="image/webp" />
              <img
                src={slide.desktopJpg}
                alt={slide.altText}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </picture>
          </div>
        );
      })}

      {/* ── LUXURY VIGNETTE & TEXT PROTECTION OVERLAY ── */}
      <div className="hero__overlay" />

      {/* ── CODE-RENDERED EDITORIAL TYPOGRAPHY & BUTTONS ── */}
      <div className="hero__content">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className="hero__slide-text-wrap"
              style={{
                display: isActive ? 'block' : 'none',
                animation: isActive ? 'heroTextFadeIn 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
              }}
            >
              {/* Sanskrit Lipi (Prominent Devanagari Script - Desktop Only) */}
              <div className="hero__sanskrit-lipi">
                {slide.sanskritLipi}
              </div>

              {/* Main Headline */}
              <h1 className="hero__tagline">
                {slide.tagline}
              </h1>

              {/* Subtitle (Desktop Only to reduce mobile clutter) */}
              <p className="hero__subtitle">
                {slide.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="hero__actions">
                <Link
                  href={slide.primaryCtaLink}
                  className="btn btn--gold hero-primary-btn"
                >
                  {slide.primaryCtaText} &rarr;
                </Link>

                <Link
                  href={slide.secondaryCtaLink}
                  className="hero-secondary-btn"
                >
                  {slide.secondaryCtaText}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ARROWS & PAGINATION PROGRESS ── */}
      <div className="hero__controls">
        {/* Pagination Pips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {slides.map((s, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}: ${s.tagline}`}
                style={{
                  width: isSelected ? '36px' : '12px',
                  height: '6px',
                  borderRadius: '3px',
                  background: isSelected ? 'var(--gargi-gold)' : 'rgba(255, 255, 255, 0.4)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected ? '0 0 10px rgba(201, 162, 39, 0.6)' : 'none',
                }}
              />
            );
          })}
        </div>

        {/* Minimalist Prev/Next Arrow Pair */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="hero-arrow-btn"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="hero-arrow-btn"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
