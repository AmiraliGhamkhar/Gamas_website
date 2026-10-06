import {
  BOT_IDENTITY_VERIFIED,
  BOT_USERNAME,
  PRODUCT,
  landingEventFor,
  normaliseUsername,
} from './product.js'

export { BOT_IDENTITY_VERIFIED, BOT_USERNAME, PRODUCT, landingEventFor, normaliseUsername }
export const BOT_HANDLE = `@${BOT_USERNAME}`
export const BOT_URL_BASE = `https://t.me/${BOT_USERNAME}`

// Deploy origin and path, matching vite.config.js defaults. Used by metadata
// and JSON-LD so @id values follow a subfolder deployment too.
const env = import.meta.env ?? {}
export const SITE_ORIGIN = (env.VITE_SITE_URL || 'https://gamas.bot').replace(/\/+$/, '')
const base = typeof env.BASE_URL === 'string' && env.BASE_URL ? env.BASE_URL : '/'
const sitePath_ = base.endsWith('/') ? base : `${base}/`
export const SITE_URL = `${SITE_ORIGIN}${sitePath_}`

/** Build a root- or subfolder-aware URL for a file under the deployed site. */
export function sitePath(path = '') {
  return `${base}${String(path).replace(/^\/+/, '')}`
}

/**
 * Telegram deep links carry the same landing event name that the click tracker
 * records, allowing future bot-side attribution without adding a new platform.
 */
export function tgLink(placement = 'hero') {
  return `${BOT_URL_BASE}?start=${encodeURIComponent(landingEventFor(placement))}`
}

/** Format visible numbers in Persian without changing values used by APIs or logic. */
export function toFa(value) {
  return new Intl.NumberFormat('fa-IR').format(value)
}
