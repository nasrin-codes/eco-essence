import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // 👈 Update 5000 to match your backend port if different!
        changeOrigin: true,
        secure: false,
      }
    }
  }
})