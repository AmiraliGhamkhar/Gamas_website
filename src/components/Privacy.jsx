import { BOT_HANDLE } from '../lib/constants'
import IsolatedText from './IsolatedText'

const details = [
  'صدا و ویدیو برای رونویسی به Speechmatics یا Deepgram فرستاده می‌شود.',
  'رونوشت و اسلایدها برای ساخت جزوه به Gemini، Anthropic یا سرویس سازگار با OpenAI می‌روند.',
  'فایل موقت بعد از پردازش حذف می‌شود؛ رونوشت و جزوه ممکن است در دیتابیس بمانند.',
  'فرم این صفحه فقط ایمیل و منبع فرم را ذخیره می‌کند. ایمیل خودکار ارسال نمی‌شود.',
  'هر سرویس بیرونی سیاست خودش را دارد.'
]

export default function Privacy() {
  return (
    <section id="privacy" className="product-tile product-tile-light">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2>حریم خصوصی</h2>
          <p className="mt-5 text-muted">فایل‌ها برای پردازش به سرویس‌های لازم ارسال می‌شوند.</p>
        </div>

        <details className="disclosure mt-12 max-w-2xl">
          <summary>
            جزئیات حریم خصوصی
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="disclosure-marker">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </summary>
          <div className="disclosure-body">
            <ul className="flex flex-col gap-3">
              {details.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-subtle" aria-hidden="true" />
                  <span><IsolatedText>{item}</IsolatedText></span>
                </li>
              ))}
            </ul>
          </div>
        </details>

        <p className="mt-10 text-xs text-ink-subtle">
          سؤالی داری؟ در تلگرام از <bdi dir="ltr">{BOT_HANDLE}</bdi> بپرس.
        </p>
      </div>
    </section>
  )
}
