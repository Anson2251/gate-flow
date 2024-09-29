import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  publicDir: "./public",
  plugins: [
  ],
  build: {
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
