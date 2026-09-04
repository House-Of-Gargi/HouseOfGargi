'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ArrowRight, ArrowLeft, Phone, KeyRound, Loader2, Sparkles, Check } from 'lucide-react';
import '@/seller.css';

export default function SellerLoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();

  // If already logged in, redirect directly to dashboard
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
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch verification code. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const targetPhone = cleanPhoneNumber(verifiedPhone || phone);

    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      let { data, error: verifyErr } = await supabase.auth.verifyOtp({
        phone: targetPhone,
        token: otp,
        type: 'sms',
      });

      if (verifyErr && verifyErr.message?.toLowerCase().includes('invalid')) {
        const intlRes = await supabase.auth.verifyOtp({
          phone: `+91${targetPhone}`,
          token: otp,
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
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundImage: `url('/images/atelier-lineart-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#FBF6EE',
      fontFamily: 'var(--font-sans)',
      color: 'var(--ink-brown)',
      overflowX: 'hidden',
    }}>
      {/* Subtle Warm Ivory Lightening Veil */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(251, 246, 238, 0.42)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* ========================================================= */}
      {/* 1. TOP HEADER BAR                                         */}
      {/* ========================================================= */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo & Hub Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'var(--maharani-maroon)',
              color: 'var(--ivory-silk)',
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(122, 35, 49, 0.25)',
              border: '1px solid var(--gargi-gold)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              lineHeight: 1,
            }}>
              House of Gargi
            </span>
          </Link>

          <span style={{
            fontSize: '0.65rem',
            fontFamily: 'var(--font-nav)',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            background: 'var(--pure-white)',
            color: 'var(--stone-taupe)',
            border: '1px solid var(--soft-gold-line)',
            boxShadow: '0 1px 3px rgba(43, 31, 24, 0.04)',
          }}>
            Seller Portal
          </span>
        </div>

        {/* Back to Boutique Button */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.85rem',
            borderRadius: '8px',
            background: 'var(--pure-white)',
            border: '1px solid var(--soft-gold-line)',
            color: 'var(--ink-brown)',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-nav)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            textDecoration: 'none',
            boxShadow: '0 1px 4px rgba(43, 31, 24, 0.05)',
            transition: 'all 200ms ease',
          }}
        >
          <ArrowLeft style={{ width: 14, height: 14 }} />
          Back to Boutique
        </Link>
      </header>

      {/* ========================================================= */}
      {/* 2. CENTERED 2-COLUMN LUXURY LOGIN MODAL                   */}
      {/* ========================================================= */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem 1.5rem',
        margin: 'auto 0',
      }}>
        <div style={{
          background: 'var(--pure-white)',
          borderRadius: '20px',
          border: '1px solid rgba(228, 211, 174, 0.8)',
          boxShadow: '0 25px 60px -15px rgba(43, 31, 24, 0.18)',
          width: '100%',
          maxWidth: '860px',
          padding: '1.75rem',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
        }}>
          {/* Responsive 2-column on desktop (styled via inline style on wrapper) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }} className="seller-login-grid-wrapper">
            
            <style>{`
              @media (min-width: 768px) {
                .seller-login-grid-wrapper {
                  display: grid !important;
                  grid-template-columns: 1fr 1.05fr !important;
                  align-items: center !important;
                  gap: 2rem !important;
                }
              }
            `}</style>

            {/* Left Column: Vintage Indian Artisan Editorial Woodcut Illustration */}
            <div style={{
              width: '100%',
              height: '100%',
              minHeight: '340px',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid var(--soft-gold-line)',
              boxShadow: '0 4px 16px rgba(43, 31, 24, 0.06)',
              position: 'relative',
              background: '#FBF6EE',
            }}>
              <img
                src="/images/artisan-batik-card.jpg"
                alt="House of Gargi Master Artisans at Work"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            {/* Right Column: Clean Luxury Authentication Form */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0.5rem 0.75rem',
            }}>
              <div>
                <h1 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: 'var(--ink-brown)',
                  letterSpacing: '0.01em',
                  lineHeight: 1.15,
                  margin: 0,
                }}>
                  Atelier Seller Portal
                </h1>
                <p style={{
                  fontSize: '0.82rem',
                  color: 'var(--stone-taupe)',
                  margin: '0.45rem 0 1.5rem 0',
                  lineHeight: 1.5,
                }}>
                  Sign in with your registered phone number to manage handcrafted couture orders and loom inventory.
                </p>
              </div>

              {error && (
                <div style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECDD3',
                  color: 'var(--maharani-maroon)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  marginBottom: '1.25rem',
                  fontWeight: 500,
                }}>
                  {error}
                </div>
              )}

              {step === 1 ? (
                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-nav)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: 'var(--stone-taupe)',
                      marginBottom: '0.45rem',
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
                      transition: 'border-color 150ms ease',
                    }}>
                      <div style={{
                        padding: '0.75rem 0.85rem',
                        background: 'var(--ivory-silk)',
                        borderRight: '1px solid var(--soft-gold-line)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-nav)',
                        fontWeight: 700,
                        color: 'var(--maharani-maroon)',
                      }}>
                        <Phone style={{ width: 14, height: 14 }} />
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
                          padding: '0.75rem 0.85rem',
                          border: 'none',
                          outline: 'none',
                          fontSize: '0.95rem',
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
                    fontSize: '0.78rem',
                  }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: 'var(--stone-taupe)' }}>
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
                      style={{ color: 'var(--maharani-maroon)', textDecoration: 'none', fontWeight: 600, fontSize: '0.75rem' }}
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
                      padding: '0.85rem',
                      fontSize: '0.85rem',
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
                        Sign In with Atelier OTP
                        <ArrowRight style={{ width: 15, height: 15 }} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                      <label style={{
                        fontSize: '0.7rem',
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
                        onClick={() => { setStep(1); setOtp(''); }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          fontSize: '0.72rem',
                          color: 'var(--maharani-maroon)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Change Number
                      </button>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--soft-gold-line)',
                      borderRadius: '8px',
                      background: '#FFFFFF',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        padding: '0.75rem 0.85rem',
                        background: 'var(--ivory-silk)',
                        borderRight: '1px solid var(--soft-gold-line)',
                        color: 'var(--maharani-maroon)',
                      }}>
                        <KeyRound style={{ width: 16, height: 16 }} />
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        autoFocus
                        required
                        style={{
                          flex: 1,
                          padding: '0.75rem 0.85rem',
                          border: 'none',
                          outline: 'none',
                          fontSize: '1.25rem',
                          color: 'var(--ink-brown)',
                          fontWeight: 700,
                          letterSpacing: '0.3em',
                          textAlign: 'center',
                        }}
                      />
                    </div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--stone-taupe)', marginTop: '0.35rem', textAlign: 'center' }}>
                      Verification code sent to +91 {verifiedPhone}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    style={{
                      width: '100%',
                      background: otp.length === 6 ? 'var(--maharani-maroon)' : '#D6D3D1',
                      color: 'var(--ivory-silk)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.85rem',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-nav)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      cursor: otp.length === 6 && !loading ? 'pointer' : 'not-allowed',
                      boxShadow: otp.length === 6 ? '0 4px 14px rgba(122, 35, 49, 0.25)' : 'none',
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                        Verifying Session...
                      </>
                    ) : (
                      <>
                        <Check style={{ width: 16, height: 16 }} />
                        Verify &amp; Enter Atelier
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Subtext info */}
              <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--stone-taupe)' }}>
                Need artisan partner onboarding?{' '}
                <a href="mailto:support@houseofgargi.com" style={{ color: 'var(--maharani-maroon)', fontWeight: 700, textDecoration: 'none' }}>
                  Request Atelier Registration
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* 3. BOTTOM FOOTER BAR                                      */}
      {/* ========================================================= */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '1.25rem 2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Bottom Left: Indian Flag + Proudly Made in India in black font style */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.95rem',
          fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
          fontStyle: 'italic',
          fontWeight: 700,
          color: '#111827',
          letterSpacing: '0.02em',
        }}>
          <span style={{ fontSize: '1.15rem', fontStyle: 'normal' }}>🇮🇳</span>
          <span>Proudly Made in India</span>
        </div>

        {/* Center / Right: Links & Copyright */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          fontSize: '0.72rem',
          color: 'var(--stone-taupe)',
          fontFamily: 'var(--font-sans)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/privacy" style={{ color: 'var(--stone-taupe)', textDecoration: 'none' }}>Privacy</Link>
            <span>&bull;</span>
            <Link href="/terms" style={{ color: 'var(--stone-taupe)', textDecoration: 'none' }}>Terms</Link>
            <span>&bull;</span>
            <Link href="/faq" style={{ color: 'var(--stone-taupe)', textDecoration: 'none' }}>Security</Link>
          </div>
          <span style={{ display: 'none' }} className="copyright-desktop">
            &copy; 2026 House of Gargi. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
