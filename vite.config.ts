import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    // Разрешаем хост Render
    allowedHosts: ['todo-frontend-bh64.onrender.com'],
  },
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4000,
    proxy: {
      '/api': {
        target: 'http://138.2.129.89:25565',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
