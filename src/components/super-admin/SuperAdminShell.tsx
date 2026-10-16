'use client';

import { ReactNode } from 'react';
import { SuperAdminSidebar } from './SuperAdminSidebar';

export interface SuperAdminShellProps {
  children: ReactNode;
  userEmail?: string;
  userName?: string;
}

export function SuperAdminShell({
  children,
  userEmail = 'superadmin@houseofgargi.com',
  userName = 'Executive Super Admin',
}: SuperAdminShellProps) {
  return (
    <div
      className="seller-shell super-admin-shell"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'var(--ivory-silk, #FBF6EE)',
      }}
    >
      {/* Permanent Side Nav Rail (72px collapsed / 264px expanded hover & tap) */}
      <SuperAdminSidebar
        userEmail={userEmail}
        userName={userName}
      />

      {/* Main Content Area - zero header bar, pure side nav architecture */}
      <main
        className="seller-main"
        style={{
          flex: 1,
          minWidth: 0,
          paddingLeft: 'var(--seller-rail-width, 72px)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--ivory-silk, #FBF6EE)',
        }}
      >
        <div className="seller-container">
          {children}
        </div>
      </main>
    </div>
  );
}

