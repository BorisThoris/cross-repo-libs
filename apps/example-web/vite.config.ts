import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@cross-repo-libs/notifications': path.resolve(__dirname, '../../packages/notifications/src/index.ts')
    }
  },
  server: {
    port: 5179
  }
});
