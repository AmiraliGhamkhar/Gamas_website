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

import fs from 'node:fs'
import path from 'node:path'
// Shared with the page so the bot handle in llms.txt cannot drift from the
// handle rendered in the UI. normaliseUsername() is the single owner of the
// sanitising; this script supplies the env value Node cannot see through
// import.meta.env.
import { normaliseUsername } from '../src/lib/constants.js'

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
const configuredBase = process.env.VITE_BASE || '/'
const configuredSite = (process.env.VITE_SITE_URL || 'https://gamas.bot').replace(/\/+$/, '')
let siteOrigin = ''
try {
  const parsedSite = new URL(configuredSite)
  if (!['https:', 'http:'].includes(parsedSite.protocol) || parsedSite.pathname !== '/' || parsedSite.search || parsedSite.hash) {
    throw new Error('VITE_SITE_URL must be an origin only, such as https://gamas.bot')
  }
  siteOrigin = parsedSite.origin
} catch (error) {
  fail(error.message || `invalid VITE_SITE_URL "${configuredSite}"`)
}

if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(configuredBase)) {
  fail(`invalid VITE_BASE "${configuredBase}" — use / or a path such as /gamas/`)
} else if (siteOrigin) {
  const prefix = configuredBase === '/' ? '' : configuredBase.slice(0, -1)
  const today = new Date().toISOString().slice(0, 10)
  const robots = [
    'User-agent: *',
    `Disallow: ${prefix}/api/`,
    `Allow: ${prefix}/`,
    '',
    `Sitemap: ${siteOrigin}${prefix}/sitemap.xml`,
    '',
    '# Plain-text summary for AI answer engines and LLM crawlers:',
    `# ${siteOrigin}${prefix}/llms.txt`,
    '',
  ].join('\n')
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    `    <loc>${siteOrigin}${prefix}/</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    '    <priority>1.0</priority>',
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
  const bot = normaliseUsername(process.env.VITE_BOT_USERNAME)
  const site = `${siteOrigin}${prefix}/`
  const botLink = `https://t.me/${bot}`
  const llms = [
    '# گاماس (Gamas)',
    '',
    '> ربات تلگرامی فارسی که با کمک هوش مصنوعی گفتار کلاس را به رونوشت و جزوه‌ی قابل مرور تبدیل می‌کند.',
    '',
    `- Site: ${site}`,
    `- Telegram bot: ${botLink} (@${bot})`,
    '- Language: Persian (fa), right-to-left',
    '',
    '## What it does',
    '',
    'Send an audio recording, video or PowerPoint file to the Telegram bot. It transcribes',
    'speech and can use slide text when processing a presentation. The bot returns a raw',
    'transcript and, when note generation succeeds, a structured Word study guide in the chat.',
    '',
    '## Supported files',
    '',
    '- Audio examples: MP3, M4A, WAV, OGG, FLAC, WMA, AMR and other formats readable by the bundled media libraries',
    '- Video: MP4, MKV, MOV, AVI, WEBM and Telegram video notes',
    '- PowerPoint: PPTX, PPTM, PPSX, PPSM, POTX, POTM, PPT, PPS and POT',
    '- Not supported: ODP, OTP, PDF, images and ZIP',
    '- Default application file-size limit: 2 GB; provider and hosting limits may differ',
    '',
    '## Output',
    '',
    '- Raw Persian speech transcript as a TXT file',
    '- Structured study notes as a Word DOCX file when note generation succeeds',
    '- Slide text can be included when the input is a supported PowerPoint file',
    '- If note generation fails, the raw transcript is still delivered',
    '',
    '## Demo',
    '',
    'The conversation shown on the website is a simulation. It is not connected to a live bot response.',
    '',
    '## Privacy',
    '',
    '- The current landing page does not collect email addresses.',
    '- CTA analytics records the page section and event time; a private rate-limit bucket uses a keyed IP pseudonym.',
    '- The hosting provider may keep separate access logs, subject to its own settings and retention policy.',
    '- The bot forwards audio and, when configured, transcript or slide text to external processing providers.',
    '- Temporary working media is removed after processing.',
    '- The reviewed bot implementation stores Telegram user identifiers, file metadata, transcripts and notes in SQLite; no automatic transcript/note expiry is defined there.',
    '- Do not send files you are not comfortable processing with external services.',
    `- Full details: ${site}#privacy`,
    '',
    '## Start',
    '',
    `Open ${botLink} and send an eligible class file. This page does not state a verified price.`,
    '',
    '## Page sections',
    '',
    `- [Overview and start](${site}#top): what the bot does and how to open it`,
    `- [Why it exists](${site}#story): a common class-note problem`,
    `- [Simulated demo](${site}#demo): a sample processing flow, not a live response`,
    `- [How it works](${site}#how): the three steps`,
    `- [Capabilities](${site}#features): accepted formats, size limit and outputs`,
    `- [Privacy](${site}#privacy): providers and data retention`,
    `- [FAQ](${site}#faq): files, outputs, accuracy and storage`,
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
if (fs.existsSync(htaccess)) {
  if (configuredBase !== '/' && /^\/(?:[A-Za-z0-9_-]+\/)*$/.test(configuredBase)) {
    const htContent = fs.readFileSync(htaccess, 'utf8')
    const updatedHt = htContent.replace(/^(\s*RewriteBase\s+)\/\s*$/m, `$1${configuredBase}`)
    fs.writeFileSync(htaccess, updatedHt)
  }
  ok('.htaccess present in dist/')
} else {
  fail('.htaccess missing from dist/ — public/.htaccess was not copied')
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
