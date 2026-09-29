import { BOT_HANDLE, sitePath, tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'
import IsolatedText from './IsolatedText'

export default function Hero() {
  return (
    <section className="product-tile product-tile-light relative overflow-hidden">
      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10">
          <div className="w-full max-w-4xl text-center">
            {/* Badge */}
            <div className="hero-reveal inline-flex items-center gap-2 surface-card rounded-pill px-3 py-1.5 text-xs text-white/75" style={{ animationDelay: '80ms' }}>
              <span className="h-2 w-2 rounded-full bg-surface-muted animate-pulse shrink-0" aria-hidden="true" />
              <span>ربات تلگرامی فارسی — بدون نیاز به نصب</span>
              <span className="hidden sm:inline-flex items-center gap-1.5 me-1 ps-2 border-s border-white/10">
                <span className="h-1 w-1 rounded-full bg-white/40" />
                پاسخ در چند دقیقه
              </span>
            </div>

            <h1
              className="hero-reveal hero-headline mt-6 font-display text-balance"
              style={{ animationDelay: '160ms' }}
            >
              <span className="block">صوت کلاس</span>
              <span className="text-primary-emphasis">← جزوه ساختاریافته</span>
            </h1>

            <p
              className="hero-reveal mt-5 text-[15px] sm:text-[16px] leading-8 text-white/66 max-w-[52ch] mx-auto"
              style={{ animationDelay: '240ms' }}
            >
              ویس، فایل صوتی، ویدیو و پاورپوینت را در تلگرام بفرست؛ گاماس با تبدیل گفتار فارسی و ساختاردهی هوشمند، جزوه‌ای تمیز، بخش‌بندی‌شده و قابل مرور تحویل می‌دهد — با پیام وضعیت زنده و تحویل رونوشت حتی در صورت خطا.
            </p>

            <div className="hero-reveal mt-8 flex flex-col sm:flex-row gap-3 justify-center" style={{ animationDelay: '320ms' }}>
              <a
                href={tgLink('hero')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTA('hero')}
                className="button-primary group inline-flex items-center justify-center gap-2.5 rounded-pill bg-primary px-7 py-3.5 text-[15px] font-semibold text-white hover:opacity-[0.96] active:opacity-90 transition will-change-transform"
              >
                <span>شروع در تلگرام</span>
                <bdi dir="ltr" className="hidden text-xs font-normal sm:inline">— {BOT_HANDLE}</bdi>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl shrink-0 transition inline-nudge">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="#how"
                className="button-secondary-pill inline-flex items-center justify-center gap-2 rounded-pill surface-card px-7 py-3.5 text-[14px] font-semibold hover:bg-white/[0.08] active:bg-white/[0.04] transition"
              >
                نحوه کار را ببین
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl opacity-60">
                  <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Trust micro-badges */}
            <div className="hero-reveal mt-6 flex flex-wrap items-center justify-center gap-2 text-[11.5px] leading-none" style={{ animationDelay: '400ms' }}>
              <span className="inline-flex items-center gap-1.5 surface-card rounded-pill px-3 py-1.5 text-white/65 chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                حداکثر ۲ گیگابایت
              </span>
              <span className="inline-flex items-center gap-1.5 surface-card rounded-pill px-3 py-1.5 text-white/65 chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <IsolatedText>PDF / تصویر / ZIP مردود</IsolatedText>
              </span>
              <span className="inline-flex items-center gap-1.5 surface-card rounded-pill px-3 py-1.5 text-white/65 chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                رونوشت همیشه تحویل
              </span>
            </div>

            <p className="hero-reveal mt-4 text-[11px] leading-5 text-white/35" style={{ animationDelay: '480ms' }}>
              <IsolatedText>فرمت‌های صوتی: MP3 / M4A / WAV / OGG / FLAC و … — ویدیو: MP4 / MKV / MOV / AVI و ویدیونوت — پاورپوینت: PPTX/PPSX/POTX و PPT/ODP قدیمی</IsolatedText>
            </p>
          </div>

          {/* Product visual */}
          <div className="hero-reveal relative mx-auto w-full max-w-[360px] lg:max-w-[400px]" style={{ animationDelay: '280ms' }}>
            <div className="relative rounded-18 border border-white/10 bg-surface p-2.5 sm:p-3  will-change-transform">
              {/* Real image with dimensions & modern formats */}
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
                  <div className="surface-card rounded-2xl p-3 ">
                    <div className="flex items-center justify-between text-[10px] leading-none">
                      <span className="flex items-center gap-1.5 text-white/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-surface-muted animate-pulse" />
                        در حال ساخت جزوه…
                      </span>
                      <span className="persian-digits text-white">۶۸٪</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-[68%] bg-primary" />
                    </div>
                    <p className="mt-2 text-[10px] leading-4 text-white/55">یک پیام وضعیت با نوار پیشرفت — به‌روزرسانی زنده، بدون اسپم</p>
                  </div>
                </div>
              </div>

              {/* Side label */}
              <div className="absolute -end-2 top-10 hidden lg:flex items-center gap-2 surface-card rounded-pill px-3 py-1.5 text-[11px] text-white/70 ">
                <span className="h-2 w-2 rounded-full bg-surface-muted" />
                اسلاید به اسلاید
              </div>
              <div className="absolute -start-2 bottom-16 hidden lg:flex items-center gap-2 surface-card rounded-pill px-3 py-1.5 text-[11px] text-white/70 ">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                <bdi dir="ltr" lang="en">STT</bdi> فارسی
              </div>
            </div>

            <p className="mt-3 text-center text-[11px] text-white/30">
              پیش‌نمایش شبیه‌سازی‌شده — پیام واقعی ربات در تلگرام نمایش داده می‌شود
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
