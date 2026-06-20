import { useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import artisanImg from '../assets/artisan-hands.png';
import craftBannerImg from '../assets/craft-story-banner.png';
import { DiyaIcon, LotusIcon, WishlistIcon, StarIcon } from '../components/Icons';

export default function OurStory() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      {/* Banner */}
      <div className="category-banner" style={{ height: '420px' }}>
        <img src={craftBannerImg} alt="Our artisans at work" />
        <div className="category-banner__content">
          <h1>Our Story</h1>
          <p>Honouring the hands that weave India's heritage.</p>
        </div>
      </div>

      <section className="section section--ivory">
        <div className="container" style={{ maxWidth: '800px' }}>
          <ScrollReveal>
            <h2 style={{ color: 'var(--maharani-maroon)', marginBottom: '32px', textAlign: 'center' }}>
              The House of Gargi
            </h2>
            <p style={{ color: 'var(--stone-taupe)', fontSize: '17px', lineHeight: '1.9', marginBottom: '24px' }}>
              House of Gargi is named after <strong style={{ color: 'var(--ink-brown)' }}>Gargi Vachaknavi</strong> — the Vedic-era philosopher who stood in the court of King Janaka and fearlessly debated the nature of Brahman and the universe. She was a woman of intellect, courage, and unwavering conviction — qualities we see reflected in every artisan who keeps India's textile traditions alive.
            </p>
            <p style={{ color: 'var(--stone-taupe)', fontSize: '17px', lineHeight: '1.9', marginBottom: '24px' }}>
              We founded this house with a single belief: <em style={{ color: 'var(--ink-brown)' }}>the most extraordinary fashion in the world is already being made — in the homes and workshops of India's artisan families.</em> Our role is not to reinvent their craft, but to celebrate it — to bring the finest handwoven sarees, hand-embroidered lehengas, and block-printed kurtas to women who appreciate the beauty of something made entirely by human hands.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <ScrollReveal>
            <div className="story-split">
              <div className="story-split__image">
                <img src={artisanImg} alt="Artisan embroidering zari" />
              </div>
              <div className="story-split__copy">
                <h2 style={{ color: 'var(--maharani-maroon)' }}>Our Artisans</h2>
                <p>
                  Every piece in the House of Gargi collection is made by skilled artisans — many from families who have practised their craft for five, six, even ten generations. From the zari weavers of Varanasi to the block printers of Jaipur, from the chikankari embroiderers of Lucknow to the jadau jewellers of Rajasthan.
                </p>
                <p>
                  We work directly with these artisan communities — no middlemen, no factories. This means fair wages, safe working conditions, and the creative freedom for each artisan to bring their own signature to the work.
                </p>
                <p className="subtitle-italic" style={{ color: 'var(--ink-brown)' }}>
                  When you wear House of Gargi, you wear someone's life's work.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section section--ivory">
        <div className="container" style={{ maxWidth: '800px' }}>
          <ScrollReveal>
            <div className="divider"><span className="divider__icon"><DiyaIcon size={16} /></span></div>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ color: 'var(--maharani-maroon)', marginBottom: '24px' }}>Our Promise</h2>
              <div className="product-grid" style={{ marginTop: '40px' }}>
                <div>
                  <div style={{ color: 'var(--gargi-gold)', marginBottom: '12px' }}><LotusIcon size={32} /></div>
                  <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>100% Handmade</h3>
                  <p className="caption">No machines. No shortcuts. Every stitch, every weave, every print — by human hands.</p>
                </div>
                <div>
                  <div style={{ color: 'var(--gargi-gold)', marginBottom: '12px' }}><WishlistIcon size={32} /></div>
                  <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Ethically Sourced</h3>
                  <p className="caption">Fair wages, direct relationships, and respect for the artisan's time and skill.</p>
                </div>
                <div>
                  <div style={{ color: 'var(--gargi-gold)', marginBottom: '12px' }}><StarIcon size={32} /></div>
                  <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Limited Editions</h3>
                  <p className="caption">Small batches that honour the months each technique demands. Never mass-produced.</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
