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
import { getFaqs } from '../src/lib/faq-data.js'

test('Telegram username normalization accepts handles, not URLs or malformed identifiers', () => {
  assert.equal(normaliseUsername(' @Gamas_Bot9 '), 'Gamas_Bot9')
  assert.equal(normaliseUsername('tiny'), '')
  assert.equal(normaliseUsername('https://t.me/Gamas_jozveh_bot'), '')
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
  assert.match(PRODUCT.demo.disclaimerFa, /به ربات متصل نیست/)
  assert.match(PRODUCT.demo.disclaimerFa, /زمان و نتیجه‌ی واقعی/)
  assert.match(PRODUCT.demo.captionFa, /پیش‌نمایش نمایشی/)
  assert.doesNotMatch(`${PRODUCT.demo.disclaimerFa} ${PRODUCT.demo.captionFa}`, /(?:۵|5) دقیقه/)
  assert.equal(PRODUCT.outputs.transcriptExtension, 'TXT')
  assert.equal(PRODUCT.outputs.notesExtension, 'DOCX')
  assert.equal(PRODUCT.outputs.notesConditional, true)
  assert.equal(PRODUCT.outputs.rawTranscriptOnNotesFailure, true)
  assert.equal(PRODUCT.files.defaultMaxBytes, 2_000_000_000)
  assert.match(PRODUCT.privacy.temporarySummaryFa, /پس از پردازش پاک می‌شود/)
  assert.match(PRODUCT.privacy.temporarySummaryFa, /راه‌اندازی بعدی/)
  assert.match(PRODUCT.privacy.retentionSummaryFa, /حذف خودکار تعریف نشده/)
  assert.equal(PRODUCT.source.liveConfigurationVerified, false)
  assert.match(PRODUCT.source.noticeFa, /پیکربندی نسخه‌ی زنده مستقلاً تأیید نشده/)
  assert.doesNotMatch(PRODUCT.source.noticeFa, /کار 3 ساعته/)
  assert.ok(PRODUCT.privacy.details.length >= 8)
  assert.ok(PRODUCT.privacy.details.every((detail) => typeof detail === 'string'))
  assert.ok(PRODUCT.privacy.detailGroups.length >= 3)
  assert.ok(PRODUCT.privacy.detailGroups.every(({ heading, items }) => heading && items.length > 0))
  assert.deepEqual(
    PRODUCT.privacy.detailGroups.flatMap(({ items }) => items).sort(),
    [...PRODUCT.privacy.details].sort(),
  )
  const privacyDetails = PRODUCT.privacy.details.join(' ')
  assert.match(privacyDetails, /پایگاه‌داده/)
  assert.match(privacyDetails, /Do Not Track/)
  assert.match(privacyDetails, /درخواست حذف/)
  assert.equal(PRODUCT.bot.identityVerified, false)
  assert.match(PRODUCT.bot.identityNoticeFa, /هویت و دسترس‌پذیری زنده/)
  assert.match(PRODUCT.source.commit, /^[a-f0-9]{40}$/)
})

test('SEO facts stay Persian, bounded and free of build placeholders', () => {
  assert.ok(PRODUCT.seo.title.length >= 20 && PRODUCT.seo.title.length <= 90, 'title length is in a sane range')
  assert.match(PRODUCT.seo.title, /گاماس/, 'title keeps the brand name')
  assert.ok(PRODUCT.seo.description.length >= 80 && PRODUCT.seo.description.length <= 240, 'description length is in a sane range')
  assert.ok(PRODUCT.seo.keywords.length >= 5, 'several Persian query families are targeted')
  assert.ok(PRODUCT.seo.keywords.every((keyword) => keyword.trim().length > 3 && !/%[A-Z_]+%/.test(keyword)))
  assert.match(PRODUCT.seo.language, /^fa(-IR)?$/)
  assert.match(PRODUCT.seo.publishedOn, /^\d{4}-\d{2}-\d{2}$/)
  assert.match(PRODUCT.seo.updatedOn, /^\d{4}-\d{2}-\d{2}$/)
  assert.ok(PRODUCT.features.length >= 5, 'the SoftwareApplication feature list is populated')
  assert.ok(PRODUCT.features.every((feature) => !/%[A-Z_]+%/.test(feature)))
})

test('FAQ content covers the transcription, notes and Telegram intents', () => {
  const faqs = getFaqs()
  assert.ok(faqs.length >= 12, 'FAQ set stays broad enough for long-tail Persian queries')
  assert.ok(faqs.every((faq) => faq.q.trim().length > 8 && faq.a.trim().length > 20), 'every FAQ has a real question and answer')
  const allText = faqs.map((faq) => `${faq.q} ${faq.a}`).join(' ')
  assert.match(allText, /ویس/, 'covers the "voice to text" intent')
  assert.match(allText, /پاورپوینت/, 'covers the PowerPoint intent')
  assert.match(allText, /جزوه/, 'covers the study-notes intent')
  assert.match(allText, new RegExp(PRODUCT.bot.username), 'explains how to find the bot')
})
