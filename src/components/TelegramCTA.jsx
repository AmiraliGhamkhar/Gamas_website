import Icon from './Icon'
import { tgLink } from '../lib/constants'
import { trackCTA } from '../lib/track'

export default function TelegramCTA({
  placement,
  className = '',
  label = 'باز کردن ربات تلگرام',
  telegramSize = 20,
  arrowSize = 18,
  showTelegram = true,
  showArrow = true,
  onClick,
  ...rest
}) {
  const handleClick = (event) => {
    trackCTA(placement)
    onClick?.(event)
  }

  return (
    <a
      href={tgLink(placement)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`button-primary ${className}`.trim()}
      {...rest}
    >
      {showTelegram && <Icon name="telegram" size={telegramSize} />}
      {label}
      {showArrow && <Icon name="arrow-left" size={arrowSize} className="cta-arrow" />}
    </a>
  )
}
