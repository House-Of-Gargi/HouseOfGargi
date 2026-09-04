'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { ArrowRight, ShieldCheck, Phone, KeyRound, Loader2, Sparkles } from 'lucide-react';
import '@/seller.css';

export default function SellerLoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState('');
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
      setError(err.message || 'Failed to dispatch security code. Please verify credentials.');
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--ivory-silk)',
      padding: '1.5rem',
      fontFamily: 'var(--font-sans)'
    }}>
      <div style={{
        background: 'var(--pure-white)',
        borderRadius: '4px',
        border: '1px solid var(--soft-gold-line)',
        boxShadow: '0 12px 36px rgba(43, 31, 24, 0.06)',
        width: '100%',
        maxWidth: '420px',
        padding: '2.5rem 2.25rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Heritage Gold/Maroon Accent Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, var(--maharani-maroon), var(--gargi-gold), var(--maharani-maroon))'
        }} />

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '4px',
            background: 'var(--maharani-maroon)',
            border: '1px solid var(--gargi-gold)',
            color: 'var(--ivory-silk)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-nav)',
            fontSize: '1.1rem',
            fontWeight: 700,
            letterSpacing: '1px',
            marginBottom: '1rem'
          }}>
            HG
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.75rem',
            fontWeight: 600,
            color: 'var(--ink-brown)',
            letterSpacing: '0.01em',
            margin: '0 0 0.35rem 0'
          }}>
            Atelier Seller Portal
          </h1>
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--stone-taupe)',
            margin: 0,
            fontWeight: 400
          }}>
            House of Gargi &bull; Artisan &amp; Couture Atelier Access
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECDD3',
            color: 'var(--maharani-maroon)',
            padding: '0.75rem 1rem',
            borderRadius: '2px',
            fontSize: '0.78rem',
            marginBottom: '1.5rem',
            fontWeight: 500,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-nav)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--stone-taupe)',
                marginBottom: '0.5rem'
              }}>
                Registered Phone Number
              </label>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--soft-gold-line)',
                borderRadius: '2px',
                background: 'var(--pure-white)',
                overflow: 'hidden'
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
                  color: 'var(--maharani-maroon)'
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
                    padding: '0.75rem 1rem',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: 'var(--ink-brown)',
                    fontWeight: 600,
                    letterSpacing: '0.04em'
                  }}
                />
              </div>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--stone-taupe)', marginTop: '0.4rem' }}>
                Secure OTP verification powered by Supabase Auth
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              style={{
                width: '100%',
                background: phone.length === 10 ? 'var(--maharani-maroon)' : '#D6D3D1',
                color: 'var(--ivory-silk)',
                border: 'none',
                borderRadius: '2px',
                padding: '0.9rem',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-nav)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: phone.length === 10 && !loading ? 'pointer' : 'not-allowed',
                transition: 'background 200ms ease',
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                  Dispatching Code...
                </>
              ) : (
                <>
                  Request Atelier OTP
                  <ArrowRight style={{ width: 15, height: 15 }} />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <label style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-nav)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--stone-taupe)'
                }}>
                  Enter 6-Digit Code
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
                    textDecoration: 'underline'
                  }}
                >
                  Change Number
                </button>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--soft-gold-line)',
                borderRadius: '2px',
                background: 'var(--pure-white)',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '0.75rem 0.85rem',
                  background: 'var(--ivory-silk)',
                  borderRight: '1px solid var(--soft-gold-line)',
                  color: 'var(--maharani-maroon)'
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
                    padding: '0.75rem 1rem',
                    border: 'none',
                    outline: 'none',
                    fontSize: '1.2rem',
                    color: 'var(--ink-brown)',
                    fontWeight: 700,
                    letterSpacing: '0.35em',
                    textAlign: 'center'
                  }}
                />
              </div>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--stone-taupe)', marginTop: '0.4rem', textAlign: 'center' }}>
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
                borderRadius: '2px',
                padding: '0.9rem',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-nav)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: otp.length === 6 && !loading ? 'pointer' : 'not-allowed',
                transition: 'background 200ms ease',
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                  Verifying Session...
                </>
              ) : (
                <>
                  <ShieldCheck style={{ width: 16, height: 16 }} />
                  Verify &amp; Access Atelier
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Security Badge */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--soft-gold-line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          color: 'var(--stone-taupe)',
          fontSize: '0.75rem'
        }}>
          <Sparkles style={{ width: 13, height: 13, color: 'var(--gargi-gold)' }} />
          <span>Exclusive to verified House of Gargi artisans &amp; sellers</span>
        </div>
      </div>
    </div>
  );
}
