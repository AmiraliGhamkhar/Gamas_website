import { tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'
import Icon from './Icon'

export default function MobileSticky() {
  return (
    <div className="floating-sticky-bar safe-pb md:hidden">
      <a
        href={tgLink('mobile_sticky')}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCTA('mobile_sticky')}
        className="button-primary sticky-cta"
      >
        <Icon name="telegram" size={19} />
        شروع در تلگرام
        <Icon name="arrow-left" size={17} className="cta-arrow" />
      </a>
    </div>
  )
}
