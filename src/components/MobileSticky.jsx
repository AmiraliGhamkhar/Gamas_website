import TelegramCTA from './TelegramCTA'

export default function MobileSticky() {
  return (
    <div className="floating-sticky-bar">
      <TelegramCTA placement="mobile_sticky" telegramSize={19} arrowSize={17} className="sticky-cta" />
    </div>
  )
}
