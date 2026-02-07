import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// Production configuration
// For local development, use: npx astro dev
// For production deployment to Cloudflare Pages or other platforms

export default defineConfig({
  // Production site URL
  // Set to your actual domain for production
  site: 'https://uws.com.ua',

  // Base path for the application
  // Use '/' for production, '/UWS' for GitHub Pages development
  base: '/',

  // URL trailing slash behavior
  trailingSlash: 'always',

  // Build configuration
  build: {
    format: 'directory',
    assets: 'assets',
  },

  // Prefetch configuration for better UX
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  // Markdown configuration
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },

  // Image optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  // Integrations
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // We have custom base styles
    }),
  ],

  // Vite configuration for development
  vite: {
    server: {
      port: 4321,
      host: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'framer-motion'],
            forms: ['react-hook-form', 'zod', '@hookform/resolvers'],
          }
        }
      }
    }
  },
});
