/* Verification harness for the DESIGN.md / RTL redesign (Phase 5).
   Dev-only; not wired into package.json. Serve the app on :5173 first. */
import { chromium } from 'playwright'
import fs from 'node:fs'

const BASE = process.env.BASE_URL || 'http://localhost:5173/'
const OUT = 'docs/screenshots'
fs.mkdirSync(OUT, { recursive: true })

const VIEWPORTS = [
  { w: 320, h: 640, name: '320' },
  { w: 375, h: 667, name: '375' },
  { w: 414, h: 896, name: '414' },
  { w: 768, h: 1024, name: '768' },
  { w: 834, h: 1112, name: '834' },
  { w: 1024, h: 768, name: '1024' },
  { w: 1280, h: 800, name: '1280' },
  { w: 1440, h: 900, name: '1440' },
]

const report = { base: BASE, viewports: [], reducedMotion: null, bidi: null }

const browser = await chromium.launch()

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } })
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push(String(e)))

  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)

  const result = await page.evaluate(() => {
    const doc = document.documentElement
    const overflowX = Math.max(doc.scrollWidth, document.body.scrollWidth) - window.innerWidth
    const imgs = [...document.images].map((img) => ({
      src: img.currentSrc.split('/').pop() || img.src.split('/').pop(),
      ok: img.complete && img.naturalWidth > 0,
    }))
    const font = getComputedStyle(document.body).fontFamily
    const fontsLoaded = document.fonts.status
    const h1Count = document.querySelectorAll('h1').length
    const skipLink = !!document.querySelector('.skip-link')
    const landmarks = {
      header: !!document.querySelector('header'),
      main: !!document.querySelector('main'),
      footer: !!document.querySelector('footer'),
      nav: !!document.querySelector('nav'),
    }
    return {
      overflowX,
      dir: doc.getAttribute('dir'),
      lang: doc.getAttribute('lang'),
      font,
      fontsLoaded,
      h1Count,
      skipLink,
      landmarks,
      brokenImages: imgs.filter((i) => !i.ok),
      imageCount: imgs.length,
      scrollHeight: doc.scrollHeight,
    }
  })

  await page.screenshot({ path: `${OUT}/${vp.name}.png`, fullPage: true })
  report.viewports.push({ viewport: `${vp.w}x${vp.h}`, ...result, consoleErrors: errors })
  await page.close()
}

// Reduced-motion pass (320px)
{
  const page = await browser.newPage({ viewport: { width: 320, height: 640 }, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  const gsapActive = await page.evaluate(() => {
    return document.querySelectorAll('[style*="translate"], [style*="transform"]').length
  })
  await page.screenshot({ path: `${OUT}/320-reduced-motion.png`, fullPage: true })
  report.reducedMotion = { gsapTransformedElements: gsapActive, errors }
  await page.close()
}

// Mixed-bidi sanity: Persian sentence + handle + URL + Latin word + digits
{
  const page = await browser.newPage({ viewport: { width: 414, height: 896 } })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  const bidi = await page.evaluate(() => {
    const probe = document.createElement('div')
    probe.dir = 'rtl'
    probe.style.cssText = 'position:absolute;visibility:hidden;font-size:17px;width:380px'
    probe.textContent = 'ربات گاماس را در تلگرام امتحان کنید: @Gamas_bot — https://t.me/Gamas_bot نسخه 2 ویژه کلاس‌ها'
    document.body.appendChild(probe)
    const rect = probe.getBoundingClientRect()
    probe.remove()
    return { width: rect.width, height: rect.height }
  })
  const isolated = await page.evaluate(() => ({
    bdiCount: document.querySelectorAll('bdi').length,
    ltrSpans: document.querySelectorAll('[dir="ltr"]').length,
  }))
  report.bidi = { ...bidi, ...isolated }
  await page.close()
}

await browser.close()
fs.writeFileSync(`${OUT}/verify-report.json`, JSON.stringify(report, null, 2))

let failed = false
for (const v of report.viewports) {
  if (v.overflowX > 1) { console.log(`✗ ${v.viewport}: horizontal overflow ${v.overflowX}px`); failed = true }
  else { console.log(`✓ ${v.viewport}: no overflow (dir=${v.dir}, lang=${v.lang}, h1=${v.h1Count})`) }
  if (v.brokenImages.length) { console.log(`  ✗ broken images: ${v.brokenImages.map((i) => i.src).join(', ')}`); failed = true }
  if (v.consoleErrors.length) { console.log(`  ⚠ console errors: ${v.consoleErrors.join(' | ')}`); }
}
console.log(`reduced-motion: ${JSON.stringify(report.reducedMotion)}`)
console.log(`bidi: ${JSON.stringify(report.bidi)}`)
process.exit(failed ? 1 : 0)
