#!/usr/bin/env node
/**
 * Gamas — responsive image inventory check.
 * The 35 public/images/* variants are generated from 4 master illustrations
 * (student, waveform, before-after, teacher-privacy) + hero-phone.
 * This script asserts every expected width/format exists so a designer
 * re-export cannot silently drift from ResponsiveIllustration.jsx WIDTHS.
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.cwd(), 'public/images')
const illustrations = ['student', 'waveform', 'before-after', 'teacher-privacy']
const widths = [384, 512, 768, 1024]
const formats = ['avif', 'webp']

let failed = false
const missing = []
for (const name of illustrations) {
  for (const w of widths) {
    for (const ext of formats) {
      const p = path.join(root, `illustration-${name}-${w}.${ext}`)
      if (!fs.existsSync(p)) {
        failed = true
        missing.push(path.relative(process.cwd(), p))
      }
    }
  }
}
for (const ext of ['avif', 'webp', 'jpg']) {
  const p = path.join(root, `hero-phone.${ext}`)
  if (!fs.existsSync(p)) {
    failed = true
    missing.push(path.relative(process.cwd(), p))
  }
}

if (failed) {
  console.error(`missing responsive variants:\n  ${missing.join('\n  ')}`)
  process.exit(1)
}
console.log(`responsive image inventory ok: ${illustrations.length * widths.length * formats.length + 3} files`)
