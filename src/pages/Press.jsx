import { useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';

export default function Press() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <div className="category-banner">
        <img src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/press_banner.png" alt="Press and media coverage" />
        <div className="category-banner__content">
          <h1>Press</h1>
          <p>House of Gargi in the spotlight.</p>
        </div>
      </div>

      <section className="section section--ivory">
        <div className="container" style={{ maxWidth: '800px' }}>
          <ScrollReveal>
            <h2 style={{ color: 'var(--maharani-maroon)', marginBottom: '32px', textAlign: 'center' }}>
              Celebrated Craft
            </h2>
            <p style={{ color: 'var(--stone-taupe)', fontSize: '17px', lineHeight: '1.9', marginBottom: '24px' }}>
              Since our inception, House of Gargi has been celebrated by leading fashion publications and tastemakers for our uncompromising dedication to Indian craftsmanship. We are proud to see our heritage pieces gracing the pages of Vogue, Harper's Bazaar, and Elle.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <ScrollReveal>
            <div className="story-split">
              <div className="story-split__image">
                <img src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/press_split.png" alt="Fashion editorial" />
              </div>
              <div className="story-split__copy">
                <h2 style={{ color: 'var(--maharani-maroon)' }}>Editorial Features</h2>
                <p>
                  "House of Gargi is quietly redefining modern luxury by looking deeply into the past, proving that true elegance is handmade."<br />
                  <strong style={{ color: 'var(--ink-brown)' }}>— Vogue India</strong>
                </p>
                <p>
                  "A masterclass in reviving lost textiles, every garment feels less like a piece of clothing and more like a cherished heirloom."<br />
                  <strong style={{ color: 'var(--ink-brown)' }}>— Harper's Bazaar</strong>
                </p>
                <p>
                  "The brand putting artisans back at the center of the fashion narrative."<br />
                  <strong style={{ color: 'var(--ink-brown)' }}>— Elle</strong>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
