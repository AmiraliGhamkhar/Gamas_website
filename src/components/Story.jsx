import { tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'

const inputs = [
  'ویس یا ویدیو',
  'پاورپوینت کلاس',
]

const outputs = [
  'رونوشت فارسی',
  'متن و اسلاید کنار هم',
  'جزوه در چند پیام',
]

function Column({ label, items }) {
  return (
    <div className="border-t border-subtle">
      <p className="mt-6 text-sm font-semibold">{label}</p>
      <ul className="mt-1">
        {items.map((item) => (
          <li key={item} className="flex gap-3 border-t border-subtle py-4 text-sm text-muted">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-subtle" aria-hidden="true" />
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
          <h2>از فایل تا جزوه.</h2>
          <p className="mt-5 text-muted">فایل کلاس را می‌فرستی؛ متن و اسلایدها کنار هم می‌آیند.</p>
        </div>

        <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
          <Column label="می‌فرستی" items={inputs} />
          <Column label="تحویل می‌گیری" items={outputs} />
        </div>

        <a
          href={tgLink('story')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCTA('story')}
          className="link-underline mt-10 text-sm font-semibold"
        >
          امتحانش کن
        </a>
      </div>
    </section>
  )
}
