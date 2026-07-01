import React from 'react';
import { LeafIcon } from '../components/Icons';

export default function Press() {
  return (
    <div className="page-container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 className="hero__title" style={{ color: 'var(--ink-brown)', marginBottom: '1rem' }}>Press</h1>
      <div className="divider" style={{ margin: '2rem auto' }}>
        <span className="divider__icon"><LeafIcon size={16} /></span>
      </div>
      <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--ink-brown-light)', marginBottom: '2rem' }}>
        House of Gargi has been featured in leading fashion and lifestyle publications across the country. Our commitment to preserving Indian heritage crafts and our sustainable approach to modern fashion continues to garner attention from industry experts and fashion enthusiasts alike.
      </p>
      
      <div style={{ width: '100%', height: '400px', backgroundColor: 'var(--ivory-dark)', borderRadius: '4px', overflow: 'hidden', margin: '2rem 0' }}>
        <img 
          src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/press_hero.png" 
          alt="Press and media coverage" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<div style="display:flex; height:100%; align-items:center; justify-content:center; color: var(--ink-brown-light)">Press Image</div>';
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
        <div style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: 'var(--ink-brown)', marginBottom: '1rem' }}>Vogue India</h3>
          <p style={{ color: 'var(--ink-brown-light)', fontSize: '0.9rem', fontStyle: 'italic' }}>"Redefining traditional silhouettes with a conscious mind and a regal aesthetic."</p>
        </div>
        <div style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: 'var(--ink-brown)', marginBottom: '1rem' }}>Elle</h3>
          <p style={{ color: 'var(--ink-brown-light)', fontSize: '0.9rem', fontStyle: 'italic' }}>"A stunning tribute to the weaves of India, tailored for the modern woman."</p>
        </div>
        <div style={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: 'var(--ink-brown)', marginBottom: '1rem' }}>Harper's Bazaar</h3>
          <p style={{ color: 'var(--ink-brown-light)', fontSize: '0.9rem', fontStyle: 'italic' }}>"House of Gargi's new collection is a masterclass in understated elegance."</p>
        </div>
      </div>
    </div>
  );
}
