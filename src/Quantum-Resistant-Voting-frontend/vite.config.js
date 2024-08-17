import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export default defineConfig({
    build: {
        emptyOutDir: true,
        rollupOptions: {
            // Remove the external configuration for these packages
            // This ensures Vite bundles them instead of treating them as external
            external: [],
        },
    },
    optimizeDeps: {
        include: [
            "@dfinity/agent",
            "@dfinity/auth-client",
            "@dfinity/identity",
        ],
        esbuildOptions: {
            define: {
                global: "globalThis",
            },
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://127.0.0.1:4943",
                changeOrigin: true,
            },
        },
        headers: {
            'Permissions-Policy': 'interest-cohort=()'
        }
    },
    plugins: [
        react(),
        environment("all", { prefix: "CANISTER_" }),
        environment("all", { prefix: "DFX_" }),
    ],
    resolve: {
        alias: [{
                find: 'declarations',
                replacement: fileURLToPath(new URL('../declarations',
                    import.meta.url)),
            },
            {
                find: '@',
                replacement: fileURLToPath(new URL('./src',
                    import.meta.url)),
            }
        ],
    },
});
