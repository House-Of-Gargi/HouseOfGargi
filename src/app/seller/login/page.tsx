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
    // If standard 10 digit Indian mobile number, return clean 10 digits
    if (digits.length === 10) return digits;
    // If entered with 91 prefix (12 digits), strip country code for Supabase test phone match
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
      // First try configured test number format (10 digits)
      let { error: otpErr } = await supabase.auth.signInWithOtp({
        phone: targetPhone,
      });

      // If Supabase expects international format (+91), try fallback
      if (otpErr && otpErr.message?.toLowerCase().includes('format')) {
        const intlRes = await supabase.auth.signInWithOtp({
          phone: `+91${targetPhone}`,
        });
        otpErr = intlRes.error;
      }

      if (otpErr) {
        throw otpErr;
      }

      setVerifiedPhone(targetPhone);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch security code. Please check your connection.');
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
      // Authenticate natively with Supabase Auth
      let { data, error: verifyErr } = await supabase.auth.verifyOtp({
        phone: targetPhone,
        token: otp,
        type: 'sms',
      });

      // If first attempt fails, attempt with +91 international prefix
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

      if (verifyErr) {
        throw verifyErr;
      }

      if (data?.session) {
        router.push('/seller');
      } else {
        setError('Verification successful, but session could not be established.');
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
      backgroundColor: '#FAFAF8',
      padding: '1.5rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '1.25rem',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        width: '100%',
        maxWidth: '440px',
        padding: '2.25rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Brand Accent Bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #3A3564, #B38E5D, #3A3564)'
        }} />

        {/* Header Badge */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: '#3A3564',
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.15rem',
            fontWeight: 800,
            boxShadow: '0 4px 14px rgba(58,53,100,0.25)',
            marginBottom: '1rem'
          }}>
            HG
          </div>
          <h1 style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            margin: '0 0 0.35rem 0'
          }}>
            Atelier Seller Portal
          </h1>
          <p style={{
            fontSize: '0.8rem',
            color: '#64748B',
            margin: 0,
            fontWeight: 500
          }}>
            House of Gargi Luxury Handloom & Artisan Management
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.8rem',
            marginBottom: '1.25rem',
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
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#475569',
                marginBottom: '0.5rem'
              }}>
                Registered Artisan Phone
              </label>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '10px',
                background: '#FFFFFF',
                overflow: 'hidden',
                transition: 'border-color 150ms ease'
              }}>
                <div style={{
                  padding: '0.75rem 0.85rem',
                  background: '#FAF7F0',
                  borderRight: '1px solid rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#3A3564'
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
                    color: '#0F172A',
                    fontWeight: 600,
                    letterSpacing: '0.02em'
                  }}
                />
              </div>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.4rem' }}>
                Secure OTP verification powered by Supabase Auth
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              style={{
                width: '100%',
                background: phone.length === 10 ? '#3A3564' : '#94A3B8',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '0.85rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: phone.length === 10 && !loading ? 'pointer' : 'not-allowed',
                transition: 'background 180ms ease, transform 180ms ease',
                boxShadow: phone.length === 10 ? '0 4px 12px rgba(58,53,100,0.2)' : 'none'
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                  Sending Security Code...
                </>
              ) : (
                <>
                  Request Atelier OTP
                  <ArrowRight style={{ width: 16, height: 16 }} />
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
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#475569'
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
                    color: '#3A3564',
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
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '10px',
                background: '#FFFFFF',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '0.75rem 0.85rem',
                  background: '#FAF7F0',
                  borderRight: '1px solid rgba(0, 0, 0, 0.08)',
                  color: '#3A3564'
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
                    fontSize: '1.15rem',
                    color: '#0F172A',
                    fontWeight: 800,
                    letterSpacing: '0.35em',
                    textAlign: 'center'
                  }}
                />
              </div>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.4rem', textAlign: 'center' }}>
                Code sent to +91 {verifiedPhone}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              style={{
                width: '100%',
                background: otp.length === 6 ? '#3A3564' : '#94A3B8',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '0.85rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: otp.length === 6 && !loading ? 'pointer' : 'not-allowed',
                boxShadow: otp.length === 6 ? '0 4px 12px rgba(58,53,100,0.2)' : 'none'
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  <ShieldCheck style={{ width: 18, height: 18 }} />
                  Verify & Access Atelier
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Security Badge */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          color: '#94A3B8',
          fontSize: '0.72rem'
        }}>
          <Sparkles style={{ width: 13, height: 13, color: '#B38E5D' }} />
          <span>Exclusive to verified House of Gargi master weavers & sellers</span>
        </div>
      </div>
    </div>
  );
}
