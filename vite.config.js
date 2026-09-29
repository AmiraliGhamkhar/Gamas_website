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
 * Frontend asset/API paths are generated from import.meta.env.BASE_URL. The
 * postbuild step also rewrites robots.txt and sitemap.xml for this base. For a
 * subfolder deploy, put both dist/ and api/ under the same public_html folder.
 */
const base = process.env.VITE_BASE || '/'
if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(base)) {
  throw new Error(`Invalid VITE_BASE "${base}". Use / or a path such as /gamas/`)
}

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
    // No forced HMR host: pinning it to localhost breaks HMR through proxies.
    // Vite follows window.location and allows the Arena preview subdomain,
    // without turning off DNS-rebinding protection for arbitrary Host headers.
    allowedHosts: ['.e2b.app']
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: ['.e2b.app']
  },
  build: {
    cssCodeSplit: true,
    target: 'es2018',
    // Vite fingerprints everything in dist/assets, which is what lets
    // .htaccess hand out `Cache-Control: immutable` for a year.
    assetsDir: 'assets'
  }
})
