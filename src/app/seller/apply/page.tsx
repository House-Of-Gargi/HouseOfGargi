'use client';

import { useState, FormEvent, useEffect, useId } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

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
  'West Bengal (পশ্চিমবঙ্গ)',
  'Uttar Pradesh (উত্তর প্রদেশ)',
  'Rajasthan (রাজস্থান)',
  'Gujarat (গুজরাট)',
  'Madhya Pradesh (মধ্য প্রদেশ)',
  'Maharashtra (মহারাষ্ট্র)',
  'Tamil Nadu (তামিলনাড়ু)',
  'Odisha (ওড়িশা)',
  'Assam (আসাম)',
  'Bihar (বিহার)',
  'Karnataka (কর্ণাটক)',
  'Andhra Pradesh (অন্ধ্র প্রদেশ)',
  'Telangana (তেলেঙ্গানা)',
  'Kerala (কেরালা)',
  'Punjab (পাঞ্জাব)',
  'Haryana (হরিয়ানা)',
  'Himachal Pradesh (হিমাচল প্রদেশ)',
  'Jammu & Kashmir (জম্মু ও কাশ্মীর)',
  'Chhattisgarh (ছত্তিশগড়)',
  'Jharkhand (ঝাড়খণ্ড)',
  'Uttarakhand (উত্তরাখণ্ড)',
  'Delhi NCR (দিল্লি)',
  'Other State / Union Territory',
];

