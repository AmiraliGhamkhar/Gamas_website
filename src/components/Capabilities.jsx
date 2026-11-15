import Icon from './Icon'
import IsolatedText from './IsolatedText'
import StudyArtwork from './StudyArtwork'
import { PRODUCT } from '../lib/constants'

const formats = [
  { id: 'audio', index: '۰۱', icon: 'microphone', label: 'صدا', examples: PRODUCT.files.audioExamples },
  {
    id: 'video',
    index: '۰۲',
    icon: 'video',
    label: 'ویدیو',
    examples: [...PRODUCT.files.videoExamples, 'ویدیوی گرد تلگرام'],
  },
  {
    id: 'presentation',
    index: '۰۳',
    icon: 'presentation',
    label: 'PowerPoint',
    examples: PRODUCT.files.powerpointExamples,
  },
]

const outputs = [
  {
    id: 'transcript',
    status: 'خروجی اصلی',
    title: 'رونوشت گفتار',
    detail: `فایل متنی ${PRODUCT.outputs.transcriptExtension}`,
  },
  {
    id: 'notes',
    status: 'در صورت موفقیت',
    title: 'جزوه‌ی ساختاریافته',
    detail: `${PRODUCT.outputs.notesLabelFa} (${PRODUCT.outputs.notesExtension})`,
  },
  {
    id: 'slides',
    status: 'در PowerPoint',
    title: 'متن اسلایدها',
    detail: 'در کنار گفتارِ فایل ارائه استفاده می‌شود.',
  },
]

export default function Capabilities() {
  return (
    <section
      id="features"
      className="product-tile product-tile-parchment features-section"
      aria-labelledby="features-title"
    >
      <div className="container">
        <div className="section-heading features-heading">
          <p className="features-kicker">ورودی‌ها و خروجی‌ها</p>
          <h2 id="features-title" className="section-title">از فایل کلاس تا رونوشت فارسی.</h2>
          <p className="section-description">
            صدا، ویدیو و پاورپوینت پشتیبانی می‌شوند. رونوشت گفتار فرستاده می‌شود؛ ساخت جزوه‌ی{' '}
            <IsolatedText>Word</IsolatedText> به موفقیت پردازش وابسته است.
          </p>
        </div>

        <div className="features-layout">
          <div className="format-column">
            <h3 className="format-group-heading">فرمت‌های ورودی</h3>
            <ul className="format-card-grid" aria-label="فرمت‌های ورودی پشتیبانی‌شده" role="list">
              {formats.map((format) => (
                <li key={format.id} className={`format-card format-card-${format.id}`}>
                  <div className="format-card-meta">
                    <span className="format-index" aria-hidden="true">{format.index}</span>
                    <span className="format-icon" aria-hidden="true">
                      <Icon name={format.icon} size={20} />
                    </span>
                  </div>
                  <h4 id={`format-title-${format.id}`}><IsolatedText>{format.label}</IsolatedText></h4>
                  <ul className="format-examples" aria-labelledby={`format-title-${format.id}`} role="list">
                    {format.examples.map((example) => (
                      <li key={example}><IsolatedText>{example}</IsolatedText></li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            <aside className="format-limit-note" aria-label="محدودیت‌های فایل">
              <div className="limit-size">
                <span className="limit-label">سقف پیش‌فرض هر فایل</span>
                <strong className="limit-value">
                  <IsolatedText>{PRODUCT.files.defaultMaxLabelFa}</IsolatedText>
                </strong>
              </div>
              <div className="limit-unsupported">
                <span className="limit-label">پشتیبانی نمی‌شوند</span>
                <ul className="unsupported-list" role="list">
                  {PRODUCT.files.unsupported.map((item) => (
                    <li key={item}><IsolatedText>{item}</IsolatedText></li>
                  ))}
                </ul>
              </div>
            </aside>

            <p className="product-source-note">
              {PRODUCT.source.noticeFa}{' '}
            </p>

            <div className="output-card">
              <div className="output-card-heading">
                <span className="output-card-icon" aria-hidden="true">
                  <Icon name="notes" size={19} />
                </span>
                <div>
                  <h3>چه چیزی تحویل می‌گیری؟</h3>
                  <p>
                    رونوشت گفتار؛ جزوه‌ی <IsolatedText>Word</IsolatedText> در صورت موفقیت ساخت.
                  </p>
                </div>
              </div>

              <ul className="output-card-list" aria-label="خروجی‌های پردازش" role="list">
                {outputs.map((output) => (
                  <li key={output.id} className={`output-item output-item-${output.id}`}>
                    <span className="output-status"><IsolatedText>{output.status}</IsolatedText></span>
                    <div className="output-copy">
                      <h4>{output.title}</h4>
                      <p><IsolatedText>{output.detail}</IsolatedText></p>
                    </div>
                  </li>
                ))}
              </ul>

              {PRODUCT.outputs.rawTranscriptOnNotesFailure && (
                <p className="output-fallback-note">
                  اگر ساخت جزوه انجام نشود، رونوشت خام گفتار همچنان فرستاده می‌شود.
                </p>
              )}

              <details className="output-sample">
                <summary>نمونه‌ی ویراست‌شده‌ی خروجی (متن واقعی، بدون داده‌ی کاربر)</summary>
                <div className="output-sample-body" dir="rtl">
                  <p><strong>رونوشت (گزیده):</strong> «…پس انرژی جنبشی برابر است با یک‌دوم ام‌وی‌دو؛ این رابطه را برای مسئله‌ی بعد نگه دارید…»</p>
                  <p><strong>جزوه (گزیده):</strong> تعریف انرژی جنبشی + فرمول + یک پرسش مرور: «واحد انرژی جنبشی در SI چیست؟»</p>
                </div>
              </details>
            </div>
          </div>

          <figure className="before-after-visual">
            <div className="before-after-labels" aria-hidden="true">
              <span className="before-label">جزوه مرتب</span>
              <span className="after-label">یادداشت‌های پراکنده</span>
            </div>
            <StudyArtwork variant="formats" />
            <figcaption>نمایش مفهومی؛ نمونه‌ی واقعی خروجی نیست.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
