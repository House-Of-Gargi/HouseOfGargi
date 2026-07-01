import React from 'react';
import { LeafIcon } from '../../components/Icons';

export default function SizeGuide() {
  return (
    <div className="page-container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 className="hero__title" style={{ color: 'var(--ink-brown)', marginBottom: '1rem' }}>Size Guide</h1>
      <div className="divider" style={{ margin: '2rem auto' }}>
        <span className="divider__icon"><LeafIcon size={16} /></span>
      </div>
      <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--ink-brown-light)', marginBottom: '2rem' }}>
        To ensure the perfect fit, please refer to our detailed sizing charts below. 
        Measurements are in inches. If you fall between sizes, we recommend opting for the larger size 
        or utilizing our Bespoke service for a custom fit.
      </p>
      
      <div style={{ width: '100%', height: '300px', backgroundColor: 'var(--ivory-dark)', borderRadius: '4px', overflow: 'hidden', margin: '2rem 0' }}>
        <img 
          src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/size_guide_hero.png" 
          alt="Measuring tape on silk fabric" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<div style="display:flex; height:100%; align-items:center; justify-content:center; color: var(--ink-brown-light)">Size Guide Image</div>';
          }}
        />
      </div>

      <div style={{ textAlign: 'left', marginTop: '3rem' }}>
        <h3 style={{ color: 'var(--ink-brown)', marginBottom: '1rem' }}>Standard Garment Measurements</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--ivory-dark)', color: 'var(--ink-brown)' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Size</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Bust</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Waist</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Hip</th>
            </tr>
          </thead>
          <tbody style={{ color: 'var(--ink-brown-light)' }}>
            <tr style={{ borderBottom: '1px solid var(--ivory-dark)' }}>
              <td style={{ padding: '1rem' }}>XS (UK 6)</td>
              <td style={{ padding: '1rem' }}>32"</td>
              <td style={{ padding: '1rem' }}>26"</td>
              <td style={{ padding: '1rem' }}>36"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--ivory-dark)' }}>
              <td style={{ padding: '1rem' }}>S (UK 8)</td>
              <td style={{ padding: '1rem' }}>34"</td>
              <td style={{ padding: '1rem' }}>28"</td>
              <td style={{ padding: '1rem' }}>38"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--ivory-dark)' }}>
              <td style={{ padding: '1rem' }}>M (UK 10)</td>
              <td style={{ padding: '1rem' }}>36"</td>
              <td style={{ padding: '1rem' }}>30"</td>
              <td style={{ padding: '1rem' }}>40"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--ivory-dark)' }}>
              <td style={{ padding: '1rem' }}>L (UK 12)</td>
              <td style={{ padding: '1rem' }}>38"</td>
              <td style={{ padding: '1rem' }}>32"</td>
              <td style={{ padding: '1rem' }}>42"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--ivory-dark)' }}>
              <td style={{ padding: '1rem' }}>XL (UK 14)</td>
              <td style={{ padding: '1rem' }}>40"</td>
              <td style={{ padding: '1rem' }}>34"</td>
              <td style={{ padding: '1rem' }}>44"</td>
            </tr>
          </tbody>
        </table>
        
        <p style={{ color: 'var(--ink-brown-light)', fontSize: '0.9rem' }}>
          * For Sarees, standard blouse pieces are provided at 1 meter length unless stated otherwise.
        </p>
      </div>
    </div>
  );
}
