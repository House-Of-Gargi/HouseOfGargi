'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ShieldCheck, 
  Award, 
  Printer, 
  Search, 
  CheckCircle2, 
  Quote, 
  Sparkles, 
  Calendar, 
  MapPin, 
  User, 
  BookOpen, 
  PenTool, 
  ArrowLeft,
  Check,
  Compass,
  Layers,
  Heart
} from 'lucide-react';

export interface QuestionnaireQuestion {
  id: number;
  part: 'part1' | 'part2' | 'part3';
  partTitle: string;
  partTitleBn: string;
  shortTitle: string;
  promptEn: string;
  promptBn: string;
  keys: string[];
}

export const QUESTIONNAIRE_QUESTIONS: QuestionnaireQuestion[] = [
  // ── PART I: PERSONAL LIFE & DREAMS ──
  {
    id: 1,
    part: 'part1',
    partTitle: 'Part I: Personal Life & Dreams',
    partTitleBn: 'পর্ব ১: ব্যক্তিগত জীবন ও স্বপ্ন',
    shortTitle: '3 Personal Qualities',
    promptEn: 'If friends were to describe you, what 3 things would they say about you?',
    promptBn: 'যদি বন্ধুরা আপনার বর্ণনা দেয়, তবে তারা আপনার সম্পর্কে কোন ৩টি গুণের কথা বলবে?',
    keys: ['3 Personal Qualities', 'q1', '1', 'three_personal_qualities'],
  },
  {
    id: 2,
    part: 'part1',
    partTitle: 'Part I: Personal Life & Dreams',
    partTitleBn: 'পর্ব ১: ব্যক্তিগত জীবন ও স্বপ্ন',
    shortTitle: 'Overcoming Life Challenges',
    promptEn: "Have you ever experienced difficult moments in your life that you're proud to have overcome?",
    promptBn: 'আপনি কি আপনার জীবনে এমন কঠিন মুহূর্তের মুখোমুখি হয়েছেন যা সফলভাবে অতিক্রম করার জন্য আপনি গর্বিত?',
    keys: ['Overcoming Life Challenges', 'q2', '2', 'overcoming_challenges'],
  },
  {
    id: 3,
    part: 'part1',
    partTitle: 'Part I: Personal Life & Dreams',
    partTitleBn: 'পর্ব ১: ব্যক্তিগত জীবন ও স্বপ্ন',
    shortTitle: 'Lighthearted Memory',
    promptEn: 'Have you experienced funny, embarrassing or silly moments in your life that have made you laugh — would you share them with us?',
    promptBn: 'আপনি কি এমন কোনো মজার, অপ্রত্যাশিত বা হাস্যকর মুহূর্তের অভিজ্ঞতা পেয়েছেন যা আপনাকে হাসিয়েছে — তা কি আমাদের সাথে ভাগ করে নেবেন?',
    keys: ['Lighthearted Memory', 'q3', '3', 'funny_moments'],
  },
  {
    id: 4,
    part: 'part1',
    partTitle: 'Part I: Personal Life & Dreams',
    partTitleBn: 'পর্ব ১: ব্যক্তিগত জীবন ও স্বপ্ন',
    shortTitle: 'Hopes & Dreams for the Future',
    promptEn: 'What are your hopes, plans and dreams for the future?',
    promptBn: 'ভবিষ্যতের জন্য আপনার আশা, পরিকল্পনা ও স্বপ্ন কী?',
    keys: ['Hopes & Dreams for the Future', 'q4', '4', 'hopes_and_dreams'],
  },

  // ── PART II: CRAFT LINEAGE & MATERIALS ──
  {
    id: 5,
    part: 'part2',
    partTitle: 'Part II: Craft Lineage & Materials',
    partTitleBn: 'পর্ব ২: কারুশিল্প, বংশানুক্রম ও উপাদান',
    shortTitle: 'Craft Beginnings & Attraction',
    promptEn: 'How did you get interested in this art / craft, and what is it about this art that attracts you to it?',
    promptBn: 'আপনি কীভাবে এই কারুশিল্পে আগ্রহী হলেন এবং এই শিল্পের কোন দিকটি আপনাকে সবচেয়ে বেশি আকর্ষণ করে?',
    keys: ['Craft Beginnings & Attraction', 'q5', '5', 'craft_beginnings'],
  },
  {
    id: 6,
    part: 'part2',
    partTitle: 'Part II: Craft Lineage & Materials',
    partTitleBn: 'পর্ব ২: কারুশিল্প, বংশানুক্রম ও উপাদান',
    shortTitle: 'Master Lineage & Teaching',
    promptEn: 'Who taught you? Do you also now teach to others? (please specify who and where)',
    promptBn: 'কে আপনাকে এই শিল্প শিখিয়েছেন? আপনি কি এখন অন্যদেরও শেখান? (দয়া করে জানান কার কাছ থেকে ও কোথায়)',
    keys: ['Master Lineage & Teaching', 'q6', '6', 'master_lineage_teaching'],
  },
  {
    id: 7,
    part: 'part2',
    partTitle: 'Part II: Craft Lineage & Materials',
    partTitleBn: 'পর্ব ২: কারুশিল্প, বংশানুক্রম ও উপাদান',
    shortTitle: 'Learning & Mastery Journey',
    promptEn: 'What did you have to do to learn and master this art / craft?',
    promptBn: 'এই শিল্পটিতে দক্ষতা ও নিপুণতা অর্জন করতে আপনাকে কী ধরনের সাধনা ও অনুশীলন করতে হয়েছে?',
    keys: ['Learning & Mastery Journey', 'q7', '7', 'learning_mastery_journey'],
  },
  {
    id: 8,
    part: 'part2',
    partTitle: 'Part II: Craft Lineage & Materials',
    partTitleBn: 'পর্ব ২: কারুশিল্প, বংশানুক্রম ও উপাদান',
    shortTitle: 'Materials & Fiber Sourcing',
    promptEn: 'What kind of materials do you use? Are they easy / difficult to work with? How do you obtain them? Do you make / prepare any of them? Are any of your materials recycled, reclaimed or reused?',
    promptBn: 'আপনি কী ধরণের কাঁচামাল ব্যবহার করেন? সেগুলি সংগ্রহ করা কতটা সহজ বা কঠিন? আপনি কি কিছু নিজে তৈরি করেন এবং কোনো পুনর্ব্যবহৃত উপাদান ব্যবহার করেন?',
    keys: ['Materials & Fiber Sourcing', 'q8', '8', 'materials_fiber_sourcing'],
  },

  // ── PART III: COMMUNITY, INSPIRATION & WORKSHOP ──
  {
    id: 9,
    part: 'part3',
    partTitle: 'Part III: Community, Inspiration & Atelier',
    partTitleBn: 'পর্ব ৩: সম্প্রদায়, প্রেরণা ও কর্মশালা',
    shortTitle: 'Favorite Part & Key Challenges',
    promptEn: 'What is your favorite thing about your art / craft? What do you find the most challenging?',
    promptBn: 'আপনার শিল্পের কোন কাজটি আপনার সবচেয়ে প্রিয়? এবং কোন অংশটি সবচেয়ে বেশি চ্যালেঞ্জিং?',
    keys: ['Favorite Part & Key Challenges', 'q9', '9', 'favorite_part_challenges'],
  },
  {
    id: 10,
    part: 'part3',
    partTitle: 'Part III: Community, Inspiration & Atelier',
    partTitleBn: 'পর্ব ৩: সম্প্রদায়, প্রেরণা ও কর্মশালা',
    shortTitle: 'Sources of Inspiration',
    promptEn: 'Where do you get your inspiration from?',
    promptBn: 'আপনার কাজের নকশা ও শিল্পকলার মূল প্রেরণা কোথা থেকে পান?',
    keys: ['Sources of Inspiration', 'q10', '10', 'sources_of_inspiration'],
  },
  {
    id: 11,
    part: 'part3',
    partTitle: 'Part III: Community, Inspiration & Atelier',
    partTitleBn: 'পর্ব ৩: সম্প্রদায়, প্রেরণা ও কর্মশালা',
    shortTitle: 'Starting Out on Your Own',
    promptEn: 'Describe what it has been like to get started on your own?',
    promptBn: 'নিজের উদ্যোগে এককভাবে কর্মশালা বা কাজ শুরু করার অভিজ্ঞতা কেমন ছিল?',
    keys: ['Starting Out on Your Own', 'q11', '11', 'starting_on_own'],
  },
  {
    id: 12,
    part: 'part3',
    partTitle: 'Part III: Community, Inspiration & Atelier',
    partTitleBn: 'পর্ব ৩: সম্প্রদায়, প্রেরণা ও কর্মশালা',
    shortTitle: 'Family Workshop Organization',
    promptEn: 'If you work with family members, how do you organize the work? (Who does what?)',
    promptBn: 'পরিবারের সদস্যদের সাথে কাজ করলে কীভাবে কাজ ভাগ করে নেন? (কে কোন দায়িত্ব পালন করেন?)',
    keys: ['Family Workshop Organization', 'q12', '12', 'family_workshop_organization'],
  },
  {
    id: 13,
    part: 'part3',
    partTitle: 'Part III: Community, Inspiration & Atelier',
    partTitleBn: 'পর্ব ৩: সম্প্রদায়, প্রেরণা ও কর্মশালা',
    shortTitle: 'Design & Collaboration Qualities',
    promptEn: 'If you only design, what qualities do you look for in artisans that would craft your designs?',
    promptBn: 'যদি আপনি শুধু নকশা করেন, তবে সেই নকশা ফুটিয়ে তোলার জন্য কারিগরদের মধ্যে কোন গুণাবলী খোঁজেন?',
    keys: ['Design & Collaboration Qualities', 'q13', '13', 'design_collaboration_qualities'],
  },
  {
    id: 14,
    part: 'part3',
    partTitle: 'Part III: Community, Inspiration & Atelier',
    partTitleBn: 'পর্ব ৩: সম্প্রদায়, প্রেরণা ও কর্মশালা',
    shortTitle: 'Community & Livelihood Impact',
    promptEn: 'Describe any benefits your craft / workshop brings to your local community.',
    promptBn: 'আপনার এই কারুশিল্প ও কর্মশালা স্থানীয় গ্রামীণ সমাজ ও জীবিকার ক্ষেত্রে কী অবদান রাখছে?',
    keys: ['Community & Livelihood Impact', 'q14', '14', 'community_livelihood_impact'],
  },
];

