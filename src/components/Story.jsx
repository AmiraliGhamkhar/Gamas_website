import { useEffect, useRef } from 'react'
import { trackCTA } from '../lib/track'

export default function Story() {
  const sectionRef = useRef(null)
  const pinnedRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let mm
    let ctx

    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        mm = gsap.matchMedia()

        // Desktop: pinned story with problem → solution crossfade
        mm.add('(min-width: 1024px)', () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=700',
              pin: pinnedRef.current,
              pinSpacing: true,
              scrub: 0.8,
              anticipatePin: 1,
            }
          })

          tl.to('.problem-card', {
            opacity: 0,
            y: -18,
            scale: 0.98,
            duration: 0.35,
            ease: 'power2.inOut'
          }, 0.15)
          .fromTo('.solution-card',
            { opacity: 0, y: 18, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out' },
            0.2
          )
          .to('.problem-badge', { opacity: 0, duration: 0.2 }, 0.15)
          .to('.solution-badge', { opacity: 1, duration: 0.3 }, 0.28)
        })

        // Mobile: simple reveals
        mm.add('(max-width: 1023px)', () => {
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

        // Parallax glows — transform only
        mm.add('(min-width: 768px)', () => {
          gsap.to('.story-glow-1', {
            y: -30,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          })
          gsap.to('.story-glow-2', {
            y: 30,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          })
        })
      }, sectionRef)
    })()

    return () => {
      mm?.revert()
      ctx?.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} id="story" className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* bg glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="story-glow-1 absolute -top-24 end-1/4 h-[420px] w-[520px] rounded-full bg-primary/10 blur-[90px]" />
        <div className="story-glow-2 absolute -bottom-24 start-1/4 h-[360px] w-[460px] rounded-full bg-accent/8 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center story-reveal">
          <span className="inline-flex items-center gap-2 glass rounded-pill px-3 py-1.5 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            داستان گاماس
          </span>
          <h2 className="mt-4 font-display text-[1.9rem] sm:text-[2.4rem] lg:text-[2.8rem] leading-[1.1] tracking-tight">
            از گوش دادنِ دوباره و دوباره
            <span className="block text-gradient">تا جزوه‌ای که خودش می‌رسد</span>
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] leading-7 text-white/60">
            یک کلاس ۹۰ دقیقه‌ای نباید ۳ ساعت از روزت را بگیرد. مسئله را ببین، راه‌حل گاماس را مقایسه کن.
          </p>
        </div>

        <div className="mt-12 lg:mt-16 grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-10 items-start">
          {/* Pinned side */}
          <div ref={pinnedRef} className="lg:sticky lg:top-24">
            <div className="relative min-h-[420px] sm:min-h-[460px] lg:min-h-[480px]">
              {/* Problem card — visible first */}
              <div className="problem-card absolute inset-0 glass rounded-[1.6rem] p-6 sm:p-7 flex flex-col will-change-transform">
                <div className="flex items-center gap-3">
                  <span className="problem-badge inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs">✕</span>
                  <span className="problem-badge text-xs font-medium text-white/60">قبل — ساعت‌ها اتلاف</span>
                  <span className="ms-auto text-[11px] text-white/30 persian-digits">۹۰ دقیقه → ۳ ساعت</span>
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
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6 flex items-center gap-2 text-xs text-white/35">
                  <span className="h-px flex-1 bg-white/10" />
                  <span>اسکرول کن → راه‌حل</span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
              </div>

              {/* Solution card — fades in on scroll (desktop pinned) */}
              <div className="solution-card absolute inset-0 glass-strong rounded-[1.6rem] p-6 sm:p-7 flex flex-col opacity-0 will-change-transform lg:opacity-0">
                <div className="flex items-center gap-3">
                  <span className="solution-badge inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 text-xs opacity-0 lg:opacity-0">✓</span>
                  <span className="solution-badge text-xs font-medium text-emerald-300/90 opacity-0 lg:opacity-0">بعد — بفرست، تحویل بگیر</span>
                  <span className="ms-auto text-[11px] text-white/30">چند دقیقه</span>
                </div>
                <h3 className="mt-5 font-display text-[1.35rem] leading-6">فایل را بفرست، جزوه را بگیر</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  ویس/ویدیو/پاورپوینت را به <span dir="ltr" className="text-white">@GamasBot</span> بفرست — با FFmpeg صدا جدا می‌شود، با STT فارسی رونویسی و با LLM ساختار می‌گیرد.
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {[
                    ['✅', 'ویس، MP3/M4A/WAV/OGG/FLAC… و MP4/MKV/MOV/AVI'],
                    ['✅', 'پاورپوینت PPTX/PPSX/POTX + PPT/ODP قدیمی'],
                    ['✅', 'پیام وضعیتِ واحد با نوار پیشرفت زنده'],
                    ['✅', 'رونوشت خام حتی اگر ساخت جزوه خطا بخورد'],
                  ].map(([icon, text]) => (
                    <li key={text} className="flex items-center gap-3 text-white/80">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/15 text-xs">{icon}</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <a href="https://t.me/GamasBot?start=landing_story" target="_blank" rel="noopener noreferrer" onClick={() => trackCTA('story')} className="inline-flex items-center gap-2 rounded-pill bg-gradient-primary px-5 py-2.5 text-xs font-medium text-white shadow-glow">
                    امتحان کن — شروع در تلگرام
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile only: show both stacked (since pin disabled) — hidden on lg because pinned shows crossfade */}
            <div className="lg:hidden mt-6 space-y-4 story-reveal">
              <div className="glass-strong rounded-2xl p-5 border-emerald-500/20">
                <p className="text-xs font-medium text-emerald-300">راه‌حل گاماس</p>
                <p className="mt-2 text-sm leading-6 text-white/70">در موبایل هر دو کارت پشتِ هم نمایش داده می‌شود؛ در دسکتاپ با اسکرول، کارتِ مشکل محو و کارتِ راه‌حل با پین ظاهر می‌شود.</p>
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
              <div key={i} className="story-reveal glass rounded-2xl p-5 sm:p-6">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-gradient-primary flex items-center justify-center text-[11px]">{i+1}</span>
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/60">{item.desc}</p>
                <p className="mt-3 text-xs text-white/35">{item.meta}</p>
              </div>
            ))}

            <div className="story-reveal glass rounded-2xl p-5 flex items-center justify-between">
              <span className="text-xs text-white/60">آماده‌ای؟</span>
              <a href="https://t.me/GamasBot?start=landing_story_cta" target="_blank" rel="noopener noreferrer" onClick={() => trackCTA('story_cta')} className="rounded-pill bg-white text-zinc-900 px-4 py-2 text-xs font-medium hover:bg-white/90 transition">شروع در تلگرام</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
