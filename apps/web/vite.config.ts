import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api/auth': {
        target: process.env.VITE_CONVEX_SITE_URL,
        changeOrigin: true,
        secure: true,
        ws: true,
      },
    },
  },
  plugins: [
    tailwindcss(),
    viteReact(),
  ],
})
