/**
 * CTA click tracker — POST to /api/track.php
 * CTA analytics only; no form/session state. Failures never block navigation.
 */
import { landingEventFor, sitePath } from './constants'

export function trackCTA(section) {
  try {
    const body = JSON.stringify({ section: landingEventFor(section) })
    // Use keepalive for unload, but fall back to fetch when the browser refuses
    // to queue the beacon (sendBeacon returns false in that case).
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json; charset=utf-8' })
      try {
        if (navigator.sendBeacon(sitePath('api/track.php'), blob)) return
      } catch {}
    }
    fetch(sitePath('api/track.php'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
      credentials: 'same-origin',
      keepalive: true,
    }).catch(() => {})
  } catch {}
}
