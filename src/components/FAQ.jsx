import { useState } from 'react'
import IsolatedText from './IsolatedText'

const faqs = [
  {
    q: 'چه فرمت‌هایی می‌پذیرد؟',
    a: 'ویس تلگرام، MP3، M4A، WAV، OGG، ویدیو و پاورپوینت. PDF، تصویر و ZIP را نمی‌گیرد.',
  },
  {
    q: 'حداکثر حجم چقدر است؟',
    a: '۲ گیگابایت.',
  },
  {
    q: 'فایل‌هایم کجا می‌مانند؟',
    a: 'برای پردازش به سرویس‌های لازم می‌روند. فایل موقت حذف می‌شود؛ رونوشت و جزوه ممکن است در دیتابیس بمانند.',
  },
  {
    q: 'دقت چقدر است؟',
    a: 'به کیفیت ضبط و نویز بستگی دارد.',
  },
  {
    q: 'هزینه چقدر است؟',
    a: 'هنوز نهایی نشده. دسترسی فعلاً با تأیید است.',
  },
  {
    q: 'اگر خطا بخورد چه؟',
    a: 'اگر ساخت جزوه خطا بخورد، رونوشت خام فرستاده می‌شود.',
  },
]

function FAQItem({ index, q, a, isOpen, onToggle }) {
  const panelId = `faq-panel-${index}`
  return (
    <div className="faq-row border-b border-subtle">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 py-5 text-start"
      >
        <span className="text-[15px] font-semibold leading-7">{q}</span>
        <span
          className={`faq-marker flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition ${
            isOpen ? 'rotate-45 border-ink bg-ink text-white' : 'border-subtle text-ink-muted'
          }`}
          aria-hidden="true"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div
        id={panelId}
        aria-hidden={!isOpen}
        className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="max-w-[62ch] pb-6 text-sm text-muted"><IsolatedText>{a}</IsolatedText></p>
        </div>
      </div>
    </div>
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
  // Escape "<" so no answer text can ever close the <script> tag early.
  const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, '\\u003c')

  return (
    <section id="faq" className="product-tile product-tile-parchment">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2>سؤال‌های رایج</h2>
        </div>

        <div className="mt-12 max-w-3xl border-t border-subtle">
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
