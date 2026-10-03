import Icon from './Icon'
import { tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'
import LeadForm from './LeadForm'

export default function FinalCTA() {
  return (
    <section id="final-cta" className="product-tile product-tile-dark cta-section">
      <div className="cta-glow cta-glow-one" aria-hidden="true" />
      <div className="cta-glow cta-glow-two" aria-hidden="true" />
      <div className="container cta-layout">
        <div className="cta-copy">
          <h2 className="cta-title">جلسه‌ی بعدی را<br /><span>با خیال راحت گوش کن.</span></h2>
          <p className="cta-description">فایل را بفرست؛ گاماس نکته‌ها را جمع می‌کند تا تو روی یادگیری تمرکز کنی.</p>
          <a
            href={tgLink('final_cta')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('final_cta')}
            className="button-primary cta-main-button"
          >
            <Icon name="telegram" size={21} />
            شروع در تلگرام
            <Icon name="arrow-left" size={19} className="cta-arrow" />
          </a>
          <div className="cta-micro-proof"><Icon name="check" size={16} /> بدون نصب اپ جدید <span>·</span> نتیجه در همان چت</div>
        </div>

        <div id="access" className="access-card">
          <div className="access-card-head">
            <span className="access-card-icon"><Icon name="notes" size={22} /></span>
            <div>
              <h3>درخواست دسترسی</h3>
              <p>فعلاً با تأیید؛ قیمت هنوز نهایی نشده.</p>
            </div>
          </div>
          <div className="access-card-form"><LeadForm source="access" /></div>
        </div>
      </div>
    </section>
  )
}
