import { BOT_HANDLE, tgLink, sitePath } from '../lib/constants'
import { trackCTA } from '../lib/track'
import IsolatedText from './IsolatedText'

export default function Footer() {
  const persianYear = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    timeZone: 'Asia/Tehran',
  }).format(new Date())

  return (
    <footer className="footer product-tile product-tile-light border-t border-white/5 py-10 pb-24 md:pb-10">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 justify-between">
          <div>
            <a href="#" className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center font-display text-sm">گ</span>
              <span className="font-display text-[17px]">گاماس</span>
              <bdi dir="ltr" lang="en" className="text-xs text-white/40">Gamas Bot</bdi>
            </a>
            <p className="mt-3 max-w-[42ch] text-xs leading-6 text-white/45">
              دستیار تلگرامی فارسیِ جزوه‌ساز — ویس، ویدیو و پاورپوینت را به جزوه‌ی ساختاریافته تبدیل می‌کند. منبع بات: <bdi lang="en">GitHub</bdi>.
            </p>
            <p className="mt-3 text-[11px] leading-5 text-white/25" suppressHydrationWarning>
              © {persianYear} گاماس.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div>
              <p className="font-semibold text-white/70">لینک‌ها</p>
              <ul className="mt-3 space-y-2 text-white/45">
                <li><a href="#features" className="hover:text-white transition">ویژگی‌ها</a></li>
                <li><a href="#how" className="hover:text-white transition">نحوه کار</a></li>
                <li><a href="#faq" className="hover:text-white transition">سوالات</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white/70">حریم خصوصی</p>
              <ul className="mt-3 space-y-2 text-white/45">
                <li><a href="#privacy" className="hover:text-white transition">حریم خصوصی و محدودیت‌ها</a></li>
                <li><a href="https://github.com/AmiraliGhamkhar/Gamas_bot" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">سورس بات</a></li>
                <li><a href={sitePath('sitemap.xml')} className="hover:text-white transition"><bdi lang="en">Sitemap</bdi></a></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="font-semibold text-white/70">شروع</p>
              <div className="mt-3 flex flex-col gap-2">
                <a href={tgLink('footer')} target="_blank" rel="noopener noreferrer" onClick={() => trackCTA('footer')} className="button-primary inline-flex items-center justify-center gap-2 rounded-pill bg-primary px-4 py-2 text-xs font-semibold text-white ">
                  شروع در تلگرام
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href={tgLink('footer')} target="_blank" rel="noopener noreferrer" className="text-center text-[11px] text-white/30" dir="ltr">
                  <bdi dir="ltr">{BOT_HANDLE}</bdi>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5 pt-6 text-[11px] leading-5 text-white/25">
          <p><IsolatedText>ساخته شده با Vite + React + Tailwind + GSAP — بدون Node در پروداکشن.</IsolatedText></p>
          <p className="flex items-center gap-2">
            <span>فارسی ۰۱۲۳۴۵۶۷۸۹</span>
            <span>·</span>
            <span><bdi dir="ltr" lang="en">RTL</bdi></span>
            <span>·</span>
            <span>زمینه تیره</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
