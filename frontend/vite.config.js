import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteCompression({
      algorithm: 'brotliCompress', // or 'gzip'
      ext: '.br',                  // .gz for gzip
      threshold: 1024,             // Only assets > 1KB are compressed
    })
  ],
})
