import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    hmr: {
      host: 'universe.localhost',
      protocol: 'wss',
      clientPort: 443,
    }
  },
});
