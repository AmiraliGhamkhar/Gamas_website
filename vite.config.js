import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Deploy path.
 * ---------------------------------------------------------------------------
 * The site is deployed to the ROOT of public_html, so base stays '/'.
 *
 * If you ever move it into a subfolder (public_html/gamas/), build with:
 *     VITE_BASE=/gamas/ npm run build      (Linux/macOS)
 *     set VITE_BASE=/gamas/ && npm run build   (Windows cmd)
 *
 * base MUST end with a trailing slash and MUST match the public URL path,
 * otherwise /assets/*, /fonts/* and /images/* 404 on a case-sensitive Linux
 * server even though everything worked on Windows/macOS.
 *
 * Note: /api/*.php is called with absolute paths from src/lib/track.js and
 * src/components/LeadForm.jsx. At root that is correct; for a subfolder
 * deploy, change those to relative ('api/lead.php') or import.meta.env.BASE_URL.
 */
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
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
    allowedHosts: true
  },
  build: {
    cssCodeSplit: true,
    target: 'es2018',
    // Vite fingerprints everything in dist/assets, which is what lets
    // .htaccess hand out `Cache-Control: immutable` for a year.
    assetsDir: 'assets'
  }
})
