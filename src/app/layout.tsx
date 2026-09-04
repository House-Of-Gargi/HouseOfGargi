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
  metadataBase: new URL('https://www.gargisaha.com'),
  alternates: {
    canonical: 'https://www.gargisaha.com',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.gargisaha.com/',
    siteName: 'House of Gargi',
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

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.gargisaha.com/#website',
  url: 'https://www.gargisaha.com/',
  name: 'House of Gargi',
  alternateName: ['House of Gargi Atelier', 'Gargi Saha', 'House of Gargi Luxury Fashion'],
  description: 'House of Gargi offers luxury, handcrafted traditional Indian fashion. Explore pure silk sarees, bridal lehengas, block-printed kurta sets, and heritage jewellery.',
  publisher: {
    '@id': 'https://www.gargisaha.com/#organization',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.gargisaha.com/shop?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.gargisaha.com/#organization',
  name: 'House of Gargi',
  url: 'https://www.gargisaha.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.gargisaha.com/favicon.svg',
    width: 512,
    height: 512,
  },
  description: 'Luxury handcrafted Indian ethnic couture atelier honoring generational master artisans.',
  email: 'hello@houseofgargi.com',
  sameAs: [
    'https://www.instagram.com/houseofgargi',
    'https://www.facebook.com/houseofgargi',
    'https://www.pinterest.com/houseofgargi',
  ],
};

const sitelinksNavigationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'House of Gargi Collections & Services',
  itemListElement: [
    {
      '@type': 'SiteNavigationElement',
      position: 1,
      name: 'Pure Silk Sarees',
      description: 'Handwoven Banarasi, Kanchipuram, and Tussar silk sarees crafted with gold zari by master weavers.',
      url: 'https://www.gargisaha.com/category/sarees',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 2,
      name: 'Bridal Lehengas',
      description: 'Exquisite bridal silhouettes embroidered with centuries of royal Indian zardozi and heirloom craft.',
      url: 'https://www.gargisaha.com/category/lehengas',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 3,
      name: 'Artisan Kurta Sets',
      description: 'Handcrafted pure Chanderi silks and block-printed cotton ensembles designed for festive celebrations.',
      url: 'https://www.gargisaha.com/category/kurta-sets',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 4,
      name: 'Heritage Jewellery',
      description: 'Artisan Jadau, Kundan, and antique temple jewellery to complement luxury ethnic couture.',
      url: 'https://www.gargisaha.com/category/accessories',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 5,
      name: 'Bespoke Atelier',
      description: 'Private bridal commissions and bespoke tailoring crafted to your individual measurements.',
      url: 'https://www.gargisaha.com/bespoke',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 6,
      name: 'Our Heritage & Story',
      description: 'Honoring generational master weaver families, slow luxury, and timeless Indian craftsmanship.',
      url: 'https://www.gargisaha.com/our-story',
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Marcellus&family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Caveat:wght@600;700&family=Kalam:wght@700&family=Noto+Serif+Devanagari:wght@400;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sitelinksNavigationSchema) }}
        />
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

