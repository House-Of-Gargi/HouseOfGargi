'use client';

import { Users, MapPin, Award, CheckCircle2, Phone, Mail } from 'lucide-react';

const GUILDS = [
  {
    id: 'gld-01',
    name: 'Ramdas Mishra Pit Loom Guild',
    region: 'Madanpura, Varanasi, Uttar Pradesh',
    craft: 'Pure Mulberry Katan Silk Kadwa Weaving',
    looms: 8,
    masterWeaver: 'Ramdas Mishra',
    phone: '+91 98391 20492',
    email: 'mishra.looms@gargisaha.com',
    experienceYears: 42,
    verified: true,
  },
  {
    id: 'gld-02',
    name: 'Kanchipuram Heritage Silk Weavers Society',
    region: 'Kanchipuram, Tamil Nadu',
    craft: 'Temple Border Korvai Handloom Sarees',
    looms: 12,
    masterWeaver: 'Sundaramurthy Chettiar',
    phone: '+91 94441 83920',
    email: 'chettiar.silk@gargisaha.com',
    experienceYears: 36,
    verified: true,
  },
  {
    id: 'gld-03',
    name: 'Khatri Artisan Ajrakh Atelier',
    region: 'Dhamadka, Kutch, Gujarat',
    craft: '16-Stage Natural Indigo & Madder Ajrakh Block Print',
    looms: 4,
    masterWeaver: 'Ismail Khatri',
    phone: '+91 98252 74819',
    email: 'khatri.craft@gargisaha.com',
    experienceYears: 28,
    verified: true,
  },
  {
    id: 'gld-04',
    name: 'Awadh Zardozi Master Guild',
    region: 'Chowk, Lucknow, Uttar Pradesh',
    craft: 'Pure Silver & Gold Dabka Zardozi Needlework',
    looms: 6,
    masterWeaver: 'Haji Mohammed Rafi',
    phone: '+91 94150 91823',
    email: 'rafi.zardozi@gargisaha.com',
    experienceYears: 30,
    verified: true,
  },
];

export default function VerifiedArtisansPage() {
  return (
    <div>
      <div style={{ borderBottom: '1px solid var(--soft-gold-line)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', fontWeight: 700, color: 'var(--ink-brown)', margin: 0 }}>
          Verified Artisan Guilds Directory
        </h1>
        <p style={{ margin: '0.35rem 0 0', color: 'var(--stone-taupe)', fontSize: '0.88rem' }}>
          Certified master weavers, active workshops, and pit loom collectives partnered with House of Gargi.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {GUILDS.map((g) => (
          <div
            key={g.id}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid var(--soft-gold-line)',
              borderRadius: 4,
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(43,31,24,0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--ink-brown)' }}>
                  {g.name}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--stone-taupe)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: 4 }}>
                  <MapPin style={{ width: 14, height: 14, color: 'var(--maharani-maroon)' }} />
                  {g.region}
                </span>
              </div>
              <span style={{ background: '#E8F5E9', color: '#2E7D32', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 2 }}>
                VERIFIED
              </span>
            </div>

            <div style={{ background: '#FAF7F2', padding: '0.85rem', borderRadius: 4, margin: '1rem 0', fontSize: '0.82rem' }}>
              <div style={{ color: 'var(--maharani-maroon)', fontWeight: 700 }}>{g.craft}</div>
              <div style={{ color: 'var(--stone-taupe)', marginTop: 4 }}>
                Master Craftsman: <strong>{g.masterWeaver}</strong> ({g.experienceYears} Years Lineage)
              </div>
              <div style={{ color: 'var(--stone-taupe)', marginTop: 2 }}>
                Active Pit Looms: <strong>{g.looms} Looms</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--stone-taupe)' }}>
              <span>{g.phone}</span>
              <span>{g.email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
