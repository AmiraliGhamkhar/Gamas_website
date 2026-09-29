import { BOT_HANDLE } from '../lib/constants'
import IsolatedText from './IsolatedText'

const steps = [
  {
    n: '۰۱',
    title: 'بفرست',
    desc: `فایل را به ${BOT_HANDLE} بفرست — تا ۲ گیگابایت.`,
    icon: '↑',
  },
  {
    n: '۰۲',
    title: 'رونویسی',
    desc: 'صدا با موتور گفتار فارسی متن می‌شود.',
    icon: '◑',
  },
  {
    n: '۰۳',
    title: 'ساختاردهی',
    desc: 'رونوشت و اسلایدها به جزوه‌ی مرتب تبدیل می‌شوند.',
    icon: '≡',
  },
  {
    n: '۰۴',
    title: 'بگیر',
    desc: 'جزوه در چت تحویل داده می‌شود — تقسیم خودکار.',
    icon: '✓',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="product-tile product-tile-light relative">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2>
            از ارسال تا <span className="text-primary-emphasis">دریافت جزوه</span>
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-ink-muted">
            چهار قدم — بدون نصب هیچ چیزی.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((s) => (
            <div key={s.n} className="hover-lift store-utility-card group relative surface-card rounded-18 p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm shrink-0 text-white">
                  {s.icon}
                </span>
                <span className="persian-digits text-xs font-semibold text-ink-subtle">{s.n}</span>
              </div>
              <h3 className="mt-4 font-display text-[16px]">{s.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-muted">
                {s.desc.split(BOT_HANDLE).map((part, index) => (
                  <span key={`${s.n}-${index}`}>
                    {index > 0 && <bdi dir="ltr">{BOT_HANDLE}</bdi>}
                    <IsolatedText>{part}</IsolatedText>
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-6 text-ink-subtle">
          برای ساخت جزوه، صدا به سرویس‌های گفتار و زبان خارجی می‌رود — جزئیات در <a href="#privacy" className="link-underline underline-offset-4">حریم خصوصی</a>.
        </p>
      </div>
    </section>
  )
}
