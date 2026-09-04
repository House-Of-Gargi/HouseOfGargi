import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

export default function ReturnsPage() {
  return (
    <>
      <div className="category-banner">
        <img src="/images/returns_banner.png" alt="Premium garments neatly folded" />
        <div className="category-banner__content">
          <h1>Returns & Exchanges</h1>
          <p>We want you to love your Gargi piece.</p>
        </div>
      </div>

      <section className="section section--ivory">
        <div className="container" style={{ maxWidth: '800px' }}>
          <ScrollReveal>
            <h2 style={{ color: 'var(--maharani-maroon)', marginBottom: '32px', textAlign: 'center' }}>
              Our Return Policy
            </h2>
            <p style={{ color: 'var(--stone-taupe)', fontSize: '17px', lineHeight: '1.9', marginBottom: '24px' }}>
              We take immense pride in the quality and craftsmanship of our garments. 
              If you are not entirely satisfied with your purchase, we are here to help. 
              Returns and exchanges are accepted within 14 days of delivery, provided the item is in its original, unworn condition with all tags attached.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <ScrollReveal>
            <div className="story-split">
              <div className="story-split__image">
                <img src="/images/returns_split.png" alt="Inspecting garment for quality" />
              </div>
              <div className="story-split__copy">
                <h2 style={{ color: 'var(--maharani-maroon)' }}>How to Return</h2>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', color: 'var(--stone-taupe)', fontSize: '16px', lineHeight: '1.8' }}>
                  <li style={{ marginBottom: '0.5rem' }}>1. Contact our support team at care@houseofgargi.com to initiate your return.</li>
                  <li style={{ marginBottom: '0.5rem' }}>2. Pack the item securely in its original packaging.</li>
                  <li style={{ marginBottom: '0.5rem' }}>3. Hand over the package to our scheduled courier partner.</li>
                </ul>
                <p className="caption" style={{ color: 'var(--ink-brown)' }}>
                  Please note: Custom-made and bespoke pieces are crafted specifically for you and cannot be returned or exchanged unless there is a manufacturing defect.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section section--ivory">
        <div className="container" style={{ maxWidth: '800px' }}>
          <ScrollReveal>
            <div className="divider"><span className="divider__icon">❖</span></div>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <h2 style={{ color: 'var(--maharani-maroon)', marginBottom: '16px' }}>Still have questions?</h2>
              <p style={{ color: 'var(--stone-taupe)', marginBottom: '32px' }}>We&apos;re here to help make your experience perfect.</p>
              <Link href="/faq" className="btn btn--primary">View FAQ</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
