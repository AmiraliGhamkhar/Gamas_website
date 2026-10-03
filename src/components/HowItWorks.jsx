import Icon from './Icon'
import IsolatedText from './IsolatedText'
import ResponsiveIllustration from './ResponsiveIllustration'
import { BOT_HANDLE } from '../lib/constants'

const steps = [
  {
    n: '۰۱',
    icon: 'telegram',
    title: 'فایل را بفرست',
    desc: `ویس، ویدیو یا پاورپوینت را برای ${BOT_HANDLE} بفرست.`,
  },
  {
    n: '۰۲',
    icon: 'audio',
    title: 'گاماس مرتبش می‌کند',
    desc: 'گفتار رونویسی می‌شود؛ متن و محتوای اسلایدها کنار هم می‌آیند.',
  },
  {
    n: '۰۳',
    icon: 'notes',
    title: 'جزوه را تحویل بگیر',
    desc: 'خلاصه‌ی ساختاریافته و رونوشت فارسی در چت منتظرت هستند.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="product-tile product-tile-light how-section">
      <div className="container">
        <div className="section-heading how-heading">
          <h2 className="section-title">از فایل تا جزوه، در سه قدم.</h2>
          <p className="section-description">همه‌چیز همان‌جایی می‌ماند که فایل را فرستادی: داخل تلگرام.</p>
        </div>

        <div className="how-layout">
          <ol className="steps-list">
            {steps.map((step) => (
              <li key={step.n} className="step-card">
                <span className="step-number">{step.n}</span>
                <span className="step-icon"><Icon name={step.icon} size={22} /></span>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>
                    {step.desc.split(BOT_HANDLE).map((part, index) => (
                      <span key={`${step.n}-${index}`}>
                        {index > 0 && <bdi dir="ltr">{BOT_HANDLE}</bdi>}
                        <IsolatedText>{part}</IsolatedText>
                      </span>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <figure className="waveform-visual">
            <ResponsiveIllustration
              name="waveform"
              sizes="(max-width: 639px) 394px, 600px"
              alt="موج صوتی فیروزه‌ای که در یک تصویر مفهومی به صفحه‌های جزوه‌ی مرتب تبدیل می‌شود"
            />
            <figcaption className="waveform-visual-caption">
              <span className="waveform-caption-icon"><Icon name="audio" size={18} /></span>
              صدا به نکته‌های قابل مرور تبدیل می‌شود
            </figcaption>
          </figure>
        </div>

        <p className="how-privacy-note">
          فایل‌ها برای ساخت جزوه به سرویس‌های لازم فرستاده می‌شوند؛{' '}
          <a href="#privacy" className="text-link">جزئیات حریم خصوصی <Icon name="arrow-left" size={16} /></a>
        </p>
      </div>
    </section>
  )
}
