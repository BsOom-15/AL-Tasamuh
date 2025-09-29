import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VITE_API_URL } from './config';

export default defineConfig({
  define: {
    __WS_TOKEN__: JSON.stringify(process.env.VITE_WS_TOKEN ?? '')
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
  },
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled'],
  },
  server: {
    proxy: {
      '/api': {
        target: VITE_API_URL,
        changeOrigin: true,
      },
      '/uploads': {
        target: VITE_API_URL,
        changeOrigin: true,
      },
    },
  },
});
