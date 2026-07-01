import React from 'react';
import { LeafIcon } from '../components/Icons';

export default function Sustainability() {
  return (
    <div className="page-container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 className="hero__title" style={{ color: 'var(--ink-brown)', marginBottom: '1rem' }}>Sustainability</h1>
      <div className="divider" style={{ margin: '2rem auto' }}>
        <span className="divider__icon"><LeafIcon size={16} /></span>
      </div>
      <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--ink-brown-light)', marginBottom: '2rem' }}>
        At House of Gargi, we believe that true luxury does not come at the expense of the earth. We are deeply committed to sustainable practices that honor our environment and minimize our ecological footprint. From sourcing organic, natural fibers to employing traditional, water-conserving dyeing techniques, our processes are designed with the future in mind.
      </p>
      
      <div style={{ width: '100%', height: '400px', backgroundColor: 'var(--ivory-dark)', borderRadius: '4px', overflow: 'hidden', margin: '2rem 0' }}>
        <img 
          src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/sustainability_hero.png" 
          alt="Sustainable materials and dyes" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<div style="display:flex; height:100%; align-items:center; justify-content:center; color: var(--ink-brown-light)">Sustainability Image</div>';
          }}
        />
      </div>

      <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--ink-brown-light)' }}>
        Our zero-waste philosophy ensures that every scrap of fabric is repurposed, whether it be into small accessories or donated for upcycling. We use 100% natural and azo-free dyes, ensuring that our vibrant colors are safe for you and the planet. Join us in redefining conscious luxury.
      </p>
    </div>
  );
}
