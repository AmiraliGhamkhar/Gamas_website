import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import IsolatedText from './IsolatedText'
import TelegramCTA from './TelegramCTA'
import { BOT_HANDLE, PRODUCT, toFa } from '../lib/constants'

const stages = [
  { label: 'دریافت و آماده‌سازی فایل', pct: 20 },
  { label: 'پیاده‌سازی گفتار', pct: 46 },
  { label: 'مرتب‌کردن نکته‌ها', pct: 73 },
  { label: 'آماده‌کردن فایل‌های خروجی', pct: 92 },
]

const END_PHASE = 6
const waveformBars = [30, 55, 38, 82, 45, 65, 34, 78, 48, 92, 36, 64, 43, 75, 32, 55, 40, 68]

function ChatBubble({
  from,
  children,
  className = '',
  animated = false,
  delayed = false,
  time,
  receipt,
}) {
  const isUser = from === 'user'
  const rowClassName = [
    'chat-row',
    isUser ? 'chat-row-user' : 'chat-row-bot',
    animated && 'demo-message-enter',
    animated && delayed && 'demo-message-enter-delayed',
  ].filter(Boolean).join(' ')

  return (
    <div className={rowClassName}>
      <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'} ${className}`.trim()}>
        {children}
        {time && (
          <span className={`demo-message-meta ${isUser ? 'is-user' : ''}`} aria-hidden="true">
            <bdi dir="ltr">{time}</bdi>
            {receipt && (
              <span className={`demo-message-checks ${receipt === 'received' ? 'is-received' : ''}`}>
                {receipt === 'received' ? '✓✓' : '✓'}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  )
}

function PhoneFrame({ children, contentRef }) {
  return (
    <div className="demo-phone-shell">
      <div className="demo-phone-camera" aria-hidden="true" />
      <div className="demo-phone-screen">
        <div className="demo-chat-topbar">
          <span className="demo-back-arrow" aria-hidden="true">‹</span>
          <span className="demo-bot-avatar" aria-hidden="true"><Icon name="notes" size={19} /></span>
          <span className="demo-chat-title">
            <strong>گاماس</strong>
            <small><bdi dir="ltr">{BOT_HANDLE}</bdi></small>
          </span>
          <span className="demo-menu-dots" aria-hidden="true">•••</span>
        </div>
        <div
          id="demo-chat-content"
          ref={contentRef}
          className="demo-chat-content"
          role="region"
          aria-label="گفت‌وگوی شبیه‌سازی‌شده؛ برای دیدن همه‌ی پیام‌ها پیمایش کنید"
          tabIndex={0}
        >
          {children}
        </div>
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
  const [hasReplayed, setHasReplayed] = useState(false)
  const chatContentRef = useRef(null)

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
      timeoutId = window.setTimeout(advance, 1450)
    }

    timeoutId = window.setTimeout(advance, 420)
    return () => window.clearTimeout(timeoutId)
  }, [playing])

  useEffect(() => {
    const content = chatContentRef.current
    if (!content) return undefined

    const frame = window.requestAnimationFrame(() => {
      content.scrollTop = content.scrollHeight
    })
    return () => window.cancelAnimationFrame(frame)
  }, [phase, playing])

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
    setHasReplayed(true)
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
          <p className="demo-kicker">پیش‌نمایش فرایند</p>
          <h2 className="section-title">از فایل کلاس تا مرور دوباره.</h2>
          <p className="section-description">
            گاماس گفتار را به رونوشت فارسی تبدیل می‌کند؛ اگر ساخت جزوه موفق باشد، نکته‌ها هم در فایل Word برای مرور کنار هم می‌نشینند.
          </p>
          <p className="demo-disclaimer">
            {PRODUCT.demo.disclaimerFa}
          </p>
          <p className="demo-fallback-note">اگر ساخت جزوه انجام نشود، رونوشت خام گفتار همچنان فرستاده می‌شود.</p>

          <ol className="demo-flow-list" aria-label="مراحل نمایش داده‌شده">
            <li><b>۱</b><span>ارسال فایل</span></li>
            <li><b>۲</b><span>رونوشت فارسی</span></li>
            <li><b>۳</b><span>جزوه‌ی Word، در صورت موفقیت</span></li>
          </ol>

          <div className="demo-actions">
            <TelegramCTA placement="demo" telegramSize={20} arrowSize={18} className="demo-primary-cta" aria-label="باز کردن ربات تلگرام گاماس برای دیدن نمونه‌ی نمایشی" />
            <button
              type="button"
              onClick={replay}
              aria-pressed={playing}
              aria-controls="demo-chat-content"
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
          <PhoneFrame contentRef={chatContentRef}>
            <div className="demo-day-tag">گفت‌وگوی نمونه</div>
            <div className="demo-chat-messages">
              <ChatBubble from="bot" className="demo-greeting" time="۱۲:۴۰">
                <span>سلام، من گاماس هستم.</span>
                <small>فایل صوتی، ویدیو یا پاورپوینت کلاس را بفرست.</small>
              </ChatBubble>

              {showFile && (
                <ChatBubble
                  from="user"
                  className="demo-file-bubble"
                  time="۱۲:۴۱"
                  receipt={phase >= 2 ? 'received' : 'sent'}
                  animated={hasReplayed && phase === 1}
                >
                  <span className="file-type-icon"><Icon name="audio" size={20} /></span>
                  <span className="file-info">
                    <strong><IsolatedText>جلسه_زیست_۱۱.mp3</IsolatedText></strong>
                    <small>۲۴٫۶ مگابایت · صوت</small>
                  </span>
                  <span className="file-waveform" aria-hidden="true">
                    {waveformBars.map((height, index) => <i key={`${height}-${index}`} data-lvl={Math.min(5, Math.max(1, Math.round(height / 20)))} />)}
                  </span>
                </ChatBubble>
              )}

              {showProcessing && (
                <ChatBubble
                  from="bot"
                  className="demo-progress-bubble"
                  time="۱۲:۴۲"
                  animated={hasReplayed && phase === 2}
                >
                  <div className="demo-progress-heading" aria-live="polite">
                    <span className={`progress-orb ${playing ? 'is-processing' : ''}`}><Icon name="audio" size={15} /></span>
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
                  <small className="demo-progress-caption">در حال آماده‌سازی رونوشت و نکته‌های درس…</small>
                </ChatBubble>
              )}

              {showTranscript && (
                <ChatBubble
                  from="bot"
                  className="demo-transcript-bubble"
                  time="۱۲:۴۳"
                  animated={hasReplayed && phase === 4}
                >
                  <strong>رونوشت فارسی · TXT</strong>
                  <p>«فتوسنتز فرایندی است که طی آن، گیاهان انرژی نور را به انرژی شیمیایی تبدیل می‌کنند…»</p>
                </ChatBubble>
              )}

              {showNotes && (
                <>
                  <ChatBubble from="bot" className="demo-success-note" time="۱۲:۴۴" animated={hasReplayed && phase === END_PHASE}>
                    <div className="note-topline" role="status">
                      <span className="note-success-icon"><Icon name="check" size={15} /></span>
                      <strong>جزوه‌ی نمونه آماده شد</strong>
                    </div>
                    <div className="note-paper">
                      <span className="note-paper-label"><Icon name="notes" size={14} /> خلاصه‌ی جلسه</span>
                      <strong>زیست‌شناسی: فتوسنتز</strong>
                      <span className="note-line note-line-long" />
                      <span className="note-line note-line-medium" />
                      <span className="note-bullet"><i aria-hidden="true" /> نکته‌های کلیدی و تعاریف</span>
                      <span className="note-bullet"><i aria-hidden="true" /> پرسش‌های مرور سریع</span>
                    </div>
                  </ChatBubble>
                  <ChatBubble from="bot" className="demo-output-file-bubble" time="۱۲:۴۴" animated={hasReplayed && phase === END_PHASE}>
                    <span className="demo-output-file-icon" aria-hidden="true"><Icon name="notes" size={18} /></span>
                    <span className="demo-output-file-info">
                      <strong><IsolatedText>جزوه_زیست_۱۱.docx</IsolatedText></strong>
                      <small>فایل Word · نمونه</small>
                    </span>
                  </ChatBubble>
                  <ChatBubble from="bot" className="demo-output-file-bubble" time="۱۲:۴۵" animated={hasReplayed && phase === END_PHASE} delayed>
                    <span className="demo-output-file-icon is-transcript" aria-hidden="true"><Icon name="audio" size={18} /></span>
                    <span className="demo-output-file-info">
                      <strong><IsolatedText>رونوشت_زیست_۱۱.txt</IsolatedText></strong>
                      <small>متن خام گفتار · TXT</small>
                    </span>
                  </ChatBubble>
                </>
              )}
            </div>
          </PhoneFrame>
          <figcaption className="demo-caption"><Icon name="notes" size={15} /> {PRODUCT.demo.captionFa}</figcaption>
        </figure>
      </div>
    </section>
  )
}
