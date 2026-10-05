import Icon from './Icon'
import IsolatedText from './IsolatedText'
import ResponsiveIllustration from './ResponsiveIllustration'
import { BOT_HANDLE } from '../lib/constants'

const steps = [
  {
    n: '۰۱',
    icon: 'telegram',
    title: 'فایل کلاس را بفرست',
    desc: `ویس، ویدیو یا پاورپوینت را برای ${BOT_HANDLE} در تلگرام بفرست.`,
  },
  {
    n: '۰۲',
    icon: 'audio',
    title: 'گفتار به متن می‌آید',
    desc: 'هوش مصنوعی گفتار را پیاده می‌کند و در فایل ارائه از متن اسلایدها هم استفاده می‌شود.',
  },
  {
    n: '۰۳',
    icon: 'notes',
    title: 'رونوشت و جزوه را بگیر',
    desc: 'فایل Word جزوه و رونوشت متنی در همان گفت‌وگو فرستاده می‌شوند.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="product-tile product-tile-light how-section">
      <div className="container">
        <div className="section-heading how-heading">
          <h2 className="section-title">از فایل کلاس تا جزوه، در سه قدم.</h2>
          <p className="section-description">گاماس یک ربات تلگرامی است؛ فایل را همان‌جا می‌فرستی و نتیجه را همان‌جا می‌گیری.</p>
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
              alt="تصویر مفهومی از صدای کلاس و یک صفحه‌ی یادداشت مرتب"
            />
            <figcaption className="waveform-visual-caption">
              <span className="waveform-caption-icon"><Icon name="audio" size={18} /></span>
              گفتار کلاس به متن فارسی تبدیل می‌شود
            </figcaption>
          </figure>
        </div>

        <p className="how-privacy-note">
          برای پردازش، بخش‌های لازم از فایل به سرویس‌های گفتاربه‌متن و ساخت جزوه فرستاده می‌شود؛{' '}
          <a href="#privacy" className="text-link">جزئیات نگهداری فایل‌ها <Icon name="arrow-left" size={16} /></a>
        </p>
      </div>
    </section>
  )
}
