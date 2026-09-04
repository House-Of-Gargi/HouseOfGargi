'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ArrowRight, ArrowLeft, Phone, Loader2, Check } from 'lucide-react';
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
      {/* Central Navy Chakra disc & ring */}
      <circle cx="18" cy="12" r="3.2" fill="none" stroke="#1E3A8A" strokeWidth="0.8" />
      <circle cx="18" cy="12" r="1.4" fill="#1E3A8A" />
    </svg>
  );
}

export default function SellerLoginPage() {
  const [phone, setPhone] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();

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

  const cleanPhoneNumber = (input: string) => {
    const digits = input.replace(/\D/g, '');
    if (digits.length === 10) return digits;
    if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
    return digits;
  };

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const targetPhone = cleanPhoneNumber(phone);

    if (targetPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      let { error: otpErr } = await supabase.auth.signInWithOtp({
        phone: targetPhone,
      });

      if (otpErr && otpErr.message?.toLowerCase().includes('format')) {
        const intlRes = await supabase.auth.signInWithOtp({
          phone: `+91${targetPhone}`,
        });
        otpErr = intlRes.error;
      }

      if (otpErr) throw otpErr;

      setVerifiedPhone(targetPhone);
      setStep(2);
      // Focus first OTP box
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch verification code. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '');
    
    // Handle paste of multiple digits
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

    // Auto advance on input
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
    const targetPhone = cleanPhoneNumber(verifiedPhone || phone);
    const fullOtp = otpValues.join('');

    if (fullOtp.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setLoading(true);

    try {
      let { data, error: verifyErr } = await supabase.auth.verifyOtp({
        phone: targetPhone,
        token: fullOtp,
        type: 'sms',
      });

      if (verifyErr && verifyErr.message?.toLowerCase().includes('invalid')) {
        const intlRes = await supabase.auth.verifyOtp({
          phone: `+91${targetPhone}`,
          token: fullOtp,
          type: 'sms',
        });
        if (!intlRes.error) {
          data = intlRes.data;
          verifyErr = null;
        }
      }

      if (verifyErr) throw verifyErr;

      if (data?.session) {
        router.push('/seller');
      } else {
        setError('Verification succeeded, but session could not be established.');
      }
    } catch (err: any) {
      setError(err.message || 'The verification code entered is invalid or has expired.');
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
      padding: '2rem 1rem',
      overflowX: 'hidden',
    }}>
      {/* Subtle Warm Ivory Lightening Veil */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(251, 246, 238, 0.45)',
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
          gap: 0.9rem;
          margin: auto;
        }
        .seller-card-container {
          background: var(--pure-white);
          border-radius: 16px;
          border: 1.5px solid #111827;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.18), 0 10px 20px -10px rgba(0, 0, 0, 0.1);
          width: 100%;
          padding: 0;
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
        }
        @media (max-width: 767px) {
          .artisan-image-panel {
            min-height: 240px;
            max-height: 280px;
          }
        }
        .artisan-image-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .seller-form-panel {
          padding: 2.25rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (min-width: 768px) {
          .seller-form-panel {
            padding: 2.75rem 2.5rem;
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

      {/* ========================================================= */}
      {/* CENTER HUB CONTAINER                                      */}
      {/* ========================================================= */}
      <div className="seller-center-hub">
        
        {/* 1. TOP BAR (Corner elements directly above the card) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 0.15rem',
        }}>
          {/* Top Left: Brand Logo + Seller Portal Pill with slim black outline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Link
              href="/"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--maharani-maroon)',
                color: 'var(--ivory-silk)',
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                border: '1.2px solid #111827',
                boxShadow: '0 2px 8px rgba(122, 35, 49, 0.25)',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.2rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                lineHeight: 1,
              }}>
                House of Gargi
              </span>
            </Link>

            <span style={{
              fontSize: '0.82rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              background: 'var(--pure-white)',
              color: 'var(--stone-taupe)',
              border: '1.2px solid #111827',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
            }}>
              Seller Portal
            </span>
          </div>

          {/* Top Right: Back to Boutique Button with slim black outline */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              background: 'var(--pure-white)',
              border: '1.2px solid #111827',
              color: 'var(--ink-brown)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
            }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            Back to Boutique
          </Link>
        </div>

        {/* 2. MAIN LOGIN MODAL CARD (Zero white border around image) */}
        <div className="seller-card-container">
          
          {/* Left Column: Image flush with card edges */}
          <div className="artisan-image-panel">
            <img
              src="/images/artisan-batik-card.jpg"
              alt="House of Gargi Master Artisans at Work"
            />
          </div>

          {/* Right Column: Clean Luxury Authentication Form */}
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
                Atelier Seller Portal
              </h1>
              <p style={{
                fontSize: '0.98rem',
                color: 'var(--stone-taupe)',
                margin: '0.45rem 0 1.5rem 0',
                lineHeight: 1.55,
              }}>
                Sign in with your registered phone number to manage handcrafted couture orders and loom inventory.
              </p>
            </div>

            {error && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECDD3',
                color: 'var(--maharani-maroon)',
                padding: '0.75rem 0.95rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                marginBottom: '1.25rem',
                fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-nav)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'var(--stone-taupe)',
                    marginBottom: '0.5rem',
                  }}>
                    Registered Phone Number
                  </label>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--soft-gold-line)',
                    borderRadius: '8px',
                    background: '#FFFFFF',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      padding: '0.8rem 0.95rem',
                      background: 'var(--ivory-silk)',
                      borderRight: '1px solid var(--soft-gold-line)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-nav)',
                      fontWeight: 700,
                      color: 'var(--maharani-maroon)',
                    }}>
                      <Phone style={{ width: 15, height: 15 }} />
                      +91
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10-digit number"
                      autoFocus
                      required
                      style={{
                        flex: 1,
                        padding: '0.8rem 1rem',
                        border: 'none',
                        outline: 'none',
                        fontSize: '1rem',
                        color: 'var(--ink-brown)',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                      }}
                    />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.92rem',
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: 'var(--stone-taupe)', fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: 'var(--maharani-maroon)', cursor: 'pointer' }}
                    />
                    <span>Keep me signed in</span>
                  </label>

                  <a
                    href="mailto:artisan@houseofgargi.com"
                    style={{ color: 'var(--maharani-maroon)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}
                  >
                    Need assistance?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading || phone.length < 10}
                  style={{
                    width: '100%',
                    background: phone.length === 10 ? 'var(--maharani-maroon)' : '#D6D3D1',
                    color: 'var(--ivory-silk)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.95rem',
                    fontSize: '0.98rem',
                    fontFamily: 'var(--font-nav)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: phone.length === 10 && !loading ? 'pointer' : 'not-allowed',
                    boxShadow: phone.length === 10 ? '0 4px 14px rgba(122, 35, 49, 0.25)' : 'none',
                    transition: 'all 200ms ease',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                      Dispatching Code...
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
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-nav)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
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
                        color: 'var(--maharani-maroon)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Change Number
                    </button>
                  </div>

                  {/* Sleek 6-Digit Segmented OTP Input Grid */}
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
                    background: otpValues.join('').length === 6 ? 'var(--maharani-maroon)' : '#D6D3D1',
                    color: 'var(--ivory-silk)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.95rem',
                    fontSize: '0.98rem',
                    fontFamily: 'var(--font-nav)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: otpValues.join('').length === 6 && !loading ? 'pointer' : 'not-allowed',
                    boxShadow: otpValues.join('').length === 6 ? '0 4px 14px rgba(122, 35, 49, 0.25)' : 'none',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                      Verifying Code...
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
              Need artisan partner onboarding?{' '}
              <a href="mailto:support@houseofgargi.com" style={{ color: 'var(--maharani-maroon)', fontWeight: 700, textDecoration: 'none' }}>
                Request Atelier Registration
              </a>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM BAR (Corner element directly below the card) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0.25rem 0.15rem 0',
        }}>
          {/* Bottom Left: White pill with slim black outline for Proudly Made in India + Flag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'var(--pure-white)',
            border: '1.2px solid #111827',
            borderRadius: '9999px',
            padding: '0.35rem 1.15rem',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
          }}>
            <span style={{
              fontFamily: "'Caveat', 'Kalam', cursive, sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              fontStyle: 'italic',
              color: '#000000',
              letterSpacing: '0.02em',
              lineHeight: 1.1,
              display: 'inline-block',
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
