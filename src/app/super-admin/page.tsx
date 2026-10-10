'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperAdminRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/super-admin/dashboard');
  }, [router]);

  return (
    <div style={{ padding: '2rem', color: '#E4D3AE', fontFamily: 'sans-serif' }}>
      Redirecting to Executive Dashboard...
    </div>
  );
}
