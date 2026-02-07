import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  integrations: [
    react(),
    tailwind(),
  ],
  site: 'https://tim21102025-source.github.io',
  trailingSlash: 'always',
  build: {
    format: 'directory',
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
