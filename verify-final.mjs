/* Optional Playwright checks for prerendered SEO metadata, assets and local requests. */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173/'
const OUT = process.env.VERIFY_OUT || 'docs/screenshots/current'
fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const localErrors = []
const requests = []
page.on('request', (request) => requests.push({ method: request.method(), url: request.url() }))
page.on('response', (response) => {
  try {
    if (new URL(response.url()).origin === new URL(BASE).origin && response.status() >= 400) {
      localErrors.push({ status: response.status(), url: response.url() })
    }
  } catch {}
})
page.on('pageerror', (error) => localErrors.push({ status: 'pageerror', url: String(error) }))

const response = await page.goto(BASE, { waitUntil: 'networkidle' })
await page.evaluate(async () => {
  await document.fonts.ready
  const images = [...document.images]
  images.forEach((image) => { image.loading = 'eager' })
  await Promise.all(images.map((image) => image.decode().catch(() => {})))
})
const report = await page.evaluate(() => {
  const meta = (selector) => document.querySelector(selector)?.content ?? null
  const images = [...document.images].map((image) => ({
    src: image.currentSrc || image.src,
    alt: image.getAttribute('alt'),
    loaded: image.complete && image.naturalWidth > 0,
    naturalSize: `${image.naturalWidth}x${image.naturalHeight}`,
    declaredSize: `${image.getAttribute('width') || ''}x${image.getAttribute('height') || ''}`,
  }))
  const internalLinks = [...document.querySelectorAll('a[href^="#"]')].map((anchor) => ({
    href: anchor.getAttribute('href'),
    exists: !!document.getElementById(anchor.getAttribute('href').slice(1)),
  }))
  const externalTargets = [...document.querySelectorAll('a[target="_blank"]')].map((anchor) => ({
    href: anchor.href,
    rel: anchor.rel,
    safe: anchor.relList.contains('noopener') && anchor.relList.contains('noreferrer'),
  }))
  const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].map((script) => {
    try { return { valid: true, type: JSON.parse(script.textContent)?.['@type'] || null } }
    catch (error) { return { valid: false, error: String(error) } }
  })
  const resources = performance.getEntriesByType('resource').map((item) => item.name)
  return {
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    title: document.title,
    description: meta('meta[name="description"]'),
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
    ogTitle: meta('meta[property="og:title"]'),
    ogDescription: meta('meta[property="og:description"]'),
    ogImage: meta('meta[property="og:image"]'),
    twitterCard: meta('meta[name="twitter:card"]'),
    h1Count: document.querySelectorAll('h1').length,
    images,
    internalLinks,
    externalTargets,
    jsonLd,
    emailForms: document.querySelectorAll('form, input[type="email"]').length,
    demoClearlySimulated: /شبیه.سازی|نمونه/.test(document.querySelector('.demo-disclaimer')?.textContent || ''),
    assetRequests: resources.filter((url) => /\.(?:css|js|woff2|avif|webp|jpe?g|svg)(?:\?|$)/i.test(url)),
    fontRequests: resources.filter((url) => /\.woff2(?:\?|$)/i.test(url)),
    leadEndpointRequested: resources.some((url) => /\/api\/lead\.php(?:\?|$)/.test(new URL(url).pathname)),
    trackingRequestedOnLoad: resources.some((url) => /\/api\/track\.php(?:\?|$)/.test(new URL(url).pathname)),
  }
})
report.httpStatus = response?.status() ?? null
report.localErrors = localErrors
report.trackingRequestsOnLoad = requests.filter((request) => /\/api\/track\.php/.test(new URL(request.url).pathname))

assert.equal(response?.status(), 200, 'prerendered page should load successfully')
assert.equal(report.lang, 'fa')
assert.equal(report.dir, 'rtl')
assert.equal(report.h1Count, 1)
assert.ok(report.title && report.description && report.canonical && report.ogImage, 'basic SEO metadata must be present')
assert.equal(report.emailForms, 0)
assert.equal(report.demoClearlySimulated, true, 'the interactive preview must be identified as a simulation')
assert.equal(report.leadEndpointRequested, false)
assert.equal(report.trackingRequestedOnLoad, false)
assert.equal(report.images.some((image) => !image.loaded || image.alt === null), false, 'all images should load and have alt attributes')
assert.equal(report.internalLinks.some((link) => !link.exists), false, 'all in-page links should resolve')
assert.equal(report.externalTargets.some((link) => !link.safe), false, 'new-tab links should use noopener and noreferrer')
assert.equal(report.jsonLd.some((script) => !script.valid), false, 'JSON-LD should parse')
assert.equal(localErrors.length, 0, 'no failed local asset/API requests or uncaught page errors')

fs.writeFileSync(`${OUT}/metadata-assets-report.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
await browser.close()
