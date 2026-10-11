import { defineConfig } from 'vite';

export default defineConfig({
    // Relative asset paths, so the build runs from any folder on a server
    base: './',
    server: { port: 5180 },
    build: {
        chunkSizeWarningLimit: 1500,
        rollupOptions: { output: { manualChunks: { phaser: ['phaser'] } } },
    },
});
