'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import '@/seller.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const emailInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-route existing active admin/super_admin sessions (unless explicitly logging out)
  useEffect(() => {
    const checkCurrentSession = async () => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('logout') === 'true' || urlParams.get('switch') === 'true') {
          localStorage.removeItem('auth_session');
          localStorage.removeItem('super_admin_session');
          localStorage.removeItem('admin_session');
          sessionStorage.clear();
          return;
        }
      }

      const stored = typeof window !== 'undefined'
        ? (localStorage.getItem('super_admin_session') || localStorage.getItem('admin_session'))
        : null;

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.role === 'super_admin') {
            router.replace('/super-admin/dashboard');
            return;
          }
          if (parsed?.role === 'admin') {
            router.replace('/admin/dashboard');
            return;
          }
        } catch {}
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        try {
          const roleRes = await fetch(`/api/auth/role?email=${encodeURIComponent(session.user.email)}`);
          const roleData = await roleRes.json();
          if (roleData?.role === 'super_admin') {
            router.replace('/super-admin/dashboard');
          } else if (roleData?.role === 'admin') {
            router.replace('/admin/dashboard');
          }
        } catch {}
      }
    };
    checkCurrentSession();
  }, [router]);

  // Handle email + password login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid administrator email address.');
      return;
    }

    if (!password) {
      setError('Please enter your administrative password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid administrator email or password.');
      }

      const userRole = data.user?.role;
      if (userRole !== 'super_admin' && userRole !== 'admin') {
        throw new Error('Access denied. This account does not possess Administrative authority.');
      }

      const sessionPayload = {
        email: cleanEmail,
        name: data.user?.name || cleanEmail.split('@')[0],
        role: userRole,
        token: data.token || '',
        timestamp: Date.now(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_session', JSON.stringify(sessionPayload));
        localStorage.setItem('admin_session', JSON.stringify(sessionPayload));
        if (userRole === 'super_admin') {
          localStorage.setItem('super_admin_session', JSON.stringify(sessionPayload));
        }
      }

      if (userRole === 'super_admin') {
        router.push('/super-admin/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error. Please check your administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-root" style={{
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url('/images/atelier-lineart-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#FBF6EE',
      fontFamily: 'var(--font-sans)',
      color: 'var(--ink-brown)',
      overflowX: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Background Soft Ivory Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(251, 246, 238, 0.28)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      <style>{`
        .auth-page-root {
          padding: 1.25rem 0.85rem;
        }
        @media (min-width: 640px) {
          .auth-page-root {
            padding: 2.5rem 1.5rem;
          }
        }
        .admin-center-hub {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: auto;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .admin-center-hub {
            max-width: 960px;
            gap: 1.25rem;
          }
        }
        .auth-top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.15rem;
          width: 100%;
          gap: 0.5rem;
          box-sizing: border-box;
        }
        .auth-logo-badge-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
          flex-shrink: 1;
        }
        .auth-logo-img {
          height: 56px;
          width: auto;
          display: block;
          max-width: 200px;
          object-fit: contain;
        }
        .auth-portal-badge {
          display: none;
        }
        .auth-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.45rem 0.8rem;
          border-radius: 8px;
          background: #FFFFFF;
          border: 1.2px solid var(--soft-gold-line);
          color: var(--ink-brown);
          font-size: 0.78rem;
          font-family: var(--font-nav);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          text-decoration: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 200ms ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .auth-back-text-full {
          display: none;
        }
        .auth-back-text-short {
          display: inline;
        }
        @media (min-width: 480px) {
          .auth-back-text-full {
            display: inline;
          }
          .auth-back-text-short {
            display: none;
          }
          .auth-logo-img {
            height: 64px;
            max-width: 230px;
          }
          .auth-back-link {
            padding: 0.5rem 0.95rem;
            font-size: 0.84rem;
          }
        }
        @media (min-width: 768px) {
          .auth-logo-img {
            height: 70px;
            max-width: 250px;
          }
          .auth-logo-badge-wrap {
            gap: 0.75rem;
          }
          .auth-portal-badge {
            display: inline-block;
            font-size: 0.72rem;
            font-family: var(--font-nav);
            font-weight: 500;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            padding: 0.26rem 0.65rem;
            border-radius: 9999px;
            background: #FFFFFF;
            color: #7A2331;
            border: 1px solid var(--soft-gold-line);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
            line-height: 1;
            white-space: nowrap;
            flex-shrink: 0;
          }
        }
        .admin-card-container {
          background: #FFFFFF;
          border-radius: 12px;
          border: 1px solid var(--soft-gold-line);
          box-shadow: 0 16px 40px -10px rgba(43, 31, 24, 0.12);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 1fr;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .admin-card-container {
            grid-template-columns: 1fr 1.15fr;
            align-items: stretch;
          }
        }
        .admin-image-panel {
          display: none;
        }
        @media (min-width: 768px) {
          .admin-image-panel {
            display: block;
            width: 100%;
            height: 100%;
            min-height: 440px;
            max-height: none;
            background: #231812;
            position: relative;
            overflow: hidden;
          }
        }
        .admin-image-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          opacity: 0.88;
        }
        .admin-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(35, 24, 18, 0.35) 0%, rgba(35, 24, 18, 0.88) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.15rem 1rem;
          color: #FAF7F2;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .admin-image-overlay {
            padding: 2.25rem 2rem;
          }
        }
        .admin-form-panel {
          padding: 1.75rem 1.25rem;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (min-width: 480px) {
          .admin-form-panel {
            padding: 2.25rem 1.85rem;
          }
        }
        @media (min-width: 768px) {
          .admin-form-panel {
            padding: 3rem 2.5rem;
          }
        }
        .auth-heading-title {
          font-family: var(--font-serif);
          font-size: clamp(1.6rem, 5.5vw, 2.1rem);
          font-weight: 600;
          color: var(--ink-brown);
          letter-spacing: 0.01em;
          line-height: 1.2;
          margin: 0;
        }
        .auth-heading-desc {
          font-size: clamp(0.86rem, 2.8vw, 0.96rem);
          color: var(--stone-taupe);
          margin: 0.35rem 0 1.25rem 0;
          line-height: 1.45;
        }
        .auth-input-container {
          display: flex;
          align-items: center;
          border: 1.5px solid var(--soft-gold-line);
          border-radius: 9px;
          background: #FFFFFF;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 150ms ease;
        }
        .auth-input-container:focus-within {
          border-color: var(--maharani-maroon);
          box-shadow: 0 0 0 3px rgba(122, 35, 49, 0.12);
        }
        .auth-input-prefix {
          padding: 0.75rem 0.75rem;
          background: var(--ivory-silk);
          border-right: 1.5px solid var(--soft-gold-line);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-shrink: 0;
        }
        @media (min-width: 480px) {
          .auth-input-prefix {
            padding: 0.85rem 0.95rem;
            gap: 0.45rem;
          }
        }
        .auth-input-field {
          flex: 1;
          min-width: 0;
          width: 100%;
          padding: 0.75rem 0.75rem;
          border: none;
          outline: none;
          font-size: 0.98rem;
          color: var(--ink-brown);
          box-sizing: border-box;
          background: transparent;
        }
        @media (min-width: 480px) {
          .auth-input-field {
            padding: 0.85rem 1rem;
            font-size: 1.05rem;
          }
        }
        .auth-pw-toggle-btn {
          background: none;
          border: none;
          padding: 0 0.85rem;
          cursor: pointer;
          color: var(--stone-taupe);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 150ms ease;
        }
        .auth-pw-toggle-btn:hover {
          color: var(--ink-brown);
        }
      `}</style>

      {/* CENTER HUB */}
      <div className="admin-center-hub">

        {/* Top Header Bar */}
        <div className="auth-top-header">
          {/* Logo + Administrative Portal Badge */}
          <div className="auth-logo-badge-wrap">
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }} aria-label="House of Gargi">
              <img
                src="/logo-images/new-logo.png"
                alt="House of Gargi"
                className="auth-logo-img"
              />
            </Link>

            <span className="auth-portal-badge">
              Admin Console
            </span>
          </div>

          {/* Back to Storefront */}
          <Link
            href="/"
            className="auth-back-link"
          >
            <ArrowLeft style={{ width: 13, height: 13 }} />
            <span className="auth-back-text-full">Back to Store</span>
            <span className="auth-back-text-short">Store</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="admin-card-container">

          {/* Left Column: Image with Royal Overlay */}
          <div className="admin-image-panel">
            <img
              src="/images/artisan-batik-card.jpg"
              alt="House of Gargi Executive Administration"
            />
            <div className="admin-image-overlay">
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#E4D3AE',
                marginBottom: '0.35rem',
                fontWeight: 500,
              }}>
                <ShieldCheck style={{ width: 15, height: 15 }} />
                Administrative Privilege
              </span>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.15rem, 3.5vw, 1.65rem)',
                margin: '0 0 0.35rem 0',
                color: '#FFFFFF',
                fontWeight: 600,
                lineHeight: 1.25,
              }}>
                Executive & Operations Command
              </h2>
              <p style={{
                fontSize: '0.82rem',
                color: '#D8C9B8',
                lineHeight: 1.4,
                margin: 0,
              }}>
                Dedicated gateway for catalog curation, revenue supervision, artisan onboarding, and platform governance.
              </p>
            </div>
          </div>

          {/* Right Column: Authentication Form */}
          <div className="admin-form-panel">
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '4px',
                background: '#FAF7F2',
                border: '1px solid #E4D3AE',
                color: '#7A2331',
                fontSize: '0.72rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.65rem',
              }}>
                <Lock style={{ width: 12, height: 12 }} />
                Administrator Access
              </div>

              <h1 className="auth-heading-title">
                Admin Sign In
              </h1>
              <p className="auth-heading-desc">
                Sign in with your administrative email and password to enter the command center.
              </p>
            </div>

            {error && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECDD3',
                color: '#7A2331',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                marginBottom: '1.25rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
              }}>
                <ShieldAlert style={{ width: 18, height: 18, flexShrink: 0, marginTop: '2px' }} />
                <span style={{ lineHeight: 1.45 }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-nav)',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--stone-taupe)',
                  marginBottom: '0.5rem',
                }}>
                  Administrator Email Address
                </label>

                <div className="auth-input-container">
                  <div className="auth-input-prefix" style={{ color: '#7A2331' }}>
                    <Mail style={{ width: 18, height: 18 }} />
                  </div>
                  <input
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gargisaha.com"
                    required
                    autoFocus
                    className="auth-input-field"
                    style={{
                      fontFamily: 'var(--font-sans)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-nav)',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--stone-taupe)',
                  marginBottom: '0.5rem',
                }}>
                  Administrative Password
                </label>

                <div className="auth-input-container">
                  <div className="auth-input-prefix" style={{ color: '#7A2331' }}>
                    <Lock style={{ width: 18, height: 18 }} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="auth-input-field"
                    style={{
                      fontFamily: 'var(--font-sans)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-pw-toggle-btn"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                  </button>
                </div>
              </div>

              <div style={{
                padding: '0.75rem 0.95rem',
                borderRadius: '6px',
                background: '#FAF7F2',
                border: '1px solid #E4D3AE',
                fontSize: '0.82rem',
                color: '#6B584E',
                lineHeight: 1.5,
              }}>
                <strong style={{ color: '#7A2331' }}>Access Notice:</strong> Only authorized House of Gargi administrators may sign in. Newly assigned accounts use default password <code>12345678</code>.
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim() || !password}
                style={{
                  width: '100%',
                  padding: '0.95rem 1.5rem',
                  borderRadius: '9px',
                  border: 'none',
                  background: (!loading && email.trim() && password) ? '#7A2331' : '#D6D3D1',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-nav)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: (!loading && email.trim() && password) ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  boxShadow: (!loading && email.trim() && password) ? '0 4px 14px rgba(122, 35, 49, 0.28)' : 'none',
                  transition: 'all 150ms ease',
                  marginTop: '0.5rem',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                    Authenticating Credentials...
                  </>
                ) : (
                  <>
                    <span>Sign In to Command Center</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Switch Link to Artisan Portal */}
            <div style={{
              marginTop: '2rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--soft-gold-line)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              fontSize: '0.88rem',
            }}>
              <div>
                <span style={{ color: 'var(--stone-taupe)' }}>Looking for the artisan workshop portal? </span>
                <Link
                  href="/seller/login"
                  style={{
                    color: '#7A2331',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Sign in to Artisan Portal &rarr;
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
