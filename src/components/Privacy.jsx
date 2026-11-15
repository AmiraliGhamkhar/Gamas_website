import Icon from './Icon'
import IsolatedText from './IsolatedText'
import StudyArtwork from './StudyArtwork'
import { PRODUCT } from '../lib/constants'

const privacyFacts = [
  {
    id: 'temporary',
    icon: 'audio',
    title: 'فایل کاری',
    status: 'موقت',
    text: PRODUCT.privacy.temporarySummaryFa,
  },
  {
    id: 'retained',
    icon: 'notes',
    title: 'رونوشت و جزوه',
    status: 'حذف خودکار تعریف نشده',
    text: PRODUCT.privacy.retentionSummaryFa,
  },
]

export default function Privacy() {
  return (
    <section
      id="privacy"
      className="product-tile product-tile-light privacy-section"
      aria-labelledby="privacy-title"
    >
      <div className="container privacy-layout">
        <div className="privacy-copy">
          <div className="privacy-heading">
            <p className="privacy-kicker">حریم خصوصی و نگه‌داری داده</p>
            <h2 id="privacy-title" className="section-title">
              چه چیزی پاک می‌شود و چه چیزی نگه‌داری می‌شود؟
            </h2>
            <p className="privacy-intro">
              فایل‌های کاری پس از پردازش پاک می‌شوند؛ رونوشت و جزوه نگه‌داری می‌شوند. در کد بررسی‌شده، حذف خودکار رونوشت و جزوه تعریف نشده است.
            </p>
          </div>

          <div className="privacy-source-note">
            <p className="privacy-source-copy">{PRODUCT.source.noticeFa}</p>
            <div className="privacy-source-meta">
              <a
                className="privacy-source-link"
                href={PRODUCT.source.commitUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                مشاهده‌ی کد بررسی‌شده <IsolatedText>{PRODUCT.source.commit.slice(0, 7)}</IsolatedText>
              </a>
              <span className="privacy-source-date">
                بررسی‌شده:{' '}
                <time dateTime={PRODUCT.source.reviewedOn}>
                  <IsolatedText>{PRODUCT.source.reviewedOn}</IsolatedText>
                </time>
              </span>
            </div>
          </div>

          <dl className="privacy-facts" aria-label="خلاصه‌ی نگه‌داری داده‌ها">
            {privacyFacts.map((fact) => (
              <div className={`privacy-fact privacy-fact-${fact.id}`} key={fact.id}>
                <dt>
                  <span className="privacy-fact-icon" aria-hidden="true">
                    <Icon name={fact.icon} size={18} />
                  </span>
                  <span className="privacy-fact-title">{fact.title}</span>
                  <span className={`privacy-status privacy-status-${fact.id}`}>{fact.status}</span>
                </dt>
                <dd><IsolatedText>{fact.text}</IsolatedText></dd>
              </div>
            ))}
          </dl>

          <details className="privacy-details">
            <summary>
              <span className="privacy-details-summary">
                <Icon name="notes" size={18} />
                <span>جزئیات پردازش، نگه‌داری و لاگ‌ها</span>
              </span>
              <span className="details-marker" aria-hidden="true">+</span>
            </summary>
            <div className="privacy-details-body">
              {PRODUCT.privacy.detailGroups.map((group) => (
                <div className="privacy-detail-group" key={group.heading}>
                  <h3>{group.heading}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>
                        <span className="privacy-detail-dot" aria-hidden="true" />
                        <span><IsolatedText>{item}</IsolatedText></span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>

          <p className="privacy-contact">
            <strong>پیش از ارسال:</strong> فایل‌های حساس را نفرست؛ برای درخواست حذف داده از همان گفت‌وگوی تلگرام پیام بده.
          </p>
        </div>

        <figure className="privacy-visual">
          <StudyArtwork variant="privacy" />
          <figcaption>
            <span className="privacy-caption-label"><Icon name="notes" size={15} /> تصویر مفهومی</span>
            <span className="privacy-caption-note">بدون داده‌ی واقعی کاربران</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
