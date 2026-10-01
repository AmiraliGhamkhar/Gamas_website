import { useEffect, useRef, useState } from 'react'
import { BOT_HANDLE, tgLink, toFa } from '../lib/constants'
import { trackCTA } from '../lib/track'

const stages = [
  { label: 'آماده‌سازی صدا', pct: 18 },
  { label: 'تبدیل گفتار فارسی', pct: 48 },
  { label: 'ساختاردهی جزوه', pct: 82 },
  { label: 'تقسیم و ارسال', pct: 100 },
]

const END_PHASE = 6

function PhoneFrame({ children }) {
  return (
    <div className="overflow-hidden rounded-18 border border-dark bg-surface-dark">
      <div className="flex items-center justify-between border-b border-dark px-4 py-2.5 text-xs text-on-dark-subtle">
        <span className="text-on-dark">گاماس</span>
        <bdi dir="ltr" className="hidden sm:inline">{BOT_HANDLE}</bdi>
      </div>
      <div className="flex min-h-[480px] flex-col p-3 sm:p-4">{children}</div>
    </div>
  )
}

function ChatBubble({ from, time, children }) {
  const isUser = from === 'user'
  return (
    <div className={`flex ${isUser ? 'chat-row-user' : 'chat-row-bot'}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-6 ${
          isUser
            ? 'chat-bubble-user bg-primary text-white'
            : 'chat-bubble-bot bg-white text-zinc-900'
        }`}
      >
        {children}
        {time && <div className={`mt-1 text-[10px] ${isUser ? 'text-white' : 'text-zinc-500'}`}>{time}</div>}
      </div>
    </div>
  )
}

export default function BotDemo() {
  const [phase, setPhase] = useState(0)
  const [progress, setProgress] = useState(0)
  const [auto, setAuto] = useState(true)
  const [userStarted, setUserStarted] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!auto) return undefined

    // With reduced motion we show the finished state instead of animating.
    if (
      !userStarted &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setPhase(END_PHASE)
      setProgress(100)
      setAuto(false)
      return undefined
    }

    let step = 0
    const tick = () => {
      step = (step + 1) % (END_PHASE + 1)
      setPhase(step)
      if (step >= 2 && step <= 5) setProgress(stages[step - 2].pct)
      else if (step === END_PHASE) setProgress(100)
      else setProgress(0)
    }

    tick()
    intervalRef.current = setInterval(tick, 1900)
    return () => clearInterval(intervalRef.current)
  }, [auto, userStarted])

  const showFile = phase >= 1
  const showProcessing = phase >= 2 && phase <= 5
  const showNotes = phase === END_PHASE

  return (
    <section id="demo" className="product-tile product-tile-dark">
      <div className="mx-auto grid max-w-content items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
        <div>
          <h2>همین اتفاق می‌افتد.</h2>
          <p className="mt-5 max-w-[34ch] text-on-dark-muted">یک پیام، مرحله به مرحبه.</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={tgLink('demo')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA('demo')}
              className="button-primary inline-flex items-center gap-2 px-6 py-3 text-sm"
            >
              شروع در تلگرام
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <button
              type="button"
              onClick={() => {
                if (!auto) {
                  setUserStarted(true)
                  setPhase(0)
                  setProgress(0)
                }
                setAuto((value) => !value)
              }}
              className="button-secondary-pill inline-flex items-center px-6 py-3 text-sm"
            >
              {auto ? 'توقف پخش' : 'پخش دوباره'}
            </button>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-[340px]">
          <PhoneFrame>
            <div className="flex flex-1 flex-col gap-3">
              <ChatBubble from="bot" time="۱۲:۴۱">فایل کلاست را بفرست.</ChatBubble>

              {showFile && (
                <ChatBubble from="user" time="۱۲:۴۲">
                  <bdi dir="ltr">lecture_03.mp3</bdi> — ۴۲:۱۷
                </ChatBubble>
              )}

              {showProcessing && (
                <div className="chat-row-bot flex">
                  <div className="max-w-[86%] rounded-2xl bg-white px-3.5 py-3 text-zinc-900">
                    <div className="flex items-center justify-between text-xs">
                      <span>{stages[phase - 2]?.label || 'در حال پردازش…'}</span>
                      <span className="persian-digits text-zinc-500">{toFa(progress)}٪</span>
                    </div>
                    <div
                      className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200"
                      role="progressbar"
                      aria-label="پیشرفت ساخت جزوه"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={progress}
                    >
                      <div
                        className="h-full bg-primary transition-all duration-700 ease-out will-change-[width]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {showNotes && (
                <>
                  <ChatBubble from="bot" time="۱۲:۴۶">
                    <span className="font-semibold">جزوه — بخش ۱/۲</span>
                    <span className="mt-1 block text-zinc-600">مقدمه، سرفصل‌ها و نکته‌های کلیدی.</span>
                  </ChatBubble>
                  <ChatBubble from="bot" time="۱۲:۴۶">
                    <span className="font-semibold">جزوه — بخش ۲/۲</span>
                    <span className="mt-1 block text-zinc-600">جمع‌بندی و پرسش‌های مرور.</span>
                  </ChatBubble>
                </>
              )}
            </div>
          </PhoneFrame>
          <figcaption className="mt-4 text-center text-xs text-on-dark-subtle">
            شبیه‌سازی — ربات در تلگرام
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
