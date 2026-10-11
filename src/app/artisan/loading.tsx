'use client';

import { PortalLoadingScreen } from '@/components/common/PortalLoadingScreen';

export default function ArtisanLoading() {
  return (
    <PortalLoadingScreen
      portalName="Artisan Atelier Workspace"
      theme="light"
      message="Syncing handloom orders & craft inventory..."
    />
  );
}
