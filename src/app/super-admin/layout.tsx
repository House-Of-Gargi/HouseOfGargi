'use client';

import { ReactNode } from 'react';
import { SuperAdminShell } from '@/components/super-admin/SuperAdminShell';
import '@/seller.css';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <SuperAdminShell userEmail="gargisaha1508@gmail.com" userName="Gargi Saha (Executive Lead)">
      {children}
    </SuperAdminShell>
  );
}
