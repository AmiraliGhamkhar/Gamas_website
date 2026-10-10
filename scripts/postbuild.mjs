#!/usr/bin/env node
/**
 * Gamas — post-build hygiene for dist/
 * ---------------------------------------------------------------------------
 * Runs on the machine that builds the site (Node is NOT needed on the server).
 *
 *   1. Removes build manifests that vite-react-ssg drops into dist/ and that
 *      would otherwise be served publicly from public_html:
 *        dist/.vite/manifest.json
 *        dist/.vite/ssr-manifest.json
 *        dist/static-loader-data-manifest-<hash>.json
 *   2. Fails the build if anything sensitive leaked into dist/.
 *   3. Verifies .htaccess made it into dist/ (public/ dotfiles are copied by
 *      Vite, but a silent change there would otherwise ship an unprotected
 *      site with no warning).
 */

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
// Shared product facts are used for crawler output; bot/site identity is read
// from prerendered HTML so .env and CI build settings cannot drift from the UI.
import { BOT_USERNAME_DEFAULT, PRODUCT, normaliseUsername } from '../src/lib/product.js'
import { getFaqs } from '../src/lib/faq-data.js'

const dist = path.resolve(process.cwd(), 'dist')

let failed = false
const fail = (msg) => { console.error(`\x1b[31m✗ ${msg}\x1b[0m`); failed = true }
const ok = (msg) => console.log(`\x1b[32m✓\x1b[0m ${msg}`)

if (!fs.existsSync(dist)) {
  fail('dist/ does not exist — run the build first')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// 1. Strip build manifests
// ---------------------------------------------------------------------------
const removed = []
const rm = (p) => {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true })
    removed.push(path.relative(dist, p))
  }
}

rm(path.join(dist, '.vite'))
for (const entry of fs.readdirSync(dist)) {
  if (/^static-loader-data-manifest-[a-z0-9]+\.json$/i.test(entry)) {
    rm(path.join(dist, entry))
  }
}

if (removed.length) {
  ok(`removed build manifests: ${removed.join(', ')}`)
} else {
  ok('no build manifests to remove')
}

// ---------------------------------------------------------------------------
// 2. Generate base-aware crawler files: robots.txt, sitemap.xml and llms.txt
//    Public files are copied verbatim by Vite, so rewrite these after copying
//    when the site is deployed below a cPanel domain root.
// ---------------------------------------------------------------------------
const indexPath = path.join(dist, 'index.html')
let configuredBase = ''
let siteOrigin = ''
let canonicalUrl = ''
let builtHtml = ''
if (!fs.existsSync(indexPath)) {
  fail('dist/index.html is missing; cannot determine the built site origin/base')
} else {
  builtHtml = fs.readFileSync(indexPath, 'utf8')
  const canonicalValue = builtHtml.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1]
  try {
    const parsedCanonical = new URL(canonicalValue || '')
    if (!['https:', 'http:'].includes(parsedCanonical.protocol) || parsedCanonical.search || parsedCanonical.hash || !parsedCanonical.pathname.endsWith('/')) {
      throw new Error('the prerendered canonical URL must be an HTTP(S) origin and a trailing-slash base path')
    }
    configuredBase = parsedCanonical.pathname
    if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(configuredBase)) {
      throw new Error(`invalid canonical base path "${configuredBase}"`)
    }
    siteOrigin = parsedCanonical.origin
    canonicalUrl = `${siteOrigin}${configuredBase}`
  } catch (error) {
    fail(error.message || 'invalid/missing canonical URL in dist/index.html')
  }
}

