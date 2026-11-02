/* Supplemental production-CSP, no-JS and accessibility checks. Run after build. */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { BASE, OUT, ensureOut, writeReport } from './verify-helpers.mjs'

ensureOut()
const csp = fs.readFileSync('dist/.htaccess', 'utf8').match(/Header always set Content-Security-Policy "([^"]+)"/)[1]
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
await context.route(BASE, async (route) => {
  const response = await route.fetch()
  await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': csp } })
})
const page = await context.newPage()
const violations = []
await page.addInitScript(() => {
  window.cspViolations = []
  document.addEventListener('securitypolicyviolation', (e) => window.cspViolations.push({ directive: e.violatedDirective, uri: e.blockedURI }))
})
page.on('pageerror', (error) => violations.push(String(error)))
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: `${OUT}/desktop.png` })
await page.screenshot({ path: `${OUT}/redesign-1440.png`, fullPage: true })
const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
await page.setViewportSize({ width: 390, height: 844 })
await page.screenshot({ path: `${OUT}/mobile.png` })
await page.screenshot({ path: `${OUT}/redesign-390.png`, fullPage: true })
await page.locator('button[aria-controls="mobile-nav"]').click()
await page.waitForFunction(() => document.activeElement === document.querySelector('#mobile-nav a[href]'))
await page.keyboard.press('Escape')
await page.locator('.privacy-details summary').click()
await page.locator('.faq-question').nth(1).click()
await page.locator('.demo-replay-button').click()
// Failed tracking must never cancel the real anchor navigation.
await context.route('**/api/track.php', (route) => route.abort('failed'))
await context.route('https://t.me/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Local Telegram stub</title>' }))
const popupPromise = page.waitForEvent('popup')
await page.locator('.hero-primary-cta').click()
const popup = await popupPromise
await popup.waitForLoadState()
assert.ok(popup.url().startsWith('https://t.me/'))
await popup.close()
const cspViolations = await page.evaluate(() => window.cspViolations)
assert.equal(await page.locator('[style]').count(), 0, 'no inline style attributes')
assert.deepEqual(cspViolations, [], 'production CSP must not block page behavior')
assert.deepEqual(violations, [], 'no uncaught JS errors')
const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
const staticPage = await noJS.newPage()
await staticPage.goto(BASE)
assert.equal(await staticPage.locator('h1').count(), 1)
assert.ok((await staticPage.locator('.hero-primary-cta').getAttribute('href')).startsWith('https://t.me/'))
assert.ok((await staticPage.locator('#features').innerText()).includes('رونوشت'))
writeReport('editorial-report.json', {
  productionCsp: cspViolations, pageErrors: violations, noInlineStyles: true,
  noJsPrerender: true, trackingFailureNavigation: true,
  accessibility: axe.violations.map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map((n) => n.target) })),
})
await browser.close()
assert.equal(axe.violations.length, 0, 'WCAG A/AA automated checks should pass')
