import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, 'src/domain'),
      '@app': path.resolve(__dirname, 'src/application'),
      '@infra': path.resolve(__dirname, 'src/infrastructure'),
      '@ui': path.resolve(__dirname, 'src/interface')
    }
  },
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
