import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { getArtisan } from '@/data/artisans';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const artisan = getArtisan(id);
  if (!artisan) {
    return {
      title: 'Master Artisan Profile | House of Gargi',
    };
  }

  return {
    title: `${artisan.name} | ${artisan.role}`,
    description: `${artisan.name}, ${artisan.role} from ${artisan.region}. ${artisan.lineage} preserving authentic Indian handloom heritage and slow luxury couture at House of Gargi.`,
    alternates: {
      canonical: `https://www.gargisaha.com/artisan/${id}`,
    },
    openGraph: {
      title: `${artisan.name} | Master Artisan | House of Gargi`,
      description: artisan.bio,
      url: `https://www.gargisaha.com/artisan/${id}`,
      images: [
        {
          url: artisan.coverImage || '/images/hero-desktop.png',
          width: 1200,
          height: 630,
          alt: `${artisan.name} - House of Gargi`,
        },
      ],
    },
  };
}

export default function ArtisanLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
