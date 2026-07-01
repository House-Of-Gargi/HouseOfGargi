import { useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';

export default function OurArtisans() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      {/* Banner */}
      <div className="category-banner">
        <img src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/artisans_banner.png" alt="Our artisans at work" />
        <div className="category-banner__content">
          <h1>Our Artisans</h1>
          <p>The masters behind the magic.</p>
        </div>
      </div>

      <section className="section section--ivory">
        <div className="container" style={{ maxWidth: '800px' }}>
          <ScrollReveal>
            <h2 style={{ color: 'var(--maharani-maroon)', marginBottom: '32px', textAlign: 'center' }}>
              The Hands of Heritage
            </h2>
            <p style={{ color: 'var(--stone-taupe)', fontSize: '17px', lineHeight: '1.9', marginBottom: '24px' }}>
              At the heart of House of Gargi lies the unparalleled skill of our master artisans. For generations, these gifted weavers and craftsmen have perfected their art, passing down techniques that cannot be replicated by machines. Every piece in our collection is a testament to their dedication and artistry.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <ScrollReveal>
            <div className="story-split">
              <div className="story-split__image">
                <img src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/artisans_split.png" alt="Artisan embroidering" />
              </div>
              <div className="story-split__copy">
                <h2 style={{ color: 'var(--maharani-maroon)' }}>Fair Trade Promise</h2>
                <p>
                  We are committed to fair trade practices, ensuring that our artisans receive equitable compensation, safe working conditions, and the recognition they deserve. By choosing House of Gargi, you are directly supporting these weaving communities and helping to keep these ancient crafts alive.
                </p>
                <p className="subtitle-italic" style={{ color: 'var(--ink-brown)' }}>
                  When you wear House of Gargi, you wear someone's life's work.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
