import IsolatedText from './IsolatedText'

const features = [
  {
    id: 'all-formats',
    span: 'md:col-span-2',
    icon: '◐',
    title: 'همه‌ی فرمت‌های کلاس',
    desc: 'ویس، MP3، ویدیو و پاورپوینت — PDF و ZIP نه.',
  },
  {
    id: 'slide-by-slide',
    span: 'md:col-span-1',
    icon: '▭',
    title: 'اسلاید به اسلاید',
    desc: 'هر اسلاید با متن و صدای خودش در جزوه.',
  },
  {
    id: 'live-progress',
    span: 'md:col-span-1',
    icon: '≡',
    title: 'پیشرفت زنده',
    desc: 'یک پیام که هر مرحله ویرایش می‌شود؛ بدون اسپم.',
  },
  {
    id: 'fallback',
    span: 'md:col-span-1',
    icon: '↺',
    title: 'اگر خطا خورد؟',
    desc: 'رونوشت خام همچنان تحویل داده می‌شود.',
  },
  {
    id: 'persian-stt',
    span: 'md:col-span-1',
    icon: 'فا',
    title: 'گفتار فارسی',
    desc: 'دقت به کیفیت ضبط بستگی دارد — بدون ادعای ٪.',
  },
]

export default function Bento() {
  return (
    <section id="features" className="product-tile product-tile-parchment relative">
      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2>
            یک ربات برای <span className="text-primary-emphasis">همه‌ی فرمت‌ها</span>
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-ink-muted">
            فقط فایل را بفرست؛ بقیه‌اش با گاماس.
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.id}
              className={`hover-lift group relative surface-card rounded-18 p-6 sm:p-7 ${f.span}`}
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-display shrink-0 text-white">
                  {f.icon}
                </span>
                <h3 className="font-display text-[16px] leading-6">{f.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-7 text-ink-muted"><IsolatedText>{f.desc}</IsolatedText></p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="chip">حد ۲ گیگابایت</span>
          <span className="chip"><IsolatedText>PDF / تصویر / ZIP مردود</IsolatedText></span>
          <span className="chip">ساخت جزوه / راهنما / قالب‌ها</span>
        </div>
      </div>
    </section>
  )
}
