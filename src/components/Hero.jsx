import Icon from './Icon'
import { BOT_IDENTITY_VERIFIED, PRODUCT, sitePath, tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'

const proofPoints = [
  { icon: 'microphone', label: 'ویس و فایل صوتی' },
  { icon: 'presentation', label: 'ویدیو و پاورپوینت' },
]

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="hero-section product-tile product-tile-light">
      <div className="hero-backdrop-orb hero-backdrop-orb-one" aria-hidden="true" />
      <div className="hero-backdrop-orb hero-backdrop-orb-two" aria-hidden="true" />

      <div className="container hero-layout">
        <div className="hero-copy">
          <h1 id="hero-title" className="hero-headline">
            با هوش مصنوعی،
            <span className="hero-headline-accent">صدای کلاس را به جزوه تبدیل کن.</span>
          </h1>

          <p className="hero-lede">
            سه ساعت ضبط مانده و فردا امتحان است؟ فایل صوتی، ویدیوی کلاس یا پاورپوینت را در تلگرام بفرست. گاماس با کمک هوش مصنوعی گفتار را به متن فارسی تبدیل می‌کند و نکته‌ها را برای مرور مرتب می‌کند.
            <span className="hero-audience"> برای دانشجوها و هرکسی که فایل آموزشی دارد.</span>
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
              باز کردن ربات تلگرام
              <Icon name="arrow-left" size={18} className="cta-arrow" />
            </a>
            <a href="#demo" className="button-secondary-pill hero-secondary-cta">
              <span className="play-dot" aria-hidden="true">▶</span>
              دیدن نمونه‌ی نمایشی
            </a>
          </div>

          {!BOT_IDENTITY_VERIFIED && (
            <p className="bot-identity-note" role="note">{PRODUCT.bot.identityNoticeFa}</p>
          )}

          <ul className="hero-proof-points" aria-label="فایل‌های آموزشی قابل ارسال">
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
              alt="تصویر مفهومی از گوشی با حباب‌های گفت‌وگو و صفحه‌ی یادداشتِ بدون متن"
              loading="eager"
              decoding="async"
              fetchpriority="high"
              className="hero-phone-image"
            />
          </picture>
          <figcaption className="hero-image-caption">
            محتوای روی گوشی انتزاعی است؛ گفت‌وگو یا خروجی واقعی ربات نیست.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
