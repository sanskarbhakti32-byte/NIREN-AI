import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Matches your GitHub repository name: https://sanskarbhakti32-byte.github.io/NIREN-AI/
  base: '/NIREN-AI/',
  define: {
    // This allows process.env.API_KEY to work in your code after bundling
    'process.env': process.env
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-utils': ['lucide-react', 'recharts', '@google/genai'],
        },
      },
    },
  },
});