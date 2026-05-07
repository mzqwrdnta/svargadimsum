import type { MetadataRoute } from 'next';
import { outlets } from '@/data/outlets';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://svargadimsum.com';

  const outletRoutes = outlets.map((outlet) => ({
    url: `${baseUrl}/outlet/${outlet.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const routes = [
    '',
    '/menu',
    '/outlet',
    '/tentang',
    '/kontak',
    '/testimoni',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.9,
  }));

  return [...routes, ...outletRoutes];
}
