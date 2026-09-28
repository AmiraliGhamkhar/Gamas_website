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
// 2. Refuse to ship anything sensitive
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
// 3. .htaccess must be there
// ---------------------------------------------------------------------------
const htaccess = path.join(dist, '.htaccess')
if (fs.existsSync(htaccess)) {
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
