import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/seller/', '/seller/*', '/api/*'],
      },
    ],
    sitemap: 'https://www.gargisaha.com/sitemap.xml',
    host: 'https://www.gargisaha.com',
  };
}
