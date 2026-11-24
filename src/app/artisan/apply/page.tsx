'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface FormData {
  name: string;
  dob: string;
  age: string;
  gender: string;
  state: string;
  placeOfBirth: string;
  typeOfArt: string;
  phone: string;
  email: string;
  answers: Record<string, string>;
  agreedChildLabor: boolean;
  agreedInspection: boolean;
  signature: string;
  signatureDate: string;
}

const INDIAN_STATES = [
  'West Bengal',
  'Uttar Pradesh',
  'Rajasthan',
  'Gujarat',
  'Madhya Pradesh',
  'Maharashtra',
  'Tamil Nadu',
  'Odisha',
  'Assam',
  'Bihar',
  'Karnataka',
  'Andhra Pradesh',
  'Telangana',
  'Kerala',
  'Punjab',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Chhattisgarh',
  'Jharkhand',
  'Uttarakhand',
  'Delhi NCR',
  'Other State / Union Territory',
];

const CRAFT_TYPES = [
  'Pure Silk Handloom Weaving',
  'Jamdani Handloom Weaving',
  'Kantha Stitch Embroidery',
  'Awadhi Zardozi & Aari',
  'Lucknowi Chikankari',
  'Banarasi Kadwa Gold Weave',
  'Chanderi Gossamer Silk',
  'Dokra Lost-Wax Metal Craft',
  'Teak Wood Block Print & Dabu',
  'Patola & Bandhani Tie-Dye',
  'Temple Jewellery & Meenakari',
  'Terracotta & Clay Craft',
  'Other Traditional Craft',
];

const STEPS = [
  { step: 1, labelEn: '1. Basic Info', titleEn: 'Basic Profile & Contact' },
  { step: 2, labelEn: '2. Journey', titleEn: 'Part I: Personal Life & Dreams' },
  { step: 3, labelEn: '3. Craft & Materials', titleEn: 'Part II: Craft, Lineage & Materials' },
  { step: 4, labelEn: '4. Atelier', titleEn: 'Part III: Community, Inspiration & Design' },
  { step: 5, labelEn: '5. Agreement', titleEn: 'Ethical Agreement & Submission' },
];

