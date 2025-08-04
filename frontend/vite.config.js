import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1", // fuerza IPv4 para evitar errores EACCES
    port: 8080,        // puerto fijo para tu frontend
    strictPort: true   // evita que Vite cambie de puerto automáticamente
  }
})
