import { useState } from 'react'
import IsolatedText from './IsolatedText'
import { SITE_URL } from '../lib/constants'
import { getFaqs } from '../lib/faq-data'

const faqs = getFaqs()

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
