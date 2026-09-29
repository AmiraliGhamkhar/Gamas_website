import { useEffect, useRef, useState } from 'react'
import { BOT_HANDLE, tgLink, toFa } from '../lib/constants'
import IsolatedText from './IsolatedText'
import { trackCTA } from '../lib/track'

const stages = [
  { label: 'آماده‌سازی صدا', pct: 18 },
  { label: 'تبدیل گفتار فارسی', pct: 48 },
  { label: 'ساختاردهی جزوه', pct: 82 },
  { label: 'تقسیم و ارسال', pct: 100 },
]

function PhoneFrame({ children }) {
  return (
    <div className="relative rounded-18 border border-white/10 bg-surface p-2.5 sm:p-3">
      <div className="rounded-18 bg-tile-dark border border-white/10 overflow-hidden">
        <div className="h-8 flex items-center justify-between px-4 border-b border-white/5 bg-white/[0.03]">
          <span className="flex items-center gap-2 text-[11px] text-white/70">
            <span className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white">گ</span>
            گاماس
            <bdi dir="ltr" className="hidden text-white/30 sm:inline">• {BOT_HANDLE}</bdi>
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
    <div className={`flex ${isUser ? 'chat-row-user' : 'chat-row-bot'}`}>
      <div className={`chat-bubble max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-5 ${isUser ? 'chat-bubble-user bg-primary text-white' : 'chat-bubble-bot bg-white text-zinc-900'}`}>
        <div>{children}</div>
        {time && <div className={`mt-1 text-[10px] text-start ${isUser ? 'text-white/70' : 'text-zinc-500'}`}>{time}</div>}
      </div>
    </div>
  )
}

export default function BotDemo() {
  const [phase, setPhase] = useState(0) // 0 idle, 1.. stages + messages, then loop
  const [progress, setProgress] = useState(0)
  const [auto, setAuto] = useState(true)
  const [userStarted, setUserStarted] = useState(false)
  const intervalRef = useRef(null)

  // Auto replay loop
  useEffect(() => {
    if (!auto) return
    if (
      !userStarted &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setPhase(6) // jump to end, no animation unless explicitly started by user
      setProgress(100)
      setAuto(false)
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
  }, [auto, userStarted])

  const showFile = phase >= 1
  const showProcessing = phase >= 2 && phase <= 5
  const showNotes = phase >= 6

  return (
    <section id="demo" className="product-tile product-tile-dark demo-section relative overflow-hidden">
      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-12 items-center">
          {/* Text */}
          <div className="demo-text order-2 lg:order-1">
            <h2>
              ببین ربات <span className="text-primary-emphasis">دقیقاً چه می‌کند</span>
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-on-dark-muted">
              یک پیام وضعیت که هر مرحله ویرایش می‌شود — همین.
            </p>

            <ul className="mt-6 space-y-2.5 text-sm">
              {[
                'مراحل: آماده‌سازی ← گفتار ← ساختار ← ارسال',
                'جزوه‌ی طولانی خودکار تقسیم می‌شود',
                'در خطا، رونوشت خام می‌آید',
              ].map((t) => (
                <li key={t} className="flex gap-2 text-on-dark">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span className="leading-6"><IsolatedText>{t}</IsolatedText></span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={tgLink('demo')} target="_blank" rel="noopener noreferrer" onClick={() => trackCTA('demo')} className="button-primary inline-flex items-center gap-2 rounded-pill bg-primary px-6 py-3 text-sm font-semibold text-white">
                شروع در تلگرام
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <button
                type="button"
                onClick={() => {
                  if (!auto) {
                    setUserStarted(true)
                    setPhase(0)
                    setProgress(0)
                  }
                  setAuto((v) => !v)
                }}
                className="button-secondary-pill inline-flex items-center gap-2 rounded-pill surface-card px-6 py-3 text-sm"
              >
                {auto ? '⏸ توقف' : '▶ پخش'}
              </button>
            </div>
          </div>

          {/* Phone */}
          <div className="demo-phone order-1 lg:order-2 relative mx-auto w-full max-w-[360px]">
            <PhoneFrame>
              <div className="space-y-3 flex-1">
                {/* Bot welcome */}
                <ChatBubble from="bot" time="۱۲:۴۱">
                  سلام! فایل کلاست را بفرست تا جزوه‌اش را بسازم
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
                      <bdi dir="ltr">lecture_03.mp3</bdi> — ۴۲:۱۷
                    </span>
                  </ChatBubble>
                )}

                {showProcessing && (
                  <div className="surface-card rounded-2xl p-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5 text-white/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        <IsolatedText>{stages[phase-2]?.label || 'در حال پردازش…'}</IsolatedText>
                      </span>
                      <span className="persian-digits text-white/60">{toFa(progress)}٪</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden" role="progressbar" aria-label="پیشرفت ساخت جزوه" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                      <div className="h-full bg-primary transition-all duration-700 ease-out will-change-[width]" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {showNotes && (
                  <>
                    <ChatBubble from="bot" time="۱۲:۴۶">
                      <span className="font-semibold">جزوه — بخش ۱/۲</span>
                      <span className="mt-1 block text-zinc-600">مقدمه، سرفصل‌ها و نکات کلیدی هر بخش…</span>
                    </ChatBubble>
                    <ChatBubble from="bot" time="۱۲:۴۶">
                      <span className="font-semibold">جزوه — بخش ۲/۲</span>
                      <span className="mt-1 block text-zinc-600">جمع‌بندی و پرسش‌های مرور.</span>
                    </ChatBubble>
                    <div className="rounded-2xl bg-surface-muted border border-subtle px-3 py-2 text-[11px] leading-5 text-muted">
                      پیام طولانی بود؛ برای تلگرام تقسیم شد.
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

            <p className="mt-3 text-center text-[11px] text-on-dark-subtle">شبیه‌سازی — ربات واقعی در تلگرام</p>
          </div>
        </div>
      </div>
    </section>
  )
}
