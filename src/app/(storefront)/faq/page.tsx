'use client';

import { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: "Do you ship internationally?", a: "Yes, we provide insured worldwide shipping. International orders typically arrive within 7–14 business days via express courier." },
    { q: "How should I care for my pure silk garments?", a: "We recommend dry cleaning only for our pure mulberry silk and hand-embroidered zari pieces to preserve their natural luster and delicate motifs. Always store them wrapped in unbleached muslin cloth away from direct sunlight." },
    { q: "Can I customize the fit of a garment?", a: "Yes, we offer a dedicated bespoke commission service. You can provide your exact measurements on our Bespoke page or during checkout consultation." },
    { q: "What is your return policy?", a: "We accept returns within 14 days of delivery for standard collection pieces in pristine condition with original heirloom tags. Custom-made bespoke pieces are crafted to your personal measurements and cannot be returned." },
    { q: "Are your weaves authentic handloom?", a: "Every single saree, lehenga, and kurta in our catalog is authentically handcrafted by master weaving families across Varanasi, Kanchipuram, Chanderi, and Jaipur without industrial machinery." }
  ];

  return (
    <>
      <div className="category-banner">
        <img src="/images/faq_banner.png" alt="Elegant boutique interior" />
        <div className="category-banner__content">
          <h1>Frequently Asked Questions</h1>
          <p>Common questions, answered.</p>
        </div>
      </div>

      <section className="section section--ivory">
        <div className="container" style={{ maxWidth: '800px' }}>
          <ScrollReveal>
            <h2 style={{ color: 'var(--maharani-maroon)', marginBottom: '32px', textAlign: 'center' }}>
              How Can We Help?
            </h2>
            <p style={{ color: 'var(--stone-taupe)', fontSize: '17px', lineHeight: '1.9', marginBottom: '24px', textAlign: 'center' }}>
              We&apos;ve compiled answers to our most common inquiries regarding our handcrafted textiles, shipping, and bespoke services. For personal assistance, our artisan concierge is always available at <strong>hello@houseofgargi.com</strong>.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <ScrollReveal>
            <div className="story-split">
              <div className="story-split__image">
                <img src="/images/returns_split.png" alt="Customer care" />
              </div>
              <div className="story-split__copy">
                <h2 style={{ color: 'var(--maharani-maroon)' }}>Common Inquiries</h2>
                
                <div style={{ marginTop: '2rem' }}>
                  {faqs.map((faq, idx) => (
                    <div key={idx} style={{ marginBottom: '1rem', borderBottom: '1px solid var(--soft-gold-line)' }}>
                      <button
                        type="button"
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          padding: '1rem 0',
                          fontSize: '1.1rem',
                          color: 'var(--ink-brown)',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>{faq.q}</span>
                        <span style={{ fontSize: '1.4rem', color: 'var(--gargi-gold)', marginLeft: '12px' }}>
                          {openIndex === idx ? '−' : '+'}
                        </span>
                      </button>
                      {openIndex === idx && (
                        <div style={{ paddingBottom: '1.2rem', color: 'var(--stone-taupe)', lineHeight: '1.8', fontSize: '15px' }}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
              <h2 style={{ color: 'var(--maharani-maroon)', marginBottom: '16px' }}>Have a Bespoke Question?</h2>
              <p style={{ color: 'var(--stone-taupe)', marginBottom: '32px' }}>Our master craftsmen are ready to assist with custom wedding commissions.</p>
              <Link href="/bespoke" className="btn btn--primary">Commission a Piece</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
