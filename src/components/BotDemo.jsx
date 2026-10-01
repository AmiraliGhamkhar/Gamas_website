import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import IsolatedText from './IsolatedText'
import { BOT_HANDLE, tgLink, toFa } from '../lib/constants'
import { trackCTA } from '../lib/track'

const stages = [
  { label: 'آماده‌سازی صدا', pct: 18 },
  { label: 'رونویسی گفتار', pct: 48 },
  { label: 'ساخت جزوه', pct: 82 },
  { label: 'ارسال نتیجه', pct: 100 },
]

const END_PHASE = 6
const waveformBars = [30, 55, 38, 82, 45, 65, 34, 78, 48, 92, 36, 64, 43, 75, 32, 55, 40, 68]

function ChatBubble({ from, children, className = '' }) {
  const isUser = from === 'user'
  return (
    <div className={`chat-row ${isUser ? 'chat-row-user' : 'chat-row-bot'}`}>
      <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'} ${className}`}>
        {children}
      </div>
    </div>
  )
}

function PhoneFrame({ children }) {
  return (
    <div className="demo-phone-shell">
      <div className="demo-phone-camera" aria-hidden="true" />
      <div className="demo-phone-screen">
        <div className="demo-chat-topbar">
          <span className="demo-back-arrow" aria-hidden="true">‹</span>
          <span className="demo-bot-avatar"><Icon name="sparkles" size={19} /></span>
          <span className="demo-chat-title">
            <strong>گاماس</strong>
            <small><bdi dir="ltr">{BOT_HANDLE}</bdi></small>
          </span>
          <span className="demo-menu-dots" aria-hidden="true">•••</span>
        </div>
        <div className="demo-chat-content">{children}</div>
        <div className="demo-input-bar" aria-hidden="true">
          <span>پیام خود را بنویسید…</span>
          <span className="demo-input-mic"><Icon name="microphone" size={17} /></span>
        </div>
      </div>
    </div>
  )
}