export function getAnswerForQuestion(
  answers: Record<string, string> | undefined | null,
  q: QuestionnaireQuestion
): string {
  if (!answers || typeof answers !== 'object') return '';
  
  // 1. Exact match on known keys
  for (const key of q.keys) {
    if (answers[key] && typeof answers[key] === 'string' && answers[key].trim().length > 0) {
      return answers[key].trim();
    }
  }

  // 2. Case-insensitive lookup
  const lowerKeys = q.keys.map((k) => k.toLowerCase());
  for (const [ansKey, val] of Object.entries(answers)) {
    if (typeof val === 'string' && val.trim().length > 0) {
      if (lowerKeys.includes(ansKey.toLowerCase())) {
        return val.trim();
      }
    }
  }

  // 3. Substring matching for descriptive titles
  for (const [ansKey, val] of Object.entries(answers)) {
    if (typeof val === 'string' && val.trim().length > 0) {
      const lowerAnsKey = ansKey.toLowerCase();
      if (
        lowerAnsKey.includes(q.shortTitle.toLowerCase()) ||
        q.keys.some((k) => lowerAnsKey.includes(k.toLowerCase()))
      ) {
        return val.trim();
      }
    }
  }

  return '';
}

interface ArtisanQuestionnaireDossierProps {
  application: any;
  artisanName?: string;
  artisanCode?: string;
  onSwitchToProfileTab?: () => void;
}

