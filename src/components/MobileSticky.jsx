import { tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'

export default function MobileSticky() {
  return (
    <div className="floating-sticky-bar fixed bottom-0 inset-inline-0 z-30 p-3 md:hidden safe-pb">
      <a
        href={tgLink('mobile_sticky')}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCTA('mobile_sticky')}
        className="button-primary w-full items-center justify-center gap-2 py-3 text-sm"
      >
        شروع در تلگرام
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mirror-rtl">
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  )
}
