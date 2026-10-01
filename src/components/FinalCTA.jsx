import { BOT_HANDLE, tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'
import LeadForm from './LeadForm'

export default function FinalCTA() {
  return (
    <section id="final-cta" className="product-tile product-tile-dark">
      <div className="mx-auto grid max-w-content gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:px-8">
        <div>
          <h2>همین حالا بفرست.</h2>
          <p className="mt-5 max-w-[32ch] text-on-dark-muted">
            فایل را بفرست؛ جزوه در چت می‌آید.
          </p>
          <a
            href={tgLink('final_cta')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('final_cta')}
            className="button-primary group mt-9 inline-flex items-center gap-2 px-7 py-3.5 text-[15px]"
          >
            <span>شروع در تلگرام</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl inline-nudge shrink-0">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div id="access" className="surface-card p-6 sm:p-8">
          <h3>دسترسی با تأیید است.</h3>
          <p className="mt-3 text-sm text-on-dark-muted">قیمت هنوز نهایی نشده.</p>

          <a
            href={tgLink('access')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('access')}
            className="button-secondary-pill mt-6 inline-flex items-center gap-2 px-5 py-3 text-sm"
          >
            پیام به <bdi dir="ltr">{BOT_HANDLE}</bdi>
          </a>

          <div className="mt-7 border-t border-dark pt-6">
            <LeadForm source="access" />
          </div>
        </div>
      </div>
    </section>
  )
}
