import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@react-three') || id.includes('node_modules/three') || id.includes('node_modules/@dimforge/rapier') || id.includes('node_modules/@pmndrs')) return 'gameplay-webgl-runtime';
          return undefined;
        },
      },
    },
  },
});
