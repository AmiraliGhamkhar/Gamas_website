import { useState, useRef } from 'react'
import IsolatedText from './IsolatedText'

const faqs = [
  {
    q: 'چه فرمت‌هایی قبول است؟',
    a: 'ویس تلگرام، MP3/M4A/WAV/OGG، ویدیو (MP4/MKV/MOV/AVI) و پاورپوینت PPTX/PPSX/POTX — و PPT/ODP قدیمی. PDF، تصویر و ZIP نه.',
  },
  {
    q: 'حداکثر حجم چقدر است؟',
    a: '۲ گیگابایت. برای فایل‌های بزرگ‌تر، کلاس را بخش‌بخش بفرست.',
  },
  {
    q: 'فایل‌هایم خصوصی می‌ماند؟',
    a: 'برای پردازش، صدا به سرویس گفتار و رونوشت به سرویس ساخت جزوه می‌رود. فایل موقت حذف می‌شود، اما رونوشت ممکن است در دیتابیس بماند.',
  },
  {
    q: 'دقت چقدر است؟',
    a: 'به کیفیت ضبط و نویز بستگی دارد — عدد ٪ وعده نمی‌دهیم. با یک فایل واقعی خودت تست کن.',
  },
  {
    q: 'هزینه چقدر است؟',
    a: 'قیمت هنوز نهایی نشده. فعلاً دسترسی با تأیید ادمین است.',
  },
  {
    q: 'اگر خطا بخورد چه؟',
    a: 'رونوشت خام همچنان تحویل داده می‌شود — چیزی از دست نمی‌رود.',
  },
]

function FAQItem({ index, q, a, isOpen, onToggle }) {
  const panelId = `faq-panel-${index}`
  return (
    <div className="faq-row faq-item rounded-18 border border-subtle bg-surface-parchment">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
      >
        <span className="text-sm font-semibold leading-6 text-ink">{q}</span>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-subtle transition ${isOpen ? 'rotate-45 bg-primary text-white' : 'bg-surface-muted text-ink-muted'}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </span>
      </button>
      <div
        id={panelId}
        aria-hidden={!isOpen}
        className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-7 text-ink-muted"><IsolatedText>{a}</IsolatedText></p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(0)
  const ref = useRef(null)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  // Escape "<" so no answer text can ever close the <script> tag early
  // (JSON.stringify does not escape "</script>").
  const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, '\\u003c')

  return (
    <section ref={ref} id="faq" className="product-tile product-tile-light relative">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2>
            پرسشی داری؟ <span className="text-primary-emphasis">اینجا جوابشه</span>
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-2xl space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="faq-item">
              <FAQItem index={i} q={f.q} a={f.a} isOpen={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            </div>
          ))}
        </div>
      </div>

      {/* FAQPage JSON-LD — prerendered */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
    </section>
  )
}
