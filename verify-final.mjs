/* Final acceptance check for the humanize/palette/micro-interaction pass. */
import { chromium } from 'playwright'
import fs from 'node:fs'

const BASE = process.env.BASE_URL || 'http://localhost:5173/'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)

const result = await page.evaluate(() => {
  const out = {}
  // Eyebrows: pill badges with a status dot directly above headings should be gone.
  // Heuristic: any inline-flex chip that contains ONLY a dot span + short text inside a centered header stack.
  out.chipCount = document.querySelectorAll('.chip').length
  // The old eyebrows were chips placed as first child of header stacks; remaining chips should be hero trust + bento/faq aux only
  const headerChips = [...document.querySelectorAll('section h2, section h1')].map((h) => {
    let prev = h.previousElementSibling
    const chips = []
    while (prev) { chips.push(prev); prev = prev.previousElementSibling }
    return chips.filter((c) => c.classList?.contains('chip') || (c.className || '').includes('rounded-pill')).length
  })
  out.eyebrowsAboveHeadings = headerChips.reduce((a, b) => a + b, 0)

  // Palette live
  const cs = getComputedStyle(document.documentElement)
  out.palette = {
    canvas: cs.getPropertyValue('--canvas').trim(),
    primary: cs.getPropertyValue('--primary').trim(),
    tileDark: cs.getPropertyValue('--tile-dark').trim(),
  }
  const btn = document.querySelector('.button-primary')
  out.buttonBg = getComputedStyle(btn).backgroundColor
  const darkTile = document.querySelector('.product-tile-dark')
  out.darkTileBg = getComputedStyle(darkTile).backgroundColor
  const parchmentTile = document.querySelector('.product-tile-parchment')
  out.parchmentBg = getComputedStyle(parchmentTile).backgroundColor

  // Micro-interactions present in stylesheet (hover rules live in a media block).
  // Note: CSSStyleRule exposes an empty cssRules list for CSS nesting, so a
  // non-empty length check is what distinguishes a container rule from a leaf.
  const flat = (list) => list.flatMap((r) => (r.cssRules && r.cssRules.length ? flat([...r.cssRules]) : [r]))
  const rules = [...document.styleSheets].flatMap((s) => { try { return flat([...s.cssRules]) } catch { return [] } })
  out.hasBtnHover = rules.some((r) => r.selectorText && r.selectorText === '.button-primary:hover')
  out.hasLinkUnderline = rules.some((r) => r.selectorText && r.selectorText === '.link-underline:hover')
  out.hoverSelectors = rules.map((r) => r.selectorText).filter((s) => s && s.includes(':hover')).slice(0, 12)
  out.cardCount = document.querySelectorAll('.surface-card').length
  out.linkUnderlineUsage = document.querySelectorAll('.link-underline').length
  out.copyHandleUsage = document.querySelectorAll('.copy-handle').length

  // Body still 17px/1.8 Vazirmatn
  const body = getComputedStyle(document.body)
  out.body = { size: body.fontSize, lineHeight: body.lineHeight, family: body.fontFamily.split(',')[0] }
  return out
})

// Hover the primary button and confirm the hover tint applies
const primary = page.locator('.button-primary').first()
await primary.hover()
await page.waitForTimeout(250)
result.primaryHoverBg = await page.evaluate(() => {
  const el = document.querySelector('.button-primary')
  return getComputedStyle(el).backgroundColor
})

// Copy-handle click micro-interaction (footer handle)
result.copyHandleClicked = await (async () => {
  try {
    // Grant clipboard permission in context; if unavailable, the class flip still proves the interaction
    await page.context().grantPermissions(['clipboard-write', 'clipboard-read'])
    const handle = page.locator('.copy-handle').last()
    await handle.scrollIntoViewIfNeeded()
    await handle.click()
    await page.waitForTimeout(200)
    return await page.evaluate(() => {
      const el = document.querySelector('.copy-handle.is-copied')
      return el ? el.textContent.trim() : null
    })
  } catch (e) { return `error: ${e.message.slice(0, 80)}` }
})()

result.consoleErrors = errors
fs.writeFileSync('docs/screenshots/final-checks.json', JSON.stringify(result, null, 2))
console.log(JSON.stringify(result, null, 2))
await browser.close()
