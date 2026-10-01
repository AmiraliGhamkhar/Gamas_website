import Icon from './Icon'
import IsolatedText from './IsolatedText'
import { sitePath } from '../lib/constants'

const formats = [
  { icon: 'microphone', label: 'صدا', examples: 'ویس · MP3 · M4A · WAV · OGG' },
  { icon: 'video', label: 'ویدیو', examples: 'MP4 · MKV · MOV · AVI' },
  { icon: 'presentation', label: 'پاورپوینت', examples: 'PPTX · PPSX · PPT · ODP' },
]

const outputs = [
  'رونوشت فارسی برای جست‌وجو و مرور',
  'متن و اسلاید کنار هم',
  'جزوه‌های بلند در چند پیام',
  'اگر ساخت جزوه خطا بخورد، رونوشت خام می‌آید',
]

export default function Capabilities() {
  return (
    <section id="features" className="product-tile product-tile-parchment features-section">
      <div className="container">
        <div className="section-heading features-heading">
          <p className="section-eyebrow"><Icon name="notes" size={17} /> هر ورودی، یک شروع</p>
          <h2 className="section-title">فایل خام داخل؛ نکته‌های مرتب بیرون.</h2>
          <p className="section-description">یک پیام از کلاس، یک جزوه‌ی سبک و آماده‌ی مرور.</p>
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
              <span>تا ۲ گیگابایت · PDF، تصویر و ZIP پشتیبانی نمی‌شوند.</span>
            </div>

            <div className="output-card">
              <div className="output-card-heading">
                <span className="output-card-icon"><Icon name="sparkles" size={19} /></span>
                <div><h3>در خروجی می‌گیری</h3><p>برای فهمیدن، نه فقط ذخیره‌کردن.</p></div>
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
              <span className="after-label">جزوه‌ی ساختاریافته</span>
            </div>
            <img
              src={sitePath('images/illustration-before-after.webp')}
              width="1280"
              height="960"
              loading="lazy"
              decoding="async"
              alt="تصویر مفهومی از یادداشت‌های شلوغ که با موجی فیروزه‌ای به صفحه‌ی جزوه‌ی مرتب تبدیل می‌شوند"
            />
            <figcaption>پیش از مرور، همه‌چیز یک‌جا مرتب می‌شود.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
