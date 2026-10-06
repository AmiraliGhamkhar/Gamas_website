import { useEffect, useState } from 'react'
import Icon from './Icon'
import IsolatedText from './IsolatedText'
import { BOT_HANDLE, PRODUCT, tgLink, toFa } from '../lib/constants'
import { trackCTA } from '../lib/track'

const stages = [
  { label: 'دریافت و آماده‌سازی فایل', pct: 20 },
  { label: 'پیاده‌سازی گفتار', pct: 46 },
  { label: 'مرتب‌کردن نکته‌ها', pct: 73 },
  { label: 'آماده‌کردن فایل‌های خروجی', pct: 92 },
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
  const [phase, setPhase] = useState(END_PHASE)
  const [progress, setProgress] = useState(100)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return undefined

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setPhase(END_PHASE)
      setProgress(100)
      setPlaying(false)
      return undefined
    }

    let step = 0
    let timeoutId
    const advance = () => {
      step += 1
      if (step >= END_PHASE) {
        setPhase(END_PHASE)
        setProgress(100)
        setPlaying(false)
        return
      }

      setPhase(step)
      if (step >= 2 && step <= 5) setProgress(stages[step - 2].pct)
      else setProgress(0)
      timeoutId = window.setTimeout(advance, 1500)
    }

    advance()
    return () => window.clearTimeout(timeoutId)
  }, [playing])

  const showFile = phase >= 1
  const showProcessing = phase >= 2 && phase <= 5
  const showTranscript = phase >= 4
  const showNotes = phase === END_PHASE
  const activeStage = stages[Math.min(Math.max(phase - 2, 0), stages.length - 1)]

  const replay = () => {
    if (playing) {
      setPlaying(false)
      return
    }
    setPhase(0)
    setProgress(0)
    setPlaying(true)
  }

  return (
    <section id="demo" className="product-tile product-tile-dark demo-section">
      <div className="demo-backdrop-glow demo-backdrop-glow-one" aria-hidden="true" />
      <div className="demo-backdrop-glow demo-backdrop-glow-two" aria-hidden="true" />
      <div className="container demo-layout">
        <div className="demo-copy">
          <h2 className="section-title">یک فایل؛ از گفتار تا جزوه.</h2>
          <p className="section-description">
            این پیش‌نمایش، مراحل معمول پردازش را نشان می‌دهد: دریافت فایل، تبدیل گفتار به متن و آماده‌شدن خروجی‌ها.
          </p>
          <p className="demo-disclaimer">
            {PRODUCT.demo.disclaimerFa}
          </p>

          <ol className="demo-flow-list" aria-label="مراحل نمایش داده‌شده">
            <li><b>۱</b> ارسال فایل</li>
            <li><b>۲</b> تبدیل گفتار به متن</li>
            <li><b>۳</b> دریافت خروجی</li>
          </ol>

          <div className="demo-actions">
            <a
              href={tgLink('demo')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA('demo')}
              className="button-primary demo-primary-cta"
            >
              <Icon name="telegram" size={20} />
              باز کردن ربات تلگرام
              <Icon name="arrow-left" size={18} className="cta-arrow" />
            </a>
            <button
              type="button"
              onClick={replay}
              aria-pressed={playing}
              className="button-secondary-pill demo-replay-button"
            >
              <span className={`replay-symbol ${playing ? 'is-playing' : ''}`} aria-hidden="true">{playing ? 'Ⅱ' : '↻'}</span>
              {playing ? 'توقف نمایش' : 'نمایش مراحل از ابتدا'}
            </button>
          </div>
        </div>

        <figure className="demo-preview">
          <div className="demo-preview-orbit demo-preview-orbit-one" aria-hidden="true" />
          <div className="demo-preview-orbit demo-preview-orbit-two" aria-hidden="true" />
          <PhoneFrame>
            <div className="demo-day-tag">امروز</div>
            <div className="demo-chat-messages">
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
                    {waveformBars.map((height, index) => <i key={`${height}-${index}`} className={`waveform-bar-${height}`} />)}
                  </span>
                </ChatBubble>
              )}

              {showProcessing && (
                <ChatBubble from="bot" className="demo-progress-bubble">
                  <div className="demo-progress-heading" aria-live="polite">
                    <span className="progress-orb"><Icon name="sparkles" size={15} /></span>
                    <span>{activeStage.label}</span>
                    <bdi dir="ltr" className="progress-percent">{toFa(progress)}٪</bdi>
                  </div>
                  <div
                    className="demo-progress-track"
                    role="progressbar"
                    aria-label="پیشرفت نمایشی پردازش فایل"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                    aria-valuetext={`${activeStage.label}؛ ${toFa(progress)} درصد`}
                  >
                    <span className="demo-progress-fill" data-progress={progress} />
                  </div>
                  <small className="demo-progress-caption">داریم نکته‌ها را از دل کلاس بیرون می‌کشیم…</small>
                </ChatBubble>
              )}

              {showTranscript && (
                <ChatBubble from="bot" className="demo-transcript-bubble">
                  <strong>رونوشت فارسی</strong>
                  <p>در این بخش، گفتار کلاس به متن تبدیل می‌شود تا بتوانی نکته‌ها را دوباره بخوانی.</p>
                </ChatBubble>
              )}

              {showNotes && (
                <>
                  <ChatBubble from="bot" className="demo-success-note">
                    <div className="note-topline" role="status">
                      <span className="note-success-icon"><Icon name="check" size={15} /></span>
                      <strong>جزوه‌ی نمونه آماده شد</strong>
                    </div>
                    <div className="note-paper">
                      <span className="note-paper-label"><Icon name="notes" size={14} /> خلاصه‌ی جلسه</span>
                      <strong>عنوان و موضوع‌های درس</strong>
                      <span className="note-line note-line-long" />
                      <span className="note-line note-line-medium" />
                      <span className="note-bullet"><i /> نکته‌های کلیدی و تعاریف</span>
                      <span className="note-bullet"><i /> پرسش‌های مرور سریع</span>
                    </div>
                    <small className="demo-note-timestamp">نمونه‌ی نمایشی</small>
                  </ChatBubble>
                  <ChatBubble from="bot" className="demo-next-message">
                    فایل Word جزوه و متن خام به‌صورت فایل در همین گفت‌وگو می‌رسند.
                  </ChatBubble>
                </>
              )}
            </div>
          </PhoneFrame>
          <figcaption className="demo-caption"><Icon name="sparkles" size={15} /> {PRODUCT.demo.captionFa}</figcaption>
        </figure>
      </div>
    </section>
  )
}
