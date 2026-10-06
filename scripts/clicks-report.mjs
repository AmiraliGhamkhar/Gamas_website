#!/usr/bin/env node
/**
 * Gamas — read-only clicks report (run on the server, never exposed via HTTP).
 * Aggregates the private SQLite clicks table (or clicks.ndjson fallback)
 * by section and day. Usage: GAMAS_DATA_DIR=/home/USER/gamas_data node scripts/clicks-report.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const dataDir = process.env.GAMAS_DATA_DIR || path.resolve(process.cwd(), 'data')
const dbPath = path.join(dataDir, 'gamas.sqlite')
const ndPath = path.join(dataDir, 'clicks.ndjson')

const rows = []
try {
  const { default: Database } = await import('node:sqlite').catch(() => ({}))
  if (Database && fs.existsSync(dbPath)) {
    const db = new Database(dbPath, { readonly: true })
    for (const r of db.prepare('SELECT section, substr(created_at, 1, 10) AS day, COUNT(*) AS n FROM clicks GROUP BY section, day ORDER BY day DESC, n DESC').all()) {
      rows.push(r)
    }
    db.close()
  }
} catch {}
if (!rows.length && fs.existsSync(ndPath)) {
  for (const line of fs.readFileSync(ndPath, 'utf8').split('\n')) {
    if (!line.trim()) continue
    try {
      const rec = JSON.parse(line)
      rows.push({ section: rec.section, day: String(rec.created || '').slice(0, 10), n: 1 })
    } catch {}
  }
}

const agg = new Map()
for (const r of rows) {
  const key = `${r.day}  ${r.section}`
  agg.set(key, (agg.get(key) || 0) + Number(r.n || 1))
}
if (!agg.size) {
  console.log('no click events found')
  process.exit(0)
}
for (const [key, n] of [...agg.entries()].sort().reverse()) console.log(`${key}: ${n}`)
