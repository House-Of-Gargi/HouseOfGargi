import Link from 'next/link';
import { ArrowRight, MapPin, Award, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { getAllArtisans } from '@/data/artisans';

export const metadata = {
  title: 'Our Master Artisans | House of Gargi',
  description: 'Meet the generational master weavers and craft virtuosos across Varanasi, Kanchipuram, Lucknow, Paithan, and Kutch who handcraft House of Gargi heirlooms.',
};

export default function OurArtisansPage() {
  const artisans = getAllArtisans();

  return (
    <>
      {/* ── 1. HERO BANNER ── */}
      <div className="category-banner" style={{ height: '420px', position: 'relative' }}>
        <img src="/images/artisans_banner.png" alt="House of Gargi Master Artisans at work" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(36, 26, 21, 0.4) 0%, rgba(36, 26, 21, 0.85) 100%)' }} />
        <div className="category-banner__content" style={{ maxWidth: '850px', padding: '0 24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(201, 162, 39, 0.2)',
            border: '1px solid rgba(201, 162, 39, 0.45)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '11.5px',
            fontFamily: 'var(--font-nav)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#FBF6EE',
            fontWeight: 700,
            marginBottom: '14px',
          }}>
            <Sparkles size={13} style={{ color: 'var(--gargi-gold)' }} />
            <span>Generational Master Weavers Guild</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', fontFamily: 'var(--font-serif)', color: '#FFFFFF', marginBottom: '10px' }}>
            The Hands of Heritage
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', maxWidth: '640px', margin: '0 auto' }}>
            Meet the venerable master craftsmen and women who preserve centuries-old handloom arts across the Indian subcontinent.
          </p>
        </div>
      </div>

      {/* ── 2. GUILD MANIFESTO & PILLARS ── */}
      <section className="section section--ivory" style={{ padding: '64px 0 40px' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="section__eyebrow">✦ The Living Traditions</span>
              <h2 style={{ color: 'var(--maharani-maroon)', marginTop: '8px', marginBottom: '16px' }}>
                Custodians of Sacred Craftsmanship
              </h2>
              <p style={{ color: 'var(--stone-taupe)', fontSize: '17px', lineHeight: '1.85', margin: '0 auto', maxWidth: '780px' }}>
                At House of Gargi, we believe true luxury is born of human patience, unbroken heritage, and unhurried time. Every thread of Kadwa zari, Korvai interlock, and Awadhi zardozi is guided by the instincts of generational masters whose techniques cannot be replicated by any modern machine.
              </p>
            </div>
          </ScrollReveal>

          {/* Value Badges */}
          <ScrollReveal>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
              marginTop: '32px',
            }}>
              <div style={{
                background: '#FFFFFF',
                border: '1px solid rgba(201, 162, 39, 0.3)',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(43, 31, 24, 0.03)',
              }}>
                <div style={{ color: 'var(--gargi-gold)', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                  <Layers size={28} strokeWidth={1.5} />
                </div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--ink-brown)', marginBottom: '6px' }}>
                  Generational Lineage
                </h4>
                <p style={{ fontSize: '13.5px', color: 'var(--stone-taupe)', lineHeight: 1.6 }}>
                  Direct partnerships with 3rd to 10th generation master weaving lineages across historic Indian craft clusters.
                </p>
              </div>

              <div style={{
                background: '#FFFFFF',
                border: '1px solid rgba(201, 162, 39, 0.3)',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(43, 31, 24, 0.03)',
              }}>
                <div style={{ color: 'var(--gargi-gold)', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                  <ShieldCheck size={28} strokeWidth={1.5} />
                </div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--ink-brown)', marginBottom: '6px' }}>
                  Fair Trade Royalties
                </h4>
                <p style={{ fontSize: '13.5px', color: 'var(--stone-taupe)', lineHeight: 1.6 }}>
                  Every piece directly finances loom development, healthcare, and fair living wages for artisan families.
                </p>
              </div>

              <div style={{
                background: '#FFFFFF',
                border: '1px solid rgba(201, 162, 39, 0.3)',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(43, 31, 24, 0.03)',
              }}>
                <div style={{ color: 'var(--gargi-gold)', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                  <Award size={28} strokeWidth={1.5} />
                </div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--ink-brown)', marginBottom: '6px' }}>
                  Verified GI &amp; Silk Mark
                </h4>
                <p style={{ fontSize: '13.5px', color: 'var(--stone-taupe)', lineHeight: 1.6 }}>
                  100% authentic geographical indication provenance with authenticated handloom certifications.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 3. MASTER ARTISAN GUILD DIRECTORY GRID ── */}
      <section className="section section--sand" style={{ padding: '64px 0 80px' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <span className="section__eyebrow">✦ The Master Weavers &amp; Virtuosos</span>
              <h2 style={{ color: 'var(--ink-brown)', marginTop: '8px', marginBottom: '12px' }}>
                Explore Master Artisan Profiles
              </h2>
              <p style={{ color: 'var(--stone-taupe)', fontSize: '16px', maxWidth: '640px', margin: '0 auto' }}>
                Select an artisan to explore their generational lineage, loom techniques, philosophy, and the exclusive pieces they have crafted.
              </p>
            </div>
          </ScrollReveal>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '28px',
          }}>
            {artisans.map(artisan => (
              <ScrollReveal key={artisan.id}>
                <Link
                  href={`/artisan/${artisan.id}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid rgba(201, 162, 39, 0.28)',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 4px 20px rgba(43, 31, 24, 0.04)',
                    height: '100%',
                  }}
                  className="artisan-guild-card"
                >
                  {/* Card Cover with Avatar */}
                  <div style={{ position: 'relative', height: '180px', background: '#241A15', overflow: 'hidden' }}>
                    <img
                      src={artisan.coverImage || artisan.image}
                      alt={artisan.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(36,26,21,0.2) 0%, rgba(36,26,21,0.75) 100%)' }} />
                    
                    {/* Lineage Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      background: 'rgba(255, 255, 255, 0.92)',
                      color: 'var(--maharani-maroon)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-nav)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}>
                      {artisan.lineage.split(' ')[0]} {artisan.lineage.split(' ')[1]}
                    </div>

                    {/* Region Pill */}
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '14px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      fontFamily: 'var(--font-nav)',
                      textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                    }}>
                      <MapPin size={13} style={{ color: 'var(--gargi-gold)' }} />
                      {artisan.region}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '20px',
                      color: 'var(--ink-brown)',
                      marginBottom: '4px',
                      fontWeight: 700,
                    }}>
                      {artisan.name}
                    </h3>

                    <div style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: '14px',
                      color: 'var(--maharani-maroon)',
                      marginBottom: '12px',
                    }}>
                      {artisan.role}
                    </div>

                    <p style={{
                      fontSize: '13.5px',
                      lineHeight: 1.7,
                      color: 'var(--stone-taupe)',
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flexGrow: 1,
                    }}>
                      {artisan.bio}
                    </p>

                    {/* Specialties Chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                      {artisan.specialties.slice(0, 3).map(spec => (
                        <span
                          key={spec}
                          style={{
                            fontSize: '11px',
                            background: 'rgba(201, 162, 39, 0.08)',
                            color: '#725010',
                            padding: '3px 8px',
                            borderRadius: '10px',
                            fontWeight: 600,
                          }}
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Footer CTA */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '14px',
                      borderTop: '1px solid rgba(201, 162, 39, 0.2)',
                      marginTop: 'auto',
                    }}>
                      <span style={{ fontSize: '12px', color: 'var(--stone-taupe)', fontWeight: 600 }}>
                        {artisan.experienceYears}+ Yrs Mastery &bull; {artisan.productIds.length} {artisan.productIds.length === 1 ? 'Masterpiece' : 'Pieces'}
                      </span>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        fontFamily: 'var(--font-nav)',
                        fontWeight: 700,
                        color: 'var(--maharani-maroon)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}>
                        Meet Artisan <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. FAIR TRADE COMMITMENT ── */}
      <section className="section section--ivory">
        <div className="container">
          <ScrollReveal>
            <div className="story-split">
              <div className="story-split__image">
                <img src="/images/artisans_split.png" alt="Master artisan embroidering zardozi" />
              </div>
              <div className="story-split__copy">
                <span className="section__eyebrow">✦ Direct Patronage</span>
                <h2 style={{ color: 'var(--maharani-maroon)', marginTop: '8px' }}>Fair Trade Promise</h2>
                <p style={{ lineHeight: '1.85', color: 'var(--stone-taupe)' }}>
                  We work directly with master craftspeople without intermediaries, ensuring equitable compensation, safe pit-loom working conditions, and the international recognition they deserve. By choosing House of Gargi, you are directly investing in these artisan families and helping ancient heritage survive into the next century.
                </p>
                <p className="subtitle-italic" style={{ color: 'var(--ink-brown)', fontSize: '18px', marginTop: '16px' }}>
                  When you wear House of Gargi, you wear someone&apos;s life&apos;s work.
                </p>
                <div style={{ marginTop: '28px' }}>
                  <Link href="/shop" className="btn btn--primary">
                    Explore Handcrafted Catalog &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