if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(configuredBase)) {
  fail(`cannot infer a valid VITE_BASE from the built canonical URL — use / or a path such as /gamas/`)
} else if (siteOrigin) {
  const prefix = configuredBase === '/' ? '' : configuredBase.slice(0, -1)
  // Policy for a public marketing page that WANTS classic search plus AI
  // citations. Named search/answer agents are listed explicitly so the intent
  // survives future default changes; the wildcard group covers everything else.
  // Each group repeats the API disallow because a bot matching a specific group
  // ignores the '*' group entirely (robots.txt group-matching rule).
  // Training-only crawlers are allowed so the product can enter model knowledge;
  // add `Disallow: ${prefix}/` for one of them below to opt out of its data use.
  const searchAndAiAgents = [
    'Googlebot', 'Bingbot', 'Applebot',
    'OAI-SearchBot', 'ChatGPT-User', 'GPTBot',
    'PerplexityBot', 'Perplexity-User',
    'Claude-SearchBot', 'Claude-User', 'ClaudeBot',
    'Google-Extended', 'Applebot-Extended', 'CCBot',
  ]
  const robots = [
    '# Public marketing page: classic search and AI answer crawlers welcome.',
    '# The API subtree is private and never indexable.',
    '',
    'User-agent: *',
    `Allow: ${prefix}/`,
    `Disallow: ${prefix}/api/`,
    '',
    ...searchAndAiAgents.flatMap((agent) => [
      `User-agent: ${agent}`,
      `Allow: ${prefix}/`,
      `Disallow: ${prefix}/api/`,
      '',
    ]),
    `Sitemap: ${siteOrigin}${prefix}/sitemap.xml`,
    '',
    '# Plain-text summary for AI answer engines and LLM crawlers:',
    `# ${siteOrigin}${prefix}/llms.txt`,
    '',
  ].join('\n')
  const sitemapImages = ['og-image.jpg', 'images/hero-phone.jpg']
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    '  <url>',
    `    <loc>${siteOrigin}${prefix}/</loc>`,
    `    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    '    <priority>1.0</priority>',
    ...sitemapImages.map((image) => `    <image:image><image:loc>${siteOrigin}${prefix}/${image}</image:loc></image:image>`),
    '  </url>',
    '</urlset>',
    '',
  ].join('\n')
  fs.writeFileSync(path.join(dist, 'robots.txt'), robots)
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap)
  ok(`crawler files generated for base ${configuredBase}`)

  // --------------------------------------------------------------------------
  // 2b. llms.txt — a plain-text summary aligned with the bot and page.
  //     Avoid unsupported access, price, proof and retention promises.
  // --------------------------------------------------------------------------
  const renderedBot = builtHtml.match(/href="https:\/\/t\.me\/([a-z0-9_]{5,32})\?start=landing_[^"]+"/i)?.[1]
  const bot = normaliseUsername(renderedBot) || BOT_USERNAME_DEFAULT
  if (!renderedBot || !normaliseUsername(renderedBot)) {
    fail('could not find a valid Telegram CTA destination in the prerendered page')
  }
  const botLink = `https://t.me/${bot}`
  const identityMarkedVerified = builtHtml.includes(`"sameAs":["${botLink}"]`)
  const botStatus = identityMarkedVerified
    ? 'The deploy operator explicitly attested VITE_BOT_IDENTITY_VERIFIED=true; Telegram availability can still change and should be rechecked.'
    : 'The rendered Telegram handle is not independently verified for ownership or live availability; confirm the destination before release.'
  const site = `${siteOrigin}${prefix}/`
  // llms.txt follows the llmstxt.org convention: one H1 (name), a blockquote
  // summary, context paragraphs, then H2 sections that are link lists. It is an
  // optional, low-cost discovery aid - it does not affect Google Search ranking
  // (see docs/seo-geo.md) - so it stays concise and links to real page anchors.
  const faqs = getFaqs()
  const llms = [
    '# گاماس (Gamas)',
    '',
    '> ربات تلگرامی فارسی که با کمک هوش مصنوعی گفتار کلاس را به رونوشت متنی و جزوه‌ی قابل مرور تبدیل می‌کند.',
    '',
    'گاماس برای دانشجوها و هرکسی است که فایل آموزشی دارد. ویس، فایل صوتی، ویدیو یا پاورپوینت کلاس را',
    'در تلگرام می‌فرستی و رونوشت فارسی و جزوه‌ی Word را در همان گفت‌وگو می‌گیری.',
    '',
    `- Site: ${site}`,
    `- Telegram bot: ${botLink} (@${bot})`,
    `- Telegram identity status: ${botStatus}`,
    `- Language: Persian (${PRODUCT.seo.language}), right-to-left`,
    `- Product facts reviewed at source revision ${PRODUCT.source.commit}: ${PRODUCT.source.commitUrl}`,
    `- Page last updated: ${PRODUCT.seo.updatedOn}`,
    '',
    '## شروع و استفاده',
    '',
    `- [باز کردن ربات در تلگرام](${botLink}): شروع کار در تلگرام`,
    `- [مراحل کار: از فایل کلاس تا جزوه](${site}#how): سه قدم`,
    `- [قابلیت‌ها و فرمت‌های پشتیبانی‌شده](${site}#features): صدا، ویدیو و پاورپوینت`,
    `- [سقف حجم فایل](${site}#features): ${PRODUCT.files.defaultMaxLabelFa}`,
    '',
    '## خروجی‌ها',
    '',
    `- رونوشت گفتار فارسی در فایل ${PRODUCT.outputs.transcriptExtension}`,
    `- جزوه‌ی ساختاریافته در فایل Word (${PRODUCT.outputs.notesExtension})، اگر ساخت جزوه موفق شود`,
    '- اگر ساخت جزوه انجام نشود، رونوشت خام همچنان فرستاده می‌شود',
    '',
    '## قابلیت‌ها',
    '',
    ...PRODUCT.features.map((feature) => `- ${feature}`),
    '',
    '## فرمت‌های پشتیبانی‌شده',
    '',
    `- صدا: ${PRODUCT.files.audioExamples.join(', ')}`,
    `- ویدیو: ${PRODUCT.files.videoExamples.join(', ')}؛ ویدیوی گرد تلگرام هم پردازش می‌شود`,
    `- پاورپوینت: ${PRODUCT.files.powerpointExamples.join(', ')}`,
    `- پشتیبانی‌نشده در کد بررسی‌شده: ${PRODUCT.files.unsupported.join(', ')}`,
    '',
    '## پرسش‌های پرتکرار',
    '',
    ...faqs.map((faq) => `- [${faq.q}](${site}#faq): ${faq.a}`),
    '',
    '## حریم خصوصی و نگهداری داده',
    '',
    '- این صفحه ایمیل جمع نمی‌کند.',
    ...PRODUCT.privacy.details.map((detail) => `- ${detail}`),
    `- ${PRODUCT.privacy.retentionSummaryFa}`,
    `- ${PRODUCT.source.noticeFa}`,
    `- جزئیات کامل: ${site}#privacy`,
    '',
    '## Optional',
    '',
    `- [صفحه‌ی اصلی گاماس](${site}): توضیح کامل محصول`,
    `- [نمایش شبیه‌سازی‌شده](${site}#demo): نمونه‌ی جریان پردازش، نه پاسخ زنده‌ی ربات`,
    `- [سورس عمومی ربات](${PRODUCT.source.repository}): مخزن کد`,
    `- پیش از تکیه بر ${botLink} مطمئن شو همان ربات موردنظر است و در دسترس می‌ماند. این صفحه قیمت تأییدشده‌ای اعلام نمی‌کند.`,
    '',
  ].join('\n')
  fs.writeFileSync(path.join(dist, 'llms.txt'), llms)
  ok('llms.txt generated for ' + site)
}

