'use client';

import React from 'react';

interface AdminLoadingSpinnerProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export function AdminLoadingSpinner({
  size = 26,
  color = 'var(--maharani-maroon)',
  style,
}: AdminLoadingSpinnerProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        ...style,
      }}
      role="status"
      aria-label="Loading..."
    >
      <style>{`
        @keyframes gargiSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <svg
        style={{
          width: `${size}px`,
          height: `${size}px`,
          animation: 'gargiSpin 0.82s linear infinite',
          flexShrink: 0,
        }}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="rgba(122, 35, 49, 0.16)"
          strokeWidth="2.8"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke={color}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function AdminPageLoadingBlock({
  message,
  minHeight = '180px',
}: {
  message?: string;
  minHeight?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem',
        minHeight,
        gap: '0.75rem',
        width: '100%',
        boxSizing: 'border-box',
      }}
      role="status"
    >
      <AdminLoadingSpinner size={34} />
      {message && (
        <span
          style={{
            fontSize: '0.82rem',
            color: 'var(--stone-taupe)',
            fontFamily: 'var(--font-nav)',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}
        >
          {message}
        </span>
      )}
    </div>
  );
}
