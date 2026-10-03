// `import.meta.env` only exists under Vite. The fallback keeps this module
// importable from plain Node — scripts/postbuild.mjs generates dist/llms.txt
// from these exact values, so the bot identity can never drift from the page.
const env = import.meta.env ?? {}

/** Normalise a Telegram handle from any source (build-time env, CLI input). */
export function normaliseUsername(raw) {
  return String(raw || '').trim().replace(/^@/, '').replace(/[^a-z0-9_]/gi, '') || 'GamasBot'
}

export const BOT_USERNAME = normaliseUsername(env.VITE_BOT_USERNAME)
export const BOT_HANDLE = `@${BOT_USERNAME}`
export const BOT_URL_BASE = `https://t.me/${BOT_USERNAME}`

// Deploy origin and path, matching vite.config.js defaults. Used by the
// JSON-LD entity graph so @id values follow a subfolder deploy too.
export const SITE_ORIGIN = (env.VITE_SITE_URL || 'https://gamas.bot').replace(/\/+$/, '')
const base = typeof env.BASE_URL === 'string' && env.BASE_URL ? env.BASE_URL : '/'
const sitePath_ = base.endsWith('/') ? base : `${base}/`
export const SITE_URL = `${SITE_ORIGIN}${sitePath_}`

/** Build a root- or subfolder-aware URL for a file under the deployed site. */
export function sitePath(path = '') {
  return `${base}${String(path).replace(/^\/+/, '')}`
}

export function tgLink(section = 'hero') {
  return `${BOT_URL_BASE}?start=landing_${section}`
}

/** Format visible numbers in Persian without changing values used by APIs or logic. */
export function toFa(value) {
  return new Intl.NumberFormat('fa-IR').format(value)
}
