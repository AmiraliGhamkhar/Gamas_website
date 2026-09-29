import { useState, useEffect, useRef } from 'react'

const faqs = [
  {
    q: 'چه فرمت‌هایی پشتیبانی می‌شود؟',
    a: 'صوتی: ویس تلگرام و MP3/M4A/WAV/OGG/FLAC/WMA/AMR و هر فرمت قابل پشتیبانی FFmpeg. ویدیویی: MP4/MKV/MOV/AVI و ویدیونوت → صدای اول استخراج می‌شود. پاورپوینت: PPTX/PPSX/POTX native؛ PPT/PPS/POT/ODP/OTP قدیمی فقط با LibreOffice قابل تبدیل است. PDF، تصویر و ZIP مردود هستند.',
  },
  {
    q: 'حداکثر حجم فایل چقدر است؟',
    a: '۲ گیگابایت. فایل‌های بزرگ‌تر مردود می‌شوند. برای فایل‌های حجیم، آن را به بخش‌های کوتاه‌تر تقسیم کنید.',
  },
  {
    q: 'آیا فایل‌های من خصوصی می‌ماند؟',
    a: 'برای پردازش، صدا به سرویس STT خارجی (Speechmatics/Deepgram) و در صورت فعال بودن، رونوشت/متن اسلایدها به سرویس ساخت جزوه (Gemini/Anthropic/OpenAI-compatible) ارسال می‌شود. فایل‌های موقت بعد پردازش حذف می‌شوند، اما رونوشت/جزوه ممکن است در دیتابیس محلی بماند. سیاست نگهداری ارائه‌دهندگان، رضایت کاربر و مقررات را قبل از تولید بررسی کنید.',
  },
  {
    q: 'دقت رونویسی و جزوه چقدر است؟',
    a: 'دقت متغیر است و به کیفیت ضبط، نویز محیط، گویش و اصطلاحات تخصصی بستگی دارد. هیچ عدد ٪ یا تضمین ۱۰۰٪ ارائه نمی‌شود. برای ارزیابی، یک فایل را با هر دو موتور STT تست و اصطلاحات را دستی بررسی کنید.',
  },
  {
    q: 'هزینه چقدر است؟',
    a: 'قیمت و ساختار پلن‌ها هنوز نهایی نشده‌اند. فعلاً دسترسی با تأیید ادمین است؛ پیش از فعال‌سازی، شرایط و هرگونه هزینه احتمالی را با ادمین هماهنگ کنید.',
  },
  {
    q: 'اگر ساخت جزوه خطا بخورد چه می‌شود؟',
    a: 'اگر LLM یا سرویس ساخت جزوه در دسترس نباشد یا خطا دهد، رونوشت خام (و در پاورپوینت، متن/یادداشت اسلایدها) همچنان تحویل داده می‌شود. جزوه‌های طولانی هم برای رعایت محدودیت تلگرام به چند پیام تقسیم می‌شوند.',
  },
]

function FAQItem({ index, q, a, isOpen, onToggle }) {
  const panelId = `faq-panel-${index}`
  return (
    <div className="group rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
      >
        <span className="text-sm font-medium leading-6 text-white/90">{q}</span>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 transition will-change-transform ${isOpen ? 'rotate-45 bg-white text-zinc-900' : 'bg-white/5 text-white/60'}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </span>
      </button>
      <div
        id={panelId}
        aria-hidden={!isOpen}
        className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-7 text-white/60">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let mm
    let ctx
    let cancelled = false
    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        mm = gsap.matchMedia()
        mm.add('(min-width: 768px)', () => {
          gsap.fromTo('.faq-item', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', scrollTrigger: { trigger: ref.current, start: 'top 82%' } })
        })
        mm.add('(max-width: 767px)', () => {
          gsap.utils.toArray('.faq-item').forEach(el => {
            gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, scrollTrigger: { trigger: el, start: 'top 94%' } })
          })
        })
      }, ref)
    })()
    return () => {
      cancelled = true
      mm?.revert()
      ctx?.revert()
    }
  }, [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  // Escape "<" so no answer text can ever close the <script> tag early
  // (JSON.stringify does not escape "</script>").
  const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, '\\u003c')

  return (
    <section ref={ref} id="faq" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 glass rounded-pill px-3 py-1.5 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            سوالات متداول
          </span>
          <h2 className="mt-4 font-display text-[1.9rem] sm:text-[2.45rem] leading-[1.05] tracking-tight">
            سوالی داری؟ <span className="text-gradient">اینجا جوابشه</span>
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="faq-item will-change-transform">
              <FAQItem index={i} q={f.q} a={f.a} isOpen={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            </div>
          ))}
        </div>
      </div>

      {/* FAQPage JSON-LD — prerendered */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
    </section>
  )
}
