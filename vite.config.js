import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { version } from './package.json';

export default defineConfig({
  root: 'src',
  build: {
    // Relative to the root
    outDir: '../build',
  },
  publicDir: '../public',
  base: './',
  outDir: './',
  appType: 'spa',
  plugins: [
    tailwindcss(),
    VitePWA({
      strategies: 'generateSW',
      injectRegister: 'auto',
      registerType: 'prompt',
      filename: 'service-worker.js',
      manifestFilename: 'skydark.webmanifest',
      workbox: {
        navigateFallbackDenylist: [/^\/api/],
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false,
      },
      includeAssets: [
        './images/skydark-app-48.png',
        './images/skydark-app-96.png',
        './images/skydark-app-128.png',
        './images/skydark-app-192.png',
        './images/skydark-app-256.png',
        './images/skydark-app-384.png',
        './images/skydark-app-512.png',
        './images/skydark-maskable-512.png',
      ],
      manifest: {
        name: `${
          process.env.NODE_ENV === 'development' ? 'DEV ' : ''
        }Sky Dark (Powered by Apple Weather)`,
        short_name: `${
          process.env.NODE_ENV === 'development' ? 'DEV ' : ''
        }Sky Dark`,
        description: `${
          process.env.NODE_ENV === 'development' ? 'DEV ' : ''
        }Sky Dark (Powered by Apple Weather)`,
        version,
        lang: 'en-US',
        dir: 'auto',
        orientation: 'portrait',
        display: 'standalone',
        id: '/',
        start_url: '/',
        background_color: '#181c1d',
        theme_color: '#181c1d',
        icons: [
          {
            src: '/images/skydark-app-48.png',
            type: 'image/png',
            sizes: '48x48',
          },
          {
            src: '/images/skydark-app-72.png',
            type: 'image/png',
            sizes: '72x72',
          },
          {
            src: '/images/skydark-app-128.png',
            type: 'image/png',
            sizes: '128x128',
          },
          {
            src: '/images/skydark-app-192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: '/images/skydark-app-256.png',
            type: 'image/png',
            sizes: '256x256',
          },
          {
            src: '/images/skydark-app-384.png',
            type: 'image/png',
            sizes: '384x384',
          },
          {
            src: '/images/skydark-app-512.png',
            type: 'image/png',
            sizes: '512x512',
          },
          {
            src: '/images/skydark-app-512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any',
          },
          {
            src: '/images/skydark-maskable-512.png',
            type: 'image/png',
            sizes: '512x512',
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
