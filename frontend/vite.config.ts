import path from 'node:path'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  plugins: [solid(), cloudflare()],
  resolve: {
    alias: {
      '#frontend': path.resolve(__dirname, 'src'),
      '#backend': path.resolve(__dirname, '../backend/src'), // If frontend needs to import from backend
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})
