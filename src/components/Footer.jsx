import { useRef, useState } from 'react'
import { BOT_HANDLE, tgLink, sitePath } from '../lib/constants'
import { trackCTA } from '../lib/track'

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
    <footer className="footer product-tile product-tile-light border-t border-subtle py-10 pb-24 md:pb-10">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row">
          <div>
            <a href="#" className="flex items-center gap-3" aria-label="گاماس — صفحه اصلی">
              <span className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center font-display text-sm text-white">گ</span>
              <span className="font-display text-[17px]">گاماس</span>
              <bdi dir="ltr" lang="en" className="text-xs text-ink-subtle">Gamas Bot</bdi>
            </a>
            <p className="mt-3 max-w-[38ch] text-xs leading-6 text-ink-muted">
              ویس، ویدیو و پاورپوینت کلاست را به جزوه تبدیل کن — داخل تلگرام.
            </p>
            <p className="mt-3 text-[11px] leading-5 text-ink-subtle" suppressHydrationWarning>
              © {persianYear} گاماس.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-xs sm:grid-cols-3">
            <div>
              <p className="font-semibold text-ink">لینک‌ها</p>
              <ul className="mt-3 space-y-2 text-ink-muted">
                <li><a href="#features" className="link-underline">ویژگی‌ها</a></li>
                <li><a href="#how" className="link-underline">نحوه کار</a></li>
                <li><a href="#faq" className="link-underline">پرسش‌ها</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-ink">حریم خصوصی</p>
              <ul className="mt-3 space-y-2 text-ink-muted">
                <li><a href="#privacy" className="link-underline">حریم خصوصی</a></li>
                <li><a href="https://github.com/AmiraliGhamkhar/Gamas_bot" target="_blank" rel="noopener noreferrer" className="link-underline">سورس بات</a></li>
                <li><a href={sitePath('sitemap.xml')} className="link-underline"><bdi lang="en">Sitemap</bdi></a></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="font-semibold text-ink">شروع</p>
              <div className="mt-3 flex flex-col gap-2">
                <a href={tgLink('footer')} target="_blank" rel="noopener noreferrer" onClick={() => trackCTA('footer')} className="button-primary inline-flex items-center justify-center gap-2 rounded-pill bg-primary px-4 py-2 text-xs font-semibold text-white">
                  شروع در تلگرام
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <button
                  type="button"
                  onClick={copyHandle}
                  className={`copy-handle text-center text-[11px] ${copied ? 'is-copied' : 'text-ink-subtle'}`}
                  aria-label={copied ? 'کپی شد' : 'کپی آیدی تلگرام'}
                >
                  <bdi dir="ltr">{copied ? 'کپی شد ✓' : BOT_HANDLE}</bdi>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-subtle pt-6 text-[11px] leading-5 text-ink-subtle sm:flex-row">
          <p>ساخته‌شده با Vite + React — بدون Node روی سرور.</p>
          <p className="flex items-center gap-2">
            <span>فارسی · RTL</span>
            <span>·</span>
            <span>Paper &amp; Indigo</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
