/* Phase 5 deep checks: tile alternation, nav drawer a11y, focus ring, button press, form error state. */
import { chromium } from 'playwright'
import fs from 'node:fs'

const BASE = process.env.BASE_URL || 'http://localhost:5173/'
const out = {}

const browser = await chromium.launch()

// Desktop pass: tile alternation + tokens
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  out.tiles = await page.evaluate(() => {
    const sections = [...document.querySelectorAll('main > section, footer.product-tile')]
    return sections.map((s) => {
      const cs = getComputedStyle(s)
      return {
        id: s.id || s.tagName.toLowerCase(),
        bg: cs.backgroundColor,
        paddingBlock: cs.paddingBlock,
        radius: cs.borderRadius,
      }
    })
  })
  out.heroFont = await page.evaluate(() => {
    const h1 = document.querySelector('h1')
    const cs = getComputedStyle(h1)
    return { family: cs.fontFamily, size: cs.fontSize, lineHeight: cs.lineHeight, weight: cs.fontWeight, letterSpacing: cs.letterSpacing }
  })
  out.bodyType = await page.evaluate(() => {
    const cs = getComputedStyle(document.body)
    return { size: cs.fontSize, lineHeight: cs.lineHeight }
  })
  out.vazirmatnLoaded = await page.evaluate(() => document.fonts.check('17px Vazirmatn') && document.fonts.check('600 17px Vazirmatn'))
  out.lalezarLoaded = await page.evaluate(() => document.fonts.check('40px Lalezar'))
  out.buttonSpec = await page.evaluate(() => {
    const b = document.querySelector('.button-primary, a.bg-primary')
    if (!b) return null
    const cs = getComputedStyle(b)
    return { radius: cs.borderRadius, minH: cs.minHeight || getComputedStyle(b).height, bg: cs.backgroundColor, shadow: cs.boxShadow }
  })
  // keyboard focus ring
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  out.focusRing = await page.evaluate(() => {
    const el = document.activeElement
    const cs = getComputedStyle(el)
    return { tag: el.tagName, text: (el.textContent || '').slice(0, 30), outline: cs.outline, outlineColor: cs.outlineColor }
  })
  // active scale
  out.pressScale = await page.evaluate(() => {
    const b = document.querySelector('.button-primary, a.bg-primary')
    b.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    // :active only applies with real pointer; check CSS rule exists instead
    const rules = [...document.styleSheets].flatMap((s) => { try { return [...s.cssRules] } catch { return [] } })
    const hasActiveScale = rules.some((r) => r.selectorText && /a:active|button:active/.test(r.selectorText) && /scale\(0\.95\)/.test(r.cssText))
    return { hasActiveScaleRule: hasActiveScale }
  })
  await page.close()
}

// Mobile pass: drawer a11y
{
  const page = await browser.newPage({ viewport: { width: 320, height: 640 } })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  const toggle = page.locator('button[aria-controls="mobile-nav"]')
  await toggle.click()
  await page.waitForTimeout(350)
  out.drawerOpen = await page.evaluate(() => {
    const nav = document.getElementById('mobile-nav')
    const btn = document.querySelector('button[aria-controls="mobile-nav"]')
    return {
      ariaExpanded: btn.getAttribute('aria-expanded'),
      visible: getComputedStyle(nav).visibility === 'visible',
      opacity: getComputedStyle(nav).opacity,
      translate: getComputedStyle(nav).translate,
    }
  })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(350)
  out.drawerAfterEsc = await page.evaluate(() => {
    const nav = document.getElementById('mobile-nav')
    const btn = document.querySelector('button[aria-controls="mobile-nav"]')
    return {
      ariaExpanded: btn.getAttribute('aria-expanded'),
      visible: getComputedStyle(nav).visibility,
      focusReturned: document.activeElement === btn,
    }
  })
  await page.close()
}

// Form error-state pass (dev server has no PHP; response is HTML -> JSON parse fails -> Persian network error)
{
  const page = await browser.newPage({ viewport: { width: 414, height: 896 } })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  const email = page.locator('input[type="email"]').first()
  await email.scrollIntoViewIfNeeded()
  await email.fill('test@example.com')
  const form = page.locator('form').first()
  await form.locator('button[type="submit"]').click()
  await page.waitForTimeout(1200)
  out.formErrorState = await page.evaluate(() => {
    const alert = document.querySelector('[role="alert"], [role="status"]')
    return alert ? { role: alert.getAttribute('role'), text: alert.textContent.trim().slice(0, 60) } : null
  })
  // invalid email -> client-side Persian message
  await email.fill('not-an-email')
  await form.locator('button[type="submit"]').click()
  await page.waitForTimeout(300)
  out.formInvalidState = await page.evaluate(() => {
    const alert = document.querySelector('[role="alert"], [role="status"]')
    return alert ? { role: alert.getAttribute('role'), text: alert.textContent.trim().slice(0, 60) } : null
  })
  await page.close()
}

await browser.close()
fs.writeFileSync('docs/screenshots/deep-checks.json', JSON.stringify(out, null, 2))
console.log(JSON.stringify(out, null, 2))
