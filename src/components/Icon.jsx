import { sitePath } from '../lib/constants'

export default function Icon({ name, size = 22, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`gamas-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <use href={sitePath(`icons/gamas-icons.svg#${name}`)} />
    </svg>
  )
}
