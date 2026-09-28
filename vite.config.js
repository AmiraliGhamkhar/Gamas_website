import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: {
      reduceInlineStyles: false
    },
    onFinished() {
      console.log('SSG finished')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    cors: true,
    hmr: { host: 'localhost' },
    allowedHosts: true
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    cors: true,
    allowedHosts: true,
    headers: {
      'X-Frame-Options': 'ALLOWALL'
    }
  },
  build: {
    cssCodeSplit: true,
    target: 'es2018'
  }
})
