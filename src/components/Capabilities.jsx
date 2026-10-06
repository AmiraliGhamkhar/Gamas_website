import Icon from './Icon'
import IsolatedText from './IsolatedText'
import ResponsiveIllustration from './ResponsiveIllustration'
import { PRODUCT } from '../lib/constants'

const formats = [
  { icon: 'microphone', label: 'صدا', examples: PRODUCT.files.audioExamples },
  {
    icon: 'video',
    label: 'ویدیو',
    examples: [...PRODUCT.files.videoExamples, 'ویدیوی گرد تلگرام'],
  },
  { icon: 'presentation', label: 'PowerPoint', examples: PRODUCT.files.powerpointExamples },
]

const outputs = [
  `جزوه‌ی مرتب در فایل Word با پسوند ${PRODUCT.outputs.notesExtension}، اگر ساخت جزوه موفق شود`,
  `رونوشت گفتار در فایل متنی ${PRODUCT.outputs.transcriptExtension}`,
  'متن اسلایدها در کنار گفتارِ ارائه‌های PowerPoint',
  'اگر ساخت جزوه انجام نشود، متن خام گفتار همچنان فرستاده می‌شود',
]

export default function Capabilities() {
  return (
    <section id="features" className="product-tile product-tile-parchment features-section">
      <div className="container">
        <div className="section-heading features-heading">
          <h2 className="section-title">از صوت و ویدیو تا جزوه‌ی فارسی.</h2>
          <p className="section-description">
            فایل آموزشی را بفرست؛ رونوشت گفتار و نکته‌های درس را برای مرور در تلگرام تحویل بگیر.
          </p>
        </div>

        <div className="features-layout">
          <div className="format-column">
            <div className="format-card-grid">
              {formats.map((format) => (
                <article key={format.label} className="format-card">
                  <span className="format-icon"><Icon name={format.icon} size={23} /></span>
                  <h3><IsolatedText>{format.label}</IsolatedText></h3>
                  <p><IsolatedText>{format.examples.join(' · ')}</IsolatedText></p>
                </article>
              ))}
            </div>
            <div className="format-limit-note">
              <span className="limit-mark"><bdi dir="ltr">۲GB</bdi></span>
              <span>
                سقف پیش‌فرض فایل {PRODUCT.files.defaultMaxLabelFa} است؛{' '}
                <IsolatedText>{PRODUCT.files.unsupported.join('، ')}</IsolatedText> پشتیبانی نمی‌شوند.
              </span>
            </div>
            <p className="product-source-note">
              {PRODUCT.source.noticeFa}{' '}
              <a href={PRODUCT.source.commitUrl} target="_blank" rel="noopener noreferrer">
                نسخه‌ی کد بررسی‌شده
              </a>
            </p>

            <div className="output-card">
              <div className="output-card-heading">
                <span className="output-card-icon"><Icon name="notes" size={19} /></span>
                <div><h3>چه چیزی تحویل می‌گیری؟</h3><p>فایل‌هایی برای خواندن و برگشتن به کلاس.</p></div>
              </div>
              <ul>
                {outputs.map((item) => (
                  <li key={item}><span className="output-check"><Icon name="check" size={13} /></span><IsolatedText>{item}</IsolatedText></li>
                ))}
              </ul>
            </div>
          </div>

          <figure className="before-after-visual">
            <div className="before-after-labels" aria-hidden="true">
              <span className="before-label">یادداشت‌های پراکنده</span>
              <span className="after-label">صفحه‌ی مرور</span>
            </div>
            <ResponsiveIllustration
              name="before-after"
              sizes="(max-width: 360px) calc(100vw - 30px), (max-width: 639px) calc(100vw - 36px), (max-width: 833px) calc(100vw - 64px), (max-width: 1067px) calc(100vw - 80px), 600px"
              alt="تصویر مفهومی از یادداشت‌های شلوغ در کنار صفحه‌ای مرتب برای مرور درس"
            />
            <figcaption>تصویر مفهومی؛ نمونه‌ی واقعیِ خروجی نیست.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
