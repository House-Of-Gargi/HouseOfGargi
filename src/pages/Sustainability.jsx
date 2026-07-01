import { useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';

export default function Sustainability() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <div className="category-banner">
        <img src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/sustainability_banner.png" alt="Natural dyes and sustainable practices" />
        <div className="category-banner__content">
          <h1>Sustainability</h1>
          <p>Treading lightly on the earth.</p>
        </div>
      </div>

      <section className="section section--ivory">
        <div className="container" style={{ maxWidth: '800px' }}>
          <ScrollReveal>
            <h2 style={{ color: 'var(--maharani-maroon)', marginBottom: '32px', textAlign: 'center' }}>
              Our Commitment to the Earth
            </h2>
            <p style={{ color: 'var(--stone-taupe)', fontSize: '17px', lineHeight: '1.9', marginBottom: '24px' }}>
              At House of Gargi, we believe that true luxury does not come at the expense of our planet. Our commitment to sustainability is woven into every step of our process, from sourcing natural fibers to utilizing eco-friendly dyes and zero-waste production methods.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <ScrollReveal>
            <div className="story-split">
              <div className="story-split__image">
                <img src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/sustainability_split.png" alt="Raw organic cotton" />
              </div>
              <div className="story-split__copy">
                <h2 style={{ color: 'var(--maharani-maroon)' }}>Zero-Waste Craft</h2>
                <p>
                  We prioritize natural materials like pure silk, organic cotton, and linen. Our dyes are derived from nature—indigo, madder, and marigold—ensuring that our garments are as gentle on your skin as they are on the environment.
                </p>
                <p>
                  By embracing a made-to-order model, we eliminate overproduction and minimize waste, ensuring that every garment created is cherished.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
