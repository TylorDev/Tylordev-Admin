import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const sharedGlobalsPath = path.resolve(__dirname, '../src/_globals.scss').replace(/\\/g, '/');

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: ['..'],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "${sharedGlobalsPath}" as *;
        `,
      },
    },
  },
});
