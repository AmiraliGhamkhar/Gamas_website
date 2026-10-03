import Icon from './Icon'
import IsolatedText from './IsolatedText'
import { BOT_HANDLE, sitePath } from '../lib/constants'

const details = [
  'صدا و ویدیو برای رونویسی به Speechmatics یا Deepgram فرستاده می‌شود.',
  'رونوشت و اسلایدها برای ساخت جزوه به Gemini، Anthropic یا سرویس سازگار با OpenAI می‌روند.',
  'فایل موقت بعد از پردازش حذف می‌شود؛ رونوشت و جزوه ممکن است در دیتابیس بمانند.',
  'فرم این صفحه فقط ایمیل و منبع فرم را ذخیره می‌کند. ایمیل خودکار ارسال نمی‌شود.',
  'هر سرویس بیرونی سیاست خودش را دارد.',
]

const privacyFacts = [
  { icon: 'audio', title: 'فایل موقت', text: 'پس از پردازش حذف می‌شود.' },
  { icon: 'notes', title: 'متن و جزوه', text: 'ممکن است در پایگاه داده بمانند.' },
]

export default function Privacy() {
  return (
    <section id="privacy" className="product-tile product-tile-light privacy-section">
      <div className="container privacy-layout">
        <div className="privacy-copy">
          <h2 className="section-title">شفاف، چون فایل‌هایت مهم‌اند.</h2>
          <p className="section-description">
            برای پردازش، فایل‌ها به سرویس‌های لازم فرستاده می‌شوند. اینجا دقیق می‌گوییم چه چیزی حذف می‌شود و چه چیزی ممکن است بماند.
          </p>

          <div className="privacy-facts">
            {privacyFacts.map((fact) => (
              <div className="privacy-fact" key={fact.title}>
                <span className="privacy-fact-icon"><Icon name={fact.icon} size={19} /></span>
                <span><strong>{fact.title}</strong><small>{fact.text}</small></span>
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
                {details.map((item) => (
                  <li key={item}><span className="privacy-detail-dot" aria-hidden="true" /><span><IsolatedText>{item}</IsolatedText></span></li>
                ))}
              </ul>
            </div>
          </details>

          <p className="privacy-contact">سؤالی داری؟ در تلگرام از <bdi dir="ltr">{BOT_HANDLE}</bdi> بپرس.</p>
        </div>

        <figure className="privacy-visual">
          <img
            src={sitePath('images/illustration-teacher-privacy.webp')}
            width="1280"
            height="960"
            loading="lazy"
            decoding="async"
            alt="تصویر مفهومی سه‌بعدی از پنل آموزشی مدرس در کنار سپر و قفل حریم خصوصی"
          />
          <figcaption><span><Icon name="lock" size={15} /> تصویر مفهومی</span> طراحی‌شده برای یادگیری با اطمینان بیشتر</figcaption>
        </figure>
      </div>
    </section>
  )
}
