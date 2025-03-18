import { defineConfig } from 'vite'
import postcssNesting from 'postcss-nesting'
import cssnanoPlugin from 'cssnano'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  define: {
    global: 'globalThis'
  },
  publicDir: '_public',
  plugins: [react()],
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
