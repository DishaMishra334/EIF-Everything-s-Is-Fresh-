import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173, // Your frontend dev server port
    proxy: {
      // This tells Vite to forward any requests starting with '/api'
      '/api': {
        target: 'http://localhost:4000', // YOUR BACKEND SERVER URL AND PORT
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false, // Set to true if your backend uses HTTPS, false for HTTP (common for local dev)
        // The rewrite rule is usually not needed if both frontend and backend use '/api'
        // For example, /api/product/list from frontend becomes http://localhost:4000/api/product/list
        // If your backend expected /product/list (without /api), you'd use:
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  },
  // base: "/EIF6" // Keep this line only if your project requires a specific base path
})