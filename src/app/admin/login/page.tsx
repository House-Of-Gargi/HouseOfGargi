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
    <div style={{
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
      padding: '2.5rem 1rem',
      overflowX: 'hidden',
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
        .admin-center-hub {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 960px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: auto;
        }
        .admin-card-container {
          background: #FFFFFF;
          border-radius: 12px;
          border: 1px solid var(--soft-gold-line);
          box-shadow: 0 20px 48px -10px rgba(43, 31, 24, 0.12);
          width: 100%;
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
          min-height: 400px;
          background: #231812;
          display: block;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 767px) {
          .admin-image-panel {
            min-height: 220px;
            max-height: 260px;
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
          background: linear-gradient(180deg, rgba(35, 24, 18, 0.4) 0%, rgba(35, 24, 18, 0.85) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 2.25rem 2rem;
          color: #FAF7F2;
        }
        .admin-form-panel {
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (min-width: 768px) {
          .admin-form-panel {
            padding: 3rem 2.5rem;
          }
        }
        .otp-boxes-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.5rem;
        }
        .otp-digit-box {
          width: 100%;
          height: 52px;
          text-align: center;
          font-size: 1.35rem;
          font-weight: 700;
          font-family: var(--font-sans);
          color: var(--ink-brown);
          border: 1.5px solid var(--soft-gold-line);
          border-radius: 8px;
          background: #FFFFFF;
          outline: none;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }
        .otp-digit-box:focus {
          border-color: var(--maharani-maroon);
          box-shadow: 0 0 0 3px rgba(122, 35, 49, 0.12);
        }
      `}</style>

      {/* CENTER HUB */}
      <div className="admin-center-hub">
        
        {/* Top Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 0.25rem',
        }}>
          {/* Logo + Administrative Portal Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }} aria-label="House of Gargi">
              <img
                src="/logo-images/new-logo.png"
                alt="House of Gargi"
                style={{ height: '66px', width: 'auto', display: 'block' }}
              />
            </Link>

            <span style={{
              fontSize: '0.72rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.26rem 0.65rem',
              borderRadius: '9999px',
              background: '#FFFFFF',
              color: '#7A2331',
              border: '1px solid var(--soft-gold-line)',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
              lineHeight: 1,
            }}>
              Administration Console
            </span>
          </div>

          {/* Back to Storefront */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              background: '#FFFFFF',
              border: '1.2px solid var(--soft-gold-line)',
              color: 'var(--ink-brown)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 200ms ease',
            }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            Back to Store
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
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#E4D3AE',
                marginBottom: '0.5rem',
                fontWeight: 700,
              }}>
                <ShieldCheck style={{ width: 16, height: 16 }} />
                Administrative Privilege
              </span>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.65rem',
                margin: '0 0 0.5rem 0',
                color: '#FFFFFF',
                fontWeight: 600,
                lineHeight: 1.25,
              }}>
                Executive & Operations Command
              </h2>
              <p style={{
                fontSize: '0.86rem',
                color: '#D8C9B8',
                lineHeight: 1.5,
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
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem',
              }}>
                <Lock style={{ width: 12, height: 12 }} />
                Strict Access Portal
              </div>

              <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.1rem',
                fontWeight: 600,
                color: 'var(--ink-brown)',
                letterSpacing: '0.01em',
                lineHeight: 1.15,
                margin: 0,
              }}>
                Admin Sign In
              </h1>
              <p style={{
                fontSize: '0.96rem',
                color: 'var(--stone-taupe)',
                margin: '0.45rem 0 1.25rem 0',
                lineHeight: 1.5,
              }}>
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
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--stone-taupe)',
                    marginBottom: '0.5rem',
                  }}>
                    Administrator Email Address
                  </label>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1.5px solid var(--soft-gold-line)',
                    borderRadius: '9px',
                    background: '#FFFFFF',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      padding: '0.85rem 0.95rem',
                      background: 'var(--ivory-silk)',
                      borderRight: '1.5px solid var(--soft-gold-line)',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#7A2331',
                    }}>
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
                      style={{
                        flex: 1,
                        padding: '0.85rem 1rem',
                        fontSize: '0.98rem',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--ink-brown)',
                        background: 'transparent',
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
