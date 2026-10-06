import fs from 'node:fs'

export const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173/'
export const OUT = process.env.VERIFY_OUT || 'docs/screenshots/current'

export function ensureOut() {
  fs.mkdirSync(OUT, { recursive: true })
}

export function writeReport(name, report) {
  fs.writeFileSync(`${OUT}/${name}`, JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
}

export async function gotoAndWarmup(page) {
  const response = await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.evaluate(async () => {
    await document.fonts.ready
    const images = [...document.images]
    images.forEach((image) => { image.loading = 'eager' })
    await Promise.all(images.map((image) => image.decode().catch(() => {})))
  })
  return response
}

export function collectLocalErrors(page, base = BASE) {
  const localErrors = []
  const origin = new URL(base).origin
  page.on('response', (response) => {
    try {
      if (new URL(response.url()).origin === origin && response.status() >= 400) {
        localErrors.push({ status: response.status(), url: response.url() })
      }
    } catch {}
  })
  page.on('pageerror', (error) => localErrors.push({ status: 'pageerror', url: String(error) }))
  return localErrors
}

export const IMAGE_MAP_FN = () => {
  const images = [...document.images].map((image) => ({
    src: image.currentSrc || image.src,
    alt: image.getAttribute('alt'),
    loaded: image.complete && image.naturalWidth > 0,
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
    altPresent: image.hasAttribute('alt'),
  }))
  return images
}
