import TelegramCTA from './TelegramCTA'
import StudyArtwork from './StudyArtwork'

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="hero-section product-tile product-tile-light">
      <div className="container">
        <div className="editorial-kicker"><span>گاماس — دستیار آموزشی در تلگرام</span><span>برای آنچه از کلاس می‌ماند</span></div>
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="chapter-label">گوش بده. ثبت کن. برگرد.</p>
            <h1 id="hero-title" className="hero-headline">صدای کلاس،<br /><span className="hero-headline-accent">حالا خواندنی‌ست.</span></h1>
            <p className="hero-lede">فایل صوتی، ویدیوی کلاس یا پاورپوینت را در تلگرام بفرست. گاماس با کمک هوش مصنوعی گفتار را به رونوشت فارسی تبدیل می‌کند؛ اگر ساخت جزوه موفق باشد، نکته‌ها هم در فایل Word مرتب می‌شوند.</p>
            <div className="hero-actions">
              <TelegramCTA placement="hero" className="hero-primary-cta" aria-label="باز کردن ربات تلگرام گاماس — شروع در تلگرام" />
              <a href="#demo" className="button-secondary-pill hero-secondary-cta">دیدن نمونه‌ی نمایشی <span className="hero-secondary-arrow" aria-hidden="true">↓</span></a>
            </div>
            <p className="hero-file-note">صوت / ویدیو / پاورپوینت <span aria-hidden="true">←</span> رونوشت فارسی + جزوه‌ی Word (در صورت موفقیت)</p>
          </div>
          <figure className="hero-visual"><StudyArtwork /><figcaption className="sr-only">تصویر مفهومی تبدیل گفتار به یادداشت؛ نمونه‌ی واقعی خروجی نیست.</figcaption></figure>
        </div>
        <div className="hero-bottom"><span>یادگیری، فراتر از لحظه‌ی کلاس.</span><a href="#story">داستان را دنبال کن <span aria-hidden="true">↓</span></a><span>۰۱ / ۰۸</span></div>
      </div>
    </section>
  )
}