export default function BotDemo() {
  const [phase, setPhase] = useState(1)
  const [progress, setProgress] = useState(0)
  const [auto, setAuto] = useState(true)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!auto) return undefined

    if (
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
      if (step >= 2 && step <= 5) setProgress(stages[Math.min(step - 2, stages.length - 1)].pct)
      else if (step === END_PHASE) setProgress(100)
      else setProgress(0)
    }

    tick()
    intervalRef.current = setInterval(tick, 1850)
    return () => clearInterval(intervalRef.current)
  }, [auto])

  const showFile = phase >= 1
  const showProcessing = phase >= 2 && phase <= 5
  const showNotes = phase === END_PHASE
  const activeStage = stages[Math.min(Math.max(phase - 2, 0), stages.length - 1)]

  const replay = () => {
    if (!auto) {
      setPhase(0)
      setProgress(0)
    }
    setAuto((value) => !value)
  }

  return (
    <section id="demo" className="product-tile product-tile-dark demo-section">
      <div className="demo-backdrop-glow demo-backdrop-glow-one" aria-hidden="true" />
      <div className="demo-backdrop-glow demo-backdrop-glow-two" aria-hidden="true" />
      <div className="container demo-layout">
        <div className="demo-copy">
          <p className="section-eyebrow section-eyebrow-light"><span className="live-dot" /> پیش‌نمایش تعاملی</p>
          <h2 className="section-title">یک پیام. سه قدم. جزوه‌ی آماده.</h2>
          <p className="section-description">
            فایل کلاس را در تلگرام می‌فرستی؛ گاماس وضعیت پردازش را نشان می‌دهد و وقتی آماده شد، جزوه را همان‌جا تحویل می‌گیری.
          </p>

          <div className="demo-flow-list" aria-label="مراحل کار">
            <span><b>۱</b> ارسال فایل</span>
            <span><b>۲</b> پردازش هوشمند</span>
            <span><b>۳</b> دریافت جزوه</span>
          </div>

          <div className="demo-actions">
            <a
              href={tgLink('demo')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA('demo')}
              className="button-primary demo-primary-cta"
            >
              <Icon name="telegram" size={20} />
              امتحان در تلگرام
              <Icon name="arrow-left" size={18} className="cta-arrow" />
            </a>
            <button
              type="button"
              onClick={replay}
              aria-pressed={!auto}
              className="button-secondary-pill demo-replay-button"
            >
              <span className={`replay-symbol ${auto ? 'is-playing' : ''}`} aria-hidden="true">{auto ? 'Ⅱ' : '↻'}</span>
              {auto ? 'توقف نمایش' : 'نمایش دوباره'}
            </button>
          </div>
        </div>

        <figure className="demo-preview">
          <div className="demo-preview-orbit demo-preview-orbit-one" aria-hidden="true" />
          <div className="demo-preview-orbit demo-preview-orbit-two" aria-hidden="true" />
          <PhoneFrame>
            <div className="demo-day-tag">امروز</div>
            <div className="demo-chat-messages" aria-live="polite" aria-atomic="false">
              <ChatBubble from="bot" className="demo-greeting">
                <span>سلام! 👋</span>
                <small>فایل کلاس را بفرست تا جزوه‌ی مرتبش را بسازم.</small>
              </ChatBubble>

              {showFile && (
                <ChatBubble from="user" className="demo-file-bubble">
                  <span className="file-type-icon"><Icon name="audio" size={20} /></span>
                  <span className="file-info">
                    <strong><IsolatedText>جلسه_زیست_۱۱.mp3</IsolatedText></strong>
                    <small>۲۴٫۶ مگابایت · صوت</small>
                  </span>
                  <span className="file-waveform" aria-hidden="true">
                    {waveformBars.map((height, index) => <i key={`${height}-${index}`} style={{ '--bar-height': `${height}%` }} />)}
                  </span>
                </ChatBubble>
              )}

              {showProcessing && (
                <ChatBubble from="bot" className="demo-progress-bubble">
                  <div className="demo-progress-heading">
                    <span className="progress-orb"><Icon name="sparkles" size={15} /></span>
                    <span>{activeStage.label}</span>
                    <bdi dir="ltr" className="progress-percent">{toFa(progress)}٪</bdi>
                  </div>
                  <div
                    className="demo-progress-track"
                    role="progressbar"
                    aria-label="پیشرفت ساخت جزوه"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                  >
                    <span className="demo-progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <small className="demo-progress-caption">داریم نکته‌ها را از دل کلاس بیرون می‌کشیم…</small>
                </ChatBubble>
              )}

              {showNotes && (
                <>
                  <ChatBubble from="bot" className="demo-success-note">
                    <div className="note-topline">
                      <span className="note-success-icon"><Icon name="check" size={15} /></span>
                      <strong>جزوه‌ات آماده شد!</strong>
                    </div>
                    <div className="note-paper">
                      <span className="note-paper-label"><Icon name="notes" size={14} /> خلاصه‌ی جلسه</span>
                      <strong>زیست‌شناسی · فصل یازدهم</strong>
                      <span className="note-line note-line-long" />
                      <span className="note-line note-line-medium" />
                      <span className="note-bullet"><i /> نکته‌های کلیدی و تعاریف</span>
                      <span className="note-bullet"><i /> پرسش‌های مرور سریع</span>
                    </div>
                    <small className="demo-note-timestamp">همین حالا</small>
                  </ChatBubble>
                  <ChatBubble from="bot" className="demo-next-message">
                    نسخه‌ی کامل جزوه و رونوشت فارسی را از همین‌جا ببین.
                  </ChatBubble>
                </>
              )}
            </div>
          </PhoneFrame>
          <figcaption className="demo-caption"><Icon name="sparkles" size={15} /> نمونه‌ی نمایشی از گفت‌وگوی گاماس</figcaption>
        </figure>
      </div>
    </section>
  )
}
