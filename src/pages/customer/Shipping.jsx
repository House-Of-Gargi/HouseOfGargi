import { useEffect } from 'react';
import ScrollReveal from '../../components/ScrollReveal';

export default function Shipping() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <div className="category-banner">
        <img src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/shipping_banner.webp" alt="Premium packaging" />
        <div className="category-banner__content">
          <h1>Shipping & Delivery</h1>
          <p>Carefully wrapped and swiftly delivered.</p>
        </div>
      </div>

      <section className="section section--ivory">
        <div className="container" style={{ maxWidth: '800px' }}>
          <ScrollReveal>
            <h2 style={{ color: 'var(--maharani-maroon)', marginBottom: '32px', textAlign: 'center' }}>
              Delivered with Care
            </h2>
            <p style={{ color: 'var(--stone-taupe)', fontSize: '17px', lineHeight: '1.9', marginBottom: '24px' }}>
              Every House of Gargi piece is delicately folded, wrapped in premium tissue, and secured in our signature heirloom box. We partner with the world's leading couriers to ensure your garment arrives in pristine condition, no matter where you are in the world.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <ScrollReveal>
            <div className="story-split">
              <div className="story-split__image">
                <img src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/shipping_split.webp" alt="Carefully wrapping a garment" />
              </div>
              <div className="story-split__copy">
                <h2 style={{ color: 'var(--maharani-maroon)' }}>Shipping Timelines</h2>
                <h3 style={{ fontSize: '20px', marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--ink-brown)' }}>Domestic (India)</h3>
                <p>Standard Delivery: 3-5 business days.<br />Express Delivery: 1-2 business days.</p>

                <h3 style={{ fontSize: '20px', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--ink-brown)' }}>International</h3>
                <p>Standard Delivery: 7-14 business days.<br />Express Delivery: 3-5 business days.</p>
                <p className="caption" style={{ marginTop: '1rem' }}>
                  Please note that made-to-order and bespoke items require an additional 2-4 weeks for crafting before they are shipped.
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
              <h2 style={{ color: 'var(--maharani-maroon)', marginBottom: '16px' }}>Need assistance?</h2>
              <p style={{ color: 'var(--stone-taupe)', marginBottom: '32px' }}>Our client care team is available to help with tracking and logistics.</p>
              <a href="/faq" className="btn btn--outline">Read FAQs</a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
