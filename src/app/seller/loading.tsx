'use client';

import { PortalLoadingScreen } from '@/components/common/PortalLoadingScreen';

export default function SellerLoading() {
  return (
    <PortalLoadingScreen
      portalName="Artisan Portal"
      theme="light"
      message="Syncing handloom orders & craft inventory..."
    />
  );
}
