import { useEffect, useRef } from 'react'
import { BOT_HANDLE, tgLink, toFa } from '../lib/constants'
import IsolatedText from './IsolatedText'
import { trackCTA } from '../lib/track'

export default function Story() {
  const sectionRef = useRef(null)
  const pinnedRef = useRef(null)

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

        // Desktop: sticky story with problem ← solution crossfade
        mm.add('(min-width: 1068px)', () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 25%',
              end: 'bottom 75%',
              scrub: 0.6,
            }
          })

          tl.to('.problem-card', {
            opacity: 0,
            y: -18,
            scale: 0.98,
            pointerEvents: 'none',
            duration: 0.35,
            ease: 'power2.inOut'
          }, 0.15)
          .fromTo('.solution-card',
            { opacity: 0, y: 18, scale: 0.98, pointerEvents: 'none' },
            { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto', duration: 0.45, ease: 'power2.out' },
            0.2
          )
          .to('.problem-badge', { opacity: 0, duration: 0.2 }, 0.15)
          .to('.solution-badge', { opacity: 1, duration: 0.3 }, 0.28)
        })

        // Mobile: simple reveals
        mm.add('(max-width: 1067px)', () => {
          gsap.utils.toArray('.story-reveal').forEach((el, i) => {
            gsap.fromTo(el,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: i * 0.04,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 88%',
                  toggleActions: 'play none none reverse'
                }
              }
            )
          })
        })

      }, sectionRef)
    })()

    return () => {
      cancelled = true
      mm?.revert()
      ctx?.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} id="story" className="product-tile product-tile-dark relative py-16 sm:py-20 lg:py-28 overflow-hidden">
      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center story-reveal">
          <span className="inline-flex items-center gap-2 surface-card rounded-pill px-3 py-1.5 text-xs text-white/70 chip">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            داستان گاماس
          </span>
          <h2 className="mt-4 font-display text-[1.9rem] sm:text-[2.4rem] lg:text-[2.8rem] leading-[1.1] ">
            از گوش دادنِ دوباره و دوباره
            <span className="block text-primary-emphasis">تا جزوه‌ای که خودش می‌رسد</span>
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] leading-7 text-white/60">
            یک کلاس ۹۰ دقیقه‌ای نباید ۳ ساعت از روزت را بگیرد. مسئله را ببین، راه‌حل گاماس را مقایسه کن.
          </p>
        </div>

        <div className="mt-12 lg:mt-16 grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-10 items-start">
          {/* Sticky side on desktop, stacked on mobile/tablet */}
          <div ref={pinnedRef} className="lg:sticky lg:top-24">
            <div className="relative space-y-4 lg:space-y-0 lg:min-h-[480px]">
              {/* Problem card — visible first */}
              <div className="problem-card store-utility-card lg:absolute lg:inset-0 surface-card rounded-18 p-6 sm:p-7 flex flex-col will-change-transform">
                <div className="flex items-center gap-3">
                  <span className="problem-badge inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs">✕</span>
                  <span className="problem-badge text-xs font-semibold text-white/60">قبل — ساعت‌ها اتلاف</span>
                  <span className="ms-auto text-[11px] text-white/30 persian-digits">۹۰ دقیقه ← ۳ ساعت</span>
                </div>
                <h3 className="mt-5 font-display text-[1.35rem] leading-6">گوش دادنِ چندباره، یادداشتِ ناقص</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  فایل را از اول پخش می‌کنی، نکته‌ها پراکنده می‌ماند، اسلاید و صدای استاد از هم جدا می‌افتد — شبِ امتحان خسته‌ات می‌کند.
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {[
                    ['⏱', 'اتلاف وقت — ۲ تا ۳ بار بازپخش'],
                    ['📝', 'یادداشت ناقص و نامرتب'],
                    ['🔀', 'اسلاید ≠ صدا — ارتباط گم می‌شود'],
                    ['😵', 'خستگی قبلِ مرور'],
                  ].map(([icon, text]) => (
                    <li key={text} className="flex items-center gap-3 text-white/75">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] border border-white/5 text-xs">{icon}</span>
                      <span><IsolatedText>{text}</IsolatedText></span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6 flex items-center gap-2 text-xs text-white/35">
                  <span className="h-px flex-1 bg-white/10" />
                  <span>اسکرول کن ← راه‌حل</span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
              </div>

              {/* Solution card — fades in on scroll (desktop sticky) */}
              <div className="solution-card store-utility-card story-reveal lg:absolute lg:inset-0 surface-card rounded-18 p-6 sm:p-7 flex flex-col will-change-transform lg:opacity-0 lg:pointer-events-none">
                <div className="flex items-center gap-3">
                  <span className="solution-badge inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-muted text-muted text-xs lg:opacity-0">✓</span>
                  <span className="solution-badge text-xs font-semibold text-muted lg:opacity-0">بعد — بفرست، تحویل بگیر</span>
                  <span className="ms-auto text-[11px] text-white/30">چند دقیقه</span>
                </div>
                <h3 className="mt-5 font-display text-[1.35rem] leading-6">فایل را بفرست، جزوه را بگیر</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  ویس/ویدیو/پاورپوینت را به <bdi dir="ltr" className="text-white">{BOT_HANDLE}</bdi> بفرست — با <IsolatedText>FFmpeg</IsolatedText> صدا جدا می‌شود، با <IsolatedText>STT</IsolatedText> فارسی رونویسی و با <IsolatedText>LLM</IsolatedText> ساختار می‌گیرد.
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {[
                    ['✅', 'ویس، MP3/M4A/WAV/OGG/FLAC… و MP4/MKV/MOV/AVI'],
                    ['✅', 'پاورپوینت PPTX/PPSX/POTX + PPT/ODP قدیمی'],
                    ['✅', 'پیام وضعیتِ واحد با نوار پیشرفت زنده'],
                    ['✅', 'رونوشت خام حتی اگر ساخت جزوه خطا بخورد'],
                  ].map(([icon, text]) => (
                    <li key={text} className="flex items-center gap-3 text-white/80">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-muted border border-subtle text-xs">{icon}</span>
                      <span><IsolatedText>{text}</IsolatedText></span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <a href={tgLink('story')} target="_blank" rel="noopener noreferrer" onClick={() => trackCTA('story')} className="button-primary inline-flex items-center gap-2 rounded-pill bg-primary px-5 py-2.5 text-xs font-semibold text-white ">
                    امتحان کن — شروع در تلگرام
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll side — details */}
          <div className="space-y-4">
            {[
              {
                title: 'چرا گوش دادنِ دوباره جواب نیست؟',
                desc: 'حافظه‌ی شنیداری محدود است؛ بدون ساختار، ۷۰٪ نکات بعد از ۲۴ ساعت فراموش می‌شود. جزوه‌ی ساختاریافته با سرفصل، خلاصه و نکات کلیدی، مرور را ۳ برابر سریع‌تر می‌کند.',
                meta: 'منبع: تجربه‌ی کاربران — نه آمار ساختگی'
              },
              {
                title: 'گاماس چه می‌کند که دستی سخت است؟',
                desc: '۱) FFmpeg صدای اول ویدیو/پاورپوینت را جدا می‌کند ۲) STT فارسی (Speechmatics/Deepgram) رونویسی می‌کند ۳) LLM متن را به جزوه‌ی بخش‌بندی‌شده تبدیل می‌کند ۴) پیام‌های طولانی برای تلگرام تقسیم می‌شود.',
                meta: 'PowerPoint: متن اسلاید + یادداشت گوینده + صداهای داخل اسلاید'
              },
              {
                title: 'شفاف و صادق',
                desc: 'هیچ ادعای ۱۰۰٪ دقیق نداریم — دقت به کیفیت ضبط، نویز و اصطلاحات تخصصی وابسته است. فایل‌ها تا ۲ گیگابایت، PDF/تصویر/ZIP مردود است و صدا/رونوشت برای پردازش به ارائه‌دهندگان STT/LLM خارجی ارسال می‌شود.',
                meta: 'جزئیات کامل در بخش حریم خصوصی'
              },
            ].map((item, i) => (
              <div key={i} className="story-reveal store-utility-card surface-card rounded-2xl p-5 sm:p-6">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[11px]">{toFa(i + 1)}</span>
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/60"><IsolatedText>{item.desc}</IsolatedText></p>
                <p className="mt-3 text-xs text-white/35"><IsolatedText>{item.meta}</IsolatedText></p>
              </div>
            ))}

            <div className="story-reveal store-utility-card surface-card rounded-2xl p-5 flex items-center justify-between">
              <span className="text-xs text-white/60">آماده‌ای؟</span>
              <a href={tgLink('story_cta')} target="_blank" rel="noopener noreferrer" onClick={() => trackCTA('story_cta')} className="button-secondary-pill rounded-pill bg-white text-zinc-900 px-4 py-2 text-xs font-semibold hover:bg-white/90 transition">شروع در تلگرام</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
