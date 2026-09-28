import { tgLink } from '../lib/constants'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-mesh">
      {/* subtle top glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 h-[520px] w-[880px] rounded-full bg-gradient-to-r from-primary/15 via-violet-500/10 to-accent/10 blur-[90px] opacity-70" />
      </div>

      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-8 items-center">
          {/* Text — in RTL this is visually on the right */}
          <div className="text-center lg:text-right">
            {/* Badge */}
            <div className="hero-reveal inline-flex items-center gap-2 glass rounded-pill px-3 py-1.5 text-xs text-white/75" style={{ animationDelay: '80ms' }}>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" aria-hidden="true" />
              <span>ربات تلگرامی فارسی — بدون نیاز به نصب</span>
              <span className="hidden sm:inline-flex items-center gap-1.5 me-1 ps-2 border-s border-white/10">
                <span className="h-1 w-1 rounded-full bg-white/40" />
                پاسخ در چند دقیقه
              </span>
            </div>

            <h1
              className="hero-reveal mt-6 font-display text-[2.35rem] sm:text-[2.9rem] lg:text-[3.45rem] leading-[1.02] tracking-tight text-balance"
              style={{ animationDelay: '160ms' }}
            >
              <span className="block">صوت کلاس</span>
              <span className="text-gradient">→ جزوه ساختاریافته</span>
            </h1>

            <p
              className="hero-reveal mt-5 text-[15px] sm:text-[16px] leading-8 text-white/66 max-w-[52ch] mx-auto lg:me-0 lg:ms-0"
              style={{ animationDelay: '240ms' }}
            >
              ویس، فایل صوتی، ویدیو و پاورپوینت را در تلگرام بفرست؛ گاماس با تبدیل گفتار فارسی و ساختاردهی هوشمند، جزوه‌ای تمیز، بخش‌بندی‌شده و قابل مرور تحویل می‌دهد — با پیام وضعیت زنده و تحویل رونوشت حتی در صورت خطا.
            </p>

            <div className="hero-reveal mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start" style={{ animationDelay: '320ms' }}>
              <a
                href={tgLink('hero')}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 rounded-pill bg-gradient-primary px-7 py-3.5 text-[15px] font-medium text-white shadow-glow hover:opacity-[0.96] active:opacity-90 transition will-change-transform"
              >
                <span>شروع در تلگرام</span>
                <span className="hidden sm:inline text-white/85 text-xs font-normal">— @GamasBot</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl shrink-0 transition group-hover:translate-x-0.5">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center gap-2 rounded-pill glass px-7 py-3.5 text-[14px] font-medium hover:bg-white/[0.08] active:bg-white/[0.04] transition"
              >
                نحوه کار را ببین
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl opacity-60">
                  <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Trust micro-badges */}
            <div className="hero-reveal mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-[11.5px] leading-none" style={{ animationDelay: '400ms' }}>
              <span className="inline-flex items-center gap-1.5 glass rounded-pill px-3 py-1.5 text-white/65">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                حداکثر ۲ گیگابایت
              </span>
              <span className="inline-flex items-center gap-1.5 glass rounded-pill px-3 py-1.5 text-white/65">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                PDF / تصویر / ZIP مردود
              </span>
              <span className="inline-flex items-center gap-1.5 glass rounded-pill px-3 py-1.5 text-white/65">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                رونوشت همیشه تحویل
              </span>
            </div>

            <p className="hero-reveal mt-4 text-[11px] leading-5 text-white/35" style={{ animationDelay: '480ms' }}>
              فرمت‌های صوتی: MP3 / M4A / WAV / OGG / FLAC و … — ویدیو: MP4 / MKV / MOV / AVI و ویدیونوت — پاورپوینت: PPTX/PPSX/POTX و PPT/ODP قدیمی
            </p>
          </div>

          {/* Phone / Hero image — visually on the left in RTL */}
          <div className="hero-reveal relative mx-auto w-full max-w-[360px] lg:max-w-[400px]" style={{ animationDelay: '280ms' }}>
            {/* Glow behind */}
            <div className="pointer-events-none absolute -z-10 -top-10 start-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-primary/18 blur-[70px]" />
            <div className="pointer-events-none absolute -z-10 -bottom-10 end-6 h-64 w-64 rounded-full bg-accent/12 blur-[70px]" />

            <div className="relative rounded-[2.4rem] border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.02] p-2.5 sm:p-3 shadow-glass backdrop-blur-glass will-change-transform">
              {/* Real image with dimensions & modern formats */}
              <div className="relative rounded-[1.8rem] overflow-hidden bg-[#0F1016] border border-white/10">
                {/* Top bar */}
                <div className="absolute top-0 inset-x-0 z-10 h-7 flex items-center justify-center border-b border-white/5 bg-[#0F1016]/80 backdrop-blur">
                  <span className="h-1 w-9 rounded-full bg-white/20" />
                </div>

                <picture>
                  <source srcSet="/images/hero-phone.avif" type="image/avif" />
                  <source srcSet="/images/hero-phone.webp" type="image/webp" />
                  <img
                    src="/images/hero-phone.jpg"
                    width="380"
                    height="780"
                    alt="پیش‌نمایش چت تلگرامی گاماس — ارسال فایل و دریافت جزوه با نوار پیشرفت"
                    loading="eager"
                    decoding="async"
                    className="block h-auto w-full pt-7"
                    style={{ aspectRatio: '380 / 780' }}
                  />
                </picture>

                {/* Floating glass card overlay mimicking real bot progress */}
                <div className="pointer-events-none absolute bottom-3 inset-x-3">
                  <div className="glass-strong rounded-2xl p-3 shadow-glass">
                    <div className="flex items-center justify-between text-[10px] leading-none">
                      <span className="flex items-center gap-1.5 text-white/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        در حال ساخت جزوه…
                      </span>
                      <span className="persian-digits text-white">۶۸٪</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-[68%] bg-gradient-primary" />
                    </div>
                    <p className="mt-2 text-[10px] leading-4 text-white/55">یک پیام وضعیت با نوار پیشرفت — به‌روزرسانی زنده، بدون اسپم</p>
                  </div>
                </div>
              </div>

              {/* Side label */}
              <div className="absolute -end-2 top-10 hidden lg:flex items-center gap-2 glass rounded-pill px-3 py-1.5 text-[11px] text-white/70 shadow-glass">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                اسلاید به اسلاید
              </div>
              <div className="absolute -start-2 bottom-16 hidden lg:flex items-center gap-2 glass rounded-pill px-3 py-1.5 text-[11px] text-white/70 shadow-glass">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round"/></svg>
                STT فارسی
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
