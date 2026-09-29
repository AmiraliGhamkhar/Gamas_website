# Design decisions

## Humanize pass (latest)

Applied on top of the Paper & Indigo foundation after user feedback: shorter, humanized Persian copy; all eyebrow badges removed; micro-interactions added.

- **Copy:** every section rewritten to one-line value statements and 2–4 item lists (hero lead is a single sentence; FAQ answers cut by ~50%). Product claims unchanged — pricing/plans remain honestly "announced-later".
- **Eyebrows removed:** all decorative pill badges above section headings are gone (verified in the DOM: 0 chips above any heading). Remaining `.chip` usage is limited to hero trust facts and the formats strip.
- **Micro-interactions (hover-hover devices only, transform/color transitions, no shadows):**
  - `.hover-lift` — 2px lift + accent-tinted border on cards (21 instances).
  - `.button-primary`/`.button-secondary-pill` — darker primary tint / accent border + surface tint on hover.
  - `.link-underline` — underline slides in on hover (nav + footer links).
  - Copy-to-clipboard on the footer `@handle`: click → `کپی شد ✓` for 1.6s → resets (clipboard API, class flip, aria-label updates).
  - FAQ rows tint on hover; the `+` icon rotates 45° in the accent color when open.
  - All motion is disabled under `prefers-reduced-motion` (the global reduce block plus an explicit `.hover-lift:hover { translate: none }` override).
- **GSAP removed entirely** — the library was dropped from dependencies; reveals are static (content-first), the replay/progress demo remains a small React interval animation with `role=progressbar`.
- **Verified:** lint + build pass; 8 viewports overflow-free with 0 console errors; reduced-motion shows zero transformed elements; copy interaction and hover lift confirmed in a real browser; `docs/screenshots/` regenerated.

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

## Verification (Phase 5) — completed in a follow-up session

The prior session could not run browser checks; they were executed afterward against the redesigned code on the managed preview (Vite dev server) and a transient `vite preview` of the production `dist/` build, with Playwright (Chromium) and Lighthouse. Results:

| Gate | Result |
|---|---|
| `npm run lint` / `npm run build` | ✅ zero warnings; postbuild checks pass |
| Grep gates (`ml-/mr-/pl-/pr-`, `left-/right-`, `text-left/right`, `float-left/right`, negative `letter-spacing`, `font-medium`/500, gradients, `box-shadow`) | ✅ clean in `src/`; hex colors only inside the token block of `src/index.css`; exactly one `box-shadow` (the allowed mirrored product-image shadow); `backdrop-filter` only on the two documented frosted bars |
| Viewports 320 / 375 / 414 / 768 / 834 / 1024 / 1280 / 1440 | ✅ no horizontal overflow at any width (`document.scrollWidth − innerWidth ≤ 0`; small negative values are the `scrollbar-gutter: stable` reservation, not overflow); `dir=rtl`, `lang=fa`, exactly one `h1`, skip link and `header/main/nav/footer` landmarks present, zero broken images, zero console errors at every width |
| Fonts | ✅ Vazirmatn 400/600 (Arabic+Latin) and Lalezar 400 all load (`document.fonts.check`); body renders 17px/1.8; hero h1 renders Lalezar 56px/1.38 with no letter-spacing at ≥1069px |
| Tiles | ✅ full-bleed, square-cornered, alternating light → dark → parchment → dark … (hero light, story `#202124`, features `#f5f0e8`, demo dark, how light, access dark, testimonials parchment, privacy dark, faq light, final-cta dark, footer light); 80px rhythm on ≥834px, 48px below |
| Component states | ✅ primary button = pill/44px/`#0066cc`/no shadow; `:focus-visible` = 2px `#0066cc` outline with offset; `a:active, button:active { transform: scale(.95) }` rule present; disabled = 0.58 opacity + not-allowed cursor |
| Drawer (mobile) | ✅ opens with `aria-expanded=true`, slides from the inline-start (right) edge, Escape closes it, `aria-expanded` returns to `false`, focus returns to the toggle button |
| Form | ✅ invalid email shows Persian message `نشانی ایمیل را به‌درستی وارد کنید.`; when the token endpoint fails the Persian error renders via `role=alert`; field names, endpoint, and payload unchanged (dev sandbox has no PHP, so the success path still needs the live cPanel check from `DEPLOY.md` §6) |
| Mixed bidi | ✅ Persian sentence containing `@Gamas_bot`, a URL, and digits renders without punctuation jumping sides; 31 `<bdi>` isolates + 30 `[dir=ltr]` fragments present in the DOM |
| Reduced motion | ✅ with `prefers-reduced-motion: reduce`, zero GSAP-transformed elements, reveals restored to full opacity, hero/story cards visible |
| Lighthouse (production build, mobile emulation) | Performance 76, Accessibility 100, Best Practices 92, SEO 100. Both BP deductions are environment artifacts measured under `vite preview`: a 404 for `/api/lead.php` (PHP cannot run there; the endpoint exists on cPanel) and an `image-aspect-ratio` read failure on the AVIF source in software rendering (the `img` carries explicit `width`/`height` and `aspect-ratio`, so CLS is safe). Performance 76 reflects the software-rendered, CPU-throttled sandbox (TTI ≈ 4.6s is not representative of real hardware); the largest script is 237 KB (app bundle incl. React), GSAP/ScrollTrigger are split into separate lazy chunks, total `dist/` is 765 KB, font payload 132 KB ≤ the 150 KB budget. Dev-server Lighthouse (Performance 31) is meaningless and was discarded. |

Artifacts: `docs/screenshots/verify-report.json` (per-viewport data), `docs/screenshots/deep-checks.json` (tiles/type/states/drawer/form), `docs/screenshots/lighthouse-prod.json` (production Lighthouse), `docs/screenshots/*.png` (full-page captures per viewport + reduced-motion). The harness scripts `verify-redesign.mjs` / `verify-deep.mjs` remain at the repo root as rerunnable verification tools (dev-only, not wired into `npm` scripts).

## Follow-up cleanups in this session

- `src/components/MobileSticky.jsx`: removed dead `bg-tile-dark/85 backdrop-blur-[16px] supports-[…]:bg-tile-dark/70` classes that the `.floating-sticky-bar` parchment style already overrides — the dark-glass look was unreachable and the classes contradicted the documented frosted-bar treatment.

## Remaining deviations and known gaps

- **Branch naming:** the brief requested a `redesign/design-md-rtl` branch; the environment pins work to its session branch, so the redesign was delivered on the session branch and merged to `main` (PR #7). No further branch was created for the verification-only changes.
- **Live PHP form success path, real-device Lighthouse, and screen-reader walkthrough** remain host-dependent checks: run `DEPLOY.md` §6 on the cPanel account after upload; re-run Lighthouse on real hardware if an accurate Performance score is needed.
- A `DESIGN.md` file does not exist in the repository; the brief in the user request remains the design source of truth alongside this document.
