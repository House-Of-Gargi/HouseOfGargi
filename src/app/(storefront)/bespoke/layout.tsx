import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bespoke Bridal Couture & Custom Commissions',
  description: 'Book a bespoke couture consultation with House of Gargi. Private atelier commissions, custom bridal lehengas, and handwoven sarees tailored to your measurements.',
  alternates: {
    canonical: 'https://www.gargisaha.com/bespoke',
  },
  openGraph: {
    title: 'Bespoke Atelier | House of Gargi',
    description: 'Custom bridal couture and private commissions handcrafted to perfection.',
    url: 'https://www.gargisaha.com/bespoke',
  },
};

export default function BespokeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
