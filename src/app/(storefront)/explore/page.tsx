import { Suspense } from 'react';
import ExploreContent from './ExploreContent';

export const metadata = {
  title: 'Explore Masterpieces | House of Gargi Atelier',
  description: 'Explore handwoven Banarasi sarees, royal bridal lehengas, heritage kurta sets, and handcrafted accessories by master artisans across India.',
};

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ivory-silk)' }}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '3px solid var(--soft-gold-line)', 
              borderTopColor: 'var(--maharani-maroon)', 
              borderRadius: '50%', 
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--ink-brown)', letterSpacing: '0.04em' }}>
              Curating Atelier Masterpieces...
            </div>
          </div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
