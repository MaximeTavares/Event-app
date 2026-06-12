import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        headers: { 'Cross-Origin-Opener-Policy': 'same-origin-allow-popups' },
    },
    resolve: {
        alias: {
            '@app/contracts': path.resolve(__dirname, '../../packages/contracts/src'),
        },
    },
});
