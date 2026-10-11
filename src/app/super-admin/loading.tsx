'use client';

import { PortalLoadingScreen } from '@/components/common/PortalLoadingScreen';

export default function SuperAdminLoading() {
  return (
    <PortalLoadingScreen
      portalName="Executive Super Admin Command"
      theme="light"
      message="Loading platform analytics & revenue overview..."
    />
  );
}
