/*
 * Optional Playwright regression harness for the responsive RTL landing page.
 * Run a Vite server first and set BASE_URL; Playwright/browser are intentionally
 * not runtime dependencies of the static cPanel deployment.
 */
import { chromium } from 'playwright'
import { BASE, OUT, ensureOut, writeReport, gotoAndWarmup } from './scripts/verify-helpers.mjs'

ensureOut()
const VIEWPORTS = [
  { w: 320, h: 720 },
  { w: 360, h: 780 },
  { w: 375, h: 812 },
  { w: 414, h: 896 },
  { w: 640, h: 900 },
  { w: 768, h: 1024 },
  { w: 834, h: 1112 },
  { w: 1024, h: 768 },
  { w: 1068, h: 900 },
  { w: 1280, h: 800 },
  { w: 1440, h: 900 },
]

ensureOut()
const report = { base: BASE, viewports: [], reducedMotion: null, bidi: null }
const browser = await chromium.launch()
let failed = false

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } })
  const errors = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('pageerror', (error) => errors.push(String(error)))

  const response = await gotoAndWarmup(page)
  const result = await page.evaluate(() => {
    const root = document.documentElement
    const clientWidth = root.clientWidth || window.innerWidth
    const scrollWidth = Math.max(root.scrollWidth, document.body.scrollWidth)
    const images = [...document.images].map((image) => ({
      src: image.currentSrc || image.src,
      loaded: image.complete && image.naturalWidth > 0,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      altPresent: image.hasAttribute('alt'),
    }))
    const targetSelectors = [
      'a.button-primary', 'a.button-secondary-pill', 'button', '.mobile-nav-link',
      '.footer-nav a', '.copy-handle', '.privacy-details > summary', '.text-link',
    ].join(',')
    const smallTargets = [...document.querySelectorAll(targetSelectors)]
      .filter((element) => {
        const style = getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0
          && (rect.width < 44 || rect.height < 44)
      })
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        text: (element.textContent || element.getAttribute('aria-label') || '').trim().slice(0, 40),
        width: Math.round(element.getBoundingClientRect().width),
        height: Math.round(element.getBoundingClientRect().height),
      }))
    return {
      dir: root.getAttribute('dir'),
      lang: root.getAttribute('lang'),
      title: document.title,
      h1Count: document.querySelectorAll('h1').length,
      skipLink: !!document.querySelector('.skip-link[href="#main-content"]'),
      landmarks: {
        header: !!document.querySelector('header'),
        main: !!document.querySelector('main#main-content'),
        footer: !!document.querySelector('footer'),
        navigation: document.querySelectorAll('nav').length >= 2,
      },
      overflowX: Math.max(0, scrollWidth - clientWidth),
      fontFamily: getComputedStyle(document.body).fontFamily,
      vazirmatnLoaded: document.fonts.check('17px Vazirmatn'),
      images,
      smallTargets,
      formCount: document.querySelectorAll('form').length,
    }
  })

  if (process.env.CAPTURE_SCREENSHOTS === '1') {
    await page.screenshot({ path: `${OUT}/${vp.w}.png`, fullPage: true })
  }
  report.viewports.push({
    viewport: `${vp.w}x${vp.h}`,
    httpStatus: response?.status() ?? null,
    ...result,
    consoleErrors: errors,
  })

  if (!response?.ok() || result.overflowX > 1 || result.dir !== 'rtl' || result.lang !== 'fa'
    || result.h1Count !== 1 || !result.skipLink || !result.landmarks.main
    || !result.vazirmatnLoaded || result.images.some((image) => !image.loaded || !image.altPresent)
    || result.smallTargets.length || result.formCount) {
    failed = true
  }
  await page.close()
}

{
  const page = await browser.newPage({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  report.reducedMotion = await page.evaluate(() => {
    const button = document.querySelector('.button-primary')
    const style = button ? getComputedStyle(button) : null
    return {
      requested: matchMedia('(prefers-reduced-motion: reduce)').matches,
      transitionDuration: style?.transitionDuration ?? null,
      animationDuration: style?.animationDuration ?? null,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    }
  })
  await page.close()
  if (!report.reducedMotion.requested || report.reducedMotion.scrollBehavior !== 'auto') failed = true
}

{
  const page = await browser.newPage({ viewport: { width: 414, height: 896 } })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  report.bidi = await page.evaluate(() => ({
    bdiCount: document.querySelectorAll('bdi').length,
    ltrIsolates: document.querySelectorAll('[dir="ltr"], [lang="en"]').length,
    rtlRoot: document.documentElement.dir === 'rtl',
  }))
  await page.close()
  if (!report.bidi.rtlRoot || report.bidi.bdiCount < 1) failed = true
}

await browser.close()
writeReport('responsive-report.json', report)
for (const item of report.viewports) {
  const status = item.httpStatus === 200 && item.overflowX <= 1 && !item.smallTargets.length ? '✓' : '✗'
  console.log(`${status} ${item.viewport}: overflow ${item.overflowX}px; ${item.images.length} images; ${item.smallTargets.length} small targets`)
  for (const error of item.consoleErrors) console.warn(`  console: ${error}`)
}
console.log(`reduced motion: ${JSON.stringify(report.reducedMotion)}`)
console.log(`bidi isolation: ${JSON.stringify(report.bidi)}`)
process.exit(failed ? 1 : 0)
