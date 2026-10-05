import Icon from './Icon'
import { tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'

const deliverables = [
  'جزوه‌ی دسته‌بندی‌شده در فایل Word',
  'رونوشت گفتار در فایل متنی جداگانه',
]

export default function FinalCTA() {
  return (
    <section id="final-cta" className="product-tile product-tile-dark cta-section">
      <div className="cta-glow cta-glow-one" aria-hidden="true" />
      <div className="cta-glow cta-glow-two" aria-hidden="true" />
      <div className="container cta-layout">
        <div className="cta-copy">
          <h2 className="cta-title">فایل کلاس را بفرست؛<br /><span>مرور را سبک‌تر کن.</span></h2>
          <p className="cta-description">
            ربات گاماس را در تلگرام باز کن و فایل آموزشی‌ات را بفرست. نتیجه‌ی پردازش در همان گفت‌وگو می‌رسد.
          </p>
          <a
            href={tgLink('final_cta')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('final_cta')}
            className="button-primary cta-main-button"
          >
            <Icon name="telegram" size={21} />
            باز کردن ربات تلگرام
            <Icon name="arrow-left" size={19} className="cta-arrow" />
          </a>
          <div className="cta-micro-proof"><Icon name="check" size={16} /> ربات تلگرامی گاماس <span>·</span> فایل را در همان گفت‌وگو می‌فرستی</div>
        </div>

        <div className="cta-output-card">
          <div className="cta-output-card-head">
            <span className="access-card-icon"><Icon name="notes" size={22} /></span>
            <div>
              <h3>تا دو خروجی برای مرور</h3>
              <p>رونوشت TXT و جزوه‌ی Word، اگر ساخت جزوه با موفقیت انجام شود.</p>
            </div>
          </div>
          <ul className="cta-output-list">
            {deliverables.map((item) => (
              <li key={item}>
                <span className="output-check"><Icon name="check" size={13} /></span>
                {item}
              </li>
            ))}
          </ul>
          <p className="cta-output-note">اگر ساخت جزوه موقتاً در دسترس نباشد، متن خام گفتار همچنان فرستاده می‌شود.</p>
        </div>
      </div>
    </section>
  )
}
