import { useState } from 'react'
import IsolatedText from './IsolatedText'
import { PRODUCT, SITE_URL } from '../lib/constants'

const faqs = [
  {
    q: 'چه فایل‌هایی را می‌توانم بفرستم؟',
    a: `ویس و فایل‌های صوتی رایج، ویدیو و فایل‌های PowerPoint پشتیبانی می‌شوند. ${PRODUCT.files.unsupported.join('، ')} پذیرفته نمی‌شوند.`,
  },
  {
    q: 'سقف حجم فایل چقدر است؟',
    a: `سقف پیش‌فرض ربات ${PRODUCT.files.defaultMaxLabelFa} است؛ تنظیم ربات و محدودیت سرویس پردازش می‌تواند بر اندازه‌ی قابل‌قبول اثر بگذارد.`,
  },
  {
    q: 'چه خروجی‌ای می‌گیرم؟',
    a: `رونوشت خام گفتار به‌صورت ${PRODUCT.outputs.transcriptExtension} و جزوه‌ی ساختاریافته به‌صورت Word (${PRODUCT.outputs.notesExtension}) فرستاده می‌شود. اگر ساخت جزوه انجام نشود، رونوشت خام همچنان در دسترس است.`,
  },
  {
    q: 'دقت متن و جزوه تضمین شده است؟',
    a: 'خیر؛ کیفیت ضبط، وضوح گفتار و نویز محیط روی متن اثر می‌گذارند و درصد دقت تضمین‌شده‌ای اعلام نمی‌شود. متن تولیدشده را با فایل اصلی تطبیق بده.',
  },
  {
    q: 'فایل‌ها و متن‌های من چه مدت می‌مانند؟',
    a: `${PRODUCT.privacy.retentionSummaryFa} جزئیات سرویس‌های بیرونی را در بخش حریم خصوصی بخوان.`,
  },
  {
    q: 'چطور شروع کنم؟',
    a: 'ربات گاماس را در تلگرام باز کن، فایل آموزشی را برایش بفرست و خروجی را در همان گفت‌وگو بگیر.',
  },
]

function FAQItem({ index, q, a, isOpen, onToggle }) {
  const panelId = `faq-panel-${index}`
  return (
    <article className={`faq-item ${isOpen ? 'is-open' : ''}`}>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="faq-question"
        >
          <span>{q}</span>
          <span className="faq-marker" aria-hidden="true">{isOpen ? '−' : '+'}</span>
        </button>
      </h3>
      <div
        id={panelId}
        aria-hidden={!isOpen}
        className={`faq-answer ${isOpen ? 'is-open' : ''}`}
      >
        <p><IsolatedText>{a}</IsolatedText></p>
      </div>
    </article>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}#faq`,
    url: SITE_URL,
    inLanguage: 'fa-IR',
    isPartOf: { '@id': `${SITE_URL}#webpage` },
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, '\\u003c')

  return (
    <section id="faq" className="product-tile product-tile-parchment faq-section">
      <div className="container faq-layout">
        <div className="faq-intro">
          <h2 className="section-title">پرسش‌های رایج</h2>
          <p className="section-description">درباره‌ی فایل‌ها، خروجی و نگهداری اطلاعات.</p>
        </div>

        <div className="faq-list">
          {faqs.map((f, i) => (
            <FAQItem
              key={f.q}
              index={i}
              q={f.q}
              a={f.a}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
    </section>
  )
}
