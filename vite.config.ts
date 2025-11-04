import { defineConfig } from 'vite'
import postcssNesting from 'postcss-nesting'
import cssnanoPlugin from 'cssnano'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    define: {
        global: 'globalThis'
    },
    plugins: [
        react({
            babel: {
                plugins: [['module:@preact/signals-react-transform']]
            }
        })
    ],
    // https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
    esbuild: {
        logOverride: { 'this-is-undefined-in-esm': 'silent' }
    },
    publicDir: '_public',
    css: {
        postcss: {
            plugins: [
                postcssNesting,
                cssnanoPlugin
            ],
        },
    },
    server: {
        port: 8888,
        host: true,
        open: true,
        watch: {
            usePolling: true,
            interval: 100
        },
        hmr: {
            overlay: true
        },
        proxy: {
            '/api': {
                target: 'http://localhost:9999/.netlify/functions',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ''),
            },
        },
    },
    build: {
        target: 'esnext',
        minify: false,
        outDir: './public',
        emptyOutDir: true,
        sourcemap: 'inline'
    }
})
