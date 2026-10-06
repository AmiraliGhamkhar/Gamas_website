# Baseline (2026-10-07, pre-90-point rebuild)

Recorded before applying the 90-point plan. Re-measure after each phase.

- `node --test`: 3 pass / 0 fail
- `npm run lint`: exit 0
- `npm run build`: ok, postbuild checks passed
- `dist/`: 52 files, ~1.74MB
- `dist/assets`: app JS ~189KB, CSS ~41KB, client ~0.6KB
- Preview `/`: HTTP 200, ~49KB HTML
- Known gaps: no CI, Playwright not installed, no critical-CSS inlining,
  verify trio duplicated, 12px body copy, truncated HowItWorks note,
  PHP 7.4 floor, hour bucket 200, no DNT opt-out, single-URL sitemap.