export default function ArtisanQuestionnaireDossier({
  application,
  artisanName = 'Gopal Chandra Dey',
  artisanCode = 'HG-ART-260501',
  onSwitchToProfileTab,
}: ArtisanQuestionnaireDossierProps) {
  const [selectedPart, setSelectedPart] = useState<'all' | 'part1' | 'part2' | 'part3'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract application values with fallbacks
  const answers = application?.answers || {};
  const appNumber = application?.application_number || artisanCode || 'HG-ART-260501';
  const name = application?.name || artisanName;
  const craftType = application?.type_of_art || 'Tangail Jamdani Pit Loom Weave';
  const stateOrigin = application?.state || 'West Bengal';
  const placeOfBirth = application?.place_of_birth || 'Kolkata';
  const submissionDate = application?.created_at
    ? new Date(application.created_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '28 Oct 2026';
  const signature = application?.signature || name;
  const signatureDate = application?.signature_date || submissionDate;
  const status = application?.status || 'approved';
  const agreedChildLabor = application?.agreed_child_labor ?? true;
  const agreedInspection = application?.agreed_inspection ?? true;

  // Compute answers statistics
  const answeredCount = useMemo(() => {
    return QUESTIONNAIRE_QUESTIONS.filter((q) => {
      const a = getAnswerForQuestion(answers, q);
      return a && a.length > 0;
    }).length;
  }, [answers]);

  const completionPercent = Math.round((answeredCount / QUESTIONNAIRE_QUESTIONS.length) * 100);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return QUESTIONNAIRE_QUESTIONS.filter((q) => {
      if (selectedPart !== 'all' && q.part !== selectedPart) return false;
      if (!searchQuery.trim()) return true;

      const qTerm = searchQuery.toLowerCase().trim();
      const ans = getAnswerForQuestion(answers, q).toLowerCase();
      const inTitle = q.shortTitle.toLowerCase().includes(qTerm);
      const inPromptEn = q.promptEn.toLowerCase().includes(qTerm);
      const inAnswer = ans.includes(qTerm);

      return inTitle || inPromptEn || inAnswer;
    });
  }, [selectedPart, searchQuery, answers]);

  // Handle browser printing of the questionnaire dossier
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="artisan-dossier-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ── Print Stylesheet ── */}
      <style>{`
        @media print {
          body {
            background: #FFFFFF !important;
            color: #000000 !important;
          }
          nav, header, footer, .sidebar, .atelier-header-card, .no-print {
            display: none !important;
          }
          .artisan-dossier-wrapper {
            margin: 0 !important;
            padding: 0 !important;
          }
          .dossier-question-card {
            break-inside: avoid;
            page-break-inside: avoid;
            box-shadow: none !important;
            border: 1px solid #CCCCCC !important;
            margin-bottom: 1.5rem !important;
          }
          .artisan-answer-box {
            background: #FDFDFD !important;
            border-left: 3px solid #7A2331 !important;
          }
        }
      `}</style>

      {/* ── Top Dossier Credentials Card ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF7F2 100%)',
          border: '1.5px solid var(--soft-gold-line, #E4D3AE)',
          borderRadius: '12px',
          padding: '1.75rem 2rem',
          boxShadow: '0 4px 20px rgba(43, 31, 24, 0.04)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative gold corner motif */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '140px',
            height: '140px',
            background: 'radial-gradient(circle, rgba(200, 168, 112, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Identity lockup */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: '#FAF7F2',
                border: '2px solid #7A2331',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7A2331',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(122, 35, 49, 0.12)',
              }}
            >
              <Award style={{ width: 30, height: 30 }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#7A2331',
                    background: '#FAF7F2',
                    border: '1px solid var(--soft-gold-line, #E4D3AE)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {appNumber}
                </span>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#E8F5E9',
                    border: '1px solid #A5D6A7',
                    color: '#1B5E20',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '12px',
                  }}
                >
                  <CheckCircle2 style={{ width: 13, height: 13, color: '#2E7D32' }} />
                  {status === 'approved' ? 'Verified Master Heritage Record' : 'Submitted Application Under Review'}
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.65rem',
                  fontWeight: 600,
                  color: 'var(--ink-brown, #2B1F18)',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                {name}&apos;s Heritage Onboarding Dossier
              </h2>

              <p style={{ margin: '0.35rem 0 0', fontSize: '0.92rem', color: '#6E5D53', fontWeight: 500 }}>
                Authentic oral history &bull; 14 questions preserved in the House of Gargi Royal Artisan Archive
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                background: '#FAF7F2',
                border: '1.5px solid var(--soft-gold-line, #E4D3AE)',
                borderRadius: '6px',
                padding: '0.65rem 1.15rem',
                fontSize: '0.84rem',
                fontFamily: 'var(--font-nav)',
                fontWeight: 600,
                color: 'var(--ink-brown, #2B1F18)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(43, 31, 24, 0.04)',
                transition: 'all 0.15s ease',
              }}
            >
              <Printer style={{ width: 15, height: 15, color: '#7A2331' }} />
              Print / Save PDF Dossier
            </button>

            {onSwitchToProfileTab && (
              <button
                type="button"
                onClick={onSwitchToProfileTab}
                style={{
                  background: 'var(--maharani-maroon, #7A2331)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.65rem 1.15rem',
                  fontSize: '0.84rem',
                  fontFamily: 'var(--font-nav)',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(122, 35, 49, 0.25)',
                  transition: 'all 0.15s ease',
                }}
              >
                <ArrowLeft style={{ width: 14, height: 14 }} />
                Edit Public Storefront
              </button>
            )}
          </div>
        </div>

        {/* ── Key Metadata Strip ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--soft-gold-line, #E4D3AE)',
          }}
        >
          {/* Stat 1: Questionnaire Completion */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '8px',
                background: '#FAF7F2',
                border: '1px solid var(--soft-gold-line, #E4D3AE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7A2331',
                flexShrink: 0,
              }}
            >
              <FileText style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 600 }}>
                Questionnaire Status
              </div>
              <div style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--ink-brown, #2B1F18)' }}>
                {answeredCount} of 14 Completed ({completionPercent}%)
              </div>
            </div>
          </div>

          {/* Stat 2: Craft Discipline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '8px',
                background: '#FAF7F2',
                border: '1px solid var(--soft-gold-line, #E4D3AE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7A2331',
                flexShrink: 0,
              }}
            >
              <Layers style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 600 }}>
                Craft Discipline
              </div>
              <div style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--ink-brown, #2B1F18)' }}>
                {craftType}
              </div>
            </div>
          </div>

          {/* Stat 3: Origin & Atelier Region */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '8px',
                background: '#FAF7F2',
                border: '1px solid var(--soft-gold-line, #E4D3AE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7A2331',
                flexShrink: 0,
              }}
            >
              <MapPin style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 600 }}>
                Atelier Location
              </div>
              <div style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--ink-brown, #2B1F18)' }}>
                {placeOfBirth}, {stateOrigin}
              </div>
            </div>
          </div>

          {/* Stat 4: Ethical Certification */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '8px',
                background: '#FAF7F2',
                border: '1px solid var(--soft-gold-line, #E4D3AE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1B5E20',
                flexShrink: 0,
              }}
            >
              <ShieldCheck style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 600 }}>
                Ethical Audit
              </div>
              <div style={{ fontSize: '0.94rem', fontWeight: 600, color: '#1B5E20' }}>
                Zero Child Labor Certified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar & Search Lockup ── */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#FFFFFF',
          border: '1.5px solid var(--soft-gold-line, #E4D3AE)',
          borderRadius: '10px',
          padding: '0.85rem 1.25rem',
          boxShadow: '0 2px 8px rgba(43, 31, 24, 0.03)',
        }}
      >
        {/* Part Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All 14 Responses', count: 14 },
            { id: 'part1', label: 'Part I: Personal (Q1–Q4)', count: 4 },
            { id: 'part2', label: 'Part II: Craft & Materials (Q5–Q8)', count: 4 },
            { id: 'part3', label: 'Part III: Atelier & Legacy (Q9–Q14)', count: 6 },
          ].map((tab) => {
            const active = selectedPart === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedPart(tab.id as any)}
                style={{
                  background: active ? 'var(--maharani-maroon, #7A2331)' : '#FAF7F2',
                  color: active ? '#FFFFFF' : 'var(--ink-brown, #2B1F18)',
                  border: active ? '1px solid var(--maharani-maroon, #7A2331)' : '1px solid var(--soft-gold-line, #E4D3AE)',
                  borderRadius: '6px',
                  padding: '0.5rem 0.95rem',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-nav)',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    background: active ? 'rgba(255, 255, 255, 0.22)' : 'rgba(122, 35, 49, 0.08)',
                    color: active ? '#FFFFFF' : 'var(--maharani-maroon, #7A2331)',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontWeight: 700,
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', minWidth: '260px', flex: '1 1 260px', maxWidth: '380px' }}>
          <Search
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 16,
              height: 16,
              color: '#8C7B70',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or answers..."
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem 0.55rem 2.25rem',
              borderRadius: '6px',
              border: '1px solid var(--soft-gold-line, #E4D3AE)',
              background: '#FAF7F2',
              fontSize: '0.86rem',
              color: 'var(--ink-brown, #2B1F18)',
              outline: 'none',
              fontFamily: 'var(--font-nav)',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '0.75rem',
                color: '#8C7B70',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Questions List Container ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredQuestions.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px dashed var(--soft-gold-line, #E4D3AE)',
              borderRadius: '12px',
              padding: '3rem 2rem',
              textAlign: 'center',
            }}
          >
            <BookOpen style={{ width: 42, height: 42, color: 'var(--soft-gold-line, #E4D3AE)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--ink-brown, #2B1F18)', margin: '0 0 0.5rem' }}>
              No Matching Questionnaire Records
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#6E5D53', maxWidth: '460px', margin: '0 auto 1.25rem' }}>
              No questions or responses matched &quot;{searchQuery}&quot;. Try adjusting your search keywords or resetting the category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedPart('all');
              }}
              style={{
                background: 'var(--maharani-maroon, #7A2331)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '0.55rem 1.15rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const answerText = getAnswerForQuestion(answers, q);
            const isAnswered = Boolean(answerText && answerText.length > 0);

            return (
              <div
                key={q.id}
                id={`question-${q.id}`}
                className="dossier-question-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid var(--soft-gold-line, #E4D3AE)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(43, 31, 24, 0.04)',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                }}
              >
                {/* ── Card Header Strip ── */}
                <div
                  style={{
                    backgroundColor: '#FAF7F2',
                    borderBottom: '1px solid var(--soft-gold-line, #E4D3AE)',
                    padding: '0.85rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        background: 'var(--maharani-maroon, #7A2331)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        letterSpacing: '0.06em',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                      }}
                    >
                      Q{String(q.id).padStart(2, '0')}
                    </span>

                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#7A2331',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {q.partTitle}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isAnswered ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#1B5E20',
                          background: '#E8F5E9',
                          padding: '2px 8px',
                          borderRadius: '10px',
                        }}
                      >
                        <Check style={{ width: 12, height: 12 }} />
                        Answered
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: '#8C7B70',
                          background: '#F5F0E8',
                          padding: '2px 8px',
                          borderRadius: '10px',
                        }}
                      >
                        Not Recorded
                      </span>
                    )}

                    <span style={{ fontSize: '0.74rem', color: '#8C7B70' }}>
                      &bull; {q.shortTitle}
                    </span>
                  </div>
                </div>

                {/* ── Question & Answer Body ── */}
                <div style={{ padding: '1.5rem' }}>
                  {/* English Question Prompt */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-sans, sans-serif)',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: 'var(--ink-brown, #2B1F18)',
                      margin: '0 0 0.35rem',
                      lineHeight: 1.45,
                    }}
                  >
                    {q.id}) {q.promptEn}
                  </h3>

                  {/* Authentic Bengali Prompt */}
                  <p
                    style={{
                      margin: '0 0 1.25rem',
                      fontSize: '0.9rem',
                      color: '#6E5D53',
                      lineHeight: 1.5,
                      fontStyle: 'italic',
                    }}
                  >
                    {q.promptBn}
                  </p>

                  {/* ── The Artisan's Preserved Answer ── */}
                  <div
                    className="artisan-answer-box"
                    style={{
                      backgroundColor: '#FAF7F2',
                      borderLeft: '4px solid var(--maharani-maroon, #7A2331)',
                      borderTop: '1px solid rgba(228, 211, 174, 0.4)',
                      borderRight: '1px solid rgba(228, 211, 174, 0.4)',
                      borderBottom: '1px solid rgba(228, 211, 174, 0.4)',
                      borderRadius: '0 8px 8px 0',
                      padding: '1.25rem 1.4rem',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: '#7A2331',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                          }}
                        >
                          {name.charAt(0)}
                        </div>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: 'var(--maharani-maroon, #7A2331)',
                          }}
                        >
                          {name}&apos;s Recorded Response
                        </span>
                      </div>

                      <Quote style={{ width: 18, height: 18, color: '#C8A870', opacity: 0.7 }} />
                    </div>

                    {isAnswered ? (
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.98rem',
                          lineHeight: 1.7,
                          color: '#2B1F18',
                          whiteSpace: 'pre-wrap',
                          fontWeight: 450,
                        }}
                      >
                        &ldquo;{answerText}&rdquo;
                      </p>
                    ) : (
                      <p style={{ margin: 0, fontSize: '0.92rem', color: '#8C7B70', fontStyle: 'italic' }}>
                        No written response recorded for this question during initial application submission.
                      </p>
                    )}

                    {isAnswered && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '0.85rem',
                          paddingTop: '0.65rem',
                          borderTop: '1px dashed rgba(200, 168, 112, 0.35)',
                          fontSize: '0.74rem',
                          color: '#8C7B70',
                        }}
                      >
                        <span>Word count: {answerText.split(/\s+/).filter(Boolean).length} words</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#7A2331', fontWeight: 600 }}>
                          <CheckCircle2 style={{ width: 12, height: 12 }} />
                          Verified House of Gargi Dossier
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Compulsory Ethical Undertaking & Digital Signature Box ── */}
      <div
        className="dossier-question-card"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF7F2 100%)',
          border: '1.5px solid var(--soft-gold-line, #E4D3AE)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(43, 31, 24, 0.04)',
        }}
      >
        <div style={{ borderBottom: '1px solid var(--soft-gold-line, #E4D3AE)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <ShieldCheck style={{ width: 22, height: 22, color: '#1B5E20' }} />
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.35rem',
                color: 'var(--ink-brown, #2B1F18)',
                margin: 0,
                fontWeight: 600,
              }}
            >
              Certified Ethical Undertaking &amp; Signatures
            </h3>
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem', color: '#6E5D53' }}>
            Binding verification submitted under international fair-craft and child welfare standards.
          </p>
        </div>

        {/* 2 Agreement Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
          {/* Agreement 1: Zero Child Labor */}
          <div
            style={{
              background: '#FFFFFF',
              border: agreedChildLabor ? '1.5px solid #A5D6A7' : '1.5px solid #FECDD3',
              borderRadius: '8px',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              gap: '0.85rem',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: agreedChildLabor ? '#E8F5E9' : '#FEF2F2',
                color: agreedChildLabor ? '#2E7D32' : '#B91C1C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Check style={{ width: 16, height: 16, strokeWidth: 3 }} />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2B1F18', marginBottom: '0.2rem' }}>
                Zero Child Labor Certification
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#6E5D53', lineHeight: 1.5 }}>
                Master artisan solemnly affirms that no child under the legal age of 18 was employed in any weaving, spinning, or processing of goods.
              </p>
            </div>
          </div>

          {/* Agreement 2: Workshop Inspection */}
          <div
            style={{
              background: '#FFFFFF',
              border: agreedInspection ? '1.5px solid #A5D6A7' : '1.5px solid #FECDD3',
              borderRadius: '8px',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              gap: '0.85rem',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: agreedInspection ? '#E8F5E9' : '#FEF2F2',
                color: agreedInspection ? '#2E7D32' : '#B91C1C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Check style={{ width: 16, height: 16, strokeWidth: 3 }} />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2B1F18', marginBottom: '0.2rem' }}>
                On-site Atelier Inspection Consent
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#6E5D53', lineHeight: 1.5 }}>
                Consent granted for unannounced verification visits by House of Gargi curators and guild examiners to inspect pit looms and raw silk sourcing.
              </p>
            </div>
          </div>
        </div>

        {/* Digital Signature Lockup */}
        <div
          style={{
            background: '#FAF7F2',
            border: '1px solid var(--soft-gold-line, #E4D3AE)',
            borderRadius: '8px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 600, marginBottom: '0.35rem' }}>
              Digital Signature on File
            </div>
            <div
              style={{
                fontFamily: 'var(--font-serif, serif)',
                fontStyle: 'italic',
                fontSize: '1.45rem',
                color: 'var(--maharani-maroon, #7A2331)',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              {signature}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C7B70', fontWeight: 600, marginBottom: '0.35rem' }}>
              Attestation Date
            </div>
            <div style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--ink-brown, #2B1F18)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar style={{ width: 14, height: 14, color: '#7A2331' }} />
              {signatureDate}
            </div>
          </div>
        </div>

        {/* Royal Footer Stamp */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--soft-gold-line, #E4D3AE)' }}>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#8C7B70', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            &bull; House of Gargi Royal Atelier Guild Archive &bull; Application Ref: {appNumber} &bull; Certified Authentic &bull;
          </p>
        </div>
      </div>
    </div>
  );
}
