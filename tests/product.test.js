import test from 'node:test'
import assert from 'node:assert/strict'
import {
  BOT_USERNAME_DEFAULT,
  LANDING_CTA_EVENTS,
  PRODUCT,
  landingEventFor,
  normaliseUsername,
} from '../src/lib/product.js'
import { tgLink } from '../src/lib/constants.js'

test('Telegram username normalization accepts handles, not URLs or malformed identifiers', () => {
  assert.equal(normaliseUsername(' @Gamas_Bot9 '), 'Gamas_Bot9')
  assert.equal(normaliseUsername('tiny'), '')
  assert.equal(normaliseUsername('https://t.me/GamasBot'), '')
  assert.equal(normaliseUsername('Gamas Bot'), '')
  assert.equal(normaliseUsername('a'.repeat(33)), '')
  assert.equal(BOT_USERNAME_DEFAULT, 'Gamas_jozveh_bot')
})

test('CTA deep-link parameters are the same canonical values used by analytics', () => {
  for (const [placement, event] of Object.entries(LANDING_CTA_EVENTS)) {
    assert.equal(landingEventFor(placement), event)
    const link = new URL(tgLink(placement))
    assert.equal(link.hostname, 't.me')
    assert.equal(decodeURIComponent(link.searchParams.get('start')), event)
  }
})

test('product facts disclose simulated UI, conditional notes and source-based privacy', () => {
  assert.equal(PRODUCT.demo.isLive, false)
  assert.match(PRODUCT.demo.disclaimerFa, /شبیه‌سازی/)
  assert.equal(PRODUCT.outputs.transcriptExtension, 'TXT')
  assert.equal(PRODUCT.outputs.notesExtension, 'DOCX')
  assert.equal(PRODUCT.outputs.notesConditional, true)
  assert.equal(PRODUCT.outputs.rawTranscriptOnNotesFailure, true)
  assert.equal(PRODUCT.files.defaultMaxBytes, 2_000_000_000)
  assert.match(PRODUCT.privacy.retentionSummaryFa, /حذف خودکار تعریف نشده/)
  assert.equal(PRODUCT.source.liveConfigurationVerified, false)
  assert.equal(PRODUCT.bot.identityVerified, false)
  assert.match(PRODUCT.bot.identityNoticeFa, /هویت و دسترس‌پذیری زنده/)
  assert.match(PRODUCT.source.commit, /^[a-f0-9]{40}$/)
})
