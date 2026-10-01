import { BOT_HANDLE } from '../lib/constants'
import IsolatedText from './IsolatedText'

const steps = [
  {
    n: '۰۱',
    title: 'بفرست',
    desc: `فایل را به ${BOT_HANDLE} بفرست.`,
  },
  {
    n: '۰۲',
    title: 'پردازش می‌شود',
    desc: 'صدا رونویسی می‌شود؛ متن و اسلایدها کنار هم می‌آیند.',
  },
  {
    n: '۰۳',
    title: 'تحویل بگیر',
    desc: 'جزوه و رونوشت در چت می‌آیند.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="product-tile product-tile-light">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2>سه قدم ساده.</h2>
          <p className="mt-5 text-muted">فقط در تلگرام.</p>
        </div>

        <ol className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n} className="border-t border-subtle pt-6">
              <span className="persian-digits text-xs text-ink-subtle">{step.n}</span>
              <h3 className="mt-3">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">
                {step.desc.split(BOT_HANDLE).map((part, index) => (
                  <span key={`${step.n}-${index}`}>
                    {index > 0 && <bdi dir="ltr">{BOT_HANDLE}</bdi>}
                    <IsolatedText>{part}</IsolatedText>
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-12 text-xs text-ink-subtle">
          فایل‌ها برای ساخت جزوه به سرویس‌های لازم می‌روند —{' '}
          <a href="#privacy" className="inline-link link-underline">جزئیات حریم خصوصی</a>
        </p>
      </div>
    </section>
  )
}
