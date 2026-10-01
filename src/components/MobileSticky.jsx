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
        className="button-primary w-full items-center justify-center py-3 text-sm"
      >
        شروع در تلگرام
      </a>
    </div>
  )
}
