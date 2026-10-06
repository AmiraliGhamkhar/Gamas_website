/**
 * Website-facing product facts. Bot capabilities and privacy details below were
 * checked against the public bot source at the pinned revision; they are not a
 * verification of the separately deployed bot's live configuration.
 */
const env = import.meta.env ?? {}

export const BOT_USERNAME_DEFAULT = 'Gamas_jozveh_bot'

/** Return a valid Telegram username without a leading @, or an empty string. */
export function normaliseUsername(raw) {
  const username = String(raw || '').trim().replace(/^@/, '')
  return /^[a-z0-9_]{5,32}$/i.test(username) ? username : ''
}

const configuredUsername = normaliseUsername(env.VITE_BOT_USERNAME)

export const BOT_USERNAME = configuredUsername || BOT_USERNAME_DEFAULT
export const BOT_USERNAME_CONFIGURED = Boolean(configuredUsername)
// A build-time handle is not proof of ownership or live availability. Only an
// explicit deployment attestation may add that Telegram identity to JSON-LD.
export const BOT_IDENTITY_VERIFIED = Boolean(
  configuredUsername && String(env.VITE_BOT_IDENTITY_VERIFIED || '').trim().toLowerCase() === 'true'
)

const BOT_IDENTITY_NOTICE_FA = BOT_IDENTITY_VERIFIED
  ? 'مسئول انتشار، شناسه‌ی ربات را هنگام ساخت تأیید کرده است؛ دسترس‌پذیری آن ممکن است تغییر کند.'
  : configuredUsername
    ? 'نام کاربری تلگرام هنگام ساخت تنظیم شده، اما هویت و دسترس‌پذیری زنده‌ی آن از این صفحه بررسی نشده است؛ پیش از ارسال فایل، مقصد را تأیید کنید.'
    : 'این پیوند از نام کاربری پیش‌فرض تلگرام استفاده می‌کند؛ هویت و دسترس‌پذیری زنده‌ی آن تأیید نشده است. پیش از ارسال فایل، مقصد را بررسی کنید.'

const SOURCE_NOTICE_FA =
  'اطلاعات قابلیت‌ها و نگهداری داده بر پایه‌ی کد عمومی ربات است؛ تنظیم زنده و سیاست سرویس‌دهنده‌ها ممکن است متفاوت باشند.'

export const LANDING_CTA_EVENTS = Object.freeze({
  hero: 'landing_hero',
  navbar: 'landing_navbar',
  demo: 'landing_demo',
  final_cta: 'landing_final_cta',
  footer: 'landing_footer',
  mobile_sticky: 'landing_mobile_sticky',
})

export function landingEventFor(placement) {
  return LANDING_CTA_EVENTS[placement] || `landing_${String(placement || 'hero')}`
}

