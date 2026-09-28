import { useEffect, useRef, useState } from 'react'
import { tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'

const stages = [
  { label: 'آماده‌سازی صدا', pct: 18 },
  { label: 'تبدیل گفتار فارسی', pct: 48 },
  { label: 'ساختاردهی جزوه', pct: 82 },
  { label: 'تقسیم و ارسال', pct: 100 },
]

function PhoneFrame({ children }) {
  return (
    <div className="relative rounded-[2.2rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-2.5 sm:p-3 shadow-glass backdrop-blur-glass">
      <div className="rounded-[1.7rem] bg-[#0F1016] border border-white/10 overflow-hidden">
        <div className="h-8 flex items-center justify-between px-4 border-b border-white/5 bg-white/[0.03]">
          <span className="flex items-center gap-2 text-[11px] text-white/70">
            <span className="h-6 w-6 rounded-full bg-gradient-primary flex items-center justify-center text-[10px]">گ</span>
            گاماس
            <span className="hidden sm:inline text-white/30">• @GamasBot</span>
          </span>
          <span className="h-1 w-8 rounded-full bg-white/15" />
          <span className="text-[10px] text-white/30">۱۲:۴۲</span>
        </div>
        <div className="p-3 sm:p-4 min-h-[520px] flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}

function ChatBubble({ from, children, time }) {
  const isUser = from === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-5 ${isUser ? 'bg-primary text-white rounded-br-sm' : 'bg-white text-zinc-900 rounded-bl-sm'}`}>
        <div>{children}</div>
        {time && <div className={`mt-1 text-[10px] ${isUser ? 'text-white/70 text-left' : 'text-zinc-500 text-left'}`}>{time}</div>}
      </div>
    </div>
  )
}

export default function BotDemo() {
  const [phase, setPhase] = useState(0) // 0 idle, 1.. stages+ messages, then loop
  const [progress, setProgress] = useState(0)
  const [auto, setAuto] = useState(true)
  const intervalRef = useRef(null)

  // Auto replay loop
  useEffect(() => {
    if (!auto) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase(6) // jump to end, no animation
      setProgress(100)
      return
    }

    let p = 0
    const tick = () => {
      p = (p + 1) % 7 // 0..6
      setPhase(p)
      if (p >= 2 && p <= 5) {
        setProgress(stages[p - 2].pct)
      } else if (p === 6) {
        setProgress(100)
      } else if (p === 0) {
        setProgress(0)
      }
    }

    // initial
    tick()
    intervalRef.current = setInterval(tick, 1800)
    return () => clearInterval(intervalRef.current)
  }, [auto])

  // GSAP reveal for section
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let mm
    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      const ctx = gsap.context(() => {
        mm = gsap.matchMedia()
        mm.add('(min-width: 768px)', () => {
          gsap.fromTo('.demo-phone',
            { opacity: 0, y: 20, scale: 0.98 },
            {
              opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out',
              scrollTrigger: { trigger: '.demo-section', start: 'top 75%' }
            }
          )
          gsap.fromTo('.demo-text > *',
            { opacity: 0, y: 16 },
            {
              opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out',
              scrollTrigger: { trigger: '.demo-section', start: 'top 75%' }
            }
          )
        })
        mm.add('(max-width: 767px)', () => {
          gsap.utils.toArray('.demo-phone, .demo-text > *').forEach((el) => {
            gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, scrollTrigger: { trigger: el, start: 'top 92%' } })
          })
        })
      })
      return () => ctx.revert()
    })()
    return () => mm?.revert()
  }, [])

  const showFile = phase >= 1
  const showMenu = phase >= 1
  const showProcessing = phase >= 2 && phase <= 5
  const showNotes = phase >= 6

  return (
    <section id="demo" className="demo-section relative py-16 sm:py-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 end-10 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
        <div className="absolute bottom-10 start-10 h-72 w-72 rounded-full bg-accent/8 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-12 items-center">
          {/* Text */}
          <div className="demo-text order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 glass rounded-pill px-3 py-1.5 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              دموی زنده — شبیه‌سازی چت واقعی
            </span>
            <h2 className="mt-4 font-display text-[1.9rem] sm:text-[2.4rem] leading-[1.05] tracking-tight">
              ببین ربات <span className="text-gradient">دقیقاً چه می‌کند</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/60">
              یک پیام وضعیتِ واحد که در هر مرحله ویرایش می‌شود — بدون اسپم. نوار پیشرفتِ واقعی، تقسیم خودکار برای محدودیت تلگرام، و تحویل رونوشت حتی اگر ساخت جزوه خطا بخورد.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <span className="glass rounded-pill px-3 py-1.5 text-white/60">یک پیام = یک نوار</span>
              <span className="glass rounded-pill px-3 py-1.5 text-white/60">ویرایش زنده</span>
              <span className="glass rounded-pill px-3 py-1.5 text-white/60">تقسیم خودکار</span>
            </div>

            <ul className="mt-6 space-y-2.5 text-sm">
              {[
                'منوی شیشه‌ای: ساخت جزوه / راهنما / قالب‌ها / حریم خصوصی',
                'مراحل: آماده‌سازی → STT فارسی → ساختاردهی → ارسال',
                'جزوه‌ی طولانی به چند بخش تقسیم می‌شود',
                'در خطا، رونوشت خام همچنان ارسال می‌شود',
              ].map((t) => (
                <li key={t} className="flex gap-2 text-white/70">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  <span className="leading-6">{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={tgLink('demo')} target="_blank" rel="noopener noreferrer" onClick={() => trackCTA('demo')} className="inline-flex items-center gap-2 rounded-pill bg-gradient-primary px-6 py-3 text-sm font-medium text-white shadow-glow">
                شروع در تلگرام
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <button
                type="button"
                onClick={() => { setAuto((v) => !v); if (!auto) setPhase(0); }}
                className="inline-flex items-center gap-2 rounded-pill glass px-6 py-3 text-sm hover:bg-white/[0.08] transition"
              >
                {auto ? '⏸ توقف انیمیشن' : '▶ پخش دوباره'}
              </button>
            </div>
            <p className="mt-3 text-xs text-white/35">انیمیشن هر ۱٫۸ ثانیه یک مرحله جلو می‌رود — برای احترام به reduced-motion متوقف می‌شود.</p>
          </div>

          {/* Phone */}
          <div className="demo-phone order-1 lg:order-2 relative mx-auto w-full max-w-[360px]">
            <PhoneFrame>
              <div className="space-y-3 flex-1">
                {/* Bot welcome */}
                <ChatBubble from="bot" time="۱۲:۴۱">
                  سلام! فایل صوتی، ویدیو یا پاورپوینت کلاس را بفرست تا جزوه‌اش را بسازم ✨
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {['ساخت جزوه','راهنما','قالب‌ها','حریم خصوصی'].map((l, i) => (
                      <span key={l} className={`rounded-full px-2.5 py-1 text-[10px] border ${i===0 ? 'bg-white text-zinc-900 border-white' : 'bg-zinc-100 text-zinc-700 border-zinc-200'}`}>{l}</span>
                    ))}
                  </div>
                </ChatBubble>

                {showFile && (
                  <ChatBubble from="user" time="۱۲:۴۲">
                    <span className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded bg-white/15 flex items-center justify-center text-[10px]">♫</span>
                      lecture_03.mp3 — ۴۲:۱۷
                    </span>
                  </ChatBubble>
                )}

                {showProcessing && (
                  <div className="glass rounded-2xl p-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5 text-white/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {stages[phase-2]?.label || 'در حال پردازش…'}
                      </span>
                      <span className="persian-digits text-white/60">{progress}٪</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-primary transition-all duration-700 ease-out will-change-[width]" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="mt-2 text-[10px] leading-4 text-white/40">یک پیام وضعیت که در هر مرحله ویرایش می‌شود — بدون اسپم</p>
                  </div>
                )}

                {showNotes && (
                  <>
                    <ChatBubble from="bot" time="۱۲:۴۶">
                      <span className="font-medium">جزوه ساختاریافته — بخش ۱/۲ ✅</span>
                      <span className="mt-1 block text-zinc-600">مقدمه، سرفصل‌ها، خلاصه‌ی هر بخش با نکات کلیدی…</span>
                    </ChatBubble>
                    <ChatBubble from="bot" time="۱۲:۴۶">
                      <span className="font-medium">جزوه ساختاریافته — بخش ۲/۲</span>
                      <span className="mt-1 block text-zinc-600">ادامه‌ی جزوه + جمع‌بندی و سوالات پیشنهادی برای مرور.</span>
                    </ChatBubble>
                    <div className="rounded-2xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] leading-5 text-amber-900">
                      نکته: پیام‌های طولانی برای رعایت محدودیت تلگرام به چند بخش تقسیم شد. اگر ساخت جزوه خطا بخورد، رونوشت خام همین‌جا ارسال می‌شود.
                    </div>
                  </>
                )}
              </div>

              {/* Input bar */}
              <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3">
                <span className="flex-1 rounded-full bg-white text-zinc-500 px-3 py-2 text-xs">پیام…</span>
                <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">↑</span>
              </div>
            </PhoneFrame>

            <p className="mt-3 text-center text-[11px] text-white/30">شبیه‌سازی — پیام واقعی ربات دقیقاً همین جریان را دارد</p>
          </div>
        </div>
      </div>
    </section>
  )
}
