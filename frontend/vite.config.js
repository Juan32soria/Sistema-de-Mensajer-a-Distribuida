import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev proxy: only active with `vite dev` (not in Docker).
// Rewrites /api/auth/* → localhost:8000/*, /api/groups/* → localhost:8001/*, etc.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, ''),
      },
      '/api/groups': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/groups/, ''),
      },
      '/api/messages': {
        target: 'http://localhost:8002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/messages/, ''),
      },
    },
  },
})
