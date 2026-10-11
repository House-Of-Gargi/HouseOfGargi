'use client';

import { PortalLoadingScreen } from '@/components/common/PortalLoadingScreen';

export default function AdminLoading() {
  return (
    <PortalLoadingScreen
      portalName="Operations Console"
      theme="light"
      message="Loading artisan management telemetry..."
    />
  );
}
