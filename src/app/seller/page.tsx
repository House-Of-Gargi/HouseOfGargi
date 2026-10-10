'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SellerRootPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined'
        ? (localStorage.getItem('auth_session') || localStorage.getItem('super_admin_session') || localStorage.getItem('admin_session') || localStorage.getItem('artisan_session'))
        : null;

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.role === 'super_admin') {
          router.replace('/super-admin/dashboard');
          return;
        }
        if (parsed?.role === 'admin') {
          router.replace('/admin/dashboard');
          return;
        }
        if (parsed?.role === 'artisan') {
          router.replace('/artisan/dashboard');
          return;
        }
      }
    } catch {}

    router.replace('/artisan/dashboard');
  }, [router]);

  return (
    <div style={{ padding: '2rem', color: 'var(--maharani-maroon)', fontFamily: 'sans-serif' }}>
      Redirecting to Dashboard...
    </div>
  );
}
