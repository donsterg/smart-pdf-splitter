import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'; // Add this line

export default defineConfig({
  plugins: [react(), tailwindcss()], // Add tailwindcss plugin
  build: {
    rollupOptions: {
      output: {
        // This ensures the worker file gets its own predictable location
        manualChunks(id) {
          if (id.includes('pdf.worker.mjs')) {
            return 'pdf.worker';
          }
        }
      }
    }
  },
  // Ensure worker files are treated correctly
  worker: {
    format: 'es'
  }
})