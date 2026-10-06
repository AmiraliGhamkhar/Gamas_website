import { useRef, useState } from 'react'
import Icon from './Icon'
import { BOT_HANDLE, sitePath, tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'

const footerLinks = [
  { href: '#how', label: 'چطور کار می‌کند' },
  { href: '#features', label: 'قابلیت‌ها' },
  { href: '#faq', label: 'پرسش‌های رایج' },
  { href: '#privacy', label: 'حریم خصوصی' },
]

export default function Footer() {
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef(null)

  const copyHandle = async (event) => {
    event.preventDefault()
    try {
      await navigator.clipboard.writeText(BOT_HANDLE)
      setCopied(true)
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const persianYear = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    timeZone: 'Asia/Tehran',
  }).format(new Date())

  return (
    <footer className="footer product-tile product-tile-light">
      <div className="container footer-layout">
        <div className="footer-brand-block">
          <a href="#top" className="brand-link" aria-label="گاماس — صفحه‌ی اصلی">
            <img src={sitePath('logo-mark.svg')} alt="" width="42" height="42" className="brand-mark" />
            <span className="brand-name">گاماس</span>
          </a>
          <p>از صدای کلاس، جزوه‌ای که می‌شود خواند.</p>
          <span className="footer-copyright" suppressHydrationWarning>© {persianYear} گاماس</span>
        </div>

        <nav aria-label="پیوندهای فوتر" className="footer-nav">
          <div>
            <h2>بیشتر بدان</h2>
            <ul>
              {footerLinks.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}
              <li><a href="https://github.com/AmiraliGhamkhar/Gamas_bot" target="_blank" rel="noopener noreferrer">سورس ربات</a></li>
            </ul>
          </div>
          <div className="footer-start">
            <h2>شروع کن</h2>
            <a
              href={tgLink('footer')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA('footer')}
              className="button-primary footer-cta"
            >
              <Icon name="telegram" size={17} />
              باز کردن ربات تلگرام
            </a>
            <button
              type="button"
              onClick={copyHandle}
              className={`copy-handle ${copied ? 'is-copied' : ''}`}
              aria-label={copied ? 'کپی شد' : 'کپی آیدی تلگرام'}
            >
              <bdi dir="ltr">{copied ? 'کپی شد ✓' : BOT_HANDLE}</bdi>
            </button>
          </div>
        </nav>
      </div>
    </footer>
  )
}
