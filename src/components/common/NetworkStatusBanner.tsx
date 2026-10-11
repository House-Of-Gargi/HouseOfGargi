'use client';

import { useState, useEffect } from 'react';
import { WifiOff, Wifi, RotateCcw } from 'lucide-react';

export function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showRestored, setShowRestored] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Set initial network state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
      }, 2500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isVisible = !isOnline || showRestored;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999999,
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), background-color 200ms ease',
        backgroundColor: !isOnline ? '#7A2331' : '#1E4620',
        color: '#FFFFFF',
        borderBottom: '1px solid rgba(228, 211, 174, 0.35)',
        boxShadow: isVisible ? '0 4px 16px rgba(0, 0, 0, 0.22)' : 'none',
        padding: '0.45rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.65rem',
        fontSize: '0.84rem',
        fontFamily: 'var(--font-nav)',
        letterSpacing: '0.04em',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      role="alert"
      aria-live="assertive"
    >
      {!isOnline ? (
        <>
          <WifiOff style={{ width: 14, height: 14, color: '#FFD79E', flexShrink: 0 }} />
          <span style={{ fontWeight: 600 }}>No Internet Connection</span>
          <span style={{ opacity: 0.8, fontSize: '0.78rem' }}>&bull; Offline</span>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              borderRadius: '4px',
              padding: '0.15rem 0.55rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginLeft: '0.35rem',
            }}
          >
            <RotateCcw style={{ width: 11, height: 11 }} />
            Retry
          </button>
        </>
      ) : (
        <>
          <Wifi style={{ width: 14, height: 14, color: '#A5D6A7', flexShrink: 0 }} />
          <span style={{ fontWeight: 600 }}>Back Online</span>
        </>
      )}
    </div>
  );
}
