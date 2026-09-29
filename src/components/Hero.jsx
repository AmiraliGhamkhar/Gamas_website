import { sitePath, tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'
import IsolatedText from './IsolatedText'

export default function Hero() {
  return (
    <section className="product-tile product-tile-light relative overflow-hidden">
      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10">
          <div className="w-full max-w-3xl text-center">
            <h1
              className="hero-reveal hero-headline"
              style={{ animationDelay: '80ms' }}
            >
              <span className="block">صوت کلاس</span>
              <span className="text-primary-emphasis">← جزوه ساختاریافته</span>
            </h1>

            <p
              className="hero-reveal mt-5 text-[16px] leading-8 text-muted max-w-[46ch] mx-auto"
              style={{ animationDelay: '160ms' }}
            >
              فایل کلاست را در تلگرام بفرست؛ جزوه‌ی تمیز و بخش‌بندی‌شده تحویل بگیر.
            </p>

            <div className="hero-reveal mt-8 flex flex-col sm:flex-row gap-3 justify-center" style={{ animationDelay: '240ms' }}>
              <a
                href={tgLink('hero')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTA('hero')}
                className="button-primary group inline-flex items-center justify-center gap-2.5 rounded-pill bg-primary px-7 py-3.5 text-[15px] font-semibold text-white"
              >
                <span>شروع در تلگرام</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl shrink-0 inline-nudge">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="#how"
                className="button-secondary-pill inline-flex items-center justify-center gap-2 rounded-pill surface-card px-7 py-3.5 text-[14px] font-semibold"
              >
                نحوه کار
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl opacity-60">
                  <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="hero-reveal mt-6 flex flex-wrap items-center justify-center gap-2 text-xs" style={{ animationDelay: '320ms' }}>
              <span className="chip">
                حداکثر ۲ گیگابایت
              </span>
              <span className="chip">
                <IsolatedText>PDF / تصویر / ZIP مردود</IsolatedText>
              </span>
              <span className="chip">
                رونوشت همیشه تحویل
              </span>
            </div>
          </div>

          {/* Product visual */}
          <div className="hero-reveal relative mx-auto w-full max-w-[360px] lg:max-w-[400px]" style={{ animationDelay: '200ms' }}>
            <div className="hover-lift relative rounded-18 border border-white/10 bg-surface p-2.5 sm:p-3 will-change-transform">
              <div className="relative rounded-18 overflow-hidden bg-tile-dark border border-white/10">
                {/* Top bar */}
                <div className="absolute top-0 inset-inline-0 z-10 h-7 flex items-center justify-center border-b border-white/5 bg-tile-dark/80">
                  <span className="h-1 w-9 rounded-full bg-white/20" />
                </div>

                <picture>
                  <source srcSet={`${sitePath('images/hero-phone.avif')} 380w`} sizes="(max-width: 640px) 100vw, 400px" type="image/avif" />
                  <source srcSet={`${sitePath('images/hero-phone.webp')} 380w`} sizes="(max-width: 640px) 100vw, 400px" type="image/webp" />
                  <img
                    src={sitePath('images/hero-phone.jpg')}
                    srcSet={`${sitePath('images/hero-phone.jpg')} 380w`}
                    width="380"
                    height="780"
                    alt="پیش‌نمایش چت تلگرامی گاماس — ارسال فایل و دریافت جزوه با نوار پیشرفت"
                    loading="eager"
                    decoding="async"
                    className="product-image block h-auto w-full pt-7"
                    sizes="(max-width: 640px) 100vw, 400px"
                    style={{ aspectRatio: '380 / 780' }}
                  />
                </picture>

                {/* Floating status card showing bot progress */}
                <div className="pointer-events-none absolute bottom-3 inset-inline-3">
                  <div className="surface-card rounded-2xl p-3">
                    <div className="flex items-center justify-between text-[11px] leading-none">
                      <span className="flex items-center gap-1.5 text-white/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        در حال ساخت جزوه…
                      </span>
                      <span className="persian-digits text-white">۶۸٪</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-[68%] bg-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Side label */}
              <div className="absolute -end-2 top-10 hidden lg:flex items-center gap-2 surface-card rounded-pill px-3 py-1.5 text-[11px] text-white/70">
                <span className="h-2 w-2 rounded-full bg-primary" />
                اسلاید به اسلاید
              </div>
              <div className="absolute -start-2 bottom-16 hidden lg:flex items-center gap-2 surface-card rounded-pill px-3 py-1.5 text-[11px] text-white/70">
                <bdi dir="ltr" lang="en">STT</bdi> فارسی
              </div>
            </div>

            <p className="copy-handle mt-3 text-center text-[11px] text-ink-subtle" title="پیش‌نمایش شبیه‌سازی‌شده است">
              پیش‌نمایش شبیه‌سازی‌شده — ربات واقعی در تلگرام
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
