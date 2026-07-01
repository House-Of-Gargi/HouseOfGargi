import { useEffect, useState } from 'react';
import ScrollReveal from '../../components/ScrollReveal';

export default function FAQ() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: "Do you ship internationally?", a: "Yes, we ship worldwide. International orders typically take 7-14 business days to arrive." },
    { q: "How should I care for my silk garments?", a: "We recommend dry cleaning only for our pure silk and hand-embroidered pieces to maintain their luster and delicate handwork." },
    { q: "Can I customize the fit of a garment?", a: "Yes, we offer a bespoke tailoring service. You can provide your exact measurements during checkout." },
    { q: "What is your return policy?", a: "We accept returns within 14 days of delivery for standard items in original condition. Bespoke pieces cannot be returned." },
  ];

  return (
    <>
      <div className="category-banner">
        <img src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/faq_banner.webp" alt="Elegant boutique interior" />
        <div className="category-banner__content">
          <h1>FAQ</h1>
          <p>Common questions, answered.</p>
        </div>
      </div>

      <section className="section section--ivory">
        <div className="container" style={{ maxWidth: '800px' }}>
          <ScrollReveal>
            <h2 style={{ color: 'var(--maharani-maroon)', marginBottom: '32px', textAlign: 'center' }}>
              How can we help?
            </h2>
            <p style={{ color: 'var(--stone-taupe)', fontSize: '17px', lineHeight: '1.9', marginBottom: '24px', textAlign: 'center' }}>
              We've compiled a list of our most frequently asked questions. If you can't find the answer you're looking for, our customer care team is always here to assist you at care@houseofgargi.com.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <ScrollReveal>
            <div className="story-split">
              <div className="story-split__image">
                <img src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/returns_split.webp" alt="Customer care" />
              </div>
              <div className="story-split__copy">
                <h2 style={{ color: 'var(--maharani-maroon)' }}>Frequently Asked Questions</h2>
                
                <div style={{ marginTop: '2rem' }}>
                  {faqs.map((faq, idx) => (
                    <div key={idx} style={{ marginBottom: '1rem', borderBottom: '1px solid var(--soft-gold-line)' }}>
                      <button
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          padding: '1rem 0',
                          fontSize: '1.1rem',
                          color: 'var(--ink-brown)',
                          fontFamily: 'var(--font-nav)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        {faq.q}
                        <span>{openIndex === idx ? '−' : '+'}</span>
                      </button>
                      {openIndex === idx && (
                        <div style={{ paddingBottom: '1.5rem', color: 'var(--stone-taupe)', lineHeight: '1.7' }}>
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
              <h2 style={{ color: 'var(--maharani-maroon)', marginBottom: '16px' }}>Still need help?</h2>
              <p style={{ color: 'var(--stone-taupe)', marginBottom: '32px' }}>We're always here for you.</p>
              <a href="mailto:care@houseofgargi.com" className="btn btn--outline">Contact Us</a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
