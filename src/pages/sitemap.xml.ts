import { getCollection } from 'astro:content';

interface SitemapPage {
  url: string;
  priority: number;
  changefreq: string;
  hreflang: string;
}

export async function GET() {
  const baseUrl = 'https://uws.com.ua';
  const today = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages: SitemapPage[] = [
    { url: '/', priority: 1.0, changefreq: 'daily', hreflang: 'uk' },
    { url: '/ru/', priority: 0.9, changefreq: 'daily', hreflang: 'ru' },
    { url: '/about', priority: 0.8, changefreq: 'weekly', hreflang: 'uk' },
    { url: '/ru/about', priority: 0.7, changefreq: 'weekly', hreflang: 'ru' },
    { url: '/services', priority: 0.9, changefreq: 'weekly', hreflang: 'uk' },
    { url: '/ru/services', priority: 0.8, changefreq: 'weekly', hreflang: 'ru' },
    { url: '/calculator', priority: 0.7, changefreq: 'monthly', hreflang: 'uk' },
    { url: '/ru/calculator', priority: 0.6, changefreq: 'monthly', hreflang: 'ru' },
    { url: '/blog', priority: 0.8, changefreq: 'daily', hreflang: 'uk' },
    { url: '/ru/blog', priority: 0.7, changefreq: 'daily', hreflang: 'ru' },
    { url: '/contacts', priority: 0.9, changefreq: 'monthly', hreflang: 'uk' },
    { url: '/ru/contacts', priority: 0.8, changefreq: 'monthly', hreflang: 'ru' },
    { url: '/faq', priority: 0.6, changefreq: 'monthly', hreflang: 'uk' },
    { url: '/ru/faq', priority: 0.5, changefreq: 'monthly', hreflang: 'ru' },
  ];

  // Dynamic pages from content collections
  const services = await getCollection('services');
  const blogPosts = await getCollection('blog');

  const servicePages: SitemapPage[] = services
    .filter((s: { data: { published: boolean } }) => s.data.published)
    .map((service: { slug: string }) => ({
      url: `/services/${service.slug}`,
      priority: 0.7,
      changefreq: 'weekly',
      hreflang: 'uk',
    }));

  const ruServicePages: SitemapPage[] = services
    .filter((s: { data: { published: boolean } }) => s.data.published)
    .map((service: { slug: string }) => ({
      url: `/ru/services/${service.slug}`,
      priority: 0.6,
      changefreq: 'weekly',
      hreflang: 'ru',
    }));

  const blogPages: SitemapPage[] = blogPosts
    .filter((post: { data: { published: boolean } }) => post.data.published)
    .map((post: { slug: string }) => ({
      url: `/blog/${post.slug}`,
      priority: 0.6,
      changefreq: 'weekly',
      hreflang: 'uk',
    }));

  const ruBlogPages: SitemapPage[] = blogPosts
    .filter((post: { data: { published: boolean } }) => post.data.published)
    .map((post: { slug: string }) => ({
      url: `/ru/blog/${post.slug}`,
      priority: 0.5,
      changefreq: 'weekly',
      hreflang: 'ru',
    }));

  const allPages: SitemapPage[] = [
    ...staticPages,
    ...servicePages,
    ...ruServicePages,
    ...blogPages,
    ...ruBlogPages,
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${allPages
    .map((page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="uk" href="${baseUrl}${page.url}" />
    <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/ru${page.url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page.url}" />
  </url>`)
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
