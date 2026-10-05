import Icon from './Icon'
import IsolatedText from './IsolatedText'
import ResponsiveIllustration from './ResponsiveIllustration'

const formats = [
  { icon: 'microphone', label: 'صدا', examples: 'MP3 · M4A · WAV · OGG · OPUS · FLAC · WMA · AMR' },
  { icon: 'video', label: 'ویدیو', examples: 'MP4 · MKV · MOV · AVI · WEBM · ویدیوی گرد تلگرام' },
  { icon: 'presentation', label: 'PowerPoint', examples: 'PPTX · PPTM · PPSX · PPSM · POTX · POTM · PPT · PPS · POT' },
]

const outputs = [
  'جزوه‌ی مرتب در فایل Word با پسوند DOCX',
  'رونوشت گفتار در فایل متنی TXT',
  'متن اسلایدها در کنار گفتارِ ارائه‌های PowerPoint',
  'اگر ساخت جزوه انجام نشود، متن خام همچنان فرستاده می‌شود',
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
                  <h3>{format.label}</h3>
                  <p><IsolatedText>{format.examples}</IsolatedText></p>
                </article>
              ))}
            </div>
            <div className="format-limit-note">
              <span className="limit-mark"><bdi dir="ltr">۲GB</bdi></span>
              <span>سقف پیش‌فرض فایل ۲ گیگابایت است؛ ODP/OTP، PDF، تصویر و ZIP پشتیبانی نمی‌شوند.</span>
            </div>

            <div className="output-card">
              <div className="output-card-heading">
                <span className="output-card-icon"><Icon name="notes" size={19} /></span>
                <div><h3>چه چیزی تحویل می‌گیری؟</h3><p>فایل‌هایی برای خواندن و برگشتن به کلاس.</p></div>
              </div>
              <ul>
                {outputs.map((item) => (
                  <li key={item}><span className="output-check"><Icon name="check" size={13} /></span>{item}</li>
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
              sizes="(max-width: 639px) 394px, 600px"
              alt="تصویر مفهومی از یادداشت‌های شلوغ در کنار صفحه‌ای مرتب برای مرور درس"
            />
            <figcaption>تصویر مفهومی؛ نمونه‌ی واقعیِ خروجی نیست.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
