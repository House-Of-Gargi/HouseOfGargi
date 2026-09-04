import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { getCategory } from '@/data/products';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const category = getCategory(id);
  if (!category) {
    return {
      title: 'Collection | House of Gargi',
    };
  }

  const categoryTitles: Record<string, { title: string; desc: string }> = {
    sarees: {
      title: 'Pure Silk Sarees | Banarasi & Kanchipuram Handlooms',
      desc: 'Discover pure silk sarees handwoven by master weavers in Varanasi and Kanchipuram. Intricate gold zari motifs, authentic handloom craftsmanship.',
    },
    lehengas: {
      title: 'Bridal & Festive Lehengas | Handcrafted Royal Silhouettes',
      desc: 'Explore heirloom bridal lehengas and festive couture handcrafted with zardozi embroidery, heritage raw silks, and royal embellishments.',
    },
    'kurta-sets': {
      title: 'Handcrafted Kurta Sets | Artisan Silks & Chanderi',
      desc: 'Shop artisan kurta sets handcrafted in pure Chanderi silk, fine cottons, and hand-embroidered details for celebrations and effortless luxury.',
    },
    accessories: {
      title: 'Heritage Jewellery & Accessories | Jadau & Kundan',
      desc: 'Adorn your silhouette with handcrafted Jadau, Kundan, and antique temple jewellery curated to elevate your ethnic wardrobe.',
    },
  };

  const meta = categoryTitles[id] || {
    title: `${category.name} | Handcrafted Luxury Collection`,
    desc: category.tagline,
  };

  return {
    title: meta.title,
    description: meta.desc,
    alternates: {
      canonical: `https://www.gargisaha.com/category/${id}`,
    },
    openGraph: {
      title: `${meta.title} | House of Gargi`,
      description: meta.desc,
      url: `https://www.gargisaha.com/category/${id}`,
      images: [
        {
          url: category.bannerImage || '/images/hero-desktop.png',
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
    },
  };
}

export default function CategoryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