export const PRODUCT = Object.freeze({
  nameFa: 'گاماس',
  nameLatin: 'Gamas',
  seo: Object.freeze({
    title: 'گاماس | جزوه‌ی کلاس با هوش مصنوعی',
    description:
      'فایل صوتی، ویدیویی یا پاورپوینت کلاس را در تلگرام برای ربات گاماس بفرستید. گفتار با کمک هوش مصنوعی به رونوشت فارسی و جزوه‌ی قابل مرور تبدیل می‌شود.',
  }),
  source: Object.freeze({
    repository: 'https://github.com/AmiraliGhamkhar/Gamas_bot',
    commit: '838184907bc828286d4f4782151c3c4fc3b8fc9d',
    commitUrl: 'https://github.com/AmiraliGhamkhar/Gamas_bot/tree/838184907bc828286d4f4782151c3c4fc3b8fc9d',
    reviewedOn: '2026-10-06',
    liveConfigurationVerified: false,
    noticeFa: SOURCE_NOTICE_FA,
  }),
  bot: Object.freeze({
    username: BOT_USERNAME,
    usernameConfigured: BOT_USERNAME_CONFIGURED,
    identityVerified: BOT_IDENTITY_VERIFIED,
    identityNoticeFa: BOT_IDENTITY_NOTICE_FA,
  }),
  files: Object.freeze({
    audioExamples: Object.freeze(['MP3', 'M4A', 'WAV', 'OGG', 'OPUS', 'FLAC', 'WMA', 'AMR']),
    videoExamples: Object.freeze(['MP4', 'MKV', 'MOV', 'AVI', 'WEBM']),
    powerpointExamples: Object.freeze(['PPTX', 'PPTM', 'PPSX', 'PPSM', 'POTX', 'POTM', 'PPT', 'PPS', 'POT']),
    unsupported: Object.freeze(['ODP/OTP', 'PDF', 'تصویر', 'ZIP']),
    defaultMaxBytes: 2_000_000_000,
    defaultMaxLabelFa: '۲ گیگابایت',
  }),
  outputs: Object.freeze({
    transcriptExtension: 'TXT',
    notesExtension: 'DOCX',
    notesLabelFa: 'فایل Word',
    notesConditional: true,
    rawTranscriptOnNotesFailure: true,
  }),
  privacy: Object.freeze({
    sourceNoticeFa: SOURCE_NOTICE_FA,
    temporarySummaryFa: 'پس از پردازش پاک می‌شود؛ فایل‌های باقی‌مانده پس از توقف ناگهانی، هنگام راه‌اندازی بعدی پاک‌سازی می‌شوند.',
    details: Object.freeze([
      'برای پیاده‌سازی گفتار، صدای فایل به سرویس گفتاربه‌متنِ فعال در ربات فرستاده می‌شود. کد بررسی‌شده از Speechmatics، Deepgram یا یک سرویس سازگار با OpenAI پشتیبانی می‌کند؛ سرویس فعال به تنظیمات ربات بستگی دارد.',
      'اگر ساخت جزوه فعال باشد، رونوشت و در فایل‌های ارائه متن اسلایدها به سرویس زبانی پیکربندی‌شده فرستاده می‌شوند؛ کد بررسی‌شده از Gemini، Anthropic یا API سازگار با OpenAI پشتیبانی می‌کند.',
      'فایل‌های کاری موقت پس از پردازش حذف می‌شوند. اگر فرایند ناگهانی متوقف شود، فایل‌های باقی‌مانده هنگام راه‌اندازی بعدی پاک‌سازی می‌شوند.',
      'پایگاه‌داده‌ی ربات می‌تواند شناسه‌ی تلگرام، نام کاربری (اگر موجود باشد)، وضعیت و مشخصات فایل، رونوشت خام و جزوه‌ی تولیدشده را نگه دارد. در کد بررسی‌شده، حذف خودکار رونوشت و جزوه تعریف نشده است.',
      'این صفحه ایمیل نمی‌گیرد. سایت فقط محل دکمه و زمان کلیک روی پیوندهای تلگرام را ثبت می‌کند؛ برای محدودکردن درخواست‌ها، IP خام در یک HMAC تبدیل‌شده و در فایل‌های خصوصی محدودسازی به کار می‌رود.',
      'میزبان وب ممکن است در لاگ‌های دسترسی، IP و اطلاعات مرورگر را طبق تنظیمات و دوره‌ی نگهداری خودش ثبت کند. حذف داده از برنامه لزوماً نسخه‌های پشتیبان یا داده‌های نگه‌داری‌شده نزد سرویس‌های بیرونی را حذف نمی‌کند.',
    ]),
    retentionSummaryFa:
      'فایل کاری موقت پس از پردازش پاک می‌شود؛ رونوشت و جزوه ممکن است در پایگاه‌داده بمانند و برای آن‌ها در کد بررسی‌شده حذف خودکار تعریف نشده است.',
  }),
  demo: Object.freeze({
    isLive: false,
    disclaimerFa: 'شبیه‌سازی تعاملی است؛ به ربات زنده وصل نیست و پیام‌ها و متن‌های داخل گوشی نمونه‌اند.',
    captionFa: 'پیش‌نمایش شبیه‌سازی‌شده؛ نه پاسخ زنده‌ی ربات',
  }),
  analytics: Object.freeze({
    currentEvents: Object.freeze(Object.values(LANDING_CTA_EVENTS)),
    futureBotEvents: Object.freeze([
      'bot_started',
      'file_submitted',
      'processing_success',
      'processing_failure',
    ]),
  }),
})
