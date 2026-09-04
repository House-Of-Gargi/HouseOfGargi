import type { Metadata } from 'next';
import { ReactNode } from 'react';
import '@/index.css';
import '@/account.css';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { CustomerAuthProvider } from '@/context/CustomerAuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

export const metadata: Metadata = {
  title: {
    default: 'House of Gargi | Handcrafted Luxury Indian Fashion',
    template: '%s | House of Gargi',
  },
  description: 'House of Gargi offers luxury, handcrafted traditional Indian fashion. Explore our curated collections of pure silk sarees, bridal lehengas, block-printed kurta sets, and heritage jewellery. Handcrafted Heritage, Worn Today.',
  keywords: ['Indian fashion', 'luxury ethnic wear', 'handcrafted sarees', 'bridal lehengas', 'pure silk', 'artisan jewelry', 'bespoke fashion'],
  authors: [{ name: 'House of Gargi' }],
  metadataBase: new URL('https://houseofgargi.com'),
  openGraph: {
    type: 'website',
    url: 'https://houseofgargi.com/',
    title: 'House of Gargi | Handcrafted Luxury Indian Fashion',
    description: 'House of Gargi offers luxury, handcrafted traditional Indian fashion. Explore our curated collections of pure silk sarees, bridal lehengas, block-printed kurta sets, and heritage jewellery.',
    images: [{ url: '/images/hero-desktop.png', width: 1200, height: 630, alt: 'House of Gargi Luxury Fashion' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House of Gargi | Handcrafted Luxury Indian Fashion',
    description: 'House of Gargi offers luxury, handcrafted traditional Indian fashion.',
    images: ['/images/hero-desktop.png'],
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Marcellus&family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Caveat:wght@600;700&family=Kalam:wght@700&family=Noto+Serif+Devanagari:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CurrencyProvider>
          <CustomerAuthProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
              </WishlistProvider>
            </CartProvider>
          </CustomerAuthProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
