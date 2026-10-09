'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ArrowRight, ArrowLeft, Phone, Mail, Lock, Loader2, Check } from 'lucide-react';
import '@/seller.css';

function IndiaFlagIcon({ width = 24, height = 16 }: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        borderRadius: '3px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
        flexShrink: 0,
        display: 'inline-block',
        verticalAlign: 'middle',
        overflow: 'hidden',
      }}
    >
      <rect width="36" height="8" fill="#F97316" />
      <rect y="8" width="36" height="8" fill="#FFFFFF" />
      <rect y="16" width="36" height="8" fill="#16A34A" />
      <circle cx="18" cy="12" r="3.2" fill="none" stroke="#1E3A8A" strokeWidth="0.8" />
      <circle cx="18" cy="12" r="1.4" fill="#1E3A8A" />
    </svg>
  );
}

export default function SellerLoginPage() {
  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();

  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const checkCurrentSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/seller');
      }
    };
    checkCurrentSession();
  }, [router]);

  // Extract raw 10 digits
  const getCleanPhoneDigits = (raw: string) => {
    const numbersOnly = raw.replace(/D/g, '');
    if (numbersOnly.length === 10) return numbersOnly;
    if (numbersOnly.length >= 12 && numbersOnly.startsWith('91')) return numbersOnly.slice(2, 12);
    if (numbersOnly.length > 10) return numbersOnly.slice(-10);
    return numbersOnly;
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    const digits = inputVal.replace(/\D/g, '');
    
    // Always preserve +91 prefix
    let cleanDigits = digits;
    if (cleanDigits.startsWith('91')) {
      cleanDigits = cleanDigits.slice(2);
    }
    cleanDigits = cleanDigits.slice(0, 10);

    if (cleanDigits.length > 5) {
      setPhone(`+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`);
    } else if (cleanDigits.length > 0) {
      setPhone(`+91 ${cleanDigits}`);
    } else {
      setPhone('+91 ');
    }
  };

  const switchToPhone = () => {
    setAuthMode('phone');
    setPhone('+91 ');
    setError('');
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 50);
  };

  const switchToEmail = () => {
    setAuthMode('email');
    setError('');
    setTimeout(() => {
      emailInputRef.current?.focus();
    }, 50);
  };

  // 1. Phone OTP Dispatch
  const handleSendPhoneOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const targetDigits = getCleanPhoneDigits(phone);

    if (targetDigits.length < 10) {
      setError('Please enter your 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      let { error: otpErr } = await supabase.auth.signInWithOtp({
        phone: `+91${targetDigits}`,
      });

      if (otpErr && otpErr.message?.toLowerCase().includes('format')) {
        const intlRes = await supabase.auth.signInWithOtp({
          phone: targetDigits,
        });
        otpErr = intlRes.error;
      }

      if (otpErr) throw otpErr;

      setVerifiedPhone(targetDigits);
      setStep(2);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Unable to send OTP. Please check your phone number and try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Email Sign In
  const handleEmailSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      if (password.trim()) {
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (signInErr) throw signInErr;

        if (data?.session) {
          router.push('/seller');
          return;
        }
      } else {
        // Send OTP/Magic link to email if password is not provided
        const { error: otpErr } = await supabase.auth.signInWithOtp({
          email: email.trim(),
        });
        if (otpErr) throw otpErr;
        setSuccessMsg('A login link has been sent to your email. Please check your inbox.');
      }
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Handling
  const handleOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '');
    
    if (sanitized.length > 1) {
      const pastedChars = sanitized.slice(0, 6).split('');
      const newValues = [...otpValues];
      pastedChars.forEach((char, i) => {
        if (i < 6) newValues[i] = char;
      });
      setOtpValues(newValues);
      const nextFocus = Math.min(pastedChars.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    const newValues = [...otpValues];
    newValues[index] = sanitized;
    setOtpValues(newValues);

    if (sanitized && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const targetDigits = getCleanPhoneDigits(verifiedPhone || phone);
    const fullOtp = otpValues.join('');

    if (fullOtp.length < 6) {
      setError('Please enter all 6 digits of the OTP code.');
      return;
    }

    setLoading(true);

    try {
      let { data, error: verifyErr } = await supabase.auth.verifyOtp({
        phone: `+91${targetDigits}`,
        token: fullOtp,
        type: 'sms',
      });

      if (verifyErr && verifyErr.message?.toLowerCase().includes('invalid')) {
        const fallbackRes = await supabase.auth.verifyOtp({
          phone: targetDigits,
          token: fullOtp,
          type: 'sms',
        });
        if (!fallbackRes.error) {
          data = fallbackRes.data;
          verifyErr = null;
        }
      }

      if (verifyErr) throw verifyErr;

      if (data?.session) {
        router.push('/seller');
      } else {
        setError('Verification succeeded, but could not start session.');
      }
    } catch (err: any) {
      setError(err.message || 'The OTP code is invalid or has expired. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  const phoneDigits = getCleanPhoneDigits(phone);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url('/images/artisan-batik-card.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#FBF6EE',
      fontFamily: 'var(--font-sans)',
      color: 'var(--ink-brown)',
      padding: '2.5rem 1rem',
      overflowX: 'hidden',
    }}>
      {/* Background Soft Ivory Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(251, 246, 238, 0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      <style>{`
        .seller-center-hub {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 960px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: auto;
        }
        .seller-card-container {
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
          .seller-card-container {
            grid-template-columns: 1fr 1.15fr;
            align-items: stretch;
          }
        }
        .artisan-image-panel {
          width: 100%;
          height: 100%;
          min-height: 380px;
          background: #FBF6EE;
          display: block;
          position: relative;
        }
        @media (max-width: 767px) {
          .artisan-image-panel {
            min-height: 220px;
            max-height: 260px;
          }
        }
        .artisan-image-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .seller-form-panel {
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (min-width: 768px) {
          .seller-form-panel {
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
        .auth-switch-btn {
          background: none;
          border: none;
          color: #7A2331;
          font-family: var(--font-nav);
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 150ms ease;
        }
        .auth-switch-btn:hover {
          color: #5E1A25;
          text-decoration: underline;
        }
      `}</style>

      {/* CENTER HUB */}
      <div className="seller-center-hub">
        
        {/* Top Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 0.25rem',
        }}>
          {/* Official Logo + Artisan Portal Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }} aria-label="House of Gargi">
              <img
                src="/logo-images/new-logo.png"
                alt="House of Gargi"
                style={{ height: '46px', width: 'auto', display: 'block' }}
              />
            </Link>

            <span style={{
              fontSize: '0.82rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.4rem 0.9rem',
              borderRadius: '8px',
              background: '#FFFFFF',
              color: '#7A2331',
              border: '1.2px solid var(--soft-gold-line)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}>
              Artisan Portal
            </span>
          </div>

          {/* Back to Store */}
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
        <div className="seller-card-container">
          
          {/* Left Column: Image */}
          <div className="artisan-image-panel">
            <img
              src="/images/artisan-batik-card.jpg"
              alt="House of Gargi Artisans"
            />
          </div>

          {/* Right Column: Authentication Form */}
          <div className="seller-form-panel">
            <div>
              <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.1rem',
                fontWeight: 600,
                color: 'var(--ink-brown)',
                letterSpacing: '0.01em',
                lineHeight: 1.15,
                margin: 0,
              }}>
                Artisan Portal
              </h1>
              <p style={{
                fontSize: '0.96rem',
                color: 'var(--stone-taupe)',
                margin: '0.45rem 0 1.5rem 0',
                lineHeight: 1.5,
              }}>
                Sign in to manage your products, orders, and artisan account.
              </p>
            </div>

            {error && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECDD3',
                color: '#7A2331',
                padding: '0.75rem 0.95rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                marginBottom: '1.25rem',
                fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            {successMsg && (
              <div style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                color: '#166534',
                padding: '0.75rem 0.95rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                marginBottom: '1.25rem',
                fontWeight: 500,
              }}>
                {successMsg}
              </div>
            )}

            {step === 1 ? (
              <>
                {/* ── PHONE LOGIN MODE ── */}
                {authMode === 'phone' ? (
                  <form onSubmit={handleSendPhoneOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label style={{
                          fontSize: '0.82rem',
                          fontFamily: 'var(--font-nav)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          color: 'var(--stone-taupe)',
                        }}>
                          Phone Number
                        </label>
                        <button
                          type="button"
                          onClick={switchToEmail}
                          className="auth-switch-btn"
                        >
                          <Mail style={{ width: 14, height: 14 }} />
                          Use Email Address
                        </button>
                      </div>

                      {/* Phone Input with Indian Flag & Auto +91 */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1.5px solid var(--soft-gold-line)',
                        borderRadius: '9px',
                        background: '#FFFFFF',
                        overflow: 'hidden',
                        transition: 'border-color 150ms ease',
                      }}>
                        <div style={{
                          padding: '0.85rem 0.95rem',
                          background: 'var(--ivory-silk)',
                          borderRight: '1.5px solid var(--soft-gold-line)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          flexShrink: 0,
                        }}>
                          <IndiaFlagIcon width={24} height={16} />
                          <span style={{
                            fontSize: '0.95rem',
                            fontFamily: 'var(--font-nav)',
                            fontWeight: 700,
                            color: '#7A2331',
                          }}>
                            +91
                          </span>
                        </div>
                        <input
                          ref={phoneInputRef}
                          type="tel"
                          value={phone.replace(/^\+91\s*/, '')}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setPhone(`+91 ${digits}`);
                          }}
                          placeholder="Enter 10-digit number"
                          autoFocus
                          required
                          style={{
                            flex: 1,
                            padding: '0.85rem 1rem',
                            border: 'none',
                            outline: 'none',
                            fontSize: '1.05rem',
                            color: 'var(--ink-brown)',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.9rem',
                    }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: 'var(--stone-taupe)' }}>
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          style={{ accentColor: '#7A2331', cursor: 'pointer' }}
                        />
                        <span>Remember me</span>
                      </label>

                      <a
                        href="mailto:support@houseofgargi.com"
                        style={{ color: '#7A2331', textDecoration: 'none', fontWeight: 600 }}
                      >
                        Need help?
                      </a>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || phoneDigits.length < 10}
                      style={{
                        width: '100%',
                        background: phoneDigits.length === 10 ? '#7A2331' : '#D6D3D1',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '9px',
                        padding: '1rem',
                        fontSize: '0.98rem',
                        fontFamily: 'var(--font-nav)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        cursor: phoneDigits.length === 10 && !loading ? 'pointer' : 'not-allowed',
                        transition: 'all 200ms ease',
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                          Sending Code...
                        </>
                      ) : (
                        <>
                          Send OTP
                          <ArrowRight style={{ width: 15, height: 15 }} />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* ── EMAIL LOGIN MODE ── */
                  <form onSubmit={handleEmailSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label style={{
                          fontSize: '0.82rem',
                          fontFamily: 'var(--font-nav)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          color: 'var(--stone-taupe)',
                        }}>
                          Email Address
                        </label>
                        <button
                          type="button"
                          onClick={switchToPhone}
                          className="auth-switch-btn"
                        >
                          <Phone style={{ width: 14, height: 14 }} />
                          Use Phone Number
                        </button>
                      </div>

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
                        }}>
                          <Mail style={{ width: 16, height: 16, color: '#7A2331' }} />
                        </div>
                        <input
                          ref={emailInputRef}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="artisan@houseofgargi.com"
                          autoFocus
                          required
                          style={{
                            flex: 1,
                            padding: '0.85rem 1rem',
                            border: 'none',
                            outline: 'none',
                            fontSize: '1rem',
                            color: 'var(--ink-brown)',
                            fontWeight: 500,
                          }}
                        />
                      </div>
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
                        marginBottom: '0.5rem',
                      }}>
                        Password
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
                        }}>
                          <Lock style={{ width: 16, height: 16, color: '#7A2331' }} />
                        </div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          style={{
                            flex: 1,
                            padding: '0.85rem 1rem',
                            border: 'none',
                            outline: 'none',
                            fontSize: '1rem',
                            color: 'var(--ink-brown)',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.9rem',
                    }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: 'var(--stone-taupe)' }}>
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          style={{ accentColor: '#7A2331', cursor: 'pointer' }}
                        />
                        <span>Remember me</span>
                      </label>

                      <a
                        href="mailto:support@houseofgargi.com"
                        style={{ color: '#7A2331', textDecoration: 'none', fontWeight: 600 }}
                      >
                        Need help?
                      </a>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !email.trim() || !password.trim()}
                      style={{
                        width: '100%',
                        background: email.trim() && password.trim() ? '#7A2331' : '#D6D3D1',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '9px',
                        padding: '1rem',
                        fontSize: '0.98rem',
                        fontFamily: 'var(--font-nav)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        cursor: email.trim() && password.trim() && !loading ? 'pointer' : 'not-allowed',
                        transition: 'all 200ms ease',
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                          Signing In...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight style={{ width: 15, height: 15 }} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            ) : (
              /* ── STEP 2: ENTER OTP ── */
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-nav)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: 'var(--stone-taupe)',
                    }}>
                      Enter 6-Digit OTP Code
                    </label>
                    <button
                      type="button"
                      onClick={() => { setStep(1); setOtpValues(['', '', '', '', '', '']); }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '0.85rem',
                        color: '#7A2331',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Change Number
                    </button>
                  </div>

                  <div className="otp-boxes-grid">
                    {otpValues.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpInputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="otp-digit-box"
                        placeholder="·"
                      />
                    ))}
                  </div>

                  <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--stone-taupe)', marginTop: '0.5rem', textAlign: 'center', fontWeight: 500 }}>
                    Code sent to +91 {verifiedPhone}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpValues.join('').length < 6}
                  style={{
                    width: '100%',
                    background: otpValues.join('').length === 6 ? '#7A2331' : '#D6D3D1',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '9px',
                    padding: '1rem',
                    fontSize: '0.98rem',
                    fontFamily: 'var(--font-nav)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: otpValues.join('').length === 6 && !loading ? 'pointer' : 'not-allowed',
                    transition: 'all 200ms ease',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Check style={{ width: 16, height: 16 }} />
                      Verify &amp; Sign In
                    </>
                  )}
                </button>
              </form>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--stone-taupe)' }}>
              New artisan partner?{' '}
              <a href="mailto:artisan@houseofgargi.com" style={{ color: '#7A2331', fontWeight: 700, textDecoration: 'none' }}>
                Register here
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Made in India Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0.25rem 0.25rem 0',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: '#FFFFFF',
            border: '1.2px solid var(--soft-gold-line)',
            borderRadius: '9px',
            padding: '0.45rem 1.15rem',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
          }}>
            <span style={{
              fontFamily: "'Caveat', 'Kalam', cursive, sans-serif",
              fontSize: '1.45rem',
              fontWeight: 700,
              fontStyle: 'italic',
              color: 'var(--ink-brown)',
              lineHeight: 1.1,
            }}>
              Proudly Made in India
            </span>
            <IndiaFlagIcon width={24} height={16} />
          </div>
        </div>

      </div>
    </div>
  );
}
