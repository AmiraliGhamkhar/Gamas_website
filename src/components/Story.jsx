import { BOT_HANDLE, tgLink, toFa } from '../lib/constants'
import IsolatedText from './IsolatedText'
import { trackCTA } from '../lib/track'

export default function Story() {
  return (
    <section id="story" className="product-tile product-tile-dark relative overflow-hidden">
      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2>
            از تکرارِ یک ویس خسته‌ای
            <span className="block text-primary-emphasis">ماشین، جزوه می‌سازد</span>
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-on-dark-muted">
            کلاس ۹۰ دقیقه‌ای نباید ۳ ساعت وقتت را بگیرد.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-4 lg:gap-5 items-start">
          {/* Before */}
          <div className="hover-lift store-utility-card surface-card rounded-18 p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs">✕</span>
              <span className="text-xs font-semibold text-on-dark-muted">قبل — ساعت‌ها اتلاف</span>
            </div>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                '۲ تا ۳ بار بازپخش هر کلاس',
                'یادداشت‌های ناقص و نامرتب',
                'اسلاید و صدای استاد از هم جدا',
              ].map((text) => (
                <li key={text} className="flex items-center gap-3 text-on-dark">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/30 shrink-0" />
                  <span><IsolatedText>{text}</IsolatedText></span>
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="hover-lift store-utility-card surface-card rounded-18 p-6 sm:p-7 border-primary-emphasis">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs text-white">✓</span>
              <span className="text-xs font-semibold text-primary-emphasis">بعد — بفرست، تحویل بگیر</span>
            </div>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                'ویس، ویدیو و پاورپوینت، همه‌جا',
                'یک پیام وضعیت با نوار پیشرفت زنده',
                'رونوشت خام حتی اگر خطا بخورد',
              ].map((text) => (
                <li key={text} className="flex items-center gap-3 text-on-dark">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span><IsolatedText>{text}</IsolatedText></span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-on-dark-muted">
            به <bdi dir="ltr" className="text-on-dark">{BOT_HANDLE}</bdi> بفرست؛ بقیه‌اش با گاماس.
          </p>
          <a
            href={tgLink('story')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('story')}
            className="button-primary inline-flex items-center gap-2 rounded-pill bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            همین حالا امتحان کن
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <p className="text-xs text-on-dark-subtle persian-digits">
            {toFa(3)} مرحله، چند دقیقه
          </p>
        </div>
      </div>
    </section>
  )
}
