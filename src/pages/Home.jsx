import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import ProductCard from '../components/ProductCard';
import { categories, products, featuredProductIds, formatPrice } from '../data/products';

import heroImg from '../assets/hero-desktop.png';
import artisanImg from '../assets/artisan-hands.png';
import craftBannerImg from '../assets/craft-story-banner.png';

export default function Home() {
  const featured = featuredProductIds.map(id => products.find(p => p.id === id)).filter(Boolean);

  return (
    <>
      {/* ═══════ 1. HERO ═══════ */}
      <section className="hero">
        <div className="hero__bg">
          <img src={heroImg} alt="House of Gargi — Handcrafted Heritage" />
        </div>
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1 className="hero__tagline">Handcrafted Heritage, Worn Today.</h1>
          <p className="hero__subtitle">Luxury handmade Indian fashion — woven by hand, worn for a lifetime.</p>
          <Link to="/category/sarees" className="btn btn--gold">Explore the Collection</Link>
        </div>
      </section>

      {/* ═══════ 2. VISION STRIP ═══════ */}
      <section className="section section--ivory">
        <div className="container">
          <ScrollReveal>
            <div className="vision-strip">
              <div className="vision-strip__item">
                <div className="vision-strip__icon">✦</div>
                <div className="vision-strip__title">Handmade</div>
                <div className="vision-strip__text">Every piece crafted entirely by artisan hands</div>
              </div>
              <div className="vision-strip__divider" />
              <div className="vision-strip__item">
                <div className="vision-strip__icon">🪔</div>
                <div className="vision-strip__title">Traditional Craft</div>
                <div className="vision-strip__text">Techniques passed down through generations</div>
              </div>
              <div className="vision-strip__divider" />
              <div className="vision-strip__item">
                <div className="vision-strip__icon">❋</div>
                <div className="vision-strip__title">Modern Elegance</div>
                <div className="vision-strip__text">Heritage silhouettes for the contemporary woman</div>
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
              <p className="serif-italic" style={{ color: 'var(--stone-taupe)', marginTop: '8px', fontSize: '18px' }}>
                Curated categories, each a world of craft unto itself.
              </p>
            </div>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.id} style={{ transitionDelay: `${i * 100}ms` }}>
                <Link to={`/category/${cat.id}`} className="category-tile">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                  <div className="category-tile__border" />
                  <div className="category-tile__label">
                    <h3>{cat.name}</h3>
                    <span>Explore →</span>
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
              <div className="story-split__image">
                <img src={artisanImg} alt="Artisan hand-embroidering gold zari" />
              </div>
              <div className="story-split__copy">
                <h2 style={{ color: 'var(--maharani-maroon)' }}>The House of Gargi Story</h2>
                <p>
                  Named after Gargi Vachaknavi — the Vedic-era scholar who fearlessly debated the nature of the universe — our house honours the women who weave, stitch, print, and dye India's most extraordinary textiles.
                </p>
                <p>
                  Every piece in our collection is handmade by skilled artisans using techniques that have been refined over centuries. We don't manufacture — we commission. Each saree, lehenga, and kurta set is a collaboration between our design atelier and the artisan families who've kept these traditions alive.
                </p>
                <p style={{ fontStyle: 'italic', color: 'var(--ink-brown)' }}>
                  Woven by hand. Worn for a lifetime.
                </p>
                <Link to="/our-story" className="btn btn--outline" style={{ marginTop: '16px' }}>Read Our Story</Link>
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
              <h2>Featured Pieces</h2>
              <p className="serif-italic" style={{ color: 'var(--stone-taupe)', marginTop: '8px', fontSize: '18px' }}>
                Handpicked from across our collections.
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
                <img src={craftBannerImg} alt="Artisans at handloom" />
              </div>
              <div className="craft-banner__overlay" />
              <div className="craft-banner__content">
                <h2>Why House of Gargi</h2>
                <div className="craft-points">
                  <div className="craft-points__item">
                    <span className="craft-points__icon">✦</span>
                    <span><strong>Handmade guarantee</strong> — every piece is crafted entirely by human hands, never machine-produced.</span>
                  </div>
                  <div className="craft-points__item">
                    <span className="craft-points__icon">✦</span>
                    <span><strong>Ethical sourcing</strong> — fair wages, safe workshops, and direct relationships with artisan families.</span>
                  </div>
                  <div className="craft-points__item">
                    <span className="craft-points__icon">✦</span>
                    <span><strong>Limited editions</strong> — small batches that honour the time each technique demands. No mass production.</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ 7. NEWSLETTER ═══════ */}
      <section className="section section--sand">
        <div className="container">
          <ScrollReveal>
            <div className="divider"><span className="divider__icon">🪔</span></div>
            <div className="newsletter">
              <h2>Join the House of Gargi Family</h2>
              <p style={{ color: 'var(--stone-taupe)', marginTop: '8px' }}>
                Be the first to know about new collections, artisan stories, and exclusive offers.
              </p>
              <div className="newsletter__input-group">
                <input type="email" placeholder="Your email address" />
                <button className="btn btn--primary">Subscribe</button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
