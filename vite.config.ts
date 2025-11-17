import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600, // Aumentar límite para Tremor + dependencias
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@tremor/react')) {
            return 'tremor';
          }
          if (id.includes('recharts')) {
            return 'charts';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
