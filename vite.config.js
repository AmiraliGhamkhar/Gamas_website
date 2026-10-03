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

// Port selection lives here, not in the npm scripts: npm runs scripts through
// cmd.exe on Windows, where a `${PORT:-5173}` argument is passed to Vite
// literally and crashes the server with `listen EACCES: ... ${PORT:-5173}`.
// process.env.PORT still overrides, and now works on every platform.
const devPort = Number(process.env.PORT) || 5173
const previewPort = Number(process.env.PREVIEW_PORT) || Number(process.env.PORT) || 4173

const rawSiteUrl = (process.env.VITE_SITE_URL || 'https://gamas.bot').replace(/\/+$/, '')
let siteOrigin = 'https://gamas.bot'
try {
  const parsedSite = new URL(rawSiteUrl)
  if (!['https:', 'http:'].includes(parsedSite.protocol) || parsedSite.pathname !== '/' || parsedSite.search || parsedSite.hash) {
    throw new Error('VITE_SITE_URL must be an origin only, such as https://gamas.bot')
  }
  siteOrigin = parsedSite.origin
} catch (error) {
  throw new Error(error.message || `Invalid VITE_SITE_URL "${rawSiteUrl}"`, { cause: error })
}

export default defineConfig({
  base,
  plugins: [
    react(),
    {
      name: 'gamas-site-origin',
      transformIndexHtml(html) {
        return html.replace(/https:\/\/gamas\.bot/g, siteOrigin)
      }
    }
  ],
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    // No critters/beasties options on purpose. vite-react-ssg only runs its
    // critical-CSS pass when the optional `beasties` (or legacy `critters`)
    // peer dependency is installed; without one it skips silently and the
    // emitted dist/index.html contains zero inline <style> blocks. To turn
    // inlining on: add `beasties` as a devDependency and set `beastiesOptions`
    // here (`crittersOptions` is only a deprecated alias).
    onFinished() {
      console.log('SSG finished')
    }
  },
  server: {
    host: '0.0.0.0',
    port: devPort,
    // No forced HMR host: pinning it to localhost breaks HMR through proxies.
    // Vite follows window.location and allows the Arena preview subdomain,
    // without turning off DNS-rebinding protection for arbitrary Host headers.
    allowedHosts: ['.e2b.app']
  },
  preview: {
    host: '0.0.0.0',
    port: previewPort,
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