const CRAFT_TYPES = [
  'Pure Silk Handloom Weaving (খাঁটি রেশম তাঁত শিল্প)',
  'Jamdani Handloom Weaving (ঐতিহ্যবাহী জামদানি)',
  'Kantha Stitch Embroidery (নকশি কাঁথা স্টিচ)',
  'Awadhi Zardozi & Aari (জরদোসি ও আরি কারুকাজ)',
  'Lucknowi Chikankari (লখনউ চিকনকারি)',
  'Banarasi Kadwa Gold Weave (বেনারসি কড়ুয়া বুনন)',
  'Chanderi Gossamer Silk (চান্দেরি সিল্ক ও সুতি)',
  'Dokra Lost-Wax Metal Craft (ডোকরা ধাতব শিল্প)',
  'Teak Wood Block Print & Dabu (কাঠের ব্লক প্রিন্ট)',
  'Patola & Bandhani Tie-Dye (পাটোলা ও বান্ধনী)',
  'Temple Jewellery & Meenakari (মন্দির গহনা ও মীনাকারি)',
  'Terracotta & Clay Craft (টেরাকোটা ও মাটির শিল্প)',
  'Other Traditional Craft (অন্যান্য ঐতিহ্যবাহী শিল্প)',
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
  const [showAgreementModal, setShowAgreementModal] = useState(false);

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
    if (!formData.name.trim()) return 'Please enter your full name / আপনার নাম লিখুন।';
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      return 'Please enter a valid 10-digit mobile number / সঠিক ১০ সংখ্যার ফোন নম্বর লিখুন।';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      return 'Please enter a valid email address / সঠিক ইমেইল ঠিকানা লিখুন।';
    }
    if (!formData.gender) return 'Please select your gender / আপনার লিঙ্গ নির্বাচন করুন।';
    if (!formData.state) return 'Please select your state / আপনার রাজ্য নির্বাচন করুন।';
    if (!formData.typeOfArt) return 'Please select your craft type / আপনার শিল্পের ধরন নির্বাচন করুন।';
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
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.agreedChildLabor || !formData.agreedInspection) {
      setError('Please check both compulsory agreement checkboxes to submit / উভয় চুক্তির বক্সে টিক দিয়ে সম্মতি জানান।');
      return;
    }
    if (!formData.signature.trim()) {
      setError('Please enter your full legal name as your signature / স্বাক্ষরের স্থানে আপনার নাম লিখুন।');
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
      window.scrollTo({ top: 80, behavior: 'smooth' });
    } catch (err: any) {
      setError(err?.message || 'Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Line art background styling
  const lineArtBgSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23D4AF37' stroke-width='0.45' stroke-opacity='0.16'%3E%3Cpath d='M60 10 C45 35 30 50 10 60 C30 70 45 85 60 110 C75 85 90 70 110 60 C90 50 75 35 60 10 Z'/%3E%3Ccircle cx='60' cy='60' r='18'/%3E%3Ccircle cx='60' cy='60' r='4'/%3E%3Cpath d='M0 60 H120 M60 0 V120' stroke-dasharray='1 4'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FBF6EE',
      backgroundImage: lineArtBgSvg,
      backgroundRepeat: 'repeat',
      color: '#241A15',
      fontFamily: 'var(--font-nav)',
      padding: '2.5rem 1rem 5rem',
      position: 'relative',
    }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        
        {/* Navigation Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
        }}>
          <Link
            href="/seller/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.15rem',
              borderRadius: '8px',
              background: '#FFFFFF',
              border: '1.5px solid var(--soft-gold-line)',
              color: '#241A15',
              fontSize: '0.86rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              transition: 'all 200ms ease',
            }}
          >
            <ArrowLeft style={{ width: 15, height: 15 }} />
            Artisan Login &bull; লগইন
          </Link>

          <Link
            href="/"
            style={{
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#8C7B70',
              textDecoration: 'none',
              letterSpacing: '0.05em',
            }}
          >
            Storefront &rarr;
          </Link>
        </div>

        {/* Success Confirmation State */}
        {submittedAppId ? (
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '3.5rem 2rem',
            textAlign: 'center',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#FAF7F2',
              border: '2px solid #7A2331',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              color: '#7A2331',
            }}>
              <Check style={{ width: 34, height: 34, strokeWidth: 2.5 }} />
            </div>

            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.1rem',
              color: '#7A2331',
              margin: '0 0 0.5rem',
              fontWeight: 600,
            }}>
              Application Received &bull; আবেদন জমা হয়েছে
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: '#241A15',
              lineHeight: 1.6,
              maxWidth: '560px',
              margin: '0.75rem auto 1.5rem',
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
              হাউস অফ গার্গী কারিগর পরিবারে যোগদানের জন্য আপনার আবেদন সফলভাবে জমা পড়েছে। আমাদের কিউরেশন টিম ৪৮ থেকে ৭২ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে।
            </p>

            <div style={{
              display: 'inline-block',
              background: '#FAF7F2',
              border: '1.5px solid #D4AF37',
              borderRadius: '9px',
              padding: '1.25rem 2.25rem',
              marginBottom: '2.5rem',
            }}>
              <span style={{ fontSize: '0.85rem', color: '#8C7B70', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Application Reference ID / আবেদন নং:
              </span>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '1.8rem',
                fontWeight: 700,
                color: '#7A2331',
                marginTop: '0.35rem',
                letterSpacing: '0.08em',
              }}>
                {submittedAppId}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                href="/seller/login"
                style={{
                  background: '#7A2331',
                  color: '#FFFFFF',
                  padding: '0.9rem 2rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
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
                  padding: '0.9rem 2rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                }}
              >
                Return to Storefront
              </Link>
            </div>
          </div>
        ) : (
          /* Main Questionnaire Card */
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid var(--soft-gold-line)',
            borderRadius: '12px',
            padding: '2.5rem 2.25rem',
          }}>
            
            {/* Header Crest */}
            <div style={{ textAlign: 'center', paddingBottom: '1.75rem', borderBottom: '1px solid #F0E6D2' }}>
              <span style={{
                fontSize: '0.88rem',
                letterSpacing: '0.22em',
                fontWeight: 700,
                color: '#8C7B70',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.35rem',
              }}>
                HOUSE OF GARGI
              </span>
              <p style={{
                margin: 0,
                fontSize: '0.8rem',
                color: '#B88E18',
                letterSpacing: '0.15em',
                fontStyle: 'italic',
              }}>
                — TRADITION &middot; CRAFT &middot; HERITAGE —
              </p>

              <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2rem',
                fontWeight: 600,
                color: '#7A2331',
                margin: '1.1rem 0 0.2rem',
                letterSpacing: '0.04em',
              }}>
                ARTIST QUESTIONNAIRE
              </h1>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 500,
                color: '#4A3C33',
                margin: 0,
              }}>
                শিল্পী প্রশ্নাবলী
              </h2>
            </div>

            {/* Stepper Progress Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '1.75rem 0',
              padding: '0.75rem 1rem',
              background: '#FAF7F2',
              borderRadius: '9px',
              border: '1px solid #EAE2D5',
            }}>
              {[
                { step: 1, labelEn: '1. Basic Info', labelBn: 'প্রাথমিক পরিচয়' },
                { step: 2, labelEn: '2. Journey', labelBn: 'জীবনের গল্প' },
                { step: 3, labelEn: '3. Craft & Materials', labelBn: 'শিল্প ও উপকরণ' },
                { step: 4, labelEn: '4. Atelier', labelBn: 'অনুপ্রেরণা ও দল' },
                { step: 5, labelEn: '5. Agreement', labelBn: 'চুক্তি ও সম্মতি' },
              ].map((s) => (
                <div
                  key={s.step}
                  onClick={() => s.step < currentStep && setCurrentStep(s.step)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    cursor: s.step < currentStep ? 'pointer' : 'default',
                    opacity: currentStep === s.step ? 1 : currentStep > s.step ? 0.9 : 0.45,
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: currentStep === s.step ? '#7A2331' : currentStep > s.step ? '#2E6F40' : '#D5C7B3',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {currentStep > s.step ? <Check style={{ width: 14, height: 14 }} /> : s.step}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: currentStep === s.step ? '#7A2331' : '#6A5A50', textAlign: 'center' }}>
                    {s.labelEn}
                  </span>
                </div>
              ))}
            </div>

            {/* Error Banner */}
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
                padding: '1.15rem 1.35rem',
                marginBottom: '2rem',
              }}>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.92rem', lineHeight: 1.55, color: '#3E3029' }}>
                  At House of Gargi we are especially interested in getting to know you, and introduce you to our customers around the world. Can you help us by providing the following information so we can write your story for the website?
                </p>
                <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.55, color: '#665349', fontStyle: 'italic' }}>
                  আমরা হাউস অফ গার্গীতে বিশেষভাবে আপনাকে জানতে এবং বিশ্বজুড়ে আমাদের গ্রাহকদের কাছে আপনাকে পরিচয় করিয়ে দিতে আগ্রহী। আপনি কি আমাদের নিম্নলিখিত তথ্যগুলি দিয়ে সাহায্য করতে পারেন যাতে আমরা ওয়েবসাইটের জন্য আপনার জীবনের গল্পটি লিখতে পারি?
                </p>
              </div>
            )}

            {/* ═══════════════ STEP 1: BASIC INFORMATION ═══════════════ */}
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                <div style={{ borderBottom: '1.5px solid #F0E6D2', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#7A2331', fontWeight: 700 }}>
                    1. Basic Profile &amp; Contact &bull; প্রাথমিক পরিচয় ও যোগাযোগ
                  </h3>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.84rem', color: '#8C7B70' }}>
                    Please fill out your verified details to register on the Artisan Portal.
                  </p>
                </div>

                {/* ARTIST NAME */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#241A15', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                    • ARTIST NAME: / শিল্পী নাম: <span style={{ color: '#7A2331' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name (e.g., Ramdas Mishra / রামদাস মিশ্র)"
                    required
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1.5px solid var(--soft-gold-line)',
                      fontSize: '0.98rem',
                      outline: 'none',
                      color: '#241A15',
                      background: '#FFFFFF',
                    }}
                  />
                </div>

                {/* DOB & AGE */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#241A15', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                      • DATE OF BIRTH: / জন্ম তারিখ:
                    </label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.82rem 1rem',
                        borderRadius: '8px',
                        border: '1.5px solid var(--soft-gold-line)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        color: '#241A15',
                        background: '#FFFFFF',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#241A15', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                      AGE / বয়স:
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="e.g. 42"
                      style={{
                        width: '100%',
                        padding: '0.82rem 1rem',
                        borderRadius: '8px',
                        border: '1.5px solid var(--soft-gold-line)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        color: '#241A15',
                        background: '#FFFFFF',
                      }}
                    />
                  </div>
                </div>

                {/* GENDER & STATE */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#241A15', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                      GENDER / লিঙ্গ: <span style={{ color: '#7A2331' }}>*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        borderRadius: '8px',
                        border: '1.5px solid var(--soft-gold-line)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        color: '#241A15',
                        background: '#FFFFFF',
                      }}
                    >
                      <option value="">Select Gender / নির্বাচন করুন</option>
                      <option value="Male">Male / পুরুষ</option>
                      <option value="Female">Female / মহিলা</option>
                      <option value="Other">Other / অন্যান্য</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#241A15', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                      STATE / রাজ্য: <span style={{ color: '#7A2331' }}>*</span>
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        borderRadius: '8px',
                        border: '1.5px solid var(--soft-gold-line)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        color: '#241A15',
                        background: '#FFFFFF',
                      }}
                    >
                      <option value="">Select State / রাজ্য বেছে নিন</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* PLACE OF BIRTH & TYPE OF ART */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#241A15', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                      • PLACE OF BIRTH: / জন্মস্থান:
                    </label>
                    <input
                      type="text"
                      value={formData.placeOfBirth}
                      onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                      placeholder="Village / Town / District (গ্রাম বা শহর)"
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        borderRadius: '8px',
                        border: '1.5px solid var(--soft-gold-line)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        color: '#241A15',
                        background: '#FFFFFF',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#241A15', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                      • TYPE OF ART / CRAFT: / শিল্প ধরন: <span style={{ color: '#7A2331' }}>*</span>
                    </label>
                    <select
                      value={formData.typeOfArt}
                      onChange={(e) => handleInputChange('typeOfArt', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        borderRadius: '8px',
                        border: '1.5px solid var(--soft-gold-line)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        color: '#241A15',
                        background: '#FFFFFF',
                      }}
                    >
                      <option value="">Select Craft / শিল্পের ধরন</option>
                      {CRAFT_TYPES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* PHONE & EMAIL */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#241A15', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                      MOBILE NUMBER: / ফোন নম্বর: <span style={{ color: '#7A2331' }}>*</span>
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1.5px solid var(--soft-gold-line)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#FFFFFF',
                    }}>
                      <span style={{
                        padding: '0.82rem 0.85rem',
                        background: '#FAF7F2',
                        borderRight: '1px solid var(--soft-gold-line)',
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: '#7A2331',
                      }}>
                        +91
                      </span>
                      <input
                        type="tel"
                        value={formData.phone.replace(/^\+91\s*/, '')}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                          handleInputChange('phone', `+91 ${digits}`);
                        }}
                        placeholder="10-digit number"
                        required
                        style={{
                          flex: 1,
                          padding: '0.82rem 0.95rem',
                          border: 'none',
                          outline: 'none',
                          fontSize: '0.98rem',
                          color: '#241A15',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#241A15', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                      EMAIL ADDRESS: / ইমেইল ঠিকানা: <span style={{ color: '#7A2331' }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="e.g. artisan@gmail.com"
                      required
                      style={{
                        width: '100%',
                        padding: '0.82rem 1rem',
                        borderRadius: '8px',
                        border: '1.5px solid var(--soft-gold-line)',
                        fontSize: '0.98rem',
                        outline: 'none',
                        color: '#241A15',
                        background: '#FFFFFF',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════ STEP 2: QUESTIONS 1 TO 4 ═══════════════ */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div style={{ borderBottom: '1.5px solid #F0E6D2', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#7A2331', fontWeight: 700 }}>
                    Part I: Personal Life &amp; Dreams &bull; প্রথম পর্ব: জীবন ও স্বপ্ন (Q1 - Q4)
                  </h3>
                </div>

                {/* Q1 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#241A15', lineHeight: 1.45, marginBottom: '0.2rem' }}>
                    1) If friends were to describe you, what 3 things would they say about you?
                  </label>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.86rem', color: '#6A564C', fontStyle: 'italic' }}>
                    বন্ধুরা যদি আপনার বর্ণনা দিতে চায়, তবে তারা আপনার সম্পর্কে কোন ৩টি কথা বলবে?
                  </p>
                  <textarea
                    rows={3}
                    value={formData.answers.q1 || ''}
                    onChange={(e) => handleAnswerChange('q1', e.target.value)}
                    placeholder="Describe 3 qualities..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1.5px solid var(--soft-gold-line)',
                      fontSize: '0.95rem',
                      color: '#241A15',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Q2 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#241A15', lineHeight: 1.45, marginBottom: '0.2rem' }}>
                    2) Have you ever experienced difficult moments in your life that you&apos;re proud to have overcome?
                  </label>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.86rem', color: '#6A564C', fontStyle: 'italic' }}>
                    আপনি কি আপনার জীবনে এমন কোনো কঠিন মুহূর্তের সম্মুখীন হয়েছেন যা আপনি সফলভাবে কাটিয়ে উঠেছেন এবং যার জন্য আপনি গর্বিত?
                  </p>
                  <textarea
                    rows={3}
                    value={formData.answers.q2 || ''}
                    onChange={(e) => handleAnswerChange('q2', e.target.value)}
                    placeholder="Share any challenges you overcame..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1.5px solid var(--soft-gold-line)',
                      fontSize: '0.95rem',
                      color: '#241A15',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Q3 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#241A15', lineHeight: 1.45, marginBottom: '0.2rem' }}>
                    3) Have you experienced funny, embarrassing or silly moments in your life that have made you laugh - would you share them with us?
                  </label>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.86rem', color: '#6A564C', fontStyle: 'italic' }}>
                    আপনার জীবনে কি এমন কোনো মজার, অস্বস্তিকর বা হাসির মুহূর্ত ঘটেছে যা আপনাকে হাসিয়েছে? আপনি কি তা আমাদের সাথে শেয়ার করবেন?
                  </p>
                  <textarea
                    rows={3}
                    value={formData.answers.q3 || ''}
                    onChange={(e) => handleAnswerChange('q3', e.target.value)}
                    placeholder="Share a lighthearted memory..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1.5px solid var(--soft-gold-line)',
                      fontSize: '0.95rem',
                      color: '#241A15',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Q4 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#241A15', lineHeight: 1.45, marginBottom: '0.2rem' }}>
                    4) What are your hopes, plans and dreams for the future?
                  </label>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.86rem', color: '#6A564C', fontStyle: 'italic' }}>
                    ভবিষ্যতের জন্য আপনার আশা, পরিকল্পনা এবং স্বপ্নগুলি কী কী?
                  </p>
                  <textarea
                    rows={3}
                    value={formData.answers.q4 || ''}
                    onChange={(e) => handleAnswerChange('q4', e.target.value)}
                    placeholder="Your dreams for your craft, family and atelier..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1.5px solid var(--soft-gold-line)',
                      fontSize: '0.95rem',
                      color: '#241A15',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}

            {/* ═══════════════ STEP 3: QUESTIONS 5 TO 8 ═══════════════ */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div style={{ borderBottom: '1.5px solid #F0E6D2', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#7A2331', fontWeight: 700 }}>
                    Part II: Craft, Lineage &amp; Materials &bull; দ্বিতীয় পর্ব: শিল্প, ঐতিহ্য ও উপকরণ (Q5 - Q8)
                  </h3>
                </div>

                {/* Q5 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#241A15', lineHeight: 1.45, marginBottom: '0.2rem' }}>
                    5) How did you get interested in this art / craft, and what is it about this art that attracts you to it?
                  </label>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.86rem', color: '#6A564C', fontStyle: 'italic' }}>
                    আপনি কীভাবে এই শিল্প / কারুশিল্পের প্রতি আগ্রহী হলেন, এবং এই শিল্প সম্পর্কে এমন কী আছে যা আপনাকে এর প্রতি আকৃষ্ট করে?
                  </p>
                  <textarea
                    rows={3}
                    value={formData.answers.q5 || ''}
                    onChange={(e) => handleAnswerChange('q5', e.target.value)}
                    placeholder="Your passion and beginnings..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1.5px solid var(--soft-gold-line)',
                      fontSize: '0.95rem',
                      color: '#241A15',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Q6 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#241A15', lineHeight: 1.45, marginBottom: '0.2rem' }}>
                    6) Who taught you? Do you also now teach to others? (please specify who and where)
                  </label>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.86rem', color: '#6A564C', fontStyle: 'italic' }}>
                    আপনাকে কে শিখিয়েছেন? আপনি কি এখন অন্যদেরও শেখান? (যদি শেখান, তবে কে এবং কোথায়, তা উল্লেখ করুন)
                  </p>
                  <textarea
                    rows={3}
                    value={formData.answers.q6 || ''}
                    onChange={(e) => handleAnswerChange('q6', e.target.value)}
                    placeholder="Master weavers, teachers, apprentices..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1.5px solid var(--soft-gold-line)',
                      fontSize: '0.95rem',
                      color: '#241A15',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Q7 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#241A15', lineHeight: 1.45, marginBottom: '0.2rem' }}>
                    7) What did you have to do to learn and master this art / craft?
                  </label>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.86rem', color: '#6A564C', fontStyle: 'italic' }}>
                    এই শিল্প / কারুশিল্প শিখতে এবং আয়ত্ত করতে আপনাকে কী কী করতে হয়েছে?
                  </p>
                  <textarea
                    rows={3}
                    value={formData.answers.q7 || ''}
                    onChange={(e) => handleAnswerChange('q7', e.target.value)}
                    placeholder="Years of practice, dedication, master techniques..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1.5px solid var(--soft-gold-line)',
                      fontSize: '0.95rem',
                      color: '#241A15',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Q8 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#241A15', lineHeight: 1.45, marginBottom: '0.2rem' }}>
                    8) What kind of materials do you use? Are they easy / difficult to work with? How do you obtain them? Do you make / prepare any of them? Are any of your materials recycled, reclaimed or reused?
                  </label>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.86rem', color: '#6A564C', fontStyle: 'italic' }}>
                    আপনি কী ধরনের উপকরণ ব্যবহার করেন? এগুলো কি ব্যবহার করতে সহজ / কঠিন? আপনি এগুলো কোথা থেকে সংগ্রহ করেন? আপনি কি নিজে এগুলো তৈরি / প্রস্তুত করেন? আপনার উপকরণের মধ্যে কি কোনওটি পুনর্ব্যবহার করা / পুনরুদ্ধার করা (recycled / reclaimed or reused) হয়?
                  </p>
                  <textarea
                    rows={3}
                    value={formData.answers.q8 || ''}
                    onChange={(e) => handleAnswerChange('q8', e.target.value)}
                    placeholder="Mulberry silk, metallic zari, natural indigo dyes, teak wood..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1.5px solid var(--soft-gold-line)',
                      fontSize: '0.95rem',
                      color: '#241A15',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}

            {/* ═══════════════ STEP 4: QUESTIONS 9 TO 14 ═══════════════ */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div style={{ borderBottom: '1.5px solid #F0E6D2', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#7A2331', fontWeight: 700 }}>
                    Part III: Community, Inspiration &amp; Design &bull; তৃতীয় পর্ব: সমাজ ও অনুপ্রেরণা (Q9 - Q14)
                  </h3>
                </div>

                {/* Q9 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#241A15', lineHeight: 1.45, marginBottom: '0.2rem' }}>
                    9) What is your favorite thing about your art / craft? What do you find the most challenging?
                  </label>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.86rem', color: '#6A564C', fontStyle: 'italic' }}>
                    আপনার শিল্প / কারুশিল্পের কোন বিষয়টি আপনার সবচেয়ে প্রিয়? কোন বিষয়টি আপনার কাছে সবচেয়ে বেশি চ্যালেঞ্জিং মনে হয়?
                  </p>
                  <textarea
                    rows={3}
                    value={formData.answers.q9 || ''}
                    onChange={(e) => handleAnswerChange('q9', e.target.value)}
                    placeholder="Your joy and challenges..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1.5px solid var(--soft-gold-line)',
                      fontSize: '0.95rem',
                      color: '#241A15',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Q10 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#241A15', lineHeight: 1.45, marginBottom: '0.2rem' }}>
                    10) Where do you get your inspiration from?
                  </label>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.86rem', color: '#6A564C', fontStyle: 'italic' }}>
                    আপনি কোথা থেকে আপনার কাজের অনুপ্রেরণা পান?
                  </p>
                  <textarea
                    rows={3}
                    value={formData.answers.q10 || ''}
                    onChange={(e) => handleAnswerChange('q10', e.target.value)}
                    placeholder="Temple architecture, nature, royal heritage..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1.5px solid var(--soft-gold-line)',
                      fontSize: '0.95rem',
                      color: '#241A15',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Q11 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#241A15', lineHeight: 1.45, marginBottom: '0.2rem' }}>
                    11) Describe what it has been like to get started on your own?
                  </label>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.86rem', color: '#6A564C', fontStyle: 'italic' }}>
                    নিজের উদ্যোগে বা স্বাধীনভাবে কাজ শুরু করার অভিজ্ঞতা কেমন ছিল, তা বর্ণনা করুন।
                  </p>
                  <textarea
                    rows={3}
                    value={formData.answers.q11 || ''}
                    onChange={(e) => handleAnswerChange('q11', e.target.value)}
                    placeholder="Setting up your own loom or workshop..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1.5px solid var(--soft-gold-line)',
                      fontSize: '0.95rem',
                      color: '#241A15',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Q12 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#241A15', lineHeight: 1.45, marginBottom: '0.2rem' }}>
                    12) If you work with family members, how do you organize the work? (Who does what?)
                  </label>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.86rem', color: '#6A564C', fontStyle: 'italic' }}>
                    আপনি যদি পরিবারের সদস্যদের সাথে কাজ করেন, তবে আপনারা কীভাবে কাজটিকে সংগঠিত করবেন? (কে কী করে?)
                  </p>
                  <textarea
                    rows={3}
                    value={formData.answers.q12 || ''}
                    onChange={(e) => handleAnswerChange('q12', e.target.value)}
                    placeholder="Family roles in spinning, warping, embroidery..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1.5px solid var(--soft-gold-line)',
                      fontSize: '0.95rem',
                      color: '#241A15',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Q13 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#241A15', lineHeight: 1.45, marginBottom: '0.2rem' }}>
                    13) If you only design, what qualities do you look for in artisans that would craft your designs?
                  </label>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.86rem', color: '#6A564C', fontStyle: 'italic' }}>
                    যদি আপনি শুধুমাত্র ডিজাইন করেন, তাহলে আপনার ডিজাইনগুলি যারা তৈরি করবে সেই কারিগরদের মধ্যে আপনি কোন গুণাবলী খুঁজবেন?
                  </p>
                  <textarea
                    rows={3}
                    value={formData.answers.q13 || ''}
                    onChange={(e) => handleAnswerChange('q13', e.target.value)}
                    placeholder="Patience, precision, heritage fidelity..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1.5px solid var(--soft-gold-line)',
                      fontSize: '0.95rem',
                      color: '#241A15',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Q14 */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#241A15', lineHeight: 1.45, marginBottom: '0.2rem' }}>
                    14) Describe any benefits your craft / workshop brings to your local community.
                  </label>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.86rem', color: '#6A564C', fontStyle: 'italic' }}>
                    আপনার শিল্প / কর্মশালা আপনার স্থানীয় সম্প্রদায়ের জন্য কী কী সুবিধা নিয়ে আসে তা বর্ণনা করুন।
                  </p>
                  <textarea
                    rows={3}
                    value={formData.answers.q14 || ''}
                    onChange={(e) => handleAnswerChange('q14', e.target.value)}
                    placeholder="Livelihoods, women empowerment, preservation..."
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: '1.5px solid var(--soft-gold-line)',
                      fontSize: '0.95rem',
                      color: '#241A15',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ textAlign: 'center', padding: '1rem', background: '#FAF7F2', borderRadius: '8px', color: '#7A2331', fontWeight: 700, letterSpacing: '0.1em' }}>
                  THANK YOU! &bull; ধন্যবাদ!
                </div>
              </div>
            )}

            {/* ═══════════════ STEP 5: CHILD LABOR AGREEMENT & SUBMISSION ═══════════════ */}
            {currentStep === 5 && (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div style={{ borderBottom: '1.5px solid #F0E6D2', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#7A2331', fontWeight: 700 }}>
                    Step 5: Ethical Agreement &amp; Submission &bull; শিশুশ্রম বিরোধী চুক্তি ও স্বাক্ষর
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
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', fontSize: '0.96rem', color: '#7A2331' }}>
                      HOUSE OF GARGI &amp; NOVICA COMPULSORY CHILD LABOR AGREEMENT
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: '#8C7B70' }}>FOR ARTISANS AND SUPPLIERS</span>
                  </div>

                  <p>
                    <strong>Commitment:</strong> House of Gargi &amp; NOVICA&apos;s commitment to the respect and promotion of human rights is an essential part of its business practices and mission. The Child Labor Agreement is based on the rights set forth in the UN Convention of the Rights of the Child and in the conventions of the International Labor Organization.
                  </p>
                  <p>
                    All artisans and suppliers are required to sign this Agreement as an indication of their commitment to comply with the regulations herein established.
                  </p>

                  <p style={{ fontWeight: 700, color: '#241A15' }}>I. &ldquo;No Child Labor&rdquo; Policy:</p>
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

                  <p style={{ fontWeight: 700, color: '#241A15', marginTop: '1rem' }}>
                    II. Readiness for Workplace Inspection:
                  </p>
                  <p>
                    In order to enforce its No Child Labor policy and reassure both customers and the public that no children are exploited, House of Gargi &amp; NOVICA requires all artisans to consent to periodic inspections of their workshops or homes by authorized representatives and independent human rights monitors. Advance notice will not always be provided prior to inspection to preserve the integrity of the process.
                  </p>
                </div>

                {/* 2 COMPULSORY TICKS (CHECKBOXES) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#FFFFFF', padding: '1rem 0' }}>
                  
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
                        1. I hereby agree to abide by the House of Gargi &amp; NOVICA Child Labor Agreement.
                      </strong>
                      <span style={{ display: 'block', fontSize: '0.84rem', color: '#6E5D53', fontStyle: 'italic', marginTop: '0.25rem', lineHeight: 1.4 }}>
                        আমি শিশুশ্রম বিরোধী চুক্তিটি সম্পূর্ণ পড়েছি এবং মেনে চলার সম্মতি দিচ্ছি।
                      </span>
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
                      <span style={{ display: 'block', fontSize: '0.84rem', color: '#6E5D53', fontStyle: 'italic', marginTop: '0.25rem', lineHeight: 1.4 }}>
                        আমি আমার কর্মশালা পরিদর্শনের অনুমতি দিচ্ছি এবং নিশ্চিত করছি যে এই প্রশ্নাবলীতে দেওয়া সমস্ত তথ্য সত্য।
                      </span>
                    </div>
                  </label>
                </div>

                {/* SIGNATURE & DATE */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', borderTop: '1px solid #F0E6D2', paddingTop: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#241A15', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                      SIGNATURE OF ARTISAN / শিল্পীর পূর্ণ স্বাক্ষর: <span style={{ color: '#7A2331' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.signature}
                      onChange={(e) => handleInputChange('signature', e.target.value)}
                      placeholder="Type your full legal name as signature"
                      required
                      style={{
                        width: '100%',
                        padding: '0.82rem 1rem',
                        borderRadius: '8px',
                        border: '1.5px solid var(--soft-gold-line)',
                        fontSize: '0.98rem',
                        outline: 'none',
                        color: '#241A15',
                        background: '#FFFFFF',
                        fontFamily: "'Courier New', monospace",
                        fontWeight: 700,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#241A15', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                      DATE / তারিখ:
                    </label>
                    <input
                      type="text"
                      value={formData.signatureDate}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '0.82rem 1rem',
                        borderRadius: '8px',
                        border: '1.5px solid #EAE2D5',
                        fontSize: '0.95rem',
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
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.65rem',
                    cursor: formData.agreedChildLabor && formData.agreedInspection && !loading ? 'pointer' : 'not-allowed',
                    transition: 'all 200ms ease',
                    marginTop: '0.5rem',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <ShieldCheck style={{ width: 20, height: 20 }} />
                      Submit Artisan Application &bull; আবেদনপত্র জমা দিন
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Stepper Navigation Buttons (Steps 1 to 4) */}
            {currentStep < 5 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #F0E6D2',
                paddingTop: '1.75rem',
                marginTop: '2rem',
              }}>
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.8rem 1.6rem',
                      borderRadius: '8px',
                      background: '#FFFFFF',
                      border: '1.5px solid var(--soft-gold-line)',
                      color: '#241A15',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
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
                    padding: '0.85rem 2rem',
                    borderRadius: '8px',
                    background: '#7A2331',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                >
                  {currentStep === 4 ? 'Proceed to Agreement &bull; চুক্তিতে যান' : 'Next &bull; পরবর্তী'}
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
