import React from 'react';
import { LeafIcon } from '../components/Icons';

export default function OurArtisans() {
  return (
    <div className="page-container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 className="hero__title" style={{ color: 'var(--ink-brown)', marginBottom: '1rem' }}>Our Artisans</h1>
      <div className="divider" style={{ margin: '2rem auto' }}>
        <span className="divider__icon"><LeafIcon size={16} /></span>
      </div>
      <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--ink-brown-light)', marginBottom: '2rem' }}>
        At the heart of House of Gargi lies the unparalleled skill of our master artisans. 
        For generations, these gifted weavers and craftsmen have perfected their art, 
        passing down techniques that cannot be replicated by machines. 
        Every piece in our collection is a testament to their dedication and artistry.
      </p>
      
      <div style={{ width: '100%', height: '400px', backgroundColor: 'var(--ivory-dark)', borderRadius: '4px', overflow: 'hidden', margin: '2rem 0' }}>
        <img 
          src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/artisans_hero.png" 
          alt="Artisans at work" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<div style="display:flex; height:100%; align-items:center; justify-content:center; color: var(--ink-brown-light)">Artisans Image</div>';
          }}
        />
      </div>

      <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--ink-brown-light)' }}>
        We are committed to fair trade practices, ensuring that our artisans receive equitable compensation, safe working conditions, and the recognition they deserve. By choosing House of Gargi, you are directly supporting these weaving communities and helping to keep these ancient crafts alive.
      </p>
    </div>
  );
}