// ---------------------------------------------------------------------------
// 3. Root-relative public font URLs in CSS need the deploy prefix.
//    Vite rewrites JS/HTML assets for `base`, but leaves `/fonts/...` URLs in
//    CSS as root-absolute paths. Rewrite and assert these before upload.
// ---------------------------------------------------------------------------
if (configuredBase !== '/' && /^\/(?:[A-Za-z0-9_-]+\/)*$/.test(configuredBase)) {
  const assetsDir = path.join(dist, 'assets')
  const cssFiles = []
  const findCss = (dir) => {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const entryPath = path.join(dir, entry.name)
      if (entry.isDirectory()) findCss(entryPath)
      else if (entry.isFile() && entry.name.endsWith('.css')) cssFiles.push(entryPath)
    }
  }
  findCss(assetsDir)

  if (!cssFiles.length) {
    fail('no built CSS found while checking subfolder font URLs')
  }

  const fontPrefix = `${configuredBase}fonts/`
  let rewrittenCount = 0
  for (const cssFile of cssFiles) {
    const css = fs.readFileSync(cssFile, 'utf8')
    const rewritten = css.replace(/url\(\s*(["']?)\/fonts\//g, (_match, quote) => `url(${quote}${fontPrefix}`)
    if (rewritten !== css) {
      fs.writeFileSync(cssFile, rewritten)
      rewrittenCount++
    }
    if (/url\(\s*["']?\/fonts\//.test(rewritten)) {
      fail(`root-relative font URL remains in ${path.relative(dist, cssFile)}`)
    }
    if (rewritten.includes('/fonts/')) {
      if (!rewritten.includes(fontPrefix)) {
        fail(`font URL does not use ${configuredBase} in ${path.relative(dist, cssFile)}`)
      }
    }
  }
  ok(`subfolder font URLs checked (${rewrittenCount} CSS file${rewrittenCount === 1 ? '' : 's'} rewritten)`)
}

// ---------------------------------------------------------------------------
// 4. Refuse to ship anything sensitive
// ---------------------------------------------------------------------------
const forbidden = [
  /^node_modules$/,
  /^\.env(\.|$)/i,
  /^\.git$/,
  /^src$/,
  /^vendor$/,
  /^composer\.(json|lock)$/,
  /^package(-lock)?\.json$/,
  /^vite\.config\.(js|ts|mjs)$/,
  /^php\.ini$/i,
  /\.(?:php\d*|phtml|phar)$/i,
  /\.(?:ndjson|jsonl|sqlite3?(?:-(?:wal|shm|journal))?|db(?:-(?:wal|shm|journal))?|sql|log(?:\.\d+)?)$/i,
  /\.map$/,
]

const offenders = []
const walk = (dir, rel = '') => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relPath = rel ? `${rel}/${entry.name}` : entry.name
    if (forbidden.some((re) => re.test(entry.name))) offenders.push(relPath)
    if (entry.isDirectory()) walk(path.join(dir, entry.name), relPath)
  }
}
walk(dist)

if (offenders.length) {
  fail(`sensitive files present in dist/: ${offenders.join(', ')}`)
} else {
  ok('no sensitive files in dist/')
}

// ---------------------------------------------------------------------------
// 4. .htaccess must be there (and RewriteBase aligned with VITE_BASE)
// ---------------------------------------------------------------------------
const htaccess = path.join(dist, '.htaccess')
let expectedScriptHashes = []
let expectedStyleHashesList = []
if (fs.existsSync(htaccess)) {
  let htContent = fs.readFileSync(htaccess, 'utf8')
  if (configuredBase !== '/' && /^\/(?:[A-Za-z0-9_-]+\/)*$/.test(configuredBase)) {
    htContent = htContent.replace(/^(\s*RewriteBase\s+)\/\s*$/m, `$1${configuredBase}`)
    htContent = htContent.replace(/^(\s*ErrorDocument\s+404\s+)\/\S*\s*$/m, `$1${configuredBase}404.html`)
  }

  const indexFile = path.join(dist, 'index.html')
  if (!fs.existsSync(indexFile)) {
    fail('dist/index.html is missing; cannot generate the script CSP hashes')
  } else {
    const html = fs.readFileSync(indexFile, 'utf8')
    const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)]
      .filter(([, attributes, body]) => !/\bsrc\s*=/i.test(attributes) && body.length > 0)
      .map(([, , body]) => `sha256-${crypto.createHash('sha256').update(body, 'utf8').digest('base64')}`)
    const uniqueHashes = [...new Set(inlineScripts)]
    expectedScriptHashes = uniqueHashes

    const inlineStyles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)]
      .map(([, body]) => body)
      .filter((body) => body.length > 0)
      .map((body) => `sha256-${crypto.createHash('sha256').update(body, 'utf8').digest('base64')}`)
    const uniqueStyleHashes = [...new Set(inlineStyles)]
    expectedStyleHashesList = uniqueStyleHashes

    if (!uniqueHashes.length) {
      fail('no inline scripts found; review the CSP template rather than shipping a permissive fallback')
    } else if (!htContent.includes('__GAMAS_SCRIPT_HASHES__')) {
      fail('.htaccess CSP hash placeholder is missing; refusing to ship an unverified inline-script policy')
    } else {
      htContent = htContent.replace('__GAMAS_SCRIPT_HASHES__', uniqueHashes.map((hash) => `'${hash}'`).join(' '))
      ok(`CSP allowlists ${uniqueHashes.length} exact inline script hash${uniqueHashes.length === 1 ? '' : 'es'}`)
    }
    if (!htContent.includes('__GAMAS_STYLE_HASHES__')) {
      fail('.htaccess CSP style-hash placeholder is missing; refusing to ship an unverified inline-style policy')
    } else {
      htContent = htContent.replace('__GAMAS_STYLE_HASHES__', uniqueStyleHashes.map((hash) => `'${hash}'`).join(' '))
      ok(`CSP allowlists ${uniqueStyleHashes.length} exact inline style hash${uniqueStyleHashes.length === 1 ? '' : 'es'}`)
    }

    if (/\sstyle\s*=/i.test(html)) {
      fail('inline style attribute found in prerendered HTML; style-src-attr is intentionally locked to none')
    }
    if (/\son[a-z]+\s*=/i.test(html)) {
      fail('inline event-handler attribute found in prerendered HTML')
    }
    if (/__GAMAS_[A-Z0-9_]+__|%GAMAS_[A-Z0-9_]+%/.test(html)) {
      fail('unresolved metadata/build placeholder found in dist/index.html')
    }
  }

  const cspMatch = htContent.match(/Content-Security-Policy\s+"([^"]+)"/i)
  if (!cspMatch) {
    fail('Content-Security-Policy header is missing from dist/.htaccess')
  } else {
    const csp = cspMatch[1]
    if (/__GAMAS_(SCRIPT|STYLE)_HASHES__|unsafe-inline|unsafe-eval/i.test(csp)) {
      fail('CSP contains an unresolved placeholder or an unsafe inline/eval source')
    }
    if (!/script-src\s+'self'\s+'sha256-[A-Za-z0-9+/=]+'/.test(csp)) {
      fail('CSP does not contain a self source and a generated SHA-256 script source')
    }
    const directives = csp.split(';').map((s) => s.trim())
    const hashesOf = (name) => {
      const directive = directives.find((d) => d === name || d.startsWith(`${name} `))
      if (!directive) return []
      return [...directive.matchAll(/'sha256-([A-Za-z0-9+/=]+)'/g)].map((m) => `sha256-${m[1]}`)
    }
    const policyHashes = hashesOf('script-src')
    const expectedHashes = new Set(expectedScriptHashes)
    if (policyHashes.length !== expectedHashes.size || policyHashes.some((hash) => !expectedHashes.has(hash))) {
      fail('CSP inline-script hashes do not exactly match the prerendered HTML')
    }
    if (!/style-src\s+'self'(?:\s|;)/.test(csp) || !/style-src-attr\s+'none'/.test(csp)) {
      fail('CSP must restrict styles to same-origin stylesheets and prohibit inline style attributes')
    }
    const policyStyleHashes = hashesOf('style-src')
    const expectedStyleHashes = new Set(expectedStyleHashesList)
    if (policyStyleHashes.length !== expectedStyleHashes.size || policyStyleHashes.some((hash) => !expectedStyleHashes.has(hash))) {
      fail('CSP inline-style hashes do not exactly match the prerendered HTML')
    }
    if (!/report-uri\s+\/api\/csp-report\.php/.test(csp)) {
      fail('CSP must send violation reports to /api/csp-report.php')
    }
    if (policyStyleHashes.length !== expectedStyleHashes.size || policyStyleHashes.some((hash) => !expectedStyleHashes.has(hash))) {
      fail('CSP inline-style hashes do not exactly match the prerendered HTML')
    }
  }

  fs.writeFileSync(htaccess, htContent)
  ok('.htaccess present in dist/')
} else {
  fail('.htaccess missing from dist/ — public/.htaccess was not copied')
}

