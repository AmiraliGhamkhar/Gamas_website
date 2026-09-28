/**
 * CTA click tracker — POST to /api/track.php
 * Same-origin, no CSRF, beacon-like, fails silently
 */
export function trackCTA(section) {
  try {
    const body = JSON.stringify({ section })
    // Use keepalive for unload, but also fallback to fetch
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      // sendBeacon doesn't support custom headers well, but our track.php accepts raw POST
      // Try beacon first, if it fails fallback to fetch
      try {
        navigator.sendBeacon('/api/track.php', blob)
        return
      } catch {}
    }
    fetch('/api/track.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      credentials: 'same-origin',
      keepalive: true,
    }).catch(() => {})
  } catch {}
}
