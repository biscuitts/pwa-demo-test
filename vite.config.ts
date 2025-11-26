import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['*.png', '*.svg', '*.ico', 'data/*.json'],

      manifest: {
        name: 'PWA Demo App',
        short_name: 'PWA Demo',
        description: 'A demonstration Progressive Web App showcasing offline capabilities, caching, and local storage',
        theme_color: '#4A90E2',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],

        // Clean up old caches
        cleanupOutdatedCaches: true,

        // Important: This tells Workbox to return index.html for navigation requests
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],

        runtimeCaching: [
          // Cache API data
          {
            urlPattern: /\/data\/.*\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },

      // Disable in dev mode - PWA features only work properly in production
      devOptions: {
        enabled: false
      }
    })
  ]
})
