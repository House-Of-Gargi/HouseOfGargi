import React, { useState } from 'react';
import { LeafIcon } from '../../components/Icons';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship worldwide. Shipping costs are calculated at checkout based on destination."
    },
    {
      question: "How long will my order take to arrive?",
      answer: "Domestic orders typically take 5-7 business days. International orders can take 10-15 business days depending on customs."
    },
    {
      question: "Can I customize a design?",
      answer: "Yes, our Bespoke service allows you to customize sizing, colors, and certain design elements. Please contact us or visit the Bespoke section."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 14 days of delivery for standard domestic orders. Items must be unworn and in original condition. Bespoke items are non-returnable."
    },
    {
      question: "Are your dyes safe?",
      answer: "Yes, we use 100% natural, eco-friendly, and azo-free dyes for all our garments."
    }
  ];

  return (
    <div className="page-container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 className="hero__title" style={{ color: 'var(--ink-brown)', marginBottom: '1rem' }}>Frequently Asked Questions</h1>
      <div className="divider" style={{ margin: '2rem auto' }}>
        <span className="divider__icon"><LeafIcon size={16} /></span>
      </div>
      
      <div style={{ textAlign: 'left', marginTop: '3rem' }}>
        {faqs.map((faq, index) => (
          <div key={index} style={{ borderBottom: '1px solid var(--ivory-dark)', padding: '1.5rem 0' }}>
            <button 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                color: 'var(--ink-brown)',
                fontSize: '1.1rem',
                fontWeight: '500',
                textAlign: 'left'
              }}
            >
              {faq.question}
              <span style={{ fontSize: '1.5rem', fontWeight: '300' }}>{openIndex === index ? '-' : '+'}</span>
            </button>
            {openIndex === index && (
              <div style={{ marginTop: '1rem', color: 'var(--ink-brown-light)', lineHeight: '1.6' }}>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '4rem', color: 'var(--ink-brown-light)' }}>
        <p>Still have questions? Reach out to us at <a href="mailto:hello@houseofgargi.com" style={{ color: 'var(--gold)' }}>hello@houseofgargi.com</a></p>
      </div>
    </div>
  );
}
