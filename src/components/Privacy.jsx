import Icon from './Icon'
import IsolatedText from './IsolatedText'
import ResponsiveIllustration from './ResponsiveIllustration'

const details = [
  'برای پیاده‌سازی گفتار، صدای فایل به سرویس گفتاربه‌متنِ فعال در ربات فرستاده می‌شود. بسته به تنظیمات، این سرویس می‌تواند Speechmatics، Deepgram یا یک نشانی سازگار با OpenAI باشد.',
  'اگر ساخت جزوه فعال باشد، رونوشت و در فایل‌های ارائه متن اسلایدها به سرویس زبانی پیکربندی‌شده فرستاده می‌شوند؛ کد فعلی از Gemini، Anthropic یا API سازگار با OpenAI پشتیبانی می‌کند.',
  'فایل‌های موقت پس از پردازش حذف می‌شوند. اگر فرایند ناگهانی متوقف شود، فایل‌های باقی‌مانده هنگام راه‌اندازی بعدی پاک‌سازی می‌شوند.',
  'پایگاه‌داده‌ی ربات می‌تواند شناسه‌ی تلگرام، نام کاربری (اگر موجود باشد)، وضعیت و مشخصات فایل، رونوشت خام و جزوه‌ی تولیدشده را نگه دارد. در پیاده‌سازی بررسی‌شده، حذف خودکار رونوشت و جزوه تعریف نشده است.',
  'این صفحه در نسخه‌ی فعلی ایمیل نمی‌گیرد. سایت فقط بخش صفحه و زمان تقریبی کلیک روی دکمه‌های تلگرام را ثبت می‌کند؛ برای محدودکردن درخواست‌ها، IP خام به HMAC تبدیل و در فایل‌های خصوصی محدودسازی استفاده می‌شود. پاک‌سازی این فایل‌ها هنگام درخواست‌های بعدی گهگاهی انجام می‌شود.',
  'میزبان وب ممکن است در لاگ‌های دسترسی، IP و اطلاعات مرورگر را طبق تنظیمات و دوره‌ی نگهداری خودش ثبت کند. حذف از برنامه لزوماً نسخه‌های پشتیبان یا داده‌های نگه‌داری‌شده نزد سرویس‌های بیرونی را حذف نمی‌کند.',
]

const privacyFacts = [
  { icon: 'audio', title: 'فایل کاری موقت', text: 'پس از پردازش حذف می‌شود.' },
  { icon: 'notes', title: 'رونوشت و جزوه', text: 'ممکن است در پایگاه‌داده بمانند؛ حذف خودکار تعریف نشده است.' },
]

export default function Privacy() {
  return (
    <section id="privacy" className="product-tile product-tile-light privacy-section">
      <div className="container privacy-layout">
        <div className="privacy-copy">
          <h2 className="section-title">فایل‌هایت را با چشم باز بفرست.</h2>
          <p className="section-description">
            پردازش صدا و ساخت جزوه به سرویس‌های بیرونی نیاز دارد. فایل‌های موقت پاک می‌شوند؛ رونوشت و جزوه ممکن است در پایگاه‌داده‌ی ربات بمانند.
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

          <p className="privacy-contact">فایل‌های حساس را نفرست؛ برای رونوشت و جزوه در پیاده‌سازی بررسی‌شده حذف خودکار تعریف نشده است.</p>
        </div>

        <figure className="privacy-visual">
          <ResponsiveIllustration
            name="teacher-privacy"
            sizes="(max-width: 639px) 394px, 600px"
            alt="تصویر مفهومی سه‌بعدی از پنل آموزشی مدرس در کنار سپر و قفل"
          />
          <figcaption><span><Icon name="lock" size={15} /> تصویر مفهومی</span> اطلاعات واقعی کاربر نمایش داده نمی‌شود</figcaption>
        </figure>
      </div>
    </section>
  )
}
