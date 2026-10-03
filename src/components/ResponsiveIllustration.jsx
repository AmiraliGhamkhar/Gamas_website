/**
 * Responsive illustration for the section figures.
 *
 * One owner for the srcset ladder so the four section figures cannot drift
 * apart. The rungs are real files generated from the pre-optimisation
 * 1280x960 WebP, which is no longer in the tree — recover it with
 * `git show <commit>:public/images/illustration-X.webp` before re-running the
 * commands below. Note `-q:v`, not `-quality`: ffmpeg's libwebp wrapper
 * ignores `-quality`.
 *
 *   ffmpeg -i illustration-X.webp -vf scale=W:-2:flags=lanczos \
 *          -c:v libaom-av1 -crf 22 -b:v 0 -cpu-used 6 -still-picture 1 -f avif out.avif
 *   ffmpeg -i illustration-X.webp -vf scale=W:-2:flags=lanczos \
 *          -c:v libwebp -q:v 88 -compression_level 6 out.webp
 *
 * SSIM was measured for all 32 rungs against a lossless decode of the source
 * scaled to the same width: worst case 0.9805. A rung below 0.98 needs a lower
 * AVIF crf.
 *
 * All four rungs are reachable from the shipped `sizes` values (360/394px
 * mobile, 600px desktop): 384 at DPR 1 mobile, 512 at DPR 1 mobile for the
 * 394px figures, 768 at DPR 2 mobile and DPR 1 desktop, 1024 at DPR 2+. That
 * is why 1024 is the top rung rather than 1280 — and why none of them can be
 * pruned without losing a real viewport.
 */
import { sitePath } from '../lib/constants'

const WIDTHS = [384, 512, 768, 1024]
// width/height describe the 512 `src` fallback; every rung shares this 4:3
// ratio, so the reserved box is right whichever candidate is chosen.
const FALLBACK_WIDTH = 512
const FALLBACK_HEIGHT = 384

const srcSetFor = (name, ext) =>
  WIDTHS.map((w) => `${sitePath(`images/illustration-${name}-${w}.${ext}`)} ${w}w`).join(', ')

export default function ResponsiveIllustration({ name, alt, sizes, priority = false }) {
  return (
    <picture>
      <source type="image/avif" srcSet={srcSetFor(name, 'avif')} sizes={sizes} />
      <img
        src={sitePath(`images/illustration-${name}-${FALLBACK_WIDTH}.webp`)}
        srcSet={srcSetFor(name, 'webp')}
        sizes={sizes}
        width={FALLBACK_WIDTH}
        height={FALLBACK_HEIGHT}
        // Only the Story figure can reach the initial viewport (measured: it
        // starts at 1149px, so a >=1552px-tall window shows part of it). The
        // other three would need 3359/4299/4951px-tall windows, so they stay
        // lazy. The hero in Hero.jsx remains the only LCP preload.
        loading={priority ? 'eager' : 'lazy'}
        // Lowercase, matching Hero.jsx: React 18 does not recognise the
        // camelCase `fetchPriority` prop and warns instead of setting it.
        fetchpriority={priority ? 'high' : undefined}
        decoding="async"
        alt={alt}
      />
    </picture>
  )
}
