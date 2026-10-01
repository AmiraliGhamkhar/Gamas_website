import IsolatedText from './IsolatedText'

const formats = [
  { label: 'ویس', value: 'ویس تلگرام · MP3 · M4A · WAV · OGG' },
  { label: 'ویدیو', value: 'MP4 · MKV · MOV · AVI' },
  { label: 'پاورپوینت', value: 'PPTX · PPSX · POTX · PPT و ODP قدیمی' },
]

const output = [
  'هر اسلاید با متن و صدای خودش',
  'یک پیام وضعیت، بدون اسپم',
  'جزوه‌ی بلند خودکار تقسیم می‌شود',
  'اگر خطا بخورد، رونوشت خام می‌آید',
]

export default function Capabilities() {
  return (
    <section id="features" className="product-tile product-tile-parchment">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2>چه چیزی می‌گیرد.</h2>
          <p className="mt-5 text-muted">ویس، ویدیو و پاورپوینت کلاس. تا ۲ گیگابایت.</p>
        </div>

        <ul className="mt-14">
          {formats.map((format) => (
            <li key={format.label} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-subtle py-4 text-sm">
              <span className="w-24 shrink-0 font-semibold">{format.label}</span>
              <span className="text-muted"><IsolatedText>{format.value}</IsolatedText></span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-ink-subtle">
          <bdi dir="ltr" lang="en">PDF</bdi>، تصویر و <bdi dir="ltr" lang="en">ZIP</bdi> گرفته نمی‌شود.
        </p>

        <h3 className="mt-16">چه چیزی تحویل می‌دهد.</h3>
        <ul className="mt-6 grid gap-x-12 gap-y-2 sm:grid-cols-2">
          {output.map((item) => (
            <li key={item} className="flex items-center gap-3 border-t border-subtle py-4 text-sm text-muted">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
