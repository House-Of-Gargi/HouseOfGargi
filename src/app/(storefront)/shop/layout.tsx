import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Complete Luxury Catalog | Pure Silk Sarees, Lehengas & Kurtas',
  description: 'Explore the complete luxury collection at House of Gargi — handwoven Banarasi sarees, bridal lehengas, artisan kurta sets, and heritage jewellery.',
  alternates: {
    canonical: 'https://www.gargisaha.com/shop',
  },
  openGraph: {
    title: 'Complete Luxury Catalog | House of Gargi',
    description: 'Browse all handcrafted Indian couture collections at House of Gargi.',
    url: 'https://www.gargisaha.com/shop',
  },
};

export default function ShopLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
