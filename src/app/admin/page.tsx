'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div style={{ padding: '2rem', color: 'var(--maharani-maroon)', fontFamily: 'sans-serif' }}>
      Redirecting to Operations Dashboard...
    </div>
  );
}
