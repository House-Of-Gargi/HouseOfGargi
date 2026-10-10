'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ArtisanRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/artisan/dashboard');
  }, [router]);

  return (
    <div style={{ padding: '2rem', color: 'var(--maharani-maroon)', fontFamily: 'sans-serif' }}>
      Redirecting to Artisan Dashboard...
    </div>
  );
}
