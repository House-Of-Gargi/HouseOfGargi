'use client';

import React from 'react';

interface PortalLoadingScreenProps {
  portalName?: string;
  theme?: 'light' | 'dark';
  message?: string;
}

export function PortalLoadingScreen({
  portalName = 'House of Gargi Workspace',
  theme = 'light',
  message = 'Curating luxury atelier...',
}: PortalLoadingScreenProps) {
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '80vh',
        background: isDark ? '#140D0A' : '#FBF6EE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '2rem 1.5rem',
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)',
      }}
      aria-label="Loading workspace..."
      role="status"
    >
      <style>{`
        @keyframes gargiLogoPulse {
          0% {
            opacity: 0.28;
            transform: scale(0.96);
            filter: drop-shadow(0 0 0px rgba(184, 142, 24, 0));
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
            filter: drop-shadow(0 6px 20px rgba(184, 142, 24, 0.3));
          }
          100% {
            opacity: 0.28;
            transform: scale(0.96);
            filter: drop-shadow(0 0 0px rgba(184, 142, 24, 0));
          }
        }

        @keyframes skeletonShimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes goldTrackPulse {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(300%);
          }
        }

        .gargi-shimmer-box {
          background: ${isDark 
            ? 'linear-gradient(90deg, #1C130E 0%, #2A1D16 50%, #1C130E 100%)' 
            : 'linear-gradient(90deg, #F3ECE0 0%, #FFFFFF 50%, #F3ECE0 100%)'};
          background-size: 200% 100%;
          animation: skeletonShimmer 1.8s infinite ease-in-out;
          border-radius: 4px;
        }

        .gargi-center-beacon {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justifyContent: center;
          padding: 2.25rem 3rem;
          border-radius: 12px;
          background: ${isDark ? 'rgba(28, 19, 14, 0.88)' : 'rgba(255, 255, 255, 0.94)'};
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid ${isDark ? 'rgba(228, 211, 174, 0.3)' : 'var(--soft-gold-line)'};
          box-shadow: 0 16px 40px -10px ${isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(43, 31, 24, 0.12)'};
          margin-bottom: 2.5rem;
          margin-top: 1rem;
          max-width: 480px;
          width: 90%;
          text-align: center;
        }

        .gargi-logo-pulsing {
          animation: gargiLogoPulse 1.8s infinite ease-in-out;
          display: block;
          max-width: 220px;
          height: auto;
          margin: 0 auto 1.25rem;
        }
      `}</style>

      {/* ════════════ CENTERED BEACON WITH PULSING LOGO ════════════ */}
      <div className="gargi-center-beacon">
        {/* Pulsing House of Gargi Official Logo */}
        <img
          src="/logo-images/new-logo.png"
          alt="House of Gargi"
          className="gargi-logo-pulsing"
        />

        {/* Brand Royal Inscription */}
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: isDark ? '#E4D3AE' : '#7A2331',
            textTransform: 'uppercase',
            margin: '0 0 0.35rem 0',
            lineHeight: 1.2,
          }}
        >
          HOUSE OF GARGI
        </span>

        {/* Heritage Subtitle */}
        <span
          style={{
            fontSize: '0.74rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#B88E18',
            fontWeight: 600,
            marginBottom: '1rem',
          }}
        >
          — TRADITION &middot; CRAFT &middot; HERITAGE —
        </span>

        {/* Dynamic Telemetry Status */}
        <span
          style={{
            fontSize: '0.85rem',
            color: isDark ? '#D8C9B8' : '#6B584E',
            fontWeight: 500,
            marginBottom: '1.25rem',
          }}
        >
          {portalName} &bull; {message}
        </span>

        {/* Gold Shimmer Loading Track */}
        <div
          style={{
            width: '160px',
            height: '3px',
            background: isDark ? '#2E2018' : '#E8DCBE',
            borderRadius: '9999px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '50%',
              height: '100%',
              background: 'linear-gradient(90deg, #7A2331 0%, #D4AF37 50%, #7A2331 100%)',
              borderRadius: '9999px',
              animation: 'goldTrackPulse 1.6s infinite ease-in-out',
            }}
          />
        </div>
      </div>

      {/* ════════════ BACKGROUND SKELETON LAYOUT ════════════ */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          opacity: 0.85,
        }}
      >
        {/* 1. Header Bar Skeleton */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1rem',
            borderBottom: `1px solid ${isDark ? '#2E2018' : '#E8DCBE'}`,
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="gargi-shimmer-box" style={{ width: '240px', height: '28px' }} />
            <div className="gargi-shimmer-box" style={{ width: '380px', height: '14px' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="gargi-shimmer-box" style={{ width: '110px', height: '36px', borderRadius: '6px' }} />
            <div className="gargi-shimmer-box" style={{ width: '130px', height: '36px', borderRadius: '6px' }} />
          </div>
        </div>

        {/* 2. Four KPI Metric Cards Skeleton */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                background: isDark ? '#1C130E' : '#FFFFFF',
                border: `1px solid ${isDark ? '#2E2018' : '#E8DCBE'}`,
                borderRadius: '8px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="gargi-shimmer-box" style={{ width: '120px', height: '14px' }} />
                <div className="gargi-shimmer-box" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
              </div>
              <div className="gargi-shimmer-box" style={{ width: '160px', height: '34px' }} />
              <div className="gargi-shimmer-box" style={{ width: '100px', height: '12px' }} />
            </div>
          ))}
        </div>

        {/* 3. Main Split View Skeleton (Table & Side Rail) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Main Table Skeleton */}
          <div
            style={{
              background: isDark ? '#1C130E' : '#FFFFFF',
              border: `1px solid ${isDark ? '#2E2018' : '#E8DCBE'}`,
              borderRadius: '8px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              flex: 2,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="gargi-shimmer-box" style={{ width: '180px', height: '22px' }} />
              <div className="gargi-shimmer-box" style={{ width: '90px', height: '28px' }} />
            </div>
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.65rem 0',
                  borderBottom: `1px solid ${isDark ? '#251A14' : '#F4EDE0'}`,
                }}
              >
                <div className="gargi-shimmer-box" style={{ width: '40px', height: '40px', borderRadius: '4px', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className="gargi-shimmer-box" style={{ width: '70%', height: '16px' }} />
                  <div className="gargi-shimmer-box" style={{ width: '40%', height: '12px' }} />
                </div>
                <div className="gargi-shimmer-box" style={{ width: '75px', height: '22px', borderRadius: '9999px' }} />
                <div className="gargi-shimmer-box" style={{ width: '60px', height: '16px' }} />
              </div>
            ))}
          </div>

          {/* Side Feed / Telemetry Skeleton */}
          <div
            style={{
              background: isDark ? '#1C130E' : '#FFFFFF',
              border: `1px solid ${isDark ? '#2E2018' : '#E8DCBE'}`,
              borderRadius: '8px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              flex: 1,
            }}
          >
            <div className="gargi-shimmer-box" style={{ width: '150px', height: '22px' }} />
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  padding: '0.75rem 0',
                  borderBottom: `1px solid ${isDark ? '#251A14' : '#F4EDE0'}`,
                }}
              >
                <div className="gargi-shimmer-box" style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className="gargi-shimmer-box" style={{ width: '90%', height: '14px' }} />
                  <div className="gargi-shimmer-box" style={{ width: '50%', height: '11px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
