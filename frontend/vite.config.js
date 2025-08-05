import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  host: "127.0.0.1",
  port: 8080,
  strictPort: true,
  proxy: {
    '/api/auth': 'http://localhost:5001',
    '/api/cuidador': 'http://localhost:5008',
    '/api/cliente': 'http://localhost:5009',
    '/api/solicitud': 'http://localhost:5128'
  }
}
})
