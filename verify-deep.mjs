/* Optional Playwright interaction checks for navigation, demo, FAQ and CTA tracking. */
import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { BASE, ensureOut, writeReport, gotoAndWarmup } from './scripts/verify-helpers.mjs'
import { landingEventFor } from './src/lib/product.js'

ensureOut()
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 320, height: 720 } })
const report = { base: BASE, initial: null, mobileNav: null, faq: null, demo: null, reducedMotionDemo: null, tracking: null }
const trackedRequests = []

// Keep the test local: never open the real Telegram site or rely on PHP.
await context.route('https://t.me/**', (route) => route.fulfill({
  status: 200,
  contentType: 'text/html',
  body: '<!doctype html><title>Telegram link intercepted by the local test</title>',
}))
await context.route('**/api/track.php', async (route) => {
  trackedRequests.push({
    method: route.request().method(),
    url: route.request().url(),
    body: route.request().postData(),
  })
  await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
})

const page = await context.newPage()
const pageRequests = []
page.on('request', (request) => pageRequests.push({ method: request.method(), url: request.url() }))
page.on('popup', (popup) => { void popup.close().catch(() => {}) })
await gotoAndWarmup(page)

report.initial = await page.evaluate(() => ({
  formCount: document.querySelectorAll('form').length,
  emailInputs: document.querySelectorAll('input[type="email"]').length,
  progressBars: document.querySelectorAll('[role="progressbar"]').length,
  demoDisclaimer: document.querySelector('.demo-disclaimer')?.textContent.trim() ?? null,
  demoButton: document.querySelector('.demo-replay-button')?.textContent.trim() ?? null,
}))
assert.equal(report.initial.formCount, 0, 'the retired email form must not be rendered')
assert.equal(report.initial.emailInputs, 0, 'the page must not request visitor email')
assert.equal(report.initial.progressBars, 0, 'the simulated animation must not run on page load')
assert.match(report.initial.demoDisclaimer || '', /شبیه‌سازی|نمونه/)
assert.equal(pageRequests.some((request) => /\/api\/(?:lead|track)\.php/.test(new URL(request.url).pathname)), false,
  'page load must not call the retired endpoint or record a CTA click')

// Mobile drawer: initial focus, wrap-around focus trap, Escape, focus return.
const toggle = page.locator('button[aria-controls="mobile-nav"]')
await toggle.click()
await page.waitForFunction(() => document.activeElement === document.querySelector('#mobile-nav a[href]'))
assert.equal(await toggle.getAttribute('aria-expanded'), 'true')
await page.keyboard.press('Shift+Tab')
report.mobileNav = await page.evaluate(() => ({
  first: document.querySelector('#mobile-nav a[href]') === document.activeElement,
  last: document.querySelector('#mobile-nav a[href]:last-of-type') === document.activeElement,
}))
assert.equal(report.mobileNav.last, true, 'Shift+Tab from the first drawer link should wrap to the last')
await page.keyboard.press('Tab')
assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('#mobile-nav a[href]')), true,
  'Tab from the last drawer link should wrap to the first')
await page.keyboard.press('Escape')
await page.waitForFunction(() => document.querySelector('button[aria-controls="mobile-nav"]').getAttribute('aria-expanded') === 'false')
assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('button[aria-controls="mobile-nav"]')), true)
assert.equal(await page.evaluate(() => document.body.style.overflow), '')
await toggle.click()
await page.waitForFunction(() => document.activeElement === document.querySelector('#mobile-nav a[href]'))
await page.setViewportSize({ width: 834, height: 900 })
await page.waitForFunction(() => document.querySelector('#mobile-nav').getAttribute('aria-hidden') === 'true')
report.mobileNav.desktopFocusHandoff = await page.evaluate(() =>
  document.activeElement === document.querySelector('.desktop-nav a[href]'))
assert.equal(report.mobileNav.desktopFocusHandoff, true, 'resizing to desktop should close the drawer and hand off focus')
await page.setViewportSize({ width: 320, height: 720 })

// Native summary disclosure and FAQ accordion work with mouse/keyboard controls.
await page.locator('.privacy-details > summary').click()
assert.equal(await page.locator('.privacy-details').evaluate((element) => element.open), true)
const faqButton = page.locator('.faq-question').nth(1)
await faqButton.click()
report.faq = {
  expanded: await faqButton.getAttribute('aria-expanded'),
  panelHidden: await page.locator('#faq-panel-1').getAttribute('aria-hidden'),
}
assert.equal(report.faq.expanded, 'true')
assert.equal(report.faq.panelHidden, 'false')

// Interactive demo is explicitly simulated, user-started and finishes at the sample state.
const replay = page.locator('.demo-replay-button')
await replay.click()
assert.equal(await replay.getAttribute('aria-pressed'), 'true')
await page.waitForSelector('.demo-progress-track[role="progressbar"]', { timeout: 2500 })
await page.waitForFunction(() => !document.querySelector('[role="progressbar"]')
  && !!document.querySelector('.note-topline[role="status"]'), null, { timeout: 11000 })
report.demo = await page.evaluate(() => ({
  replayPressed: document.querySelector('.demo-replay-button')?.getAttribute('aria-pressed'),
  replayLabel: document.querySelector('.demo-replay-button')?.textContent.trim(),
  finalSample: !!document.querySelector('.note-topline[role="status"]'),
  progressBarsAfterCompletion: document.querySelectorAll('[role="progressbar"]').length,
}))
assert.equal(report.demo.replayPressed, 'false')
assert.equal(report.demo.finalSample, true)

// Reduced-motion preference completes the sample without timed progress steps.
const reducedPage = await context.newPage()
await reducedPage.emulateMedia({ reducedMotion: 'reduce' })
await reducedPage.goto(BASE, { waitUntil: 'networkidle' })
await reducedPage.locator('.demo-replay-button').click()
await reducedPage.waitForFunction(() => document.querySelector('.demo-replay-button')?.getAttribute('aria-pressed') === 'false')
report.reducedMotionDemo = await reducedPage.evaluate(() => ({
  preference: matchMedia('(prefers-reduced-motion: reduce)').matches,
  finalSample: !!document.querySelector('.note-topline[role="status"]'),
  progressBars: document.querySelectorAll('[role="progressbar"]').length,
}))
assert.equal(report.reducedMotionDemo.preference, true)
assert.equal(report.reducedMotionDemo.finalSample, true)
assert.equal(report.reducedMotionDemo.progressBars, 0)

// CTA analytics is only attempted after a click, uses POST, and carries the section key.
const heroCTA = page.locator('.hero-primary-cta')
assert.match(await heroCTA.getAttribute('href'), /^https:\/\/t\.me\//)
await heroCTA.click()
await page.waitForTimeout(250)
report.tracking = {
  requests: trackedRequests,
  noLeadEndpoint: !pageRequests.some((request) => /\/api\/lead\.php/.test(new URL(request.url).pathname)),
}
assert.equal(trackedRequests.some((request) => request.method === 'POST'
  && new URL(request.url).origin === new URL(BASE).origin
  && /\/api\/track\.php/.test(new URL(request.url).pathname)), true,
  'clicking Telegram CTA should POST a same-origin tracking event')
assert.equal(trackedRequests.some((request) => {
  try { return JSON.parse(request.body || '{}').section === landingEventFor('hero') } catch { return false }
}), true, 'CTA event should contain its section label')
assert.equal(report.tracking.noLeadEndpoint, true)

writeReport('interaction-report.json', report)
await browser.close()
