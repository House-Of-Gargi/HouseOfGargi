'use client';

import { ReactNode } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import '@/seller.css';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminShell adminEmail="admin@gargisaha.com" adminName="Operations & Curation Desk">
      {children}
    </AdminShell>
  );
}
