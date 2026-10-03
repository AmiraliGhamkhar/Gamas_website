import Icon from './Icon'
import { sitePath, tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'

const proofPoints = [
  { icon: 'microphone', label: 'ویس و فایل صوتی' },
  { icon: 'presentation', label: 'ویدیو و پاورپوینت' },
]

export default function Hero() {
  return (
    <section id="top" className="hero-section product-tile product-tile-light">
      <div className="hero-backdrop-orb hero-backdrop-orb-one" aria-hidden="true" />
      <div className="hero-backdrop-orb hero-backdrop-orb-two" aria-hidden="true" />

      <div className="container hero-layout">
        <div className="hero-copy">
          <h1 className="hero-headline">
            از صدای کلاس
            <span className="hero-headline-accent">تا جزوه‌ی حسابی.</span>
          </h1>

          <p className="hero-lede">
            ویس، ویدیو یا پاورپوینت را بفرست؛ گاماس نکته‌های کلاس را به جزوه‌ای مرتب و فارسی تبدیل می‌کند.
            <span className="hero-audience"> برای دانشجوها، مدرس‌ها و جلسه‌های کاری.</span>
          </p>

          <div className="hero-actions">
            <a
              href={tgLink('hero')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA('hero')}
              className="button-primary hero-primary-cta"
            >
              <Icon name="telegram" size={20} />
              شروع در تلگرام
              <Icon name="arrow-left" size={18} className="cta-arrow" />
            </a>
            <a href="#demo" className="button-secondary-pill hero-secondary-cta">
              <span className="play-dot" aria-hidden="true">▶</span>
              دیدن نمونه‌ی زنده
            </a>
          </div>

          <ul className="hero-proof-points" aria-label="قابلیت‌ها">
            {proofPoints.map((point) => (
              <li key={point.label}>
                <span className="hero-proof-icon"><Icon name={point.icon} size={17} /></span>
                {point.label}
              </li>
            ))}
          </ul>
        </div>

        <figure className="hero-visual">
          <div className="hero-visual-halo" aria-hidden="true" />
          <div className="hero-icon-orbit" aria-hidden="true">
            <span className="hero-float-icon hero-float-icon-mic"><Icon name="microphone" size={22} /></span>
            <span className="hero-float-icon hero-float-icon-ppt"><Icon name="presentation" size={22} /></span>
            <span className="hero-float-icon hero-float-icon-notes"><Icon name="notes" size={21} /></span>
            <span className="hero-float-icon hero-float-icon-lock"><Icon name="lock" size={20} /></span>
          </div>
          <picture>
            <source srcSet={`${sitePath('images/hero-phone.avif')} 941w`} sizes="(max-width: 639px) 270px, (max-width: 833px) 330px, 430px" type="image/avif" />
            <source srcSet={`${sitePath('images/hero-phone.webp')} 941w`} sizes="(max-width: 639px) 270px, (max-width: 833px) 330px, 430px" type="image/webp" />
            <img
              src={sitePath('images/hero-phone.jpg')}
              srcSet={`${sitePath('images/hero-phone.jpg')} 941w`}
              sizes="(max-width: 639px) 270px, (max-width: 833px) 330px, 430px"
              width="941"
              height="1672"
              alt="ماکاپ سه‌بعدی موبایل گاماس؛ ارسال فایل صوتی، نوار پیشرفت فیروزه‌ای و جزوه‌ی ساختاریافته در گفت‌وگوی تلگرام"
              loading="eager"
              decoding="async"
              fetchpriority="high"
              className="hero-phone-image"
            />
          </picture>
          <figcaption className="sr-only">پیش‌نمایش مفهومی از تجربه‌ی کار با ربات گاماس</figcaption>
        </figure>
      </div>
    </section>
  )
}
