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
  Check, 
  RotateCcw,
  Sparkles,
  Lock
} from 'lucide-react';
import '@/seller.css';

function sanitizeOtpError(msg?: string): string {
  if (!msg) return 'The OTP code is invalid or has expired. Please request a new OTP.';
  return msg
    .replace(/token has expired or is invalid/gi, 'OTP has expired or is invalid')
    .replace(/token/gi, 'OTP');
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<number>(0);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const router = useRouter();

  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  // Cooldown countdown for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // 1. Send OTP (Strictly for registered Admin or Super Admin emails)
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid administrator email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, portal: 'admin' }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Access restricted. This email is not registered as an Admin or Super Admin.');
      }

      setVerifiedEmail(cleanEmail);
      setVerificationToken(data.verificationToken || '');
      setExpiresAt(data.expiresAt || 0);
      setResendCooldown(60); // 60s cooldown
      setStep(2);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('admin_active_otp', JSON.stringify({
          email: cleanEmail,
          token: data.verificationToken,
          expiresAt: data.expiresAt,
        }));
      }

      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setError(err?.message || 'Access restricted. This email is not authorized for Administrative access.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading || !verifiedEmail) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifiedEmail, portal: 'admin' }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to resend code.');
      }

      setVerificationToken(data.verificationToken || '');
      setExpiresAt(data.expiresAt || 0);
      setResendCooldown(60);
      setOtpValues(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err?.message || 'Failed to resend access code.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP 6-box input
  const handleOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '').slice(-1);
    const newOtpValues = [...otpValues];
    newOtpValues[index] = sanitized;
    setOtpValues(newOtpValues);

    if (sanitized && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newValues = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newValues[i] = pasted[i];
    }
    setOtpValues(newValues);
    const focusIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  // 2. Verify OTP and route directly to right dashboard
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const fullOtp = otpValues.join('');

    if (fullOtp.length < 6) {
      setError('Please enter all 6 digits of the access code.');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = verifiedEmail.trim().toLowerCase();
      const activeToken = verificationToken || (typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('admin_active_otp') || '{}').token : '');
      const activeExpires = expiresAt || (typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('admin_active_otp') || '{}').expiresAt : 0);

      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          otp: fullOtp,
          verificationToken: activeToken,
          expiresAt: activeExpires,
          portal: 'admin',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'The access code is invalid or has expired.');
      }

      const userRole = data.user?.role;
      if (userRole !== 'super_admin' && userRole !== 'admin') {
        throw new Error('Access denied. This account does not possess Administrative authority.');
      }

      const sessionPayload = {
        email: cleanEmail,
        name: data.user?.name || cleanEmail.split('@')[0],
        role: userRole,
        token: activeToken,
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
      setError(sanitizeOtpError(err?.message));
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
      {/* Background Soft Ivory Overlay (Line art remains clearly visible) */}
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
          max-width: 960px;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin: auto;
          box-sizing: border-box;
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
          height: 46px;
          width: auto;
          display: block;
          max-width: 130px;
          object-fit: contain;
        }
        .auth-portal-badge {
          font-size: 0.68rem;
          font-family: var(--font-nav);
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.22rem 0.5rem;
          border-radius: 9999px;
          background: #FFFFFF;
          color: #7A2331;
          border: 1px solid var(--soft-gold-line);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          line-height: 1;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .auth-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.42rem 0.75rem;
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
            height: 56px;
          }
          .auth-logo-badge-wrap {
            gap: 0.75rem;
          }
          .auth-portal-badge {
            font-size: 0.72rem;
            padding: 0.26rem 0.65rem;
          }
          .auth-back-link {
            padding: 0.5rem 0.95rem;
            font-size: 0.84rem;
          }
        }
        @media (min-width: 768px) {
          .auth-logo-img {
            height: 64px;
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
          width: 100%;
          height: 100%;
          min-height: 180px;
          max-height: 220px;
          background: #231812;
          display: block;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .admin-image-panel {
            min-height: 400px;
            max-height: none;
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
          padding: 1.5rem 1.15rem;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (min-width: 480px) {
          .admin-form-panel {
            padding: 2rem 1.75rem;
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
        .otp-boxes-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.35rem;
          width: 100%;
          box-sizing: border-box;
        }
        @media (min-width: 480px) {
          .otp-boxes-grid {
            gap: 0.5rem;
          }
        }
        .otp-digit-box {
          width: 100%;
          height: 46px;
          text-align: center;
          font-size: 1.2rem;
          font-weight: 500;
          font-family: var(--font-sans);
          color: var(--ink-brown);
          border: 1.5px solid var(--soft-gold-line);
          border-radius: 8px;
          background: #FFFFFF;
          outline: none;
          padding: 0;
          box-sizing: border-box;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }
        @media (min-width: 480px) {
          .otp-digit-box {
            height: 52px;
            font-size: 1.35rem;
          }
        }
        .otp-digit-box:focus {
          border-color: var(--maharani-maroon);
          box-shadow: 0 0 0 3px rgba(122, 35, 49, 0.12);
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
                Strict Access Portal
              </div>

              <h1 className="auth-heading-title">
                Admin Sign In
              </h1>
              <p className="auth-heading-desc">
                Sign in with OTP. Access codes are strictly dispatched to registered Admin and Super Admin accounts.
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

            {step === 1 ? (
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
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
                      placeholder="Enter your administrative email"
                      required
                      autoFocus
                      className="auth-input-field"
                      style={{
                        fontFamily: 'var(--font-sans)',
                      }}
                    />
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
                  <strong style={{ color: '#7A2331' }}>Security Verification:</strong> If this email address is not actively registered with Admin or Super Admin privileges, an access code will <em>not</em> be dispatched.
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim() || !email.includes('@')}
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.5rem',
                    borderRadius: '9px',
                    border: 'none',
                    background: (!loading && email.trim() && email.includes('@')) ? '#7A2331' : '#D6D3D1',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-nav)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: (!loading && email.trim() && email.includes('@')) ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.55rem',
                    boxShadow: (!loading && email.trim() && email.includes('@')) ? '0 4px 14px rgba(122, 35, 49, 0.28)' : 'none',
                    transition: 'all 150ms ease',
                    marginTop: '0.5rem',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                      Verifying Privilege...
                    </>
                  ) : (
                    <>
                      <span>Send Administrator Code</span>
                      <ArrowRight style={{ width: 16, height: 16 }} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{
                  background: 'var(--ivory-silk)',
                  border: '1px solid var(--soft-gold-line)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--stone-taupe)' }}>
                      Access Code Sent To:
                    </span>
                    <div style={{ fontWeight: 700, color: '#7A2331', fontSize: '0.95rem' }}>
                      {verifiedEmail}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError('');
                      setOtpValues(['', '', '', '', '', '']);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--stone-taupe)',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    Change Email
                  </button>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-nav)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--stone-taupe)',
                    marginBottom: '0.65rem',
                  }}>
                    Enter 6-Digit Code
                  </label>

                  <div className="otp-boxes-grid" onPaste={handleOtpPaste}>
                    {otpValues.map((val, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpInputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                        maxLength={6}
                        value={val}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        onFocus={(e) => e.target.select()}
                        className="otp-digit-box"
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                }}>
                  <span style={{ color: 'var(--stone-taupe)' }}>
                    Didn't receive code?
                  </span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || loading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: resendCooldown > 0 ? 'var(--stone-taupe)' : '#7A2331',
                      fontWeight: 700,
                      cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: 0,
                    }}
                  >
                    <RotateCcw style={{ width: 14, height: 14 }} />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpValues.join('').length < 6}
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.5rem',
                    borderRadius: '9px',
                    border: 'none',
                    background: otpValues.join('').length === 6 ? '#7A2331' : '#D6D3D1',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-nav)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: otpValues.join('').length === 6 && !loading ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.55rem',
                    boxShadow: otpValues.join('').length === 6 ? '0 4px 14px rgba(122, 35, 49, 0.28)' : 'none',
                    transition: 'all 150ms ease',
                    marginTop: '0.5rem',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                      Verifying Credentials...
                    </>
                  ) : (
                    <>
                      <span>Enter Admin Console</span>
                      <ArrowRight style={{ width: 16, height: 16 }} />
                    </>
                  )}
                </button>
              </form>
            )}

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
