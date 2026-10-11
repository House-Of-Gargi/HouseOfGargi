'use client';

import Link from 'next/link';
import { Home, Store, Shield } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: "url('/images/atelier-lineart-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#FBF6EE',
        fontFamily: 'var(--font-sans)',
        color: 'var(--ink-brown)',
        padding: '2.5rem 1rem',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Background Soft Ivory Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(251, 246, 238, 0.35)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <style>{`
        .gargi-404-card {
          position: relative;
          z-index: 10;
          background: #FFFFFF;
          border: 1.5px solid var(--soft-gold-line);
          border-radius: 14px;
          box-shadow: 0 24px 50px -12px rgba(43, 31, 24, 0.12);
          max-width: 640px;
          width: 100%;
          padding: 3.5rem 2.5rem;
          text-align: center;
          box-sizing: border-box;
          animation: fadeIn404 300ms ease-out;
        }
        @media (max-width: 640px) {
          .gargi-404-card {
            padding: 2.5rem 1.5rem;
          }
        }
        @keyframes fadeIn404 {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .gargi-404-number {
          font-family: var(--font-serif);
          font-size: 6.5rem;
          font-weight: 700;
          line-height: 1;
          color: #7A2331;
          letter-spacing: 0.04em;
          margin: 0.75rem 0 0.5rem;
          text-shadow: 0 4px 18px rgba(184, 142, 24, 0.18);
        }
        @media (max-width: 640px) {
          .gargi-404-number {
            font-size: 5rem;
          }
        }
      `}</style>

      <div className="gargi-404-card">
        {/* Brand Crest */}
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>
          <img
            src="/logo-images/new-logo.png"
            alt="House of Gargi"
            style={{ height: '62px', width: 'auto', display: 'block', margin: '0 auto' }}
          />
        </Link>

        <div>
          <span
            style={{
              fontSize: '0.74rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#B88E18',
            }}
          >
            — TRADITION &middot; CRAFT &middot; HERITAGE —
          </span>
        </div>

        {/* 404 Large Display */}
        <div className="gargi-404-number">404</div>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.85rem',
            fontWeight: 600,
            color: 'var(--ink-brown)',
            margin: '0 0 0.75rem 0',
            lineHeight: 1.25,
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            fontSize: '0.98rem',
            color: 'var(--stone-taupe)',
            lineHeight: 1.6,
            maxWidth: '480px',
            margin: '0 auto 2.25rem',
          }}
        >
          The path you entered could not be found on our looms. It may have been relocated, or the URL address was mistyped.
        </p>

        {/* Action Button Grid */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxWidth: '380px',
            margin: '0 auto',
          }}
        >
          {/* 1. Return to Storefront */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              background: '#7A2331',
              color: '#FFFFFF',
              padding: '0.95rem 1.75rem',
              borderRadius: '8px',
              fontFamily: 'var(--font-nav)',
              fontSize: '0.92rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(122, 35, 49, 0.28)',
              transition: 'background-color 150ms ease',
            }}
          >
            <Home style={{ width: 16, height: 16 }} />
            <span>Return to Boutique</span>
          </Link>

          {/* 2. Artisan Portal */}
          <Link
            href="/artisan/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              background: '#FFFFFF',
              color: 'var(--ink-brown)',
              border: '1.5px solid var(--soft-gold-line)',
              padding: '0.85rem 1.75rem',
              borderRadius: '8px',
              fontFamily: 'var(--font-nav)',
              fontSize: '0.88rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Store style={{ width: 16, height: 16, color: '#7A2331' }} />
            <span>Artisan Atelier Portal</span>
          </Link>

          {/* 3. Admin Console */}
          <Link
            href="/admin/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              color: '#7A2331',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '0.5rem',
              marginTop: '0.5rem',
            }}
          >
            <Shield style={{ width: 13, height: 13 }} />
            <span>Administration Console &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
