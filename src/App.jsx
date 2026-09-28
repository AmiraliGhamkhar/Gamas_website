import { useEffect } from 'react'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Story from './components/Story'
import Bento from './components/Bento'
import BotDemo from './components/BotDemo'
import HowItWorks from './components/HowItWorks'
import MobileSticky from './components/MobileSticky'
import { tgLink } from './lib/constants'

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
        <Story />
        <Bento />
        <BotDemo />
        <HowItWorks />
        <SectionPlaceholder id="access" title="دسترسی و قیمت — TODO placeholder (دسترسی فعلاً توسط ادمین) — فاز ۴" />
        <SectionPlaceholder id="testimonials" title="نظرات — TODO placeholder — فاز ۴" />
        <SectionPlaceholder id="privacy" title="حریم خصوصی و محدودیت‌ها — صداقت: ارسال به STT/LLM خارجی، حد ۲ گیگ، PDF/ZIP مردود (فاز ۴)" />
        <SectionPlaceholder id="faq" title="FAQ + JSON-LD FAQPage — فرمت‌ها، حجم، حریم خصوصی، دقت متغیر، هزینه (فاز ۴)" />
      </main>
      <Footer />
      <MobileSticky />
    </div>
  )
}
