import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { normaliseUsername, PRODUCT } from './src/lib/product.js'

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
 * postbuild step derives the public base/origin from the prerendered canonical
 * URL, then rewrites and validates crawler files and RewriteBase.
 */
const devPort = Number(process.env.PORT) || 5173
const previewPort = Number(process.env.PREVIEW_PORT) || Number(process.env.PORT) || 4173
const escapeHtmlAttribute = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

export default defineConfig(({ mode }) => {
  // Load VITE_* from both .env files and the process environment. Explicit
  // process values take precedence, matching Vite's standard env behavior.
  const viteEnv = { ...loadEnv(mode, process.cwd(), 'VITE_') }
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('VITE_')) viteEnv[key] = value
  }

  const base = viteEnv.VITE_BASE || '/'
  if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(base)) {
    throw new Error(`Invalid VITE_BASE "${base}". Use / or a path such as /gamas/`)
  }

  const rawSiteUrl = (viteEnv.VITE_SITE_URL || 'https://gamadesk.ir').replace(/\/+$/, '')
  let siteOrigin = 'https://gamadesk.ir'
  try {
    const parsedSite = new URL(rawSiteUrl)
    if (!['https:', 'http:'].includes(parsedSite.protocol) || parsedSite.username || parsedSite.password || parsedSite.pathname !== '/' || parsedSite.search || parsedSite.hash) {
      throw new Error('VITE_SITE_URL must be an origin only, such as https://gamadesk.ir')
    }
    siteOrigin = parsedSite.origin
  } catch (error) {
    throw new Error(error.message || `Invalid VITE_SITE_URL "${rawSiteUrl}"`, { cause: error })
  }

  const rawBotUsername = String(viteEnv.VITE_BOT_USERNAME || '').trim()
  const configuredBot = normaliseUsername(rawBotUsername)
  if (rawBotUsername && !configuredBot) {
    throw new Error('VITE_BOT_USERNAME must be a Telegram username (5–32 letters, numbers or underscores, without a t.me URL)')
  }
  const rawIdentityAttestation = String(viteEnv.VITE_BOT_IDENTITY_VERIFIED || '').trim().toLowerCase()
  if (rawIdentityAttestation && !['true', 'false'].includes(rawIdentityAttestation)) {
    throw new Error('VITE_BOT_IDENTITY_VERIFIED must be either true or false')
  }
  if (rawIdentityAttestation === 'true' && !configuredBot) {
    throw new Error('VITE_BOT_IDENTITY_VERIFIED=true requires an explicit VITE_BOT_USERNAME')
  }

  return {
    base,
    plugins: [
      react(),
      {
        name: 'gamas-site-origin',
        transformIndexHtml(html) {
          return html
            .replace(/https:\/\/gamadesk\.ir/g, siteOrigin)
            .replaceAll('%GAMAS_TITLE%', escapeHtmlAttribute(PRODUCT.seo.title))
            .replaceAll('%GAMAS_DESCRIPTION%', escapeHtmlAttribute(PRODUCT.seo.description))
            .replaceAll('%GAMAS_KEYWORDS%', escapeHtmlAttribute(PRODUCT.seo.keywords.join(', ')))
        },
      },
    ],
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      // Critical CSS is inlined by `beasties` when installed; without it
      // vite-react-ssg skips silently and dist/index.html ships zero inline
      // <style> blocks. `beasties` is a devDependency, so inlining is on.
      beastiesOptions: {
        pruneSource: false,
        logLevel: 'warn',
      },
      onFinished() {
        console.log('SSG finished')
      },
    },
    server: {
      host: '0.0.0.0',
      port: devPort,
      // No forced HMR host: pinning it to localhost breaks HMR through proxies.
      // Vite follows window.location and allows the Arena preview subdomain,
      // without turning off DNS-rebinding protection for arbitrary Host headers.
      allowedHosts: ['.e2b.app'],
    },
    preview: {
      host: '0.0.0.0',
      port: previewPort,
      allowedHosts: ['.e2b.app'],
    },
    build: {
      cssCodeSplit: true,
      target: 'es2018',
      // Vite fingerprints everything in dist/assets, which is what lets
      // .htaccess hand out `Cache-Control: immutable` for a year.
      assetsDir: 'assets',
    },
  }
})
