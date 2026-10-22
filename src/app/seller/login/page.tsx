'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { ArrowRight, ArrowLeft, Phone, Mail, Loader2, Check } from 'lucide-react';
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

function sanitizeOtpError(msg?: string): string {
  if (!msg) return 'The OTP code is invalid or has expired. Please request a new OTP.';
  return msg
    .replace(/token has expired or is invalid/gi, 'OTP has expired or is invalid')
    .replace(/token/gi, 'OTP')
    .replace(/OTP/gi, 'OTP');
}

export default function SellerLoginPage() {
  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedTarget, setVerifiedTarget] = useState('');
  const [verificationToken, setVerificationToken] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<number>(0);
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();

  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const checkCurrentSession = async () => {
      // If user came specifically to re-authenticate or log out, do not auto-redirect
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('logout') === 'true' || urlParams.get('switch') === 'true') {
          return;
        }
      }

      const stored = typeof window !== 'undefined'
        ? (localStorage.getItem('auth_session') || localStorage.getItem('super_admin_session') || localStorage.getItem('admin_session') || localStorage.getItem('artisan_session'))
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
          if (parsed?.role === 'artisan' || parsed?.email) {
            router.replace('/artisan/dashboard');
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
          } else {
            router.replace('/artisan/dashboard');
          }
        } catch {
          router.replace('/artisan/dashboard');
        }
      }
    };
    checkCurrentSession();
  }, [router]);

  // Extract raw 10 digits
  const getCleanPhoneDigits = (raw: string) => {
    const numbersOnly = raw.replace(/\D/g, '');
    if (numbersOnly.length === 10) return numbersOnly;
    if (numbersOnly.length >= 12 && numbersOnly.startsWith('91')) return numbersOnly.slice(2, 12);
    if (numbersOnly.length > 10) return numbersOnly.slice(-10);
    return numbersOnly;
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

  // 1. Send OTP (Supports both Phone and Email)
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (authMode === 'phone') {
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
          const fallbackRes = await supabase.auth.signInWithOtp({
            phone: targetDigits,
          });
          otpErr = fallbackRes.error;
        }

        if (otpErr) throw otpErr;

        setVerifiedTarget(`+91 ${targetDigits}`);
        setStep(2);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } catch (err: any) {
        setError(sanitizeOtpError(err?.message));
      } finally {
        setLoading(false);
      }
    } else {
      // Email OTP dispatch via Resend API (Same reliable engine as Customer Login)
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, portal: 'artisan' }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to dispatch artisan access code.');
        }

        const newToken = data.verificationToken || '';
        const newExpires = data.expiresAt || Date.now() + 10 * 60 * 1000;
        setVerificationToken(newToken);
        setExpiresAt(newExpires);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('artisan_active_otp', JSON.stringify({ token: newToken, expiresAt: newExpires, email: cleanEmail }));
        }
        setVerifiedTarget(cleanEmail);
        setStep(2);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 100);
      } catch (err: any) {
        console.error('Artisan Send OTP Error:', err);
        setError(sanitizeOtpError(err?.message));
      } finally {
        setLoading(false);
      }
    }
  };

  // OTP Input navigation & Paste support
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

  const handleOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '');
    
    if (sanitized.length > 1) {
      const pastedChars = sanitized.slice(0, 6).split('');
      const newValues = ['', '', '', '', '', ''];
      pastedChars.forEach((char, i) => {
        if (i < 6) newValues[i] = char;
      });
      setOtpValues(newValues);
      const nextFocus = Math.min(pastedChars.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    const newValues = [...otpValues];
    newValues[index] = sanitized ? sanitized.slice(-1) : '';
    setOtpValues(newValues);

    if (sanitized && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const routeUserByRole = (role: string) => {
    if (role === 'super_admin') {
      router.push('/super-admin/dashboard');
    } else if (role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      // Any valid authentication through the Artisan portal lands on the Artisan dashboard
      router.push('/artisan/dashboard');
    }
  };

  // 2. Verify OTP (Handles both SMS OTP and Email OTP with Dynamic Role Redirection)
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const fullOtp = otpValues.join('');

    if (fullOtp.length < 6) {
      setError('Please enter all 6 digits of the OTP code.');
      return;
    }

    setLoading(true);

    try {
      if (authMode === 'phone') {
        const targetDigits = getCleanPhoneDigits(verifiedTarget || phone);
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
          const phoneIdentifier = data.session.user?.phone || data.session.user?.email || targetDigits;
          let role = 'artisan';
          try {
            const roleRes = await fetch(`/api/auth/role?email=${encodeURIComponent(phoneIdentifier)}`);
            const roleData = await roleRes.json();
            if (roleData?.role) role = roleData.role;
          } catch {}

          const sessionPayload = {
            email: data.session.user?.email || '',
            phone: phoneIdentifier,
            role,
            timestamp: Date.now(),
          };

          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_session', JSON.stringify(sessionPayload));
            localStorage.setItem('artisan_session', JSON.stringify(sessionPayload));
            if (role === 'admin' || role === 'super_admin') {
              localStorage.setItem('admin_session', JSON.stringify(sessionPayload));
            }
            if (role === 'super_admin') {
              localStorage.setItem('super_admin_session', JSON.stringify(sessionPayload));
            }
          }

          routeUserByRole(role);
        } else {
          setError('Verification succeeded, but could not start session.');
        }
      } else {
        // Verify Email OTP via Resend verification or Supabase fallback
        const cleanEmail = (verifiedTarget || email).trim().toLowerCase();

        const activeToken = verificationToken || (typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('artisan_active_otp') || '{}').token : '');
        const activeExpires = expiresAt || (typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('artisan_active_otp') || '{}').expiresAt : 0);

        if (activeToken) {
          const res = await fetch('/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: cleanEmail,
              otp: fullOtp,
              verificationToken: activeToken,
              expiresAt: activeExpires,
              role: 'artisan',
              portal: 'artisan',
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.message || 'The OTP is invalid or has expired.');
          }

          const userRole = (data.user?.role === 'admin' || data.user?.role === 'super_admin')
            ? data.user.role
            : 'artisan';
          const sessionPayload = {
            email: cleanEmail,
            name: data.user?.name || cleanEmail.split('@')[0],
            role: userRole,
            token: activeToken,
            timestamp: Date.now(),
          };

          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_session', JSON.stringify(sessionPayload));
            localStorage.setItem('artisan_session', JSON.stringify(sessionPayload));
            if (userRole === 'admin' || userRole === 'super_admin') {
              localStorage.setItem('admin_session', JSON.stringify(sessionPayload));
            }
            if (userRole === 'super_admin') {
              localStorage.setItem('super_admin_session', JSON.stringify(sessionPayload));
            }
          }

          routeUserByRole(userRole);
          return;
        }

        // Supabase Fallback if verificationToken not present
        let { data, error: verifyErr } = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: fullOtp,
          type: 'recovery',
        });

        if (verifyErr) {
          const fallbackRes = await supabase.auth.verifyOtp({
            email: cleanEmail,
            token: fullOtp,
            type: 'email',
          });
          if (!fallbackRes.error) {
            data = fallbackRes.data;
            verifyErr = null;
          }
        }

        if (verifyErr) throw verifyErr;

        if (data?.session) {
          let role = 'artisan';
          try {
            const roleRes = await fetch(`/api/auth/role?email=${encodeURIComponent(cleanEmail)}`);
            const roleData = await roleRes.json();
            if (roleData?.role === 'admin' || roleData?.role === 'super_admin') role = roleData.role;
          } catch {}

          const sessionPayload = {
            email: cleanEmail,
            role,
            timestamp: Date.now(),
          };

          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_session', JSON.stringify(sessionPayload));
            localStorage.setItem('artisan_session', JSON.stringify(sessionPayload));
            if (role === 'admin' || role === 'super_admin') {
              localStorage.setItem('admin_session', JSON.stringify(sessionPayload));
            }
            if (role === 'super_admin') {
              localStorage.setItem('super_admin_session', JSON.stringify(sessionPayload));
            }
          }

          routeUserByRole(role);
        } else {
          setError('Verification succeeded, but could not start session.');
        }
      }
    } catch (err: any) {
      setError(sanitizeOtpError(err?.message));
    } finally {
      setLoading(false);
    }
  };

  const phoneDigits = getCleanPhoneDigits(phone);
  const isSendButtonDisabled = authMode === 'phone' 
    ? phoneDigits.length < 10 || loading 
    : !email.trim() || !email.includes('@') || loading;

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
        .seller-center-hub {
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
          .seller-center-hub {
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
        .seller-card-container {
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
          .seller-card-container {
            grid-template-columns: 1fr 1.15fr;
            align-items: stretch;
          }
        }
        .artisan-image-panel {
          display: none;
        }
        @media (min-width: 768px) {
          .artisan-image-panel {
            display: block;
            width: 100%;
            height: 100%;
            min-height: 380px;
            max-height: none;
            background: #FBF6EE;
            position: relative;
            overflow: hidden;
          }
        }
        .artisan-image-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .seller-form-panel {
          padding: 1.75rem 1.25rem;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (min-width: 480px) {
          .seller-form-panel {
            padding: 2.25rem 1.85rem;
          }
        }
        @media (min-width: 768px) {
          .seller-form-panel {
            padding: 3rem 2.5rem;
          }
        }
        .auth-bottom-badge {
          display: none;
        }
        @media (min-width: 768px) {
          .auth-bottom-badge {
            display: flex;
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
        .auth-switch-btn {
          background: none;
          border: none;
          color: #7A2331;
          font-family: var(--font-nav);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          transition: color 150ms ease;
        }
        @media (min-width: 480px) {
          .auth-switch-btn {
            font-size: 0.88rem;
            gap: 6px;
          }
        }
        .auth-switch-btn:hover {
          color: #5E1A25;
          text-decoration: underline;
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
      `}</style>

      {/* CENTER HUB */}
      <div className="seller-center-hub">
        
        {/* Top Header Bar */}
        <div className="auth-top-header">
          {/* Logo + Subtle Artisan Portal Badge */}
          <div className="auth-logo-badge-wrap">
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }} aria-label="House of Gargi">
              <img
                src="/logo-images/new-logo.png"
                alt="House of Gargi"
                className="auth-logo-img"
              />
            </Link>

            <span className="auth-portal-badge">
              Artisan Portal
            </span>
          </div>

          {/* Back to Store */}
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
              <h1 className="auth-heading-title">
                Artisan Portal
              </h1>
              <p className="auth-heading-desc">
                Sign in with OTP to manage your products, orders, and artisan account.
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

            {step === 1 ? (
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {authMode === 'phone' ? (
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
                    <div className="auth-input-container">
                      <div className="auth-input-prefix">
                        <IndiaFlagIcon width={24} height={16} />
                        <span style={{
                          fontSize: '0.95rem',
                          fontFamily: 'var(--font-nav)',
                          fontWeight: 500,
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
                        placeholder="10-digit mobile number"
                        autoFocus
                        required
                        className="auth-input-field"
                        style={{
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <label style={{
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-nav)',
                        fontWeight: 500,
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

                    {/* Email Input */}
                    <div className="auth-input-container">
                      <div className="auth-input-prefix" style={{ color: '#7A2331' }}>
                        <Mail style={{ width: 17, height: 17 }} />
                      </div>
                      <input
                        ref={emailInputRef}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="artisan@houseofgargi.com"
                        autoFocus
                        required
                        className="auth-input-field"
                        style={{
                          fontWeight: 500,
                        }}
                      />
                    </div>
                  </div>
                )}

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
                    href="mailto:artisan@houseofgargi.com"
                    style={{ color: '#7A2331', textDecoration: 'none', fontWeight: 600 }}
                  >
                    Need help?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isSendButtonDisabled}
                  style={{
                    width: '100%',
                    background: !isSendButtonDisabled ? '#7A2331' : '#D6D3D1',
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
                    cursor: !isSendButtonDisabled ? 'pointer' : 'not-allowed',
                    transition: 'all 200ms ease',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                      Sending OTP...
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
                      {authMode === 'phone' ? 'Change Phone' : 'Change Email'}
                    </button>
                  </div>

                  <div className="otp-boxes-grid" onPaste={handleOtpPaste}>
                    {otpValues.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpInputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        onFocus={(e) => e.target.select()}
                        className="otp-digit-box"
                        placeholder="·"
                      />
                    ))}
                  </div>

                  <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--stone-taupe)', marginTop: '0.5rem', textAlign: 'center', fontWeight: 500 }}>
                    Code sent to {verifiedTarget}
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

            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px dashed var(--soft-gold-line)',
              textAlign: 'center',
            }}>
              <Link
                href="/seller/apply"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.8rem 1.25rem',
                  borderRadius: '9px',
                  background: '#FAF7F2',
                  border: '1.5px solid var(--soft-gold-line)',
                  color: '#7A2331',
                  fontFamily: 'var(--font-nav)',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'all 200ms ease',
                }}
              >
                <span>Join Us as an Artisan</span>
                <ArrowRight style={{ width: 15, height: 15 }} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Made in India Badge */}
        <div className="auth-bottom-badge" style={{
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
