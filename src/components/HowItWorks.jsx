import { BOT_HANDLE } from '../lib/constants'
import IsolatedText from './IsolatedText'

const steps = [
  {
    n: '۰۱',
    title: 'بفرست',
    desc: `فایل کلاس را به ${BOT_HANDLE} بفرست. تا ۲ گیگابایت.`,
  },
  {
    n: '۰۲',
    title: 'گاماس می‌سازد',
    desc: 'صدا رونویسی می‌شود و متن کنار اسلایدها می‌نشیند.',
  },
  {
    n: '۰۳',
    title: 'بگیر',
    desc: 'جزوه در چت می‌آید. بلند باشد، تقسیم می‌شود.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="product-tile product-tile-light">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2>سه قدم ساده.</h2>
          <p className="mt-5 text-muted">چیزی نصب نمی‌کنی.</p>
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
          برای ساخت جزوه، صدا و متن به سرویس‌های بیرونی می‌رود —{' '}
          <a href="#privacy" className="inline-link link-underline">جزئیات در حریم خصوصی</a>
        </p>
      </div>
    </section>
  )
}
