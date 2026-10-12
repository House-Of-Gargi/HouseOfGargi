'use client';

import React from 'react';

interface PortalLoadingScreenProps {
  portalName?: string;
  theme?: 'light' | 'dark';
  message?: string;
}

export function PortalLoadingScreen({
  theme = 'light',
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
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      aria-label="Loading..."
      role="status"
    >
      <style>{`
        @keyframes gargiNormalSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* Normal loading icon animation running right in the center with nothing written */}
      <svg
        style={{
          width: '42px',
          height: '42px',
          animation: 'gargiNormalSpin 0.85s linear infinite',
        }}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={isDark ? 'rgba(228, 211, 174, 0.2)' : 'rgba(122, 35, 49, 0.15)'}
          strokeWidth="3"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke={isDark ? '#E4D3AE' : '#7A2331'}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
