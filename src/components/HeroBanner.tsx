'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface BannerSlide {
  id: string;
  eyebrow: string;
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
    eyebrow: 'गार्गी सूत्रम् • Royal Festive Splendour',
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
    eyebrow: 'पवित्र परम्परा • Sacred Heritage Weaves',
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
    eyebrow: 'राज दरबार • Royal Courtly Grandeur',
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
      style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}
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
      <div
        className="hero__overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(36,26,21,0.55) 0%, transparent 25%), linear-gradient(105deg, rgba(36,26,21,0.72) 0%, rgba(36,26,21,0.38) 45%, transparent 70%), linear-gradient(to top, rgba(36,26,21,0.6) 0%, transparent 20%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* ── CODE-RENDERED EDITORIAL TYPOGRAPHY & BUTTONS ── */}
      <div className="hero__content" style={{ position: 'relative', zIndex: 3, width: '100%' }}>
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              style={{
                display: isActive ? 'block' : 'none',
                maxWidth: '680px',
                animation: isActive ? 'heroTextFadeIn 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
              }}
            >
              {/* Eyebrow Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(201, 162, 39, 0.18)',
                  border: '1px solid rgba(201, 162, 39, 0.45)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '11.5px',
                  fontFamily: 'var(--font-nav)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#FBF6EE',
                  fontWeight: 700,
                  marginBottom: '18px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                }}
              >
                <Sparkles size={13} style={{ color: 'var(--gargi-gold)' }} />
                <span>{slide.eyebrow}</span>
              </div>

              {/* Headline */}
              <h1
                className="hero__tagline"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(34px, 5.2vw, 62px)',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  lineHeight: 1.12,
                  letterSpacing: '-0.02em',
                  marginBottom: '16px',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.45)',
                }}
              >
                {slide.tagline}
              </h1>

              {/* Subtitle */}
              <p
                className="hero__subtitle"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(16.5px, 2vw, 21px)',
                  color: 'rgba(255, 255, 255, 0.92)',
                  fontStyle: 'italic',
                  lineHeight: 1.65,
                  maxWidth: '560px',
                  marginBottom: '32px',
                  textShadow: '0 1px 6px rgba(0, 0, 0, 0.35)',
                }}
              >
                {slide.subtitle}
              </p>

              {/* Dual Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <Link
                  href={slide.primaryCtaLink}
                  className="btn btn--gold"
                  style={{
                    padding: '14px 28px',
                    fontSize: '13.5px',
                    letterSpacing: '0.1em',
                    boxShadow: '0 6px 20px rgba(184, 142, 24, 0.35)',
                  }}
                >
                  {slide.primaryCtaText} &rarr;
                </Link>

                <Link
                  href={slide.secondaryCtaLink}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '13px 24px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '4px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-nav)',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'all 200ms ease',
                  }}
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
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: 0,
          right: 0,
          zIndex: 4,
          padding: '0 var(--container-pad)',
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
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
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
            className="hero-arrow-btn"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
            className="hero-arrow-btn"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
