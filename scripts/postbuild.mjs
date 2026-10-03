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
  // 2b. llms.txt — plain-text summary for AI answer engines (llmstxt.org).
  //     Every fact below is already stated on the page; nothing is invented,
  //     and pricing is deliberately omitted because it is still undecided.
  // --------------------------------------------------------------------------
  const bot = normaliseUsername(process.env.VITE_BOT_USERNAME)
  const site = `${siteOrigin}${prefix}/`
  const botLink = `https://t.me/${bot}`
  const llms = [
    `# گاماس (Gamas)`,
    '',
    '> ربات تلگرامی فارسی که ویس، ویدیو و پاورپوینت کلاس را به یک جزوه‌ی مرتب و فارسی تبدیل می‌کند.',
    '',
    `- Site: ${site}`,
    `- Telegram bot: ${botLink} (@${bot})`,
    '- Language: Persian (fa), right-to-left',
    '',
    '## What it does',
    '',
    'You send a class recording, video or slide deck to the Telegram bot. It transcribes the',
    'speech, merges it with the slide text, and returns a structured Persian study guide in the',
    'same chat. Nothing has to be installed: the whole product is the Telegram bot.',
    '',
    '## Accepted files',
    '',
    '- Audio: Telegram voice notes, MP3, M4A, WAV, OGG',
    '- Video: MP4, MKV, MOV, AVI',
    '- Slides: PPTX, PPSX, PPT, ODP',
    '- Not accepted: PDF, images, ZIP',
    '- Maximum file size: 2 GB',
    '',
    '## Output',
    '',
    '- Persian transcript that can be searched and re-read',
    '- Slide text placed next to the transcript',
    '- Long notes are split across several messages',
    '- If note generation fails, the raw transcript is sent instead',
    '',
    '## Privacy',
    '',
    '- Files are forwarded to the services needed to process them',
    '- The temporary file is deleted after processing',
    '- The transcript and the notes may remain in the database',
    '- Full details are on the site: ' + `${site}#privacy`,
    '',
    '## Access',
    '',
    'Access is granted by approval and the price is not finalised yet, so no price is listed here.',
    '',
    '## Page sections',
    '',
    `- [Overview and call to action](${site}#top): what the bot does and how to start`,
    `- [Why it exists](${site}#story): the problem it solves`,
    `- [Live demo](${site}#demo): sample conversation with a class recording`,
    `- [How it works](${site}#how): the three steps`,
    `- [Capabilities](${site}#features): accepted formats, size limit, what you get back`,
    `- [Privacy](${site}#privacy): which files are removed and which may remain`,
    `- [FAQ](${site}#faq): formats, size, storage, accuracy, price, how to start`,
    `- [Access request](${site}#access): email capture for the access list`,
    '',
  ].join('\n')
  fs.writeFileSync(path.join(dist, 'llms.txt'), llms)
  ok('llms.txt generated for ' + site)
}

// ---------------------------------------------------------------------------
// 3. Refuse to ship anything sensitive
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