export default function ArtisanApplyPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    dob: '',
    age: '',
    gender: '',
    state: '',
    placeOfBirth: '',
    typeOfArt: '',
    phone: '',
    email: '',
    answers: {},
    agreedChildLabor: false,
    agreedInspection: false,
    signature: '',
    signatureDate: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  // Phone OTP & Registration Verification State
  const [isPhoneChecking, setIsPhoneChecking] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [registeredArtisanInfo, setRegisteredArtisanInfo] = useState<{ name?: string } | null>(null);
  const [phoneVerificationError, setPhoneVerificationError] = useState('');
  const [phoneVerificationToken, setPhoneVerificationToken] = useState('');
  const [phoneExpiresAt, setPhoneExpiresAt] = useState<number | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const getRawPhoneDigits = (phoneStr: string) => {
    return phoneStr.replace(/^\+91\s*/, '').replace(/\D/g, '').slice(-10);
  };

  const handleSendPhoneOtp = async () => {
    const digits = getRawPhoneDigits(formData.phone);
    if (digits.length !== 10) {
      setPhoneVerificationError('Please enter a valid 10-digit mobile number first.');
      return;
    }

    setPhoneVerificationError('');
    setIsAlreadyRegistered(false);
    setRegisteredArtisanInfo(null);
    setIsPhoneChecking(true);

    try {
      // Step 1: Pre-flight check if phone is already registered as an artisan
      const checkRes = await fetch('/api/auth/check-artisan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: digits }),
      });
      const checkData = await checkRes.json();

      if (checkRes.ok && checkData?.registered) {
        setIsAlreadyRegistered(true);
        setRegisteredArtisanInfo({ name: checkData.artisanName });
        setPhoneVerificationError(
          `This mobile number (+91 ${digits}) is already registered with an existing artisan account${checkData.artisanName ? ` (${checkData.artisanName})` : ''}. Please log in to your artisan portal instead.`
        );
        setIsPhoneChecking(false);
        return;
      }

      // Step 2: Dispatch OTP
      setIsPhoneChecking(false);
      setIsOtpSending(true);

      const otpRes = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: digits, portal: 'artisan_apply' }),
      });
      const otpData = await otpRes.json();

      if (!otpRes.ok || !otpData.success) {
        if (otpData?.alreadyRegistered) {
          setIsAlreadyRegistered(true);
          setRegisteredArtisanInfo({ name: otpData.artisanName });
        }
        throw new Error(otpData.message || 'Failed to dispatch verification code.');
      }

      setPhoneVerificationToken(otpData.verificationToken || otpData.token || '');
      setPhoneExpiresAt(otpData.expiresAt || Date.now() + 10 * 60 * 1000);
      setPhoneOtpSent(true);
      setResendCountdown(60);
      setPhoneOtp('');
    } catch (err: any) {
      setPhoneVerificationError(err?.message || 'Failed to send OTP code.');
    } finally {
      setIsPhoneChecking(false);
      setIsOtpSending(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    const digits = getRawPhoneDigits(formData.phone);
    const cleanOtp = phoneOtp.trim();

    if (cleanOtp.length < 6) {
      setPhoneVerificationError('Please enter all 6 digits of the OTP code.');
      return;
    }

    setIsVerifyingOtp(true);
    setPhoneVerificationError('');

    try {
      const verifyRes = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: digits,
          otp: cleanOtp,
          token: phoneVerificationToken,
          expiresAt: phoneExpiresAt,
          portal: 'artisan_apply',
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.message || 'Invalid or expired OTP code.');
      }

      // Success: Lock in phone number
      setIsPhoneVerified(true);
      setPhoneOtpSent(false);
      setPhoneOtp('');
      setPhoneVerificationError('');
      setError('');
    } catch (err: any) {
      setPhoneVerificationError(err?.message || 'Verification failed. Please check the code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleUnlockPhone = () => {
    setIsPhoneVerified(false);
    setPhoneOtpSent(false);
    setPhoneOtp('');
    setPhoneVerificationError('');
    setIsAlreadyRegistered(false);
  };

  // Auto calculate age when DOB changes
  useEffect(() => {
    if (formData.dob) {
      const birthYear = new Date(formData.dob).getFullYear();
      const currentYear = new Date().getFullYear();
      if (birthYear > 1900 && currentYear > birthYear) {
        setFormData((prev) => ({ ...prev, age: String(currentYear - birthYear) }));
      }
    }
  }, [formData.dob]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleAnswerChange = (qKey: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      answers: { ...prev.answers, [qKey]: value },
    }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) return 'Please enter your full name';
    const digits = getRawPhoneDigits(formData.phone);
    if (!formData.phone.trim() || digits.length < 10) {
      return 'Please enter a valid 10-digit mobile number';
    }
    if (!isPhoneVerified) {
      return 'Please verify and lock in your mobile number with OTP before proceeding to the next step.';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      return 'Please enter a valid email address';
    }
    if (!formData.gender) return 'Please select your gender';
    if (!formData.state) return 'Please select your state';
    if (!formData.typeOfArt) return 'Please select your craft type';
    return null;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const err = validateStep1();
      if (err) {
        setError(err);
        window.scrollTo({ top: 120, behavior: 'smooth' });
        return;
      }
    }
    setError('');
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isPhoneVerified) {
      setError('Your mobile number must be verified with OTP before submitting this application.');
      setCurrentStep(1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }
    if (!formData.agreedChildLabor || !formData.agreedInspection) {
      setError('Please check both compulsory agreement checkboxes to submit');
      return;
    }
    if (!formData.signature.trim()) {
      setError('Please enter your full legal name as your signature');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/artisan/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit application.');
      }

      setSubmittedAppId(data.applicationId || 'HG-ART-2026');
      window.scrollTo({ top: 60, behavior: 'smooth' });
    } catch (err: any) {
      setError(err?.message || 'Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="artisan-apply-root">
      
      {/* Background Soft Ivory Overlay (Line art remains clearly visible, exactly like seller login) */}
      <div className="artisan-apply-overlay" />

      {/* Embedded Responsive Styles */}
      <style>{`
        .artisan-apply-root {
          min-height: 100vh;
          width: 100%;
          position: relative;
          background-image: url('/images/atelier-lineart-bg.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          background-color: #FBF6EE;
          font-family: var(--font-nav);
          color: #241A15;
          padding: 2.25rem 1rem 5rem;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        .artisan-apply-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(251, 246, 238, 0.32);
          pointer-events: none;
          z-index: 1;
        }

        .artisan-apply-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 840px;
          margin: 0 auto;
        }

        .artisan-apply-card {
          background: #FFFFFF;
          border: 1.5px solid var(--soft-gold-line);
          border-radius: 16px;
          padding: 2.5rem 2.25rem;
          box-shadow: 0 16px 40px -10px rgba(43, 31, 24, 0.08);
          width: 100%;
          box-sizing: border-box;
        }

        .artisan-form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.15rem;
        }

        .artisan-form-grid-sig {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.15rem;
        }

        .artisan-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          color: #382B23;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 0.4rem;
        }

        .artisan-question-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 600;
          color: #241A15;
          line-height: 1.45;
          margin-bottom: 0.5rem;
        }

        .artisan-input-field {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 10px;
          border: 1.5px solid #E2D7C5;
          font-size: 1rem;
          outline: none;
          color: #241A15;
          background: #FAF8F5;
          font-family: var(--font-nav);
          box-sizing: border-box;
          transition: border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
        }

        .artisan-input-field::placeholder {
          color: #9C8E84;
          font-size: 0.92rem;
        }

        .artisan-input-field:focus {
          background: #FFFFFF;
          border-color: #7A2331;
          box-shadow: 0 0 0 3px rgba(122, 35, 49, 0.1);
        }

        .artisan-nav-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #F0E6D2;
          padding-top: 1.75rem;
          margin-top: 2rem;
          gap: 1rem;
        }

        .artisan-progress-track {
          width: 100%;
          height: 5px;
          background: #EFE8DC;
          border-radius: 999px;
          overflow: hidden;
          margin: 1.25rem 0 1rem;
        }

        .artisan-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #7A2331 0%, #B88E18 100%);
          border-radius: 999px;
          transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .artisan-stepper-track {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0.75rem 0 1.5rem;
          padding: 0.85rem 1rem;
          background: #FAF7F2;
          border-radius: 10px;
          border: 1px solid #EAE2D5;
        }

        /* ── MOBILE OPTIMIZATIONS ── */
        @media (max-width: 680px) {
          .artisan-apply-root {
            padding: 1rem 0.65rem 4rem;
          }

          .artisan-apply-card {
            padding: 1.35rem 0.95rem;
            border-radius: 14px;
            box-shadow: 0 4px 20px rgba(43, 31, 24, 0.06);
            border: 1px solid #EAE2D5;
          }

          .artisan-form-grid-2 {
            grid-template-columns: 1fr;
            gap: 1.15rem;
          }

          .artisan-form-grid-sig {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .artisan-input-field {
            font-size: 16px !important; /* Prevents auto-zoom on iOS */
            padding: 0.8rem 0.85rem;
            border-radius: 8px;
          }

          .artisan-nav-actions {
            flex-direction: column-reverse;
            gap: 0.75rem;
            margin-top: 1.5rem;
            padding-top: 1.25rem;
          }

          .artisan-nav-actions button {
            width: 100% !important;
            justify-content: center;
            height: 50px !important;
            font-size: 0.92rem !important;
            border-radius: 8px !important;
            letter-spacing: 0.06em !important;
          }

          .artisan-header-title {
            font-size: 1.45rem !important;
            letter-spacing: 0.02em !important;
          }

          .artisan-header-sub {
            font-size: 1rem !important;
          }

          .artisan-stepper-track {
            padding: 0.5rem 0.4rem;
            gap: 0.25rem;
            margin-bottom: 1rem;
          }

          .stepper-label-text {
            display: none !important;
          }

          .stepper-circle {
            width: 28px !important;
            height: 28px !important;
            font-size: 0.8rem !important;
          }

          .mobile-step-banner {
            display: flex !important;
            align-items: center;
            justify-content: space-between;
            background: #FAF7F2;
            border: 1px solid #EAE2D5;
            border-radius: 8px;
            padding: 0.6rem 0.85rem;
            margin-bottom: 1.25rem;
          }
        }

        @media (min-width: 681px) {
          .mobile-step-banner {
            display: none !important;
          }
        }
      `}</style>

      <div className="artisan-apply-container">
        
        {/* Top Navigation Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <Link
            href="/artisan/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.1rem',
              borderRadius: '8px',
              background: '#FFFFFF',
              border: '1.2px solid var(--soft-gold-line)',
              color: 'var(--ink-brown)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-nav)',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 200ms ease',
            }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            Artisan Login
          </Link>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.55rem 0.95rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1.2px solid var(--soft-gold-line)',
              fontSize: '0.82rem',
              fontWeight: 500,
              color: 'var(--ink-brown)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Storefront &rarr;
          </Link>
        </div>

        {/* ════════════ SUCCESS SUBMITTED STATE ════════════ */}
        {submittedAppId ? (
          <div className="artisan-apply-card" style={{ textAlign: 'center', padding: '3.5rem 1.75rem' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#FAF7F2',
              border: '2px solid #7A2331',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              color: '#7A2331',
            }}>
              <Check style={{ width: 36, height: 36, strokeWidth: 2.5 }} />
            </div>

            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.1rem',
              color: '#7A2331',
              margin: '0 0 0.5rem',
              fontWeight: 600,
            }}>
              Application Received
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: '#241A15',
              lineHeight: 1.6,
              maxWidth: '560px',
              margin: '0.75rem auto 1.25rem',
            }}>
              Thank you, <strong>{formData.name}</strong>, for sharing your story and craft with House of Gargi.
            </p>

            <p style={{
              fontSize: '0.98rem',
              color: '#6B584E',
              lineHeight: 1.6,
              maxWidth: '560px',
              margin: '0 auto 2rem',
              fontStyle: 'italic',
            }}>
              Your application to join the House of Gargi Artisan Guild has been received. Our curation desk will review your submission and contact you shortly.
            </p>

            <div style={{
              display: 'inline-block',
              background: '#FAF7F2',
              border: '1.5px solid #D4AF37',
              borderRadius: '9px',
              padding: '1.25rem 2.25rem',
              marginBottom: '2.5rem',
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}>
              <span style={{ fontSize: '0.85rem', color: '#8C7B70', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Application Reference ID:
              </span>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '1.8rem',
                fontWeight: 500,
                color: '#7A2331',
                marginTop: '0.35rem',
                letterSpacing: '0.08em',
              }}>
                {submittedAppId}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                href="/artisan/login"
                style={{
                  background: '#7A2331',
                  color: '#FFFFFF',
                  padding: '0.95rem 2rem',
                  borderRadius: '8px',
                  fontWeight: 500,
                  fontSize: '0.92rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                  minHeight: '48px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Go to Artisan Portal Login
              </Link>
              <Link
                href="/"
                style={{
                  background: '#FFFFFF',
                  color: '#241A15',
                  border: '1.5px solid var(--soft-gold-line)',
                  padding: '0.95rem 2rem',
                  borderRadius: '8px',
                  fontWeight: 500,
                  fontSize: '0.92rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                  minHeight: '48px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Return to Storefront
              </Link>
            </div>
          </div>
        ) : (
          /* ════════════ MAIN FORM CARD ════════════ */
          <div className="artisan-apply-card">
            
            {/* Header Crest */}
            <div style={{ textAlign: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid #F0E6D2' }}>
              <span style={{
                fontSize: '0.82rem',
                letterSpacing: '0.22em',
                fontWeight: 600,
                color: '#8C7B70',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.25rem',
              }}>
                HOUSE OF GARGI
              </span>
              <p style={{
                margin: 0,
                fontSize: '0.78rem',
                color: '#B88E18',
                letterSpacing: '0.12em',
                fontStyle: 'italic',
              }}>
                TRADITION &middot; CRAFT &middot; HERITAGE
              </p>

              <h1 className="artisan-header-title" style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2rem',
                fontWeight: 600,
                color: '#7A2331',
                margin: '0.75rem 0 0.2rem',
                letterSpacing: '0.04em',
                lineHeight: 1.2,
              }}>
                ARTISAN APPLICATION
              </h1>
              <h2 className="artisan-header-sub" style={{
                fontSize: '1.15rem',
                fontWeight: 500,
                color: '#4A3C33',
                margin: '0.2rem 0 0',
              }}>
                Heritage Artisan Registry
              </h2>

              {/* Top Progress Line */}
              <div className="artisan-progress-track">
                <div className="artisan-progress-fill" style={{ width: `${(currentStep / 5) * 100}%` }} />
              </div>
            </div>

            {/* Stepper Progress Track */}
            <div className="artisan-stepper-track">
              {STEPS.map((s) => (
                <div
                  key={s.step}
                  onClick={() => s.step < currentStep && setCurrentStep(s.step)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: s.step < currentStep ? 'pointer' : 'default',
                    opacity: currentStep === s.step ? 1 : currentStep > s.step ? 0.95 : 0.45,
                    flex: 1,
                    minWidth: '40px',
                  }}
                >
                  <div
                    className="stepper-circle"
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: currentStep === s.step ? '#7A2331' : currentStep > s.step ? '#2E6F40' : '#E8E0D2',
                      color: currentStep >= s.step ? '#FFFFFF' : '#7D6F65',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 200ms ease',
                      boxShadow: currentStep === s.step ? '0 0 0 3px rgba(122, 35, 49, 0.18)' : 'none',
                    }}
                  >
                    {currentStep > s.step ? <Check style={{ width: 14, height: 14 }} /> : s.step}
                  </div>
                  <span className="stepper-label-text" style={{ fontSize: '0.72rem', fontWeight: 600, color: currentStep === s.step ? '#7A2331' : '#6A5A50', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {s.labelEn}
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile Active Step Sub-Banner */}
            <div className="mobile-step-banner">
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#7A2331', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Step {currentStep} of 5 &bull; {STEPS[currentStep - 1].labelEn}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#B88E18' }}>
                {Math.round((currentStep / 5) * 100)}% Complete
              </span>
            </div>

            {/* Error Notification */}
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                background: '#FEF2F2',
                border: '1.5px solid #FECDD3',
                color: '#7A2331',
                padding: '0.85rem 1.15rem',
                borderRadius: '8px',
                fontSize: '0.92rem',
                marginBottom: '1.75rem',
                fontWeight: 600,
              }}>
                <AlertCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Introductory Mission Callout (Steps 2-4) */}
            {currentStep >= 2 && currentStep <= 4 && (
              <div style={{
                background: '#FAF7F2',
                borderLeft: '4px solid #7A2331',
                borderTop: '1px solid #EAE2D5',
                borderRight: '1px solid #EAE2D5',
                borderBottom: '1px solid #EAE2D5',
                borderRadius: '0 8px 8px 0',
                padding: '1.15rem 1.25rem',
                marginBottom: '2rem',
              }}>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.92rem', lineHeight: 1.55, color: '#3E3029' }}>
                  At House of Gargi we are especially interested in getting to know you, and introduce you to our customers around the world. Can you help us by providing the following information so we can write your story for the website?
                </p>
                <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.55, color: '#665349', fontStyle: 'italic' }}>
                                  ।                  ?
                </p>
              </div>
            )}

            {/* ═══════════════ STEP 1: BASIC INFORMATION ═══════════════ */}
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                <div style={{ borderBottom: '1.5px solid #F0E6D2', paddingBottom: '0.75rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#7A2331', fontWeight: 600 }}>
                    Step 1: Basic Profile &amp; Contact Information
                  </h3>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.84rem', color: '#8C7B70' }}>
                    Please provide your verified details to register with the House of Gargi Artisan Guild.
                  </p>
                </div>

                {/* ARTIST NAME */}
                <div>
                  <label className="artisan-label">
                    FULL NAME <span style={{ color: '#7A2331' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="artisan-input-field"
                  />
                </div>

                {/* DOB & AGE */}
                <div className="artisan-form-grid-2">
                  <div>
                    <label className="artisan-label">
                      DATE OF BIRTH
                    </label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                      title="Enter your birth date"
                      className="artisan-input-field"
                    />
                  </div>

                  <div>
                    <label className="artisan-label">
                      AGE
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Enter your age"
                      className="artisan-input-field"
                    />
                  </div>
                </div>

                {/* GENDER & STATE */}
                <div className="artisan-form-grid-2">
                  <div>
                    <label className="artisan-label">
                      GENDER <span style={{ color: '#7A2331' }}>*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      required
                      className="artisan-input-field"
                    >
                      <option value="">Select your gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="artisan-label">
                      STATE / REGION <span style={{ color: '#7A2331' }}>*</span>
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      required
                      className="artisan-input-field"
                    >
                      <option value="">Select your state / region</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* PLACE OF BIRTH & TYPE OF ART */}
                <div className="artisan-form-grid-2">
                  <div>
                    <label className="artisan-label">
                      PLACE OF BIRTH
                    </label>
                    <input
                      type="text"
                      value={formData.placeOfBirth}
                      onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                      placeholder="Enter your village, town, or district"
                      className="artisan-input-field"
                    />
                  </div>

                  <div>
                    <label className="artisan-label">
                      CRAFT / ART TECHNIQUE <span style={{ color: '#7A2331' }}>*</span>
                    </label>
                    <select
                      value={formData.typeOfArt}
                      onChange={(e) => handleInputChange('typeOfArt', e.target.value)}
                      required
                      className="artisan-input-field"
                    >
                      <option value="">Select your craft or art form</option>
                      {CRAFT_TYPES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* PHONE & EMAIL */}
                <div className="artisan-form-grid-2">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <label className="artisan-label" style={{ margin: 0 }}>
                        MOBILE NUMBER <span style={{ color: '#7A2331' }}>*</span>
                      </label>
                      {isPhoneVerified && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: '#16A34A',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}>
                          <CheckCircle2 size={13} /> Verified &amp; Locked
                        </span>
                      )}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'stretch',
                      border: isPhoneVerified
                        ? '1.5px solid #16A34A'
                        : isAlreadyRegistered
                          ? '1.5px solid #DC2626'
                          : '1.5px solid #E2D7C5',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      background: isPhoneVerified ? '#F0FDF4' : '#FAF8F5',
                      width: '100%',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease',
                    }}>
                      <span style={{
                        padding: '0 0.95rem',
                        background: isPhoneVerified ? '#DCFCE7' : '#F4ECE0',
                        borderRight: isPhoneVerified ? '1px solid #86EFAC' : '1px solid #E2D7C5',
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: isPhoneVerified ? '#166534' : '#7A2331',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        +91
                      </span>
                      <input
                        type="tel"
                        value={formData.phone.replace(/^\+91\s*/, '')}
                        disabled={isPhoneVerified}
                        onChange={(e) => {
                          if (isPhoneVerified) return;
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                          handleInputChange('phone', `+91 ${digits}`);
                          setIsAlreadyRegistered(false);
                          setRegisteredArtisanInfo(null);
                          setPhoneVerificationError('');
                          setPhoneOtpSent(false);
                        }}
                        placeholder="Enter your 10-digit mobile number"
                        required
                        style={{
                          flex: 1,
                          minWidth: 0,
                          padding: '0.85rem 0.85rem',
                          border: 'none',
                          outline: 'none',
                          fontSize: '0.95rem',
                          color: isPhoneVerified ? '#166534' : '#241A15',
                          fontWeight: isPhoneVerified ? 600 : 400,
                          backgroundColor: 'transparent',
                          fontFamily: 'var(--font-nav)',
                        }}
                      />
                      {!isPhoneVerified && (
                        <button
                          type="button"
                          onClick={handleSendPhoneOtp}
                          disabled={isPhoneChecking || isOtpSending || getRawPhoneDigits(formData.phone).length !== 10 || (phoneOtpSent && resendCountdown > 0)}
                          style={{
                            margin: '4px 6px',
                            padding: '0 0.95rem',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            background: getRawPhoneDigits(formData.phone).length === 10 ? '#7A2331' : '#E8E1D5',
                            color: getRawPhoneDigits(formData.phone).length === 10 ? '#FFFFFF' : '#8C7B70',
                            border: 'none',
                            borderRadius: '7px',
                            cursor: getRawPhoneDigits(formData.phone).length === 10 ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {(isPhoneChecking || isOtpSending) ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              {isPhoneChecking ? 'Checking...' : 'Sending...'}
                            </>
                          ) : phoneOtpSent ? (
                            resendCountdown > 0 ? `Resend (${resendCountdown}s)` : 'Resend'
                          ) : (
                            'Send OTP'
                          )}
                        </button>
                      )}
                      {isPhoneVerified && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '12px', flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={handleUnlockPhone}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#8C7B70',
                              fontSize: '0.75rem',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              padding: '2px 4px',
                            }}
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ALREADY REGISTERED ARTISAN BANNER */}
                    {isAlreadyRegistered && (
                      <div style={{
                        marginTop: '0.65rem',
                        padding: '0.85rem 1rem',
                        background: '#FEF2F2',
                        border: '1.5px solid #FCA5A5',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        color: '#991B1B',
                        lineHeight: 1.45,
                      }}>
                        <div style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AlertCircle size={16} color="#DC2626" />
                          Mobile Number Already Registered
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          This number (+91 {getRawPhoneDigits(formData.phone)}) is already associated with{' '}
                          <strong>{registeredArtisanInfo?.name || 'an existing registered artisan'}</strong>. Duplicate artisan applications are not allowed.
                        </div>
                        <Link
                          href="/artisan/login"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '0.45rem 0.85rem',
                            background: '#7A2331',
                            color: '#FFFFFF',
                            borderRadius: '5px',
                            textDecoration: 'none',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Sign In to Artisan Portal &rarr;
                        </Link>
                      </div>
                    )}

                    {/* OTP VERIFICATION BOX */}
                    {phoneOtpSent && !isPhoneVerified && !isAlreadyRegistered && (
                      <div style={{
                        marginTop: '0.75rem',
                        padding: '1rem',
                        background: '#FAF7F2',
                        border: '1.5px solid #D4AF37',
                        borderRadius: '10px',
                      }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7A2331', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Enter 6-Digit OTP sent to +91 {getRawPhoneDigits(formData.phone)}:
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <input
                            type="text"
                            maxLength={6}
                            value={phoneOtp}
                            onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Enter 6-digit OTP"
                            style={{
                              flex: '1 1 140px',
                              minWidth: '130px',
                              padding: '0.75rem 0.85rem',
                              border: '1.5px solid #D4AF37',
                              borderRadius: '8px',
                              fontSize: '1.1rem',
                              fontWeight: 700,
                              letterSpacing: '0.25em',
                              textAlign: 'center',
                              background: '#FFFFFF',
                              color: '#241A15',
                              outline: 'none',
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleVerifyPhoneOtp}
                            disabled={phoneOtp.trim().length !== 6 || isVerifyingOtp}
                            style={{
                              flex: '1 1 120px',
                              padding: '0.75rem 1.15rem',
                              background: phoneOtp.trim().length === 6 ? '#7A2331' : '#C7B9AC',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                              cursor: phoneOtp.trim().length === 6 ? 'pointer' : 'not-allowed',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {isVerifyingOtp ? (
                              <>
                                <Loader2 size={13} className="animate-spin" /> Verifying...
                              </>
                            ) : (
                              'Verify & Lock'
                            )}
                          </button>
                        </div>
                        {phoneVerificationError && (
                          <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertCircle size={13} /> {phoneVerificationError}
                          </div>
                        )}
                        <div style={{ marginTop: '0.45rem', fontSize: '0.74rem', color: '#8C7B70' }}>
                          Test verification code: <strong>123456</strong>
                        </div>
                      </div>
                    )}

                    {/* PHONE VERIFICATION ERROR NOT IN OTP BOX */}
                    {phoneVerificationError && !phoneOtpSent && !isAlreadyRegistered && (
                      <div style={{ marginTop: '0.45rem', fontSize: '0.78rem', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={13} /> {phoneVerificationError}
                      </div>
                    )}

                    {/* SUCCESS NOTE WHEN LOCKED */}
                    {isPhoneVerified && (
                      <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                        <ShieldCheck size={14} /> Mobile verified &amp; locked. You may proceed to the next step.
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="artisan-label">
                      EMAIL ADDRESS <span style={{ color: '#7A2331' }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="artisan-input-field"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════ STEP 2: QUESTIONS 1 TO 4 ═══════════════ */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div style={{ borderBottom: '1.5px solid #F0E6D2', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#7A2331', fontWeight: 600 }}>
                    Step 2: Personal Journey &amp; Dreams (Questions 1 - 4)
                  </h3>
                </div>

                {/* Q1 */}
                <div>
                  <label className="artisan-question-label">
                    1) If friends were to describe you, what 3 qualities would they highlight?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.answers.q1 || ''}
                    onChange={(e) => handleAnswerChange('q1', e.target.value)}
                    placeholder="Enter 3 personal qualities that best define you..."
                    className="artisan-input-field"
                  />
                </div>

                {/* Q2 */}
                <div>
                  <label className="artisan-question-label">
                    2) Have you ever experienced difficult moments in your life that you're proud to have overcome?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.answers.q2 || ''}
                    onChange={(e) => handleAnswerChange('q2', e.target.value)}
                    placeholder="Enter any personal or craft challenges you are proud of overcoming..."
                    className="artisan-input-field"
                  />
                </div>

                {/* Q3 */}
                <div>
                  <label className="artisan-question-label">
                    3) Have you experienced funny, memorable, or lighthearted moments in your journey?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.answers.q3 || ''}
                    onChange={(e) => handleAnswerChange('q3', e.target.value)}
                    placeholder="Enter a lighthearted or humorous memory from your journey..."
                    className="artisan-input-field"
                  />
                </div>

                {/* Q4 */}
                <div>
                  <label className="artisan-question-label">
                    4) What are your hopes, plans, and dreams for the future?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.answers.q4 || ''}
                    onChange={(e) => handleAnswerChange('q4', e.target.value)}
                    placeholder="Enter your dreams for your craft, your family, and your workshop..."
                    className="artisan-input-field"
                  />
                </div>
              </div>
            )}

            {/* ═══════════════ STEP 3: QUESTIONS 5 TO 8 ═══════════════ */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div style={{ borderBottom: '1.5px solid #F0E6D2', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#7A2331', fontWeight: 600 }}>
                    Step 3: Craft, Lineage &amp; Materials (Questions 5 - 8)
                  </h3>
                </div>

                {/* Q5 */}
                <div>
                  <label className="artisan-question-label">
                    5) How did you get interested in this craft, and what attracts you to it?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.answers.q5 || ''}
                    onChange={(e) => handleAnswerChange('q5', e.target.value)}
                    placeholder="Enter how you began and what attracts you to this craft..."
                    className="artisan-input-field"
                  />
                </div>

                {/* Q6 */}
                <div>
                  <label className="artisan-question-label">
                    6) Who taught you? Do you currently teach others? (Specify who and where)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.answers.q6 || ''}
                    onChange={(e) => handleAnswerChange('q6', e.target.value)}
                    placeholder="Enter details of your teachers, master weavers, and any apprentices or family members you teach..."
                    className="artisan-input-field"
                  />
                </div>

                {/* Q7 */}
                <div>
                  <label className="artisan-question-label">
                    7) What did you have to do to learn and master this craft?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.answers.q7 || ''}
                    onChange={(e) => handleAnswerChange('q7', e.target.value)}
                    placeholder="Enter the years of practice, discipline, and master techniques you acquired..."
                    className="artisan-input-field"
                  />
                </div>

                {/* Q8 */}
                <div>
                  <label className="artisan-question-label">
                    8) What kind of materials do you use, and how do you obtain or prepare them? Are any materials recycled or reclaimed?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.answers.q8 || ''}
                    onChange={(e) => handleAnswerChange('q8', e.target.value)}
                    placeholder="Enter the materials you work with (e.g., pure mulberry silk, zari, azo-free dyes) and your sourcing methods..."
                    className="artisan-input-field"
                  />
                </div>
              </div>
            )}

            {/* ═══════════════ STEP 4: QUESTIONS 9 TO 14 ═══════════════ */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div style={{ borderBottom: '1.5px solid #F0E6D2', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#7A2331', fontWeight: 600 }}>
                    Step 4: Community, Inspiration &amp; Design (Questions 9 - 14)
                  </h3>
                </div>

                {/* Q9 */}
                <div>
                  <label className="artisan-question-label">
                    9) What is your favorite thing about your craft? What do you find the most challenging?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.answers.q9 || ''}
                    onChange={(e) => handleAnswerChange('q9', e.target.value)}
                    placeholder="Enter what gives you the greatest joy and the intricate challenges you overcome..."
                    className="artisan-input-field"
                  />
                </div>

                {/* Q10 */}
                <div>
                  <label className="artisan-question-label">
                    10) Where do you get your inspiration from?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.answers.q10 || ''}
                    onChange={(e) => handleAnswerChange('q10', e.target.value)}
                    placeholder="Enter your inspirations (e.g., temple motifs, nature, regional folklore, royal traditions)..."
                    className="artisan-input-field"
                  />
                </div>

                {/* Q11 */}
                <div>
                  <label className="artisan-question-label">
                    11) Describe what it has been like to establish your craft and work independently.
                  </label>
                  <textarea
                    rows={3}
                    value={formData.answers.q11 || ''}
                    onChange={(e) => handleAnswerChange('q11', e.target.value)}
                    placeholder="Enter your experience founding your workshop and establishing your craft..."
                    className="artisan-input-field"
                  />
                </div>

                {/* Q12 */}
                <div>
                  <label className="artisan-question-label">
                    12) If you work with family members or team members, how do you organize the work?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.answers.q12 || ''}
                    onChange={(e) => handleAnswerChange('q12', e.target.value)}
                    placeholder="Enter how workshop roles and processes are shared..."
                    className="artisan-input-field"
                  />
                </div>

                {/* Q13 */}
                <div>
                  <label className="artisan-question-label">
                    13) If you work with designers or other artisans, what qualities do you look for in your collaborators?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.answers.q13 || ''}
                    onChange={(e) => handleAnswerChange('q13', e.target.value)}
                    placeholder="Enter the precision, dedication, and heritage values you seek..."
                    className="artisan-input-field"
                  />
                </div>

                {/* Q14 */}
                <div>
                  <label className="artisan-question-label">
                    14) Describe any benefits your craft or workshop brings to your local community.
                  </label>
                  <textarea
                    rows={3}
                    value={formData.answers.q14 || ''}
                    onChange={(e) => handleAnswerChange('q14', e.target.value)}
                    placeholder="Enter the livelihoods, community support, or artisan empowerment your workshop fosters..."
                    className="artisan-input-field"
                  />
                </div>

                <div style={{ textAlign: 'center', padding: '1rem', background: '#FAF7F2', borderRadius: '8px', color: '#7A2331', fontWeight: 600, letterSpacing: '0.08em' }}>
                  THANK YOU FOR SHARING YOUR HERITAGE &amp; JOURNEY
                </div>
              </div>
            )}

            {/* ═══════════════ STEP 5: CHILD LABOR AGREEMENT & SUBMISSION ═══════════════ */}
            {currentStep === 5 && (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div style={{ borderBottom: '1.5px solid #F0E6D2', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#7A2331', fontWeight: 600 }}>
                    Step 5: Ethical Agreement &amp; Submission
                  </h3>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#8C7B70' }}>
                    All master artisans and atelier suppliers must commit to international child labor standards.
                  </p>
                </div>

                {/* Agreement Scroll Box */}
                <div style={{
                  background: '#FAF7F2',
                  border: '1.5px solid var(--soft-gold-line)',
                  borderRadius: '9px',
                  padding: '1.25rem',
                  maxHeight: '280px',
                  overflowY: 'auto',
                  fontSize: '0.87rem',
                  lineHeight: 1.6,
                  color: '#3E3029',
                  boxSizing: 'border-box',
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', fontSize: '0.96rem', color: '#7A2331' }}>
                      HOUSE OF GARGI COMPULSORY CHILD LABOR AGREEMENT
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: '#8C7B70' }}>FOR ARTISANS AND SUPPLIERS</span>
                  </div>

                  <p>
                    <strong>Commitment:</strong> House of Gargi&apos;s commitment to the respect and promotion of human rights is an essential part of its business practices and mission. The Child Labor Agreement is based on the rights set forth in the UN Convention of the Rights of the Child and in the conventions of the International Labor Organization.
                  </p>
                  <p>
                    All artisans and suppliers are required to sign this Agreement as an indication of their commitment to comply with the regulations herein established.
                  </p>

                  <p style={{ fontWeight: 500, color: '#241A15' }}>I. &ldquo;No Child Labor&rdquo; Policy:</p>
                  <p>
                    For the purposes of the Agreement, child labor is defined as the employment, whether paid or unpaid, of any child under the age of fifteen (15) or fourteen (14) where the local law of the country permits and in any position where:
                  </p>
                  <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0' }}>
                    <li>The child is kept from attending school and receiving the education they will need to succeed in life. Work shall never come at the expense of a child&apos;s education. In no case shall a child be granted full-time employment before completing mandatory schooling.</li>
                    <li>The child is exposed to dangerous pesticides, fumes, toxins, chemicals, or carcinogens, or an unsanitary environment.</li>
                    <li>National or international laws relating to human rights or working children are violated.</li>
                    <li>The child is required to operate heavy or dangerous machinery. Heavy or dangerous machinery shall only be operated by adults age eighteen (18) and older.</li>
                    <li>The child is compelled to work or in any way coerced into completing her/his duties.</li>
                    <li>The physical, emotional, psychological, or intellectual development of the child could be jeopardized.</li>
                    <li>Children who perform developmental tasks or vocational apprenticeships at a family workshop are excluded; however, tasks must never interfere with the child&apos;s education, health, safety, or well-being.</li>
                  </ul>

                  <p style={{ fontWeight: 500, color: '#241A15', marginTop: '1rem' }}>
                    II. Readiness for Workplace Inspection:
                  </p>
                  <p>
                    In order to enforce its No Child Labor policy and reassure both customers and the public that no children are exploited, House of Gargi requires all artisans to consent to periodic inspections of their workshops or homes by authorized representatives and independent human rights monitors. Advance notice will not always be provided prior to inspection to preserve the integrity of the process.
                  </p>
                </div>

                {/* 2 COMPULSORY TICKS (CHECKBOXES) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#FFFFFF' }}>
                  
                  {/* TICK 1 */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    cursor: 'pointer',
                    padding: '0.95rem 1.15rem',
                    borderRadius: '8px',
                    border: formData.agreedChildLabor ? '1.5px solid #7A2331' : '1.5px solid #E4D3AE',
                    background: formData.agreedChildLabor ? '#FAF7F2' : '#FFFFFF',
                    transition: 'all 150ms ease',
                    boxSizing: 'border-box',
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.agreedChildLabor}
                      onChange={(e) => handleInputChange('agreedChildLabor', e.target.checked)}
                      style={{
                        accentColor: '#7A2331',
                        width: '20px',
                        height: '20px',
                        marginTop: '2px',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.92rem', color: '#241A15', lineHeight: 1.45 }}>
                        1. I hereby agree to abide by the House of Gargi Child Labor Agreement.
                      </strong>
                    </div>
                  </label>

                  {/* TICK 2 */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    cursor: 'pointer',
                    padding: '0.95rem 1.15rem',
                    borderRadius: '8px',
                    border: formData.agreedInspection ? '1.5px solid #7A2331' : '1.5px solid #E4D3AE',
                    background: formData.agreedInspection ? '#FAF7F2' : '#FFFFFF',
                    transition: 'all 150ms ease',
                    boxSizing: 'border-box',
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.agreedInspection}
                      onChange={(e) => handleInputChange('agreedInspection', e.target.checked)}
                      style={{
                        accentColor: '#7A2331',
                        width: '20px',
                        height: '20px',
                        marginTop: '2px',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.92rem', color: '#241A15', lineHeight: 1.45 }}>
                        2. I agree to make my workshop readily available for inspection and confirm all answers provided are true.
                      </strong>
                    </div>
                  </label>
                </div>

                {/* SIGNATURE & DATE */}
                <div className="artisan-form-grid-sig" style={{ borderTop: '1px solid #F0E6D2', paddingTop: '1.25rem' }}>
                  <div>
                    <label className="artisan-label">
                      SIGNATURE OF ARTISAN <span style={{ color: '#7A2331' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.signature}
                      onChange={(e) => handleInputChange('signature', e.target.value)}
                      placeholder="Enter your full legal name as signature"
                      required
                      className="artisan-input-field"
                      style={{
                        fontFamily: "'Courier New', monospace",
                        fontWeight: 500,
                      }}
                    />
                  </div>

                  <div>
                    <label className="artisan-label">
                      DATE OF SUBMISSION
                    </label>
                    <input
                      type="text"
                      value={formData.signatureDate}
                      readOnly
                      className="artisan-input-field"
                      style={{
                        background: '#FAF7F2',
                        color: '#6A5A50',
                      }}
                    />
                  </div>
                </div>

                {/* Final Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !formData.agreedChildLabor || !formData.agreedInspection || !formData.signature.trim()}
                  style={{
                    width: '100%',
                    background: formData.agreedChildLabor && formData.agreedInspection && formData.signature.trim() ? '#7A2331' : '#D6D3D1',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '9px',
                    padding: '1.15rem',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-nav)',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.65rem',
                    cursor: formData.agreedChildLabor && formData.agreedInspection && !loading ? 'pointer' : 'not-allowed',
                    transition: 'all 200ms ease',
                    minHeight: '52px',
                    boxSizing: 'border-box',
                    marginTop: '0.5rem',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" style={{ width: 18, height: 18 }} />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <ShieldCheck style={{ width: 20, height: 20 }} />
                      Submit Artisan Application &bull;   
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Stepper Navigation Buttons (Steps 1 to 4) */}
            {currentStep < 5 && (
              <div className="artisan-nav-actions">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.85rem 1.6rem',
                      borderRadius: '8px',
                      background: '#FFFFFF',
                      border: '1.5px solid var(--soft-gold-line)',
                      color: '#241A15',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      minHeight: '48px',
                    }}
                  >
                    <ArrowLeft style={{ width: 15, height: 15 }} />
                    Previous
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.9rem 2.25rem',
                    borderRadius: '8px',
                    background: '#7A2331',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.92rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    minHeight: '48px',
                  }}
                >
                  {currentStep === 4 ? 'Proceed to Agreement \u2022  ' : 'Next \u2022 '}
                  <ArrowRight style={{ width: 15, height: 15 }} />
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
