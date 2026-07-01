import { useEffect } from 'react';
import ScrollReveal from '../../components/ScrollReveal';

export default function SizeGuide() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <div className="category-banner">
        <img src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/size_guide_banner.webp" alt="Tailor's measuring tape on silk" />
        <div className="category-banner__content">
          <h1>Size Guide</h1>
          <p>Find your perfect fit.</p>
        </div>
      </div>

      <section className="section section--ivory">
        <div className="container" style={{ maxWidth: '800px' }}>
          <ScrollReveal>
            <h2 style={{ color: 'var(--maharani-maroon)', marginBottom: '32px', textAlign: 'center' }}>
              Measurements & Fit
            </h2>
            <p style={{ color: 'var(--stone-taupe)', fontSize: '17px', lineHeight: '1.9', marginBottom: '24px' }}>
              A beautiful garment is only as good as its fit. Use our comprehensive sizing charts to find your perfect measurements. If you fall between sizes, we recommend selecting the larger size for a more comfortable drape, or opting for our bespoke tailoring service for a custom fit.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <ScrollReveal>
            <div className="story-split">
              <div className="story-split__image">
                <img src="https://wlivgkosmbfgjtecvznj.supabase.co/storage/v1/object/public/images/size_guide_split.webp" alt="Tailoring measurements" />
              </div>
              <div className="story-split__copy">
                <h2 style={{ color: 'var(--maharani-maroon)' }}>Standard Chart</h2>
                <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
                  <table className="data-table" style={{ minWidth: '100%', borderCollapse: 'collapse', backgroundColor: 'transparent' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--soft-gold-line)' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--ink-brown)' }}>Size</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--ink-brown)' }}>Bust (in)</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--ink-brown)' }}>Waist (in)</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--ink-brown)' }}>Hip (in)</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: 'var(--stone-taupe)' }}>
                      <tr style={{ borderBottom: '1px solid var(--soft-gold-line)' }}>
                        <td style={{ padding: '0.75rem' }}>XS</td>
                        <td style={{ padding: '0.75rem' }}>32</td>
                        <td style={{ padding: '0.75rem' }}>26</td>
                        <td style={{ padding: '0.75rem' }}>36</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--soft-gold-line)' }}>
                        <td style={{ padding: '0.75rem' }}>S</td>
                        <td style={{ padding: '0.75rem' }}>34</td>
                        <td style={{ padding: '0.75rem' }}>28</td>
                        <td style={{ padding: '0.75rem' }}>38</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--soft-gold-line)' }}>
                        <td style={{ padding: '0.75rem' }}>M</td>
                        <td style={{ padding: '0.75rem' }}>36</td>
                        <td style={{ padding: '0.75rem' }}>30</td>
                        <td style={{ padding: '0.75rem' }}>40</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--soft-gold-line)' }}>
                        <td style={{ padding: '0.75rem' }}>L</td>
                        <td style={{ padding: '0.75rem' }}>38</td>
                        <td style={{ padding: '0.75rem' }}>32</td>
                        <td style={{ padding: '0.75rem' }}>42</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--soft-gold-line)' }}>
                        <td style={{ padding: '0.75rem' }}>XL</td>
                        <td style={{ padding: '0.75rem' }}>40</td>
                        <td style={{ padding: '0.75rem' }}>34</td>
                        <td style={{ padding: '0.75rem' }}>44</td>
                      </tr>
                    </tbody>
                  </table>
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
              <h2 style={{ color: 'var(--maharani-maroon)', marginBottom: '16px' }}>Ready to shop?</h2>
              <p style={{ color: 'var(--stone-taupe)', marginBottom: '32px' }}>Find the piece that speaks to you.</p>
              <a href="/shop" className="btn btn--primary">Browse Collection</a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
