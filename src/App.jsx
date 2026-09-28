import { useEffect, useState } from 'react'
import { tgLink } from './lib/constants'

// Phase 1 scaffold: tokens, fonts, SSG proof + placeholders for later phases
// Phase 2 will replace Preloader/Navbar/Hero with full animated versions

function PreloaderPhase1({ onDone }) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const seen = sessionStorage.getItem('gamas_preloader_seen')
    if (seen) {
      setVisible(false)
      onDone?.()
      return
    }
    const t = setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem('gamas_preloader_seen', '1')
      onDone?.()
    }, 900)
    return () => clearTimeout(t)
  }, [onDone])

  if (!visible) return null
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="در حال بارگذاری"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
      style={{ background: '#0A0A0F' }}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="h-12 w-12 rounded-2xl bg-gradient-primary glow flex items-center justify-center text-xl font-display">
          گ
        </div>
        <div className="h-1 w-24 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 bg-gradient-primary animate-[shimmer_1s_ease-in-out_infinite]" style={{ animation: 'shimmer 1s ease-in-out infinite' }} />
        </div>
        <p className="text-sm text-white/60 font-sans">گاماس — صوت کلاس → جزوه</p>
      </div>
    </div>
  )
}

function NavbarPhase1() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-[16px] border-b border-white/[0.06] bg-[#0A0A0F]/70">
      <div className="mx-auto max-w-content w-full px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-xl bg-gradient-primary flex items-center justify-center font-display text-sm">گ</span>
          <span className="font-display text-lg tracking-tight">گاماس</span>
          <span className="hidden sm:inline text-xs text-white/50 me-2">Gamas Bot</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
          <a href="#features" className="hover:text-white transition">ویژگی‌ها</a>
          <a href="#how" className="hover:text-white transition">نحوه کار</a>
          <a href="#privacy" className="hover:text-white transition">حریم خصوصی</a>
          <a href="#faq" className="hover:text-white transition">سوالات</a>
        </nav>
        <a
          href={tgLink('navbar')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-pill bg-gradient-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow hover:opacity-90 transition"
        >
          شروع در تلگرام
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </header>
  )
}

function HeroPhase1() {
  return (
    <section className="relative overflow-hidden bg-mesh">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="text-center lg:text-right">
            <div className="inline-flex items-center gap-2 glass rounded-pill px-3 py-1.5 text-xs text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              ربات تلگرامی فارسی — بدون نیاز به نصب
            </div>
            <h1 className="mt-6 font-display text-[2.2rem] sm:text-[2.8rem] lg:text-[3.4rem] leading-[1.05] tracking-tight">
              صوت کلاس
              <span className="text-gradient"> → جزوه ساختاریافته</span>
            </h1>
            <p className="mt-5 text-[15px] sm:text-base leading-8 text-white/65 max-w-[52ch] mx-auto lg:mx-0">
              ویس، فایل صوتی، ویدیو و پاورپوینت را در تلگرام بفرست؛ گاماس با تبدیل گفتار فارسی و ساختاردهی هوشمند، جزوه‌ای تمیز، بخش‌بندی‌شده و قابل مرور تحویل می‌دهد.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a
                href={tgLink('hero')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-pill bg-gradient-primary px-7 py-3.5 text-[15px] font-medium text-white shadow-glow hover:opacity-95 transition"
              >
                شروع در تلگرام
                <span className="text-white/80 text-xs">— @GamasBot</span>
              </a>
              <a href="#how" className="inline-flex items-center justify-center rounded-pill glass px-7 py-3.5 text-sm font-medium hover:bg-white/10 transition">
                نحوه کار را ببین
              </a>
            </div>
            <p className="mt-4 text-xs text-white/45">فاز ۱ — اسکلت، توکن‌ها و SSG. فاز ۲ انیمیشن و هیرو نهایی را می‌آورد.</p>
          </div>

          {/* Phone mock placeholder for Phase 3 demo */}
          <div className="relative mx-auto w-full max-w-[340px] lg:max-w-[380px]">
            <div className="relative rounded-[2.2rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-3 shadow-glass backdrop-blur-glass">
              <div className="rounded-[1.7rem] bg-[#0F1016] border border-white/10 overflow-hidden">
                <div className="h-7 flex items-center justify-center gap-1 border-b border-white/5 bg-white/[0.03]">
                  <span className="h-1 w-8 rounded-full bg-white/20" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="glass rounded-2xl p-3">
                    <p className="text-xs text-white/60">گاماس — پیش‌نمایش چت</p>
                    <div className="mt-3 space-y-2">
                      <div className="rounded-2xl bg-white text-zinc-900 px-3 py-2 text-xs leading-5">سلام! فایل صوتی کلاس را بفرست تا جزوه‌اش را بسازم ✨</div>
                      <div className="rounded-2xl bg-primary text-white px-3 py-2 text-xs">lecture_03.mp3 — ۴۲ دقیقه</div>
                      <div className="rounded-2xl glass px-3 py-2">
                        <div className="flex items-center justify-between text-[10px] text-white/60"><span>تبدیل گفتار → ساختاردهی</span><span>۶۸٪</span></div>
                        <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full w-[68%] bg-gradient-primary" /></div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-3">
                    <p className="text-xs font-medium">جزوه ساختاریافته — آماده شد ✅</p>
                    <p className="mt-1 text-[11px] leading-5 text-white/60">فایل به چند بخش تقسیم شد تا محدودیت تلگرام رعایت شود. در صورت خطا، رونوشت خام هم ارسال می‌شود.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -z-10 -top-10 -left-10 h-40 w-40 rounded-full bg-primary/20 blur-[60px]" />
            <div className="pointer-events-none absolute -z-10 -bottom-10 -end-10 h-48 w-48 rounded-full bg-accent/15 blur-[70px]" />
          </div>
        </div>
      </div>
    </section>
  )
}

function TokensPreview() {
  return (
    <section className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 pb-12">
      <div className="glass rounded-glass p-6 sm:p-8">
        <h2 className="font-display text-xl">توکن‌های طراحی — فاز ۱</h2>
        <p className="mt-2 text-sm leading-6 text-white/60">پس‌زمینه #0A0A0F، گرادیان primary indigo→violet→cyan، سطوح glass و glow. فونت Vazirmatn (بدنه) و Lalezar (عنوان) با font-display:swap و preload وزن ۴۰۰.</p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-bg border border-white/10 p-4"><span className="block h-8 w-full rounded-lg bg-bg border border-white/5" /><span className="mt-2 block text-xs text-white/60">#0A0A0F — bg</span></div>
          <div className="rounded-xl bg-gradient-primary p-4"><span className="block h-8 w-full rounded-lg bg-white/20" /><span className="mt-2 block text-xs text-white">indigo→violet→cyan</span></div>
          <div className="rounded-xl glass p-4"><span className="block h-8 w-full rounded-lg bg-white/10" /><span className="mt-2 block text-xs text-white/60">glass — backdrop-blur</span></div>
          <div className="rounded-xl bg-accent p-4"><span className="block h-8 w-full rounded-lg bg-white/20" /><span className="mt-2 block text-xs text-white">#06B6D4 — accent</span></div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          <span className="glass rounded-pill px-3 py-1.5">RTL: html lang="fa" dir="rtl"</span>
          <span className="glass rounded-pill px-3 py-1.5">logical: ms-/me-/ps-/pe-</span>
          <span className="glass rounded-pill px-3 py-1.5">digits: فارسی ۰۱۲۳۴۵۶۷۸۹</span>
          <span className="glass rounded-pill px-3 py-1.5">transform/opacity only</span>
        </div>
        <div className="mt-6 text-xs leading-6 text-white/45">
          <p>ـ GSAP/ScrollTrigger فقط کتابخانه انیمیشن (dynamic import زیر فولد). فرامر-موشن ممنوع. بودجه: JS اولیه &lt;۹۰KB gz، LCP &lt;۲ثانیه، CLS &lt;۰٫۰۵.</p>
          <p>ـ سئو: HTML پیش‌رندر شده، title/meta یکتا، OG، JSON-LD، canonical/sitemap/robots، a11y ≥۹۵.</p>
          <p className="mt-2 font-medium text-amber-300">فاز بعدی: Preloader (&le;۱ثانیه، یک‌بار در هر سشن) + نوبار شیشه‌ای + هیروی نهایی با انیمیشن.</p>
        </div>
      </div>
    </section>
  )
}

function FooterPhase1() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45">
        <p>© ۱۴۰۴ گاماس — دستیار جزوه‌ساز فارسی تلگرام</p>
        <p className="flex items-center gap-3">
          <a href={tgLink('footer')} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">ربات تلگرام</a>
          <span>·</span>
          <a href="https://github.com/AmiraliGhamkhar/Gamas_bot" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">گیت‌هاب سورس بات</a>
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    // Respect prefers-reduced-motion for any future GSAP
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduced-motion')
    }
  }, [])

  return (
    <div className="min-h-dvh flex flex-col bg-bg">
      <PreloaderPhase1 onDone={() => setReady(true)} />
      <NavbarPhase1 />
      <main className="flex-1">
        <HeroPhase1 />
        <TokensPreview />
        {/* Placeholders for upcoming phases to prove anchor targets exist for SSG/SEO */}
        <section id="features" className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-glass border border-dashed border-white/10 p-8 text-center text-sm text-white/50">
            بخش ویژگی‌ها — فاز ۳ (Bento: صوت/ویدیو/پاورپوینت، اسلایدبه‌اسلاید، پیشرفت زنده، fallback رونوشت، STT فارسی)
          </div>
        </section>
        <section id="how" className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-glass border border-dashed border-white/10 p-8 text-center text-sm text-white/50">
            نحوه کار — ۴ گام: ارسال → رونویسی → ساختاردهی → دریافت (فاز ۳)
          </div>
        </section>
        <section id="privacy" className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-glass border border-dashed border-white/10 p-8 text-center text-sm text-white/50">
            حریم خصوصی و محدودیت‌ها — صداقت: ارسال به STT/LLM خارجی، حد ۲ گیگ، PDF/ZIP مردود (فاز ۴)
          </div>
        </section>
        <section id="faq" className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-glass border border-dashed border-white/10 p-8 text-center text-sm text-white/50">
            FAQ + JSON-LD FAQPage — فرمت‌ها، حجم، حریم خصوصی، دقت متغیر، هزینه (فاز ۴)
          </div>
        </section>
      </main>
      <FooterPhase1 />

      {/* Mobile sticky CTA for Phase 1 verification */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-white/10 bg-[#0A0A0F]/80 backdrop-blur-glass supports-[backdrop-filter]:bg-[#0A0A0F]/70 p-3 sm:hidden">
        <a
          href={tgLink('mobile_sticky')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-pill bg-gradient-primary py-3 text-sm font-medium text-white shadow-glow"
        >
          شروع در تلگرام — رایگان امتحان کن
        </a>
      </div>
    </div>
  )
}
