import path from 'path'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      '#frontend': path.resolve(__dirname, 'src'),
      '#backend': path.resolve(__dirname, '../backend/src'), // If frontend needs to import from backend
    },
  },
})
