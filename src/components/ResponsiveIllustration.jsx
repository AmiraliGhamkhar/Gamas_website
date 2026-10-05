/**
 * Responsive, below-the-fold illustrations. The hero is the only eagerly
 * loaded image; every illustration has explicit dimensions to reserve its
 * aspect ratio and avoid layout shifts.
 */
import { sitePath } from '../lib/constants'

const WIDTHS = [384, 512, 768, 1024]
const FALLBACK_WIDTH = 512
const FALLBACK_HEIGHT = 384

const srcSetFor = (name, ext) =>
  WIDTHS.map((w) => `${sitePath(`images/illustration-${name}-${w}.${ext}`)} ${w}w`).join(', ')

export default function ResponsiveIllustration({ name, alt, sizes }) {
  return (
    <picture>
      <source type="image/avif" srcSet={srcSetFor(name, 'avif')} sizes={sizes} />
      <img
        src={sitePath(`images/illustration-${name}-${FALLBACK_WIDTH}.webp`)}
        srcSet={srcSetFor(name, 'webp')}
        sizes={sizes}
        width={FALLBACK_WIDTH}
        height={FALLBACK_HEIGHT}
        loading="lazy"
        decoding="async"
        alt={alt}
      />
    </picture>
  )
}
