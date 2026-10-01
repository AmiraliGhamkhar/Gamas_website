import { useRef, useState } from 'react'
import { BOT_HANDLE, tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'

const footerLinks = [
  { href: '#how', label: 'چطور کار می‌کند' },
  { href: '#features', label: 'فرمت‌ها' },
  { href: '#faq', label: 'پرسش‌های رایج' },
  { href: '#privacy', label: 'حریم خصوصی' },
]

export default function Footer() {
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef(null)

  const copyHandle = async (e) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(BOT_HANDLE)
      setCopied(true)
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 1600)
    } catch {}
  }

  const persianYear = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    timeZone: 'Asia/Tehran',
  }).format(new Date())

  return (
    <footer className="footer product-tile product-tile-light">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          <div>
            <a href="#" className="flex min-h-11 items-center gap-2.5" aria-label="گاماس — صفحه اصلی">
              <span className="flex h-8 w-8 items-center justify-center rounded-11 bg-ink font-display text-sm leading-none text-canvas">گ</span>
              <span className="text-[17px] font-semibold">گاماس</span>
            </a>
            <p className="mt-4 max-w-[34ch] text-sm text-muted">
              فایل کلاس را می‌فرستی؛ جزوه را در تلگرام می‌گیری.
            </p>
            <p className="mt-4 text-xs text-ink-subtle" suppressHydrationWarning>
              © {persianYear} گاماس
            </p>
          </div>

          <nav aria-label="پیوندهای فوتر" className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold">لینک‌ها</p>
              <ul className="mt-4 flex flex-col items-start gap-1 text-sm text-muted">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="inline-link link-underline">{link.label}</a>
                  </li>
                ))}
                <li>
                  <a href="https://github.com/AmiraliGhamkhar/Gamas_bot" target="_blank" rel="noopener noreferrer" className="inline-link link-underline">
                    سورس ربات
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold">شروع</p>
              <div className="mt-4 flex flex-col items-start gap-3">
                <a
                  href={tgLink('footer')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCTA('footer')}
                  className="button-primary items-center px-5 py-2.5 text-sm"
                >
                  شروع در تلگرام
                </a>
                <button
                  type="button"
                  onClick={copyHandle}
                  className={`copy-handle text-xs ${copied ? 'is-copied' : 'text-ink-subtle'}`}
                  aria-label={copied ? 'کپی شد' : 'کپی آیدی تلگرام'}
                >
                  <bdi dir="ltr">{copied ? 'کپی شد ✓' : BOT_HANDLE}</bdi>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  )
}