// ---------------------------------------------------------------------------
// 5. Validate prerendered SEO, RTL shell, local assets and crawler output
// ---------------------------------------------------------------------------
if (fs.existsSync(indexPath) && siteOrigin && /^\/(?:[A-Za-z0-9_-]+\/)*$/.test(configuredBase)) {
  const html = fs.readFileSync(indexPath, 'utf8')
  const basePrefix = configuredBase === '/' ? '' : configuredBase.slice(0, -1)
  const expectedCanonicalUrl = canonicalUrl

  if (!/<html\b[^>]*\blang="fa"[^>]*\bdir="rtl"|<html\b[^>]*\bdir="rtl"[^>]*\blang="fa"/i.test(html)) {
    fail('prerendered HTML must declare Persian (fa) and right-to-left direction')
  }
  if (!/<h1\b/i.test(html)) fail('prerendered page is missing its primary heading')
  if (!/<a\b[^>]*class="[^"]*skip-link[^"]*"[^>]*href="#main-content"/i.test(html)) {
    fail('prerendered page is missing the keyboard skip link')
  }
  const canonicalValue = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1]
  if (canonicalValue !== expectedCanonicalUrl) {
    fail(`canonical URL is "${canonicalValue || '(missing)'}"; expected ${expectedCanonicalUrl}`)
  }
  if (!/<meta\b[^>]*name="description"[^>]*content="[^"]+"/i.test(html)) {
    fail('prerendered page is missing a non-empty meta description')
  }
  if (/<form\b/i.test(html)) fail('unexpected form found; the landing page is intended to collect no form submissions')
  if (!/<meta\b[^>]*name="robots"[^>]*content="[^"]*max-snippet:-1[^"]*"/i.test(html)) {
    fail('prerendered page must allow full snippets (robots max-snippet:-1) for search and AI answer engines')
  }
  if (!/<meta\b[^>]*name="keywords"[^>]*content="[^"]+"/i.test(html)) {
    fail('prerendered page is missing its (non-empty) keyword meta')
  }
  if (!/<link\b[^>]*hreflang="fa-IR"[^>]*href="[^"]+"/i.test(html)) {
    fail('prerendered page must declare the fa-IR alternate link')
  }
  if (!/"@type":"HowTo"/.test(html) || !/"@type":"SoftwareApplication"/.test(html)) {
    fail('prerendered JSON-LD must describe the product with HowTo and SoftwareApplication entities')
  }
  if (!/"applicationCategory":"EducationApplication"/.test(html)) {
    fail('prerendered SoftwareApplication must keep its applicationCategory')
  }
  ok('Persian RTL shell, heading, skip link, snippets policy and metadata checked')

  const appBaseUrl = `${siteOrigin}${configuredBase}`
  const checkLocalReference = (rawValue, contextLabel) => {
    const value = rawValue.trim().replace(/&amp;/g, '&')
    if (!value || value.startsWith('#') || /^(?:data:|blob:|mailto:|tel:|javascript:)/i.test(value)) {
      if (/^javascript:/i.test(value)) fail(`javascript: URL found in ${contextLabel}`)
      return
    }

    let url
    try {
      url = new URL(value, appBaseUrl)
    } catch {
      fail(`invalid URL "${value}" found in ${contextLabel}`)
      return
    }
    if (url.origin !== siteOrigin) return
    if (!url.pathname.startsWith(configuredBase)) {
      fail(`same-origin reference escapes configured base ${configuredBase}: ${value} (${contextLabel})`)
      return
    }

    let relativePath
    try {
      relativePath = decodeURIComponent(url.pathname.slice(configuredBase.length))
    } catch {
      fail(`invalid encoded local path "${value}" in ${contextLabel}`)
      return
    }
    const outputPath = path.resolve(dist, relativePath || 'index.html')
    const fromDist = path.relative(dist, outputPath)
    if (fromDist.startsWith('..') || path.isAbsolute(fromDist)) {
      fail(`local reference escapes dist/: ${value} (${contextLabel})`)
    } else if (!fs.existsSync(outputPath)) {
      fail(`local reference has no generated file: ${value} (${contextLabel})`)
    }
  }

  const referenceAttributes = /\b(href|src|poster|xlink:href|imagesrc|imagesrcset|srcset)\s*=\s*(["'])(.*?)\2/gi
  for (const [, attribute, , rawValue] of html.matchAll(referenceAttributes)) {
    const label = 'prerendered HTML'
    if (/^(?:imagesrcset|srcset)$/i.test(attribute)) {
      for (const candidate of rawValue.split(',')) {
        const imageUrl = candidate.trim().split(/\s+/)[0]
        if (imageUrl) checkLocalReference(imageUrl, label)
      }
    } else {
      checkLocalReference(rawValue, label)
    }
  }

  for (const [, rawImageUrl] of html.matchAll(/<meta\b[^>]*(?:property|name)="(?:og:image|twitter:image)"[^>]*content="([^"]+)"/gi)) {
    checkLocalReference(rawImageUrl, 'social preview metadata')
  }

  const cssFiles = []
  const scanCss = (dir) => {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const entryPath = path.join(dir, entry.name)
      if (entry.isDirectory()) scanCss(entryPath)
      else if (entry.isFile() && entry.name.endsWith('.css')) cssFiles.push(entryPath)
    }
  }
  scanCss(path.join(dist, 'assets'))
  for (const cssFile of cssFiles) {
    const css = fs.readFileSync(cssFile, 'utf8')
    const cssBase = `${siteOrigin}${configuredBase}${path.relative(dist, cssFile).split(path.sep).join('/')}`
    for (const match of css.matchAll(/url\(\s*(?:(["'])(.*?)\1|([^)]*?))\s*\)/gi)) {
      const assetUrl = (match[2] ?? match[3] ?? '').trim()
      if (!assetUrl || /^(?:data:|blob:|https?:|\/\/)/i.test(assetUrl)) continue
      checkLocalReference(new URL(assetUrl, cssBase).href, path.relative(dist, cssFile))
    }
  }
  ok(`generated local links and CSS assets checked (${cssFiles.length} stylesheet${cssFiles.length === 1 ? '' : 's'})`)

  const robotsPath = path.join(dist, 'robots.txt')
  const sitemapPath = path.join(dist, 'sitemap.xml')
  const llmsPath = path.join(dist, 'llms.txt')
  if (![robotsPath, sitemapPath, llmsPath].every(fs.existsSync)) {
    fail('robots.txt, sitemap.xml and llms.txt must all be present in dist/')
  } else {
    const robots = fs.readFileSync(robotsPath, 'utf8')
    const sitemap = fs.readFileSync(sitemapPath, 'utf8')
    const llms = fs.readFileSync(llmsPath, 'utf8')
    if (!robots.includes(`Sitemap: ${siteOrigin}${basePrefix}/sitemap.xml`)) {
      fail('robots.txt sitemap URL does not match the configured deployment base')
    }
    if (!robots.includes(`Disallow: ${basePrefix}/api/`)) {
      fail('robots.txt API disallow path does not match the configured deployment base')
    }
    if (!sitemap.includes(`<loc>${expectedCanonicalUrl}</loc>`)) {
      fail('sitemap.xml does not contain the configured canonical URL')
    }
    if (!llms.includes(PRODUCT.source.commit) || !llms.includes('identity status')) {
      fail('llms.txt must disclose its reviewed source revision and Telegram identity verification status')
    }
    if (!/^# .+\n\n> /m.test(llms)) {
      fail('llms.txt must start with an H1 name followed by a blockquote summary')
    }
    if (!llms.includes('\n## ')) {
      fail('llms.txt must expose H2 link sections')
    }
    if (!llms.includes(`https://t.me/${PRODUCT.bot.username}`)) {
      fail('llms.txt must link the configured Telegram destination')
    }
    for (const agent of ['OAI-SearchBot', 'PerplexityBot', 'Claude-SearchBot', 'GPTBot', 'Googlebot']) {
      if (!new RegExp(`^User-agent: ${agent}$`, 'm').test(robots)) {
        fail(`robots.txt is missing an explicit AI/search crawler group for ${agent}`)
      }
    }
    if (!robots.includes(`Disallow: ${basePrefix}/api/`)) {
      fail('robots.txt must keep the API subtree disallowed for every group')
    }
    if (!/xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1"/.test(sitemap) || !/<image:image>/.test(sitemap)) {
      fail('sitemap.xml must declare the image namespace and at least one image entry')
    }
    ok('robots.txt, sitemap.xml and llms.txt checked against product facts, AI-crawler policy and deployment base')
  }

  if (fs.existsSync(htaccess)) {
    const htContent = fs.readFileSync(htaccess, 'utf8')
    const rewriteBase = htContent.match(/^\s*RewriteBase\s+(\S+)/m)?.[1]
    if (rewriteBase !== configuredBase) {
      fail(`.htaccess RewriteBase is "${rewriteBase || '(missing)'}"; expected ${configuredBase}`)
    }
    if (!/^\s*RewriteRule\s+\^api\(\?:\/\|\$\)\s+-\s+\[L,NC\]/m.test(htContent)) {
      fail('.htaccess must leave the API subtree native so PHP routes and 404s are not swallowed by the SPA fallback')
    }
  }
} else {
  fail('cannot validate prerendered output because dist/index.html or valid deployment settings are missing')
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
const size = fs
  .readdirSync(dist, { withFileTypes: true })
  .map((e) => e.name)
  .sort()

console.log(`\n  dist/ contents: ${size.join(', ')}`)

if (failed) {
  console.error('\n\x1b[31mPost-build checks FAILED — do not upload this build.\x1b[0m\n')
  process.exit(1)
}
console.log('\n\x1b[32mPost-build checks passed.\x1b[0m\n')
