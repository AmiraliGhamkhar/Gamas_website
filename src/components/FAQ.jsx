import { useState } from 'react'
import IsolatedText from './IsolatedText'
import { SITE_URL } from '../lib/constants'
import { getFaqs } from '../lib/faq-data'

const faqs = getFaqs()
const faqNumberFormat = new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2 })
const faqCount = new Intl.NumberFormat('fa-IR').format(faqs.length)

function FAQItem({ index, q, a, isOpen, onToggle }) {
  const questionId = `faq-question-${index}`
  const panelId = `faq-panel-${index}`

  return (
    <article className={`faq-item ${isOpen ? 'is-open' : ''}`}>
      <h3 className="faq-item-heading">
        <button
          id={questionId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="faq-question"
        >
          <span className="faq-question-index" aria-hidden="true">
            {faqNumberFormat.format(index + 1)}
          </span>
          <span className="faq-question-text"><IsolatedText>{q}</IsolatedText></span>
          <span className="faq-marker" aria-hidden="true">
            <span className="faq-marker-line faq-marker-line-horizontal" />
            <span className="faq-marker-line faq-marker-line-vertical" />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        aria-labelledby={questionId}
        aria-hidden={!isOpen}
        className={`faq-answer ${isOpen ? 'is-open' : ''}`}
      >
        <div className="faq-answer-inner">
          <p><IsolatedText>{a}</IsolatedText></p>
        </div>
      </div>
    </article>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(-1)

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
    <section
      id="faq"
      className="product-tile product-tile-parchment faq-section"
      aria-labelledby="faq-title"
    >
      <div className="container faq-layout">
        <header className="faq-intro">
          <p className="faq-kicker">راهنمای پاسخ‌گویی</p>
          <h2 id="faq-title" className="section-title">پرسش‌های رایج</h2>
          <p className="section-description">
            پاسخ‌هایی درباره‌ی فرمت فایل، خروجی، کیفیت پردازش و نگه‌داری داده.
          </p>
          <p className="faq-instruction">
            <span className="faq-count">{faqCount} پرسش</span>
            <span>برای دیدن پاسخ، پرسش را انتخاب کنید.</span>
          </p>
        </header>

        <ol className="faq-list" aria-label="پرسش‌های رایج و پاسخ‌ها" role="list">
          {faqs.map((f, i) => (
            <li className="faq-list-item" key={f.q}>
              <FAQItem
                index={i}
                q={f.q}
                a={f.a}
                isOpen={open === i}
                onToggle={() => setOpen((current) => (current === i ? -1 : i))}
              />
            </li>
          ))}
        </ol>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
    </section>
  )
}
