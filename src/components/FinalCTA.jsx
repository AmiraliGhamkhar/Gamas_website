import Icon from './Icon'
import IsolatedText from './IsolatedText'
import TelegramCTA from './TelegramCTA'
import { PRODUCT } from '../lib/constants'

const deliverables = [
  {
    id: 'transcript',
    number: '۰۱',
    title: 'رونوشت گفتار',
    format: `فایل متنی ${PRODUCT.outputs.transcriptExtension}`,
  },
  {
    id: 'notes',
    number: '۰۲',
    title: 'جزوه‌ی ساختاریافته',
    format: `${PRODUCT.outputs.notesLabelFa} (${PRODUCT.outputs.notesExtension})`,
    condition: PRODUCT.outputs.notesConditional ? 'در صورت موفقیت ساخت' : '',
  },
]

export default function FinalCTA() {
  return (
    <section
      id="final-cta"
      className="product-tile product-tile-dark cta-section"
      aria-labelledby="cta-title"
    >
      <div className="container cta-layout">
        <div className="cta-copy">
          <p className="cta-kicker">گام بعدی</p>
          <h2 id="cta-title" className="cta-title">
            فایل کلاس را در تلگرام بفرست؛
            <span>رونوشت فارسی را همان‌جا بگیر.</span>
          </h2>
          <p className="cta-description">
            فایل صوتی، ویدیوی کلاس یا پاورپوینت را به ربات گاماس در تلگرام بفرست. رونوشت در همان گفت‌وگو برمی‌گردد؛ جزوه‌ی Word هم در صورت موفقیت ساخت آماده است.
          </p>
          <div className="cta-actions">
            <TelegramCTA
              placement="final_cta"
              label="باز کردن ربات برای ارسال فایل"
              telegramSize={20}
              arrowSize={18}
              className="cta-main-button"
              aria-label="باز کردن ربات برای ارسال فایل — ربات گاماس در تلگرام"
            />
            <a className="cta-privacy-link" href="#privacy">
              <Icon name="lock" size={17} />
              <span>پیش از ارسال، جزئیات پردازش و نگه‌داری فایل را بخوان</span>
            </a>
          </div>
        </div>

        <aside className="cta-output-card" aria-labelledby="cta-output-title">
          <div className="cta-output-card-head">
            <p className="cta-output-kicker">خروجی‌ها</p>
            <h3 id="cta-output-title">برای مرور بعد از کلاس</h3>
          </div>
          <ol className="cta-output-list" aria-label="خروجی‌های فایل ارسالی" role="list">
            {deliverables.map((item) => (
              <li className="cta-output-item" key={item.id}>
                <span className="cta-output-number" aria-hidden="true">{item.number}</span>
                <div className="cta-output-copy">
                  <strong>{item.title}</strong>
                  <span className="cta-output-format"><IsolatedText>{item.format}</IsolatedText></span>
                  {item.condition && (
                    <small className="cta-output-condition"><IsolatedText>{item.condition}</IsolatedText></small>
                  )}
                </div>
              </li>
            ))}
          </ol>
          {PRODUCT.outputs.rawTranscriptOnNotesFailure && (
            <p className="cta-output-note">
              اگر ساخت جزوه انجام نشود، رونوشت خام گفتار همچنان فرستاده می‌شود.
            </p>
          )}
        </aside>
      </div>
    </section>
  )
}
