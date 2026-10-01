import { BOT_HANDLE, tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'

const before = [
  'دو بار گوش دادن به هر بخش',
  'یادداشت ناقص، وسط کلاس',
  'صدا و اسلاید، جدا از هم',
]

const after = [
  'ویس، ویدیو و پاورپوینت را می‌گیرد',
  'متن و اسلاید را کنار هم می‌گذارد',
  'رونوشت را هم می‌دهد، حتی اگر خطا شود',
]

function Column({ label, items, accent }) {
  return (
    <div className="border-t border-subtle">
      <p className="mt-6 text-sm font-semibold text-ink">{label}</p>
      <ul className="mt-1">
        {items.map((item) => (
          <li key={item} className="flex gap-3 border-t border-subtle py-4 text-sm text-muted">
            <span
              className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${accent ? 'bg-primary' : 'bg-ink-subtle'}`}
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Story() {
  return (
    <section id="story" className="product-tile product-tile-light tile-rule">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2>هر کلاس، دو بار گوش داده می‌شد.</h2>
          <p className="mt-5 text-muted">حالا یک بار بفرست.</p>
        </div>

        <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
          <Column label="قبل" items={before} />
          <Column label="بعد" items={after} accent />
        </div>

        <p className="mt-12 text-sm text-muted">
          به <bdi dir="ltr">{BOT_HANDLE}</bdi> بفرست؛ بقیه‌اش با گاماس.
        </p>
        <a
          href={tgLink('story')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCTA('story')}
          className="button-primary mt-5 inline-flex items-center gap-2 px-6 py-3 text-sm"
        >
          امتحانش کن
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  )
}
