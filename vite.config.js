// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Essential: Tells Vite to skip pre-bundling this package during development
    exclude: ['react-syntax-highlighter'],
  },
  build: {
    rollupOptions: {
      // Essential: Tells Rollup (Vite's bundler) to treat these as external during production build
      external: [
        'react-syntax-highlighter',
        /^react-syntax-highlighter\// // This regex handles all sub-imports like styles
      ],
    },
  },
});