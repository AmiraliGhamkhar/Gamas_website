import { useEffect } from 'react'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MobileSticky from './components/MobileSticky'
import { tgLink } from './lib/constants'

function TokensPreview() {
  return (
    <section className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 pb-8">
      <div className="glass rounded-glass p-6 sm:p-8">
        <h2 className="font-display text-xl">توکن‌های طراحی — فاز ۲ اعمال شد</h2>
        <p className="mt-2 text-sm leading-6 text-white/60">
          پری‌لودر ≤۱ ثانیه (یک‌بار در سشن، بدون بلاک LCP) + نوبار شیشه‌ای sticky + هیروی نهایی با CTAs تلگرامی. فونت Vazirmatn/Lalezar ساب‌ست woff2، گرادیان indigo→violet→cyan، glass/glow.
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-bg border border-white/10 p-4"><span className="block h-8 w-full rounded-lg bg-bg border border-white/5" /><span className="mt-2 block text-xs text-white/60">#0A0A0F — bg</span></div>
          <div className="rounded-xl bg-gradient-primary p-4"><span className="block h-8 w-full rounded-lg bg-white/20" /><span className="mt-2 block text-xs text-white">indigo→violet→cyan</span></div>
          <div className="rounded-xl glass p-4"><span className="block h-8 w-full rounded-lg bg-white/10" /><span className="mt-2 block text-xs text-white/60">glass — blur 16px</span></div>
          <div className="rounded-xl bg-accent p-4"><span className="block h-8 w-full rounded-lg bg-white/20" /><span className="mt-2 block text-xs text-white">#06B6D4 — accent</span></div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          <span className="glass rounded-pill px-3 py-1.5">RTL: lang=fa dir=rtl</span>
          <span className="glass rounded-pill px-3 py-1.5">logical: ms-/me-</span>
          <span className="glass rounded-pill px-3 py-1.5">digits: ۰۱۲۳۴۵۶۷۸۹</span>
          <span className="glass rounded-pill px-3 py-1.5">transform/opacity only ✓</span>
        </div>
      </div>
    </section>
  )
}

function SectionPlaceholder({ id, title }) {
  return (
    <section id={id} className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-8">
      <div className="rounded-glass border border-dashed border-white/10 p-8 text-center text-sm text-white/50">
        {title}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 pb-20 sm:pb-8">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45">
        <p>© ۱۴۰۴ گاماس — دستیار جزوه‌ساز فارسی تلگرام</p>
        <p className="flex items-center gap-3">
          <a href={tgLink('footer')} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">ربات تلگرام</a>
          <span>·</span>
          <a href="https://github.com/AmiraliGhamkhar/Gamas_bot" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">سورس بات</a>
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduced-motion')
    }
  }, [])

  return (
    <div className="min-h-dvh flex flex-col bg-bg">
      <Preloader />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TokensPreview />
        <SectionPlaceholder id="features" title="بخش ویژگی‌ها — فاز ۳ (Bento: صوت/ویدیو/پاورپوینت، اسلایدبه‌اسلاید، پیشرفت زنده، fallback رونوشت، STT فارسی)" />
        <SectionPlaceholder id="how" title="نحوه کار — ۴ گام: ارسال → رونویسی → ساختاردهی → دریافت (فاز ۳)" />
        <SectionPlaceholder id="privacy" title="حریم خصوصی و محدودیت‌ها — صداقت: ارسال به STT/LLM خارجی، حد ۲ گیگ، PDF/ZIP مردود (فاز ۴)" />
        <SectionPlaceholder id="faq" title="FAQ + JSON-LD FAQPage — فرمت‌ها، حجم، حریم خصوصی، دقت متغیر، هزینه (فاز ۴)" />
      </main>
      <Footer />
      <MobileSticky />
    </div>
  )
}
