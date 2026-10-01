import { sitePath, tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'

export default function Hero() {
  return (
    <section className="product-tile product-tile-light">
      <div className="mx-auto grid max-w-content items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8">
        <div>
          <h1 className="hero-reveal hero-headline">
            صدای کلاس
            <span className="block">← جزوه‌ای که می‌شود خواند.</span>
          </h1>

          <p className="hero-reveal mt-6 max-w-[38ch] text-muted" style={{ animationDelay: '80ms' }}>
            فایل کلاس را بفرست. گاماس مرتبش می‌کند.
          </p>

          <div className="hero-reveal mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '160ms' }}>
            <a
              href={tgLink('hero')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA('hero')}
              className="button-primary group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-[15px]"
            >
              <span>شروع در تلگرام</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl inline-nudge shrink-0">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#how"
              className="button-secondary-pill inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px]"
            >
              چطور کار می‌کند
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl opacity-60">
                <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-[320px] lg:max-w-[360px]">
          <picture>
            <source srcSet={`${sitePath('images/hero-phone.avif')} 380w`} sizes="(max-width: 834px) 90vw, 360px" type="image/avif" />
            <source srcSet={`${sitePath('images/hero-phone.webp')} 380w`} sizes="(max-width: 834px) 90vw, 360px" type="image/webp" />
            <img
              src={sitePath('images/hero-phone.jpg')}
              srcSet={`${sitePath('images/hero-phone.jpg')} 380w`}
              width="380"
              height="780"
              alt="پیش‌نمایش گفت‌وگوی تلگرامی گاماس: ارسال فایل کلاس و دریافت جزوه"
              loading="eager"
              decoding="async"
              className="product-image block h-auto w-full"
              sizes="(max-width: 834px) 90vw, 360px"
              style={{ aspectRatio: '380 / 780' }}
            />
          </picture>
          <figcaption className="mt-4 text-center text-xs text-ink-subtle">
            پیش‌نمایش — ربات در تلگرام
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
