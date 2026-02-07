import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  integrations: [
    react(),
    tailwind(),
    // Keystatic отключен для статического деплоя на GitHub Pages
    // Для SSR деплоя на Cloudflare Workers раскомментировать:
    // keystatic(),
  ],
  site: 'https://tim21102025-source.github.io/UWS',
  base: '/UWS',
  trailingSlash: 'never',
  build: {
    format: 'file',
    assets: 'assets',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
