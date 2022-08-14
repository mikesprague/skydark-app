import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'src',
  build: {
    // Relative to the root
    outDir: '../build',
  },
  publicDir: '../public',
  base: './',
  outDir: './',
  server: {
    strictPort: true,
  },
  plugins: [
    VitePWA({
      injectRegister: 'auto',
      registerType: 'prompt',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: true,
      },
      includeAssets: [
        './images/skydark-app-icon-64.png',
        './images/skydark-app-icon-96.png',
        './images/skydark-app-icon-128.png',
      ],
      manifest: {
        name: 'Sky Dark (Powered by Dark Sky)',
        short_name: 'Sky Dark',
        description: 'Sky Dark (Powered by Dark Sky)',
        lang: 'en-US',
        dir: 'auto',
        orientation: 'portrait',
        display: 'standalone',
        start_url: '/',
        background_color: '#181c1d',
        theme_color: '#181c1d',
        icons: [
          {
            src: '/images/skydark-app-icon-16.png',
            type: 'image/png',
            sizes: '16x16',
          },
          {
            src: '/images/skydark-app-icon-24.png',
            type: 'image/png',
            sizes: '24x24',
          },
          {
            src: '/images/skydark-app-icon-32.png',
            type: 'image/png',
            sizes: '32x32',
          },
          {
            src: '/images/skydark-app-icon-48.png',
            type: 'image/png',
            sizes: '48x48',
          },
          {
            src: '/images/skydark-app-icon-64.png',
            type: 'image/png',
            sizes: '64x64',
          },
          {
            src: '/images/skydark-app-icon-128.png',
            type: 'image/png',
            sizes: '128x128',
          },
          {
            src: '/images/skydark-app-icon-144.png',
            type: 'image/png',
            sizes: '144x144',
          },
          {
            src: '/images/skydark-app-icon-256.png',
            type: 'image/png',
            sizes: '256x256',
          },
          {
            src: '/images/skydark-app-icon-512.png',
            type: 'image/png',
            sizes: '512x512',
          },
          {
            src: '/images/skydark-app-icon-maskable-192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any',
          },
          {
            src: '/images/skydark-app-icon-maskable-192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'maskable',
          },
        ],
      },
    }),
    react({
      // Use React plugin in all *.jsx and *.tsx files
      include: '**/*.{jsx,tsx}',
    }),
  ],
});