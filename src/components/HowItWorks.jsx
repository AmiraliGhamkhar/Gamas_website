import { useEffect, useRef } from 'react'
import { BOT_HANDLE } from '../lib/constants'
import IsolatedText from './IsolatedText'

const steps = [
  {
    n: '۰۱',
    title: 'ارسال',
    desc: `فایل را به ${BOT_HANDLE} بفرست — ویس تلگرام، MP3/M4A/WAV/OGG/FLAC…، ویدیو MP4/MKV/MOV/AVI و ویدیونوت، یا پاورپوینت PPTX/PPSX/POTX و PPT/ODP قدیمی.`,
    note: 'حداکثر ۲ گیگابایت',
    icon: '↑'
  },
  {
    n: '۰۲',
    title: 'رونویسی',
    desc: 'Telegram ← FFmpeg (استخراج صدا) ← تبدیل گفتار فارسی با Speechmatics / Deepgram. کیفیت به میکروفون، نویز و اصطلاحات بستگی دارد.',
    note: 'دقت متغیر — صادقانه',
    icon: '◑'
  },
  {
    n: '۰۳',
    title: 'ساختاردهی',
    desc: 'LLM (Gemini / Anthropic / OpenAI-compatible) رونوشت + متن اسلایدها و یادداشت‌ها را به جزوه‌ی بخش‌بندی‌شده، خلاصه و نکات کلیدی تبدیل می‌کند.',
    note: 'اسلاید به اسلاید',
    icon: '≡'
  },
  {
    n: '۰۴',
    title: 'دریافت',
    desc: 'جزوه در چت برمی‌گردد؛ اگر طولانی باشد برای تلگرام تقسیم می‌شود. اگر ساخت جزوه خطا بخورد، رونوشت خام همچنان تحویل می‌شود.',
    note: 'یک پیام وضعیت + تقسیم خودکار',
    icon: '✓'
  },
]

export default function HowItWorks() {
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

        mm.add('(min-width: 834px)', () => {
          // line draw
          gsap.fromTo('.how-line',
            { scaleX: 0, transformOrigin: '100% center' },
            {
              scaleX: 1,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: { trigger: ref.current, start: 'top 72%' }
            }
          )
          gsap.fromTo('.how-card',
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: { trigger: ref.current, start: 'top 72%' }
            }
          )
        })
        mm.add('(max-width: 833px)', () => {
          gsap.utils.toArray('.how-card').forEach((el) => {
            gsap.fromTo(el,
              { opacity: 0, y: 14 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                scrollTrigger: { trigger: el, start: 'top 90%' }
              }
            )
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

  return (
    <section ref={ref} id="how" className="product-tile product-tile-light relative py-16 sm:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 surface-card rounded-pill px-3 py-1.5 text-xs text-white/70 chip">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            نحوه کار — ۴ گام
          </span>
          <h2 className="mt-4 font-display text-[1.9rem] sm:text-[2.45rem] leading-[1.05] ">
            از ارسال تا <span className="text-primary-emphasis">دریافت جزوه</span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/60">
            فقط بفرست — بقیه خودکار است. شفاف، بدون ادعای اغراق‌آمیز.
          </p>
        </div>

        {/* line — desktop horizontal */}
        <div className="relative mt-12 hidden md:block">
          <div className="absolute top-[34px] inset-inline-0 h-px bg-white/10" />
          <div className="how-line absolute top-[34px] inset-inline-0 h-px bg-primary will-change-transform" />
        </div>

        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className="how-card store-utility-card group relative surface-card rounded-18 p-6 will-change-transform"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm shrink-0">
                  {s.icon}
                </span>
                <span className="persian-digits text-xs font-semibold text-white/40">{s.n}</span>
                <span className="ms-auto hidden md:inline-flex surface-card rounded-pill px-2.5 py-1 text-[10px] text-white/50 chip">{s.note}</span>
              </div>
              <h3 className="mt-4 font-display text-[16px]">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                {s.desc.split(BOT_HANDLE).map((part, index) => (
                  <span key={`${s.n}-${index}`}>
                    {index > 0 && <bdi dir="ltr">{BOT_HANDLE}</bdi>}
                    <IsolatedText>{part}</IsolatedText>
                  </span>
                ))}
              </p>
              <span className="md:hidden mt-3 inline-flex surface-card rounded-pill px-2.5 py-1 text-[10px] text-white/50 chip">{s.note}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 surface-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm leading-6 text-white/70">
            <span className="font-semibold text-white">نکته‌ی مهم:</span> برای تولید جزوه، صدا/رونوشت به ارائه‌دهندگان <bdi dir="ltr" lang="en">STT</bdi> و <bdi dir="ltr" lang="en">LLM</bdi> خارجی ارسال می‌شود. فایل‌های موقت پس از پردازش حذف، اما رونوشت/جزوه ممکن است در دیتابیس محلی بماند.
          </p>
          <a
            href="#privacy"
            className="button-secondary-pill shrink-0 inline-flex items-center gap-1.5 rounded-pill bg-white text-zinc-900 px-4 py-2 text-xs font-semibold hover:bg-white/90 transition"
          >
            حریم خصوصی
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      </div>
    </section>
  )
}
