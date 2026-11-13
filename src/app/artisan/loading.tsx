'use client';

import { PortalLoadingScreen } from '@/components/common/PortalLoadingScreen';

export default function ArtisanLoading() {
  return (
    <PortalLoadingScreen
      portalName="Artisan Portal"
      theme="light"
      message="Syncing handloom orders & craft inventory..."
    />
  );
}
