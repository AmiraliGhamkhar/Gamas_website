import { useState } from 'react'
import Icon from './Icon'
import IsolatedText from './IsolatedText'

const faqs = [
  {
    q: 'چه فرمت‌هایی می‌پذیرد؟',
    a: 'ویس تلگرام، MP3، M4A، WAV، OGG، ویدیو و پاورپوینت. PDF، تصویر و ZIP را نمی‌گیرد.',
  },
  {
    q: 'حداکثر حجم فایل چقدر است؟',
    a: 'تا ۲ گیگابایت.',
  },
  {
    q: 'فایل‌هایم کجا می‌مانند؟',
    a: 'برای پردازش به سرویس‌های لازم می‌روند. فایل موقت حذف می‌شود؛ رونوشت و جزوه ممکن است در دیتابیس بمانند.',
  },
  {
    q: 'دقت جزوه به چه چیزی بستگی دارد؟',
    a: 'به کیفیت ضبط، وضوح گفتار و میزان نویز بستگی دارد. اگر ساخت جزوه خطا بخورد، رونوشت خام فرستاده می‌شود.',
  },
  {
    q: 'هزینه‌ی استفاده چقدر است؟',
    a: 'قیمت هنوز نهایی نشده؛ دسترسی فعلاً با تأیید است.',
  },
  {
    q: 'چه‌طور شروع کنم؟',
    a: 'روی دکمه‌ی شروع در تلگرام بزن، ربات را باز کن و فایل کلاس را برایش بفرست.',
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
          <p className="section-eyebrow"><Icon name="sparkles" size={17} /> پاسخ‌های کوتاه و روشن</p>
          <h2 className="section-title">سؤال داری؟</h2>
          <p className="section-description">چند جواب درباره‌ی فایل‌ها، خروجی و دسترسی.</p>
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
