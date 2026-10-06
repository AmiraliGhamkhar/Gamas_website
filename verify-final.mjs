/* Optional Playwright checks for prerendered SEO metadata, assets and local requests. */
import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { ensureOut, writeReport, gotoAndWarmup, collectLocalErrors } from './scripts/verify-helpers.mjs'

ensureOut()
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const localErrors = collectLocalErrors(page)
const requests = []
page.on('request', (request) => requests.push({ method: request.method(), url: request.url() }))

const response = await gotoAndWarmup(page)
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

writeReport('metadata-assets-report.json', report)
await browser.close()
