const configuredUsername = import.meta.env.VITE_BOT_USERNAME || 'GamasBot'
export const BOT_USERNAME = configuredUsername.trim().replace(/^@/, '').replace(/[^a-z0-9_]/gi, '') || 'GamasBot'
export const BOT_HANDLE = `@${BOT_USERNAME}`
export const BOT_URL_BASE = `https://t.me/${BOT_USERNAME}`

/** Build a root- or subfolder-aware URL for a file under the deployed site. */
export function sitePath(path = '') {
  return `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, '')}`
}

export function tgLink(section = 'hero') {
  return `${BOT_URL_BASE}?start=landing_${section}`
}

/** Format visible numbers in Persian without changing values used by APIs or logic. */
export function toFa(value) {
  return new Intl.NumberFormat('fa-IR').format(value)
}

// Limits & honesty
export const LIMITS = {
  maxFileGB: 2,
  rejected: 'PDF / تصویر / ZIP پشتیبانی نمی‌شود'
}
