import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true // Buka browser secara automatik bila server jalan
  },
  build: {
    outDir: 'dist', // Folder output selepas di-build
    emptyOutDir: true,
    minify: 'esbuild' // Menghasilkan fail JS/CSS yang sangat mampat (kecil)
  }
});