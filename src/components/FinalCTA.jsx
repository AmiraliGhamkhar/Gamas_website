import Icon from './Icon'
import IsolatedText from './IsolatedText'
import TelegramCTA from './TelegramCTA'
import { PRODUCT } from '../lib/constants'

const deliverables = [
  `جزوه‌ی دسته‌بندی‌شده در فایل Word (${PRODUCT.outputs.notesExtension})`,
  `رونوشت گفتار در فایل متنی ${PRODUCT.outputs.transcriptExtension}`,
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
          <TelegramCTA placement="final_cta" telegramSize={21} arrowSize={19} className="cta-main-button" aria-label="ارسال فایل کلاس در تلگرام — باز کردن ربات گاماس" />
          <div className="cta-micro-proof"><Icon name="check" size={16} /> ربات تلگرامی گاماس <span>·</span> فایل را در همان گفت‌وگو می‌فرستی</div>
        </div>

        <div className="cta-output-card">
          <div className="cta-output-card-head">
            <span className="access-card-icon"><Icon name="notes" size={22} /></span>
            <div>
              <h3>تا دو خروجی برای مرور</h3>
              <p><IsolatedText>{`رونوشت ${PRODUCT.outputs.transcriptExtension} و جزوه‌ی Word${PRODUCT.outputs.notesConditional ? '، اگر ساخت جزوه با موفقیت انجام شود.' : '.'}`}</IsolatedText></p>
            </div>
          </div>
          <ul className="cta-output-list">
            {deliverables.map((item) => (
              <li key={item}>
                <span className="output-check"><Icon name="check" size={13} /></span>
                <IsolatedText>{item}</IsolatedText>
              </li>
            ))}
          </ul>
          <p className="cta-output-note">اگر ساخت جزوه موقتاً در دسترس نباشد، متن خام گفتار همچنان فرستاده می‌شود.</p>
        </div>
      </div>
    </section>
  )
}
