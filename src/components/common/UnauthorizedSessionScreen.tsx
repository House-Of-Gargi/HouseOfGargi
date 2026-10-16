'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LogOut, LogIn, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface UnauthorizedSessionScreenProps {
  portalTitle: string;
  loginPath?: string;
  theme?: 'light' | 'dark';
  currentEmail?: string;
}

export function UnauthorizedSessionScreen({
  portalTitle,
  loginPath = '/admin/login',
  theme = 'light',
  currentEmail,
}: UnauthorizedSessionScreenProps) {
  const [signingOut, setSigningOut] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const clearAllSessions = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_session');
      localStorage.removeItem('super_admin_session');
      localStorage.removeItem('admin_session');
      localStorage.removeItem('artisan_session');
      localStorage.removeItem('user_role');
      sessionStorage.clear();
    }
    await supabase.auth.signOut().catch(() => {});
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await clearAllSessions();
      window.location.href = `${loginPath}?logout=true`;
    } catch {
      window.location.href = `${loginPath}?logout=true`;
    }
  };

  const handleSignIn = async () => {
    setRedirecting(true);
    try {
      // Clear current stale session before switching to avoid immediate redirect loop
      await clearAllSessions();
      window.location.href = `${loginPath}?switch=true`;
    } catch {
      window.location.href = `${loginPath}?switch=true`;
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark ? '#140D0A' : '#FAF7F2',
        color: isDark ? '#FFFFFF' : 'var(--ink-brown, #2B1F18)',
        padding: '1.5rem',
        fontFamily: 'var(--font-body, "Outfit", sans-serif)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          background: isDark ? '#1C130E' : '#FFFFFF',
          border: `1.5px solid ${isDark ? 'rgba(228, 211, 174, 0.2)' : 'var(--soft-gold-line, #E4D3AE)'}`,
          borderRadius: 12,
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(43, 31, 24, 0.08)',
          boxSizing: 'border-box',
        }}
      >
        {/* Shield Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: isDark ? 'rgba(122, 35, 49, 0.25)' : '#FFF5F5',
            border: `1.5px solid ${isDark ? 'rgba(255, 205, 210, 0.25)' : '#FFCDD2'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <ShieldAlert style={{ width: 32, height: 32, color: 'var(--maharani-maroon, #721C24)' }} />
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '1.5rem',
            color: isDark ? '#FFFFFF' : 'var(--ink-brown, #2B1F18)',
            margin: '0 0 0.6rem',
            fontFamily: 'var(--font-serif, "Cinzel", Georgia, serif)',
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          Session Expired or <span style={{ color: 'var(--maharani-maroon, #721C24)' }}>Restricted</span>
        </h1>

        {/* Clean Message Without Exposing Any Admin Emails */}
        <p
          style={{
            fontSize: '0.92rem',
            color: isDark ? 'rgba(255, 255, 255, 0.72)' : 'var(--stone-taupe, #5A4D41)',
            lineHeight: 1.6,
            margin: '0 0 1.5rem',
          }}
        >
          Your session may have expired, or this account does not possess authorized credentials for the{' '}
          <strong>{portalTitle}</strong>.
        </p>

        {currentEmail && (
          <div
            style={{
              padding: '0.6rem 0.85rem',
              background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F5EFEB',
              borderRadius: 6,
              marginBottom: '1.5rem',
              fontSize: '0.82rem',
              color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#5A4D41',
              wordBreak: 'break-all',
            }}
          >
            Signed in as: <strong>{currentEmail}</strong>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* 1. Sign In / Switch Account */}
          <button
            type="button"
            onClick={handleSignIn}
            disabled={redirecting || signingOut}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.8rem 1.25rem',
              borderRadius: 6,
              background: 'var(--maharani-maroon, #721C24)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.92rem',
              border: 'none',
              cursor: redirecting || signingOut ? 'not-allowed' : 'pointer',
              transition: 'opacity 150ms ease, transform 150ms ease',
              boxShadow: '0 2px 8px rgba(114, 28, 36, 0.25)',
            }}
          >
            {redirecting ? (
              <>
                <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                <span>Opening Login...</span>
              </>
            ) : (
              <>
                <LogIn style={{ width: 17, height: 17 }} />
                <span>Sign In with Authorized Account</span>
              </>
            )}
          </button>

          {/* 2. Sign Out & Clear Session */}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut || redirecting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.75rem 1.25rem',
              borderRadius: 6,
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
              color: isDark ? '#FFFFFF' : 'var(--ink-brown, #2B1F18)',
              fontWeight: 600,
              fontSize: '0.88rem',
              border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'var(--soft-gold-line, #E4D3AE)'}`,
              cursor: signingOut || redirecting ? 'not-allowed' : 'pointer',
              transition: 'background-color 150ms ease, border-color 150ms ease',
            }}
          >
            {signingOut ? (
              <>
                <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut style={{ width: 16, height: 16, color: 'var(--maharani-maroon, #721C24)' }} />
                <span>Sign Out & Clear Session</span>
              </>
            )}
          </button>

          {/* 3. Return to Public Boutique */}
          <Link
            href="/"
            style={{
              marginTop: '0.5rem',
              fontSize: '0.85rem',
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'var(--stone-taupe, #5A4D41)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
            }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            <span>Return to Public Boutique</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
