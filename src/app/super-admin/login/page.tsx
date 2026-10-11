'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/login');
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FBF6EE', color: '#7A2331', fontFamily: 'sans-serif' }}>
      Redirecting to Executive Login Console...
    </div>
  );
}
