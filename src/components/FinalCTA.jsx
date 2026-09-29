import { BOT_HANDLE, tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'

export default function FinalCTA() {
  return (
    <section id="final-cta" className="product-tile product-tile-dark relative">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="store-utility-card relative overflow-hidden surface-card rounded-18 p-8 sm:p-10 lg:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="text-center lg:text-start">
              <h2>
                جزوه‌ات را در <span className="text-primary-emphasis">چند دقیقه</span> بگیر
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-on-dark-muted">
                به <bdi dir="ltr" className="text-on-dark">{BOT_HANDLE}</bdi> بفرست — همین حالا.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href={tgLink('final_cta')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCTA('final_cta')}
                  className="button-primary inline-flex items-center justify-center gap-2 rounded-pill bg-primary px-7 py-3.5 text-[15px] font-semibold text-white"
                >
                  شروع در تلگرام
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a
                  href="#how"
                  className="button-secondary-pill inline-flex items-center justify-center rounded-pill surface-card px-7 py-3.5 text-sm"
                >
                  نحوه کار
                </a>
              </div>
            </div>

            <div className="hover-lift surface-card rounded-18 p-5">
              <p className="text-sm font-semibold text-on-dark">چه می‌فرستی؟</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                {[
                  ['♫', 'وویس/صدا'],
                  ['▶', 'ویدیو'],
                  ['▭', 'پاورپوینت'],
                ].map(([icon, label]) => (
                  <div key={label} className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-3">
                    <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-white">{icon}</span>
                    <span className="mt-2 block text-on-dark">{label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-surface-dark border border-subtle px-3 py-2.5 text-xs leading-5 text-on-dark-muted">
                ✓ یک پیام وضعیت — بدون اسپم
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
