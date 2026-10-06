import Icon from './Icon'
import IsolatedText from './IsolatedText'
import ResponsiveIllustration from './ResponsiveIllustration'
import { PRODUCT } from '../lib/constants'

const privacyFacts = [
  { icon: 'audio', title: 'فایل کاری موقت', text: PRODUCT.privacy.temporarySummaryFa },
  { icon: 'notes', title: 'رونوشت و جزوه', text: PRODUCT.privacy.retentionSummaryFa },
]

export default function Privacy() {
  return (
    <section id="privacy" className="product-tile product-tile-light privacy-section">
      <div className="container privacy-layout">
        <div className="privacy-copy">
          <h2 className="section-title">فایل‌هایت را با چشم باز بفرست.</h2>
          <p className="product-source-note privacy-source-note">
            {PRODUCT.source.noticeFa}{' '}
          </p>

          <div className="privacy-facts">
            {privacyFacts.map((fact) => (
              <div className="privacy-fact" key={fact.title}>
                <span className="privacy-fact-icon"><Icon name={fact.icon} size={19} /></span>
                <span><strong>{fact.title}</strong><small><IsolatedText>{fact.text}</IsolatedText></small></span>
              </div>
            ))}
          </div>

          <details className="privacy-details">
            <summary>
              <span><Icon name="lock" size={18} /> جزئیات سرویس‌ها و نگهداری داده</span>
              <span className="details-marker" aria-hidden="true">+</span>
            </summary>
            <div className="privacy-details-body">
              <ul>
                {PRODUCT.privacy.details.map((item) => (
                  <li key={item}>
                    <span className="privacy-detail-dot" aria-hidden="true" />
                    <span><IsolatedText>{item}</IsolatedText></span>
                  </li>
                ))}
              </ul>
            </div>
          </details>

          <p className="privacy-contact">
            فایل‌های حساس را نفرست؛ {PRODUCT.privacy.retentionSummaryFa}
          </p>
        </div>

        <figure className="privacy-visual">
          <ResponsiveIllustration
            name="teacher-privacy"
            sizes="(max-width: 360px) calc(100vw - 30px), (max-width: 639px) calc(100vw - 36px), (max-width: 833px) calc(100vw - 64px), (max-width: 1067px) calc((100vw - 118px) / 2), 600px"
            alt="تصویر مفهومی سه‌بعدی از پنل آموزشی مدرس در کنار سپر و قفل"
          />
          <figcaption><span><Icon name="lock" size={15} /> تصویر مفهومی</span> اطلاعات واقعی کاربر نمایش داده نمی‌شود</figcaption>
        </figure>
      </div>
    </section>
  )
}
