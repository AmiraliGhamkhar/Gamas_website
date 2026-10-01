import { tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'
import LeadForm from './LeadForm'

export default function FinalCTA() {
  return (
    <section id="final-cta" className="product-tile product-tile-dark">
      <div className="mx-auto grid max-w-content gap-12 px-4 sm:px-6 md:grid-cols-[1fr_1fr] md:gap-10 lg:gap-16 lg:px-8">
        <div>
          <h2>شروع کن.</h2>
          <p className="mt-5 max-w-[32ch] text-on-dark-muted">
            فایل را بفرست. جزوه را در چت بگیر.
          </p>
          <a
            href={tgLink('final_cta')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('final_cta')}
            className="button-primary mt-9 inline-flex items-center px-7 py-3.5 text-[15px]"
          >
            شروع در تلگرام
          </a>
        </div>

        <div id="access" className="surface-card p-6 sm:p-8">
          <h3>درخواست دسترسی</h3>
          <p className="mt-3 text-sm text-on-dark-muted">دسترسی فعلاً با تأیید است؛ قیمت هنوز نهایی نشده.</p>

          <div className="mt-7 border-t border-dark pt-6">
            <LeadForm source="access" />
          </div>
        </div>
      </div>
    </section>
  )
}
