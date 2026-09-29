# Design decisions

## Source and branch

- The repository did not contain a `DESIGN.md`; the user supplied the redesign brief as the design source during the session. Its concrete rules and named components are treated as authoritative.
- The brief did not provide the neutral hex values for light, parchment, dark, border, muted text, or focus colors. Those missing neutrals are the only palette additions made here; they are conservative, neutral, and meet the stated contrast target. The interactive blue remains the specified `#0066cc`, with `#2997ff` for links on dark tiles; the focus ring reuses `--primary` rather than introducing another blue.
- Work remains on Arena's session branch `arena/01a0ec30-gamas-website`. The session branch is fixed by the environment; `redesign/design-md-rtl` was not created or checked out.

## Token map

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#ffffff` | Light product tile / page canvas |
| `--parchment` | `#f5f0e8` | Parchment product tile |
| `--tile-dark` | `#202124` | Dark product tile |
| `--surface` | `#ffffff` | Flat card surface on light tile |
| `--surface-muted` | `#f0f1f2` | Quiet surface / controls on light tile |
| `--surface-dark` | `#2c2d30` | Quiet surface / cards on dark tile |
| `--surface-parchment` | `#fffdfa` | Card surface on parchment tile |
| `--on-primary` | `#ffffff` | Primary-button label |
| `--scroll-thumb` | `#85878b` | Neutral scrollbar thumb |
| `--ink` | `#202124` | Primary text on light tile |
| `--ink-muted` | `#51545a` | Secondary text on light tile |
| `--ink-subtle` | `#5b5e63` | Fine text on light tile (not legal text) |
| `--on-dark` | `#f7f7f5` | Primary text on dark tile |
| `--on-dark-muted` | `#d5d5d2` | Secondary text on dark tile |
| `--on-dark-subtle` | `#c0c0bc` | Fine text on dark tile |
| `--primary` | `#0066cc` | Primary interaction on light surfaces |
| `--primary-on-dark` | `#2997ff` | Link interaction on dark surfaces |
| `--primary-focus` | `var(--primary)` | Visible focus ring; reuses the specified interaction blue |
| `--border` | `#d7d8da` | Light surface border |
| `--border-dark` | `#55565a` | Dark surface border |
| `--radius-0/8/11/18/pill` | `0 / 8px / 11px / 18px / 999px` | Approved radius scale |
| `--space-section` | `80px` | Desktop section rhythm |
| `--space-section-mobile` | `48px` | Small-phone section rhythm |
| `--font-body` | Vazirmatn, system fallbacks | Body and UI |
| `--font-display` | Lalezar, Vazirmatn, system fallbacks | Hero/tile headlines only |

## Implementation notes

- No new dependencies or UI patterns were added. Existing sections/assets/API routes are retained and restyled.
- Existing React sections are mapped to the named primitives: `button-primary`, `button-secondary-pill`, `store-utility-card`, `chip`, `product-tile-*`, `global-nav`, `sub-nav-frosted`, `floating-sticky-bar`, and `footer`. Native links and labeled inputs remain native elements with shared CSS treatment rather than wrapper components.
- This landing page has no search, modal, table, or carousel UI, so no `search-input` or modal behavior was invented. The existing email field is styled as a form input and keeps its contract.
- The existing hero render is the single product-image shadow use; all other card/button/text shadows and decorative effects are removed.
- Existing honest product copy and API contracts are preserved. UI-only validation feedback remains Persian, with JSON keys and requests unchanged.
- Latin handles and mixed-script technical strings use `<bdi>`/`IsolatedText`; visible numbers use Persian formatting without changing API values.
- Self-hosted fonts are Vazirmatn Arabic and Latin at weights 400/600 plus Lalezar Arabic 400; the five WOFF2 assets total 124.4 KiB. No 500 face is used.
- Contrast ratios calculated from token pairs: ink/canvas 16.10:1; ink-muted/canvas 7.59:1; ink-subtle/canvas 6.51:1; on-dark/tile-dark 15.01:1; on-dark-muted/tile-dark 10.95:1; on-dark-subtle/tile-dark 8.82:1; primary/canvas 5.57:1; primary-on-dark/tile-dark 5.34:1. These are token-pair calculations, not a rendered-page audit.
- Final `npm run lint` and `npm run build` passed; the build generated root-base SSG output, crawler files, and `.htaccess`. Browser/Lighthouse/PHP tools were unavailable, so viewport screenshots, rendered accessibility, Lighthouse, and live PHP checks remain unverified.
