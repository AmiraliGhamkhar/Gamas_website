# Shared visual foundation

This document records the shared design rules for Gamas’s Persian RTL landing page. The tokens and global primitives live in `src/index.css`; `src/editorial.css` remains the composition layer for the existing sections and imports after it.

## Foundation tokens

- **Palette:** `--canvas` and `--parchment` are the paper planes; `--ink` and its muted variants carry text; `--primary` is the restrained terracotta action color; `--success` is muted olive. Keep cyan/neon colors, bright gradients, and glass effects out of the shared system.
- **Spacing:** use the 4px-based `--space-*` scale. `--space-section-mobile` ranges from 64–76px; `--space-section` scales from 76–112px. Prefer logical `block`/`inline` properties.
- **Typography:** Vazirmatn remains the reading face and Lalezar the display face. `--type-body` is 16px, reading copy scales to 18px, and section headings use `--type-section`. Persian text should keep natural letter spacing; do not tighten it with negative tracking.
- **Container:** `.container` has a fluid 18–48px gutter and an 80rem maximum width, centered with logical margins. Keep `min-inline-size: 0` on constrained grid/flex children and fix local overflow instead of hiding it on `body`.
- **Corners:** controls use `--radius-control` (2px), cards `--radius-card` (4px). The pill radius is reserved for small labels or badges. Prefer square edges over rounding a whole section.

## Elevation and interaction rules

- `--shadow-0` is the default for paper and section backgrounds.
- `.u-elevation-1` / `--shadow-1` is for ordinary cards; `.u-elevation-2` is for a featured object; `.u-elevation-3` is reserved for an overlay such as the mobile drawer. All are low, diffuse shadows—not ambient glow.
- `.button-primary` is the terracotta Telegram action; `.button-secondary-pill` is an outlined, quiet alternative. Shared controls have a 52px minimum block size; other interactive controls retain at least 44px touch targets.
- Hover is pointer-only and restrained: at most a 1px lift on the primary CTA, a small color/border change on secondary controls, and no decorative lift on non-interactive cards. Reduced-motion users get no hover movement.
- `:focus-visible` uses a clear 2px outline with a 3px offset. Dark panels switch to a light focus ring. Never remove the focus indication to preserve a visual effect.

## Navbar behavior

- Keep a quiet sticky paper header; reveal only the subtle `--shadow-1` edge after the page has scrolled more than 8px. Do not add blur or a translucent glass layer.
- At 960px and wider, show the full link row and filled Telegram CTA. Between 834–959px, keep the CTA visible beside the menu toggle; below 834px, use the menu toggle and drawer.
- The header is 80px on wide screens, 76px on the compact desktop/tablet range, and 68px on mobile. The drawer starts directly below that height, fills the remaining viewport, and uses the same measurement for its scrollable area.
- Preserve the menu’s body scroll lock, focus trap, Escape handling, focus restoration, `aria-expanded`/`aria-controls`, and hidden-state tab exclusion. Animate opacity/position only, and disable the transition delay for reduced-motion preferences.

## RTL and mobile baseline

- Keep the document `lang="fa" dir="rtl"`; use logical CSS properties and `text-align: start` for flow-aware alignment.
- Keep mixed Latin/URL content isolated with `<bdi dir="ltr">` or `[dir="ltr"]`/`[lang="en"]` isolation.
- Preserve the 320px minimum layout, fluid container gutters, safe-area spacing, anchor scroll offset, touch-sized controls, and the existing reduced-motion behavior.

## Editorial identity that must not change

- Preserve the parchment/ink/terracotta palette, strong Persian typography, generous but measured whitespace, ruled-paper cues, and asymmetric editorial layouts.
- Keep surfaces mostly flat; apply elevation only when it clarifies a relationship or affordance. Do not introduce SaaS-style gradients, glow, glassmorphism, oversized rounded cards, stock imagery, or decorative illustration packs.
- Do not change section order, product claims, simulated-demo disclosure, privacy/transparency language, or the Telegram bot as the primary conversion path.
- Keep React 18, Vite + `vite-react-ssg`, custom CSS, static generation, and cPanel deployment unchanged.

Section styles should consume these shared tokens rather than duplicate them. Navbar and Hero composition can evolve through scoped rules while retaining the editorial palette, RTL behavior, accessibility, and truthful product wording above.
