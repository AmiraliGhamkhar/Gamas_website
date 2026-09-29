import { useEffect, useRef } from 'react'
import IsolatedText from './IsolatedText'

const features = [
  {
    id: 'all-formats',
    span: 'md:col-span-2',
    icon: '◐',
    title: 'همه‌ی فرمت‌های کلاس — یک‌جا',
    desc: 'ویس تلگرام، MP3/M4A/WAV/OGG/FLAC/WMA/AMR و هر فرمت FFmpeg — ویدیو MP4/MKV/MOV/AVI و ویدیونوت — پاورپوینت PPTX/PPSX/POTX (native) و PPT/ODP قدیمی via LibreOffice.',
    bullets: ['استخراج صدای اول ویدیو با FFmpeg', 'ادغام صداهای داخل اسلایدهای پاورپوینت'],
  },
  {
    id: 'slide-by-slide',
    span: 'md:col-span-1',
    icon: '▭',
    title: 'جزوه‌ی اسلاید به اسلاید',
    desc: 'متن هر اسلاید + یادداشت گوینده + روایت صوتیِ هر اسلاید استخراج و به جزوه‌ای منظم تبدیل می‌شود.',
    bullets: ['تفکیک دقیق هر اسلاید', 'حفظ ترتیب ارائه'],
  },
  {
    id: 'live-progress',
    span: 'md:col-span-1',
    icon: '≡',
    title: 'پیشرفت زنده — یک پیام',
    desc: 'فقط یک پیام وضعیت که در هر مرحله ویرایش می‌شود — بدون اسپم. نوار پیشرفتِ واقعی.',
    bullets: ['ویرایش به‌جای پیام جدید', 'درصد و مرحله: آماده‌سازی ← STT ← ساختاردهی'],
  },
  {
    id: 'fallback',
    span: 'md:col-span-1',
    icon: '↺',
    title: 'فال‌بک رونوشت',
    desc: 'اگر ساخت جزوه به هر دلیلی خطا بخورد، رونوشت خامِ بازبینی‌شده همچنان تحویل داده می‌شود — چیزی از دست نمی‌رود.',
    bullets: ['حفظ رونوشت حتی در خطای LLM', 'تقسیم خودکار برای تلگرام'],
  },
  {
    id: 'persian-stt',
    span: 'md:col-span-1',
    icon: 'فا',
    title: 'تبدیل گفتار فارسی',
    desc: 'STT فارسی با Speechmatics / Deepgram، پیش‌پردازش FFmpeg و نرمال‌سازی — مناسب اصطلاحات دانشگاهی با دقتِ وابسته به کیفیت ضبط.',
    bullets: ['پشتیبانی fa', 'بدون ادعای ۱۰۰٪ — صادقانه'],
  },
]

export default function Bento() {
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
          gsap.fromTo('.bento-card',
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.07,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: ref.current,
                start: 'top 78%',
                toggleActions: 'play none none reverse'
              }
            }
          )
        })
        mm.add('(max-width: 833px)', () => {
          gsap.utils.toArray('.bento-card').forEach((el) => {
            gsap.fromTo(el,
              { opacity: 0, y: 14 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                scrollTrigger: {
                  trigger: el,
                  start: 'top 90%',
                }
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
    <section ref={ref} id="features" className="product-tile product-tile-parchment relative py-16 sm:py-20">
      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 surface-card rounded-pill px-3 py-1.5 text-xs text-white/70 chip">
            <span className="h-1.5 w-1.5 rounded-full bg-surface-muted" />
            ویژگی‌ها — <bdi lang="en">Bento</bdi>
          </span>
          <h2 className="mt-4 font-display text-[1.9rem] sm:text-[2.45rem] leading-[1.05] ">
            یک ربات برای <span className="text-primary-emphasis">همه‌ی فرمت‌های کلاس</span>
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] leading-7 text-white/60">
            بدون تبدیل دستی — فقط فایل را بفرست. باقی کار با گاماس است.
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.id}
              className={`bento-card group relative overflow-hidden surface-card rounded-18 p-6 sm:p-7 will-change-transform ${f.span}`}
            >

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-display shrink-0">
                    {f.icon}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 surface-card rounded-pill px-2.5 py-1 text-[10px] text-white/50 chip">
                    <span className="h-1 w-1 rounded-full bg-surface-muted" />
                    فعال
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[16px] leading-6">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60"><IsolatedText>{f.desc}</IsolatedText></p>
                <ul className="mt-4 space-y-1.5">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs leading-5 text-white/55">
                      <span className="mt-1 h-1 w-1 rounded-full bg-white/40 shrink-0" />
                      <span><IsolatedText>{b}</IsolatedText></span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px]">
          <span className="surface-card rounded-pill px-3 py-1.5 text-white/50 chip">حد ۲ گیگابایت</span>
          <span className="surface-card rounded-pill px-3 py-1.5 text-white/50 chip"><IsolatedText>PDF / تصویر / ZIP مردود</IsolatedText></span>
          <span className="surface-card rounded-pill px-3 py-1.5 text-white/50 chip">منوی ربات: ساخت جزوه / راهنما / قالب‌ها / حریم خصوصی</span>
        </div>
      </div>
    </section>
  )
}
