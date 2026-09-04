import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import ProductCard from '@/components/ProductCard';
import { categories, products, featuredProductIds } from '@/data/products';
import { DiyaIcon, ArrowRightIcon, LotusIcon, HandloomIcon, HeritageDiyaIcon, SilkOriginIcon, GoldZariIcon, AtelierSealIcon } from '@/components/Icons';

export default function HomePage() {
  const featured = featuredProductIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is typeof products[0] => Boolean(p));

  return (
    <>
      {/* ═══════ 1. HERO ═══════ */}
      <section className="hero">
        <div className="hero__bg">
          <img src="/images/hero-desktop.png" alt="House of Gargi — Handcrafted Heritage" />
        </div>
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1 className="hero__tagline">Handcrafted Heritage, Worn Today.</h1>
          <p className="hero__subtitle">Luxury handmade Indian fashion — woven by hand, worn for a lifetime.</p>
          <Link href="/category/sarees" className="btn btn--gold">Explore the Collection</Link>
        </div>
      </section>

      {/* ═══════ 2. VISION STRIP (ATELIER HERITAGE PILLARS) ═══════ */}
      <section className="section section--ivory" style={{ padding: '36px 0' }}>
        <div className="container">
          <ScrollReveal>
            <div className="vision-strip-wrapper">
              <div className="vision-strip">
                <div className="vision-strip__item">
                  <div className="vision-strip__sanskrit">हस्तशिल्प</div>
                  <div className="vision-strip__icon"><HandloomIcon size={22} /></div>
                  <h3 className="vision-strip__title">Pure Pit Loom</h3>
                  <p className="vision-strip__text">Hand-interlocked weft &amp; warp</p>
                </div>
                <div className="vision-strip__item">
                  <div className="vision-strip__sanskrit">परम्परा</div>
                  <div className="vision-strip__icon"><HeritageDiyaIcon size={22} /></div>
                  <h3 className="vision-strip__title">7th-Gen Lineage</h3>
                  <p className="vision-strip__text">Master weaving dynasties</p>
                </div>
                <div className="vision-strip__item">
                  <div className="vision-strip__sanskrit">सत्यता</div>
                  <div className="vision-strip__icon"><SilkOriginIcon size={22} /></div>
                  <h3 className="vision-strip__title">GI-Tagged Silk</h3>
                  <p className="vision-strip__text">100% Ahimsa &amp; Mulberry</p>
                </div>
                <div className="vision-strip__item">
                  <div className="vision-strip__sanskrit">अलंकार</div>
                  <div className="vision-strip__icon"><GoldZariIcon size={22} /></div>
                  <h3 className="vision-strip__title">Precious Zari</h3>
                  <p className="vision-strip__text">Real silver &amp; 24k gold wire</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ 3. SHOP BY CATEGORY ═══════ */}
      <section className="section section--sand">
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2>Shop by Collection</h2>
              <p className="subtitle-italic" style={{ color: 'var(--stone-taupe)', marginTop: '12px' }}>
                Explore our curated lines of traditional wear
              </p>
            </div>
          </ScrollReveal>
          <div className="category-grid">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.id} style={{ transitionDelay: `${i * 100}ms` }}>
                <Link href={`/category/${cat.id}`} className="category-tile">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                  <div className="category-tile__border" />
                  <div className="category-tile__label">
                    <h3>{cat.name}</h3>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Explore <ArrowRightIcon size={14} />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 4. OUR STORY ═══════ */}
      <section className="section section--ivory">
        <div className="container">
          <ScrollReveal>
            <div className="story-split">
              <div className="story-split__image-wrap">
                <img src="/assets/artisan-hands.png" alt="Artisan hand-embroidering pure gold zari" />
                <div className="story-split__seal">
                  <AtelierSealIcon size={34} />
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '2px' }}>BHARAT</span>
                </div>
              </div>
              <div className="story-split__copy">
                <div className="story-epigraph">
                  <span>✦ गार्गी सूत्रम्</span>
                  <span style={{ opacity: 0.5 }}>|</span>
                  <span>Vedic Philosophy &amp; Couture</span>
                </div>
                <h2 style={{ color: 'var(--maharani-maroon)' }}>The House of Gargi Story</h2>
                <p>
                  Named after <strong>Gargi Vachaknavi</strong> — the renowned Vedic philosopher who fearlessly debated the nature of the cosmos at the court of King Janaka — our house honours the matriarchs and master artisans who weave, stitch, and dye India&apos;s most sacred textiles.
                </p>
                <p>
                  Every piece in our collection is crafted by hand using techniques refined over centuries. We don&apos;t mass manufacture — we commission. Each saree, lehenga, and kurta set is an intimate collaboration between our design atelier and heritage weaving families across Varanasi, Chanderi, and Kutch.
                </p>

                {/* Archival Provenance Ledger */}
                <div className="provenance-ledger">
                  <div className="provenance-ledger__item">
                    <span className="provenance-ledger__val">180+ Hours</span>
                    <span className="provenance-ledger__label">Handloom Weaving</span>
                  </div>
                  <div className="provenance-ledger__item">
                    <span className="provenance-ledger__val">7 Dynasties</span>
                    <span className="provenance-ledger__label">Weaver Families</span>
                  </div>
                  <div className="provenance-ledger__item">
                    <span className="provenance-ledger__val">100% Pure Zari</span>
                    <span className="provenance-ledger__label">Silver &amp; Gold Wire</span>
                  </div>
                </div>

                <p className="subtitle-italic" style={{ color: 'var(--ink-brown)', fontSize: '18px', marginTop: '12px' }}>
                  Woven by hand. Worn for a lifetime.
                </p>
                <Link href="/our-story" className="btn btn--outline" style={{ marginTop: '18px' }}>Read Our Story</Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ 5. FEATURED PRODUCTS ═══════ */}
      <section className="section section--sand">
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2>Featured Curations</h2>
              <p className="subtitle-italic" style={{ color: 'var(--stone-taupe)', marginTop: '12px' }}>
                Our most loved pieces, selected for you
              </p>
            </div>
          </ScrollReveal>
          <div className="product-grid">
            {featured.map(product => (
              <ScrollReveal key={product.id}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 6. CRAFTSMANSHIP BANNER ═══════ */}
      <section className="section section--ivory">
        <div className="container">
          <ScrollReveal>
            <div className="craft-banner">
              <div className="craft-banner__bg">
                <img src="/assets/craft-story-banner.png" alt="Artisans at handloom" />
              </div>
              <div className="craft-banner__overlay" />
              <div className="craft-banner__content">
                <h2>Why House of Gargi</h2>
                <div className="craft-points">
                  <div className="craft-points__item">
                    <span className="craft-points__icon"><LotusIcon size={18} /></span>
                    <p><strong>100% Handmade:</strong> Every piece is crafted by skilled artisans, preserving techniques passed down through generations.</p>
                  </div>
                  <div className="craft-points__item">
                    <span className="craft-points__icon"><DiyaIcon size={18} /></span>
                    <p><strong>Ethically Sourced:</strong> We partner directly with weaving families across India to ensure fair wages and sustainable practices.</p>
                  </div>
                  <div className="craft-points__item">
                    <span className="craft-points__icon"><LotusIcon size={18} /></span>
                    <p><strong>Limited Edition:</strong> Because true craft takes time, our collections are small-batch and uniquely yours.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* European Provenance & Authenticity Ledger */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: '16px',
              marginTop: '40px',
              padding: '20px 24px',
              background: 'rgba(255, 255, 255, 0.65)',
              border: '1px solid var(--soft-gold-line)',
              borderRadius: '4px',
              fontSize: '12.5px',
              fontFamily: 'var(--font-nav)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--stone-taupe)',
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--gargi-gold)' }}>✦</span> Silk Mark India Certified
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--gargi-gold)' }}>✦</span> Handloom Mark GI Authenticated
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--gargi-gold)' }}>✦</span> Direct Artisan Guild Patronage
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--gargi-gold)' }}>✦</span> Worldwide Couture White-Glove Dispatch
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ 7. NEWSLETTER (ATELIER GAZETTE & PRIVATE SALON) ═══════ */}
      <section className="section section--sand" style={{ padding: '80px 0' }}>
        <div className="container">
          <ScrollReveal>
            <div className="salon-card">
              <div className="salon-card__crest">
                <span className="salon-card__crest-line"></span>
                <DiyaIcon size={20} style={{ color: 'var(--gargi-gold)' }} />
                <span className="salon-card__crest-line"></span>
              </div>
              <div className="salon-card__sanskrit">पत्रिका संवादः • Patrikā Saṁvādaḥ</div>
              <h2>The Atelier Gazette &amp; Private Salon</h2>
              <p>
                Receive seasonal private monographs documenting ancient Indian textile lineages, preview bespoke bridal collections, and access private atelier appointments across Europe and India.
              </p>
              <div className="salon-card__input-group">
                <input type="email" placeholder="Your distinguished email address" aria-label="Email address" />
                <button type="button" className="btn btn--primary">Request Invitation</button>
              </div>
              <div className="salon-card__privacy">
                ✦ Dispatches are issued quarterly with quiet discretion. Silk Mark India authenticated.
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
