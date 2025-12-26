
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // This must match your GitHub repository name exactly
  base: '/NIREN-AI/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Ensures assets are handled correctly on static hosts
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
