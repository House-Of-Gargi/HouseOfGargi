import Link from 'next/link';
import { DiyaIcon } from '@/components/Icons';

export default function NotFound() {
  return (
    <div className="section section--ivory" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '100px' }}>
      <div className="container" style={{ maxWidth: '560px' }}>
        <DiyaIcon size={56} style={{ color: 'var(--gargi-gold)', marginBottom: '24px' }} />
        <h1 style={{ fontFamily: 'var(--font-nav)', color: 'var(--ink-brown)', marginBottom: '16px', fontSize: '36px' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--stone-taupe)', fontSize: '17px', lineHeight: '1.8', marginBottom: '32px' }}>
          The path you seek has woven elsewhere. Allow us to guide you back to our curated collections.
        </p>
        <Link href="/" className="btn btn--primary">
          Return to Boutique
        </Link>
      </div>
    </div>
  );
}
