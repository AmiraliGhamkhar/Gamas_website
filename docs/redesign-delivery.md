# Editorial Gamas redesign — delivery record

Date: 2026-11-02. Branch: `arena/8112ad6f-gamas-website` (fixed by the session; the requested `feat/layers-of-time-persian-redesign` branch was not created).

## Scope and evidence

Redesigned the existing Persian RTL page in place: editorial hero, warm paper/ink/vermilion tokens, layered original CSS study sheets, a three-stage visual workflow, privacy ledger, ruled feature/FAQ layouts, restrained hover motion, and redesigned final Telegram CTA/footer. React 18, Vite 6, `vite-react-ssg`, local fonts, product facts, all CTA placements, demo, disclosure interactions and static cPanel delivery remain.

**Reference fidelity is not verified.** The reference failed both direct TLS and Chromium navigation (`net::ERR_CONNECTION_CLOSED`) under the sandbox's restricted network. No screenshots of or observations about its actual design are asserted. The visual direction is an original editorial interpretation; exact reference comparison is outstanding.

## Files

- `src/editorial.css`: visual tokens, layouts, mobile recomposition, original artwork, reduced-motion-compatible hover.
- `src/components/Hero.jsx`, `StudyArtwork.jsx`: hero composition and scalable original conceptual artwork.
- `Story.jsx`, `HowItWorks.jsx`, `Capabilities.jsx`, `Privacy.jsx`: integrate artwork while retaining source-based content.
- `Navbar.jsx`: class-based CSP-safe scroll lock; focus behavior retained.
- `src/main.jsx`: ordered stylesheet entry.
- `index.html`: matching theme color; remove obsolete raster hero preload.
- `verify-redesign.mjs`: add 390px and 1920px coverage without removing assertions.
- `scripts/verify-editorial.mjs`: production-CSP response injection, no-inline-style check, no-JS content, tracking-failure navigation, desktop/mobile screenshots and axe checks.

No dependencies added/removed; package manifest and lockfile unchanged. No API/security/configuration logic changed.

## Verified locally

Node 22.22.3. Baseline: clean tree at `9168c40`; lint, five tests and root build passed before edits. Baseline screenshots were later captured from an isolated `git archive HEAD` copy of that original commit, not by reverting the working tree.

- `npm ci`: passed. **38 advisories (25 moderate, 13 high)** in the existing locked dependency tree. No forced or breaking dependency upgrade attempted. Review separately before release.
- `npm run lint`: passed.
- `npm test`: five tests passed.
- `npm run typecheck`: passed (existing JS checking, no TypeScript migration).
- `npm run build`: root SSG and postbuild validation passed; generated CSP hashes, canonical metadata, robots/sitemap/llms and asset checks passed.
- `node scripts/images.mjs`: passed, 35 existing image files.
- Production output: `/home/user/Gamas_website/dist/`, ignored by Git. API remains in `/home/user/Gamas_website/api/` and must be uploaded separately.

## Verified in Chromium

Used a temporary npm-distributed Chromium binary and bundled shared libraries, outside the repository, because normal browser downloads/system packages were network-blocked. Not an installed production dependency. Preview was bound to `0.0.0.0:4173`.

- `verify-final.mjs`: passed; metadata, local assets, RTL, landmarks, JSON-LD, no API tracking on page load.
- `verify-deep.mjs`: passed; mobile initial focus/trap/Escape/focus restoration and desktop handoff, native privacy disclosure, FAQ, demo completion/reduced motion, mocked POST tracking.
- `verify-redesign.mjs`: passed at 320, 360, 375, 390, 414, 640, 768, 834, 1024, 1068, 1280, 1440 and 1920px. Zero horizontal overflow, no undersized tested targets, no console errors. Reduced motion and bidi checks passed.
- `scripts/verify-editorial.mjs`: passed. Exact generated production CSP was injected as an enforcing browser response header; no policy violations or uncaught errors, no inline style attributes. Menu/demo/FAQ/disclosure exercised. Automated axe WCAG A/AA scan: no violations in the tested desktop initial state. This is not a complete manual accessibility certification.
- JavaScript-disabled prerender: title/content and Telegram anchor available. Tracking network failure: mocked Telegram destination still opens. Neither check contacts the real bot.
- Desktop and mobile screenshots visually reviewed. Full-page images and machine reports are local-only ignored artifacts in `docs/screenshots/current/`.

### Screenshots

- `docs/screenshots/current/desktop.png` — 1440×900 viewport.
- `docs/screenshots/current/mobile.png` — 390×844 viewport.
- `docs/screenshots/current/redesign-1440.png` and `redesign-390.png` — full-page.
- `docs/screenshots/current/before-1440.png` and `before-390.png` — original-commit comparison.

## Not verified / release gates

- Reference appearance, reference interactions and visual fidelity (network unavailable).
- Actual cPanel, Apache redirects/headers/404s, PHP endpoint/storage/rate-limit runtime (PHP absent locally), provider logging and permissions.
- Live bot ownership/availability, provider configuration and real Telegram processing.
- Safari/Firefox/real-device testing, measured Lighthouse/Web Vitals, manual screen-reader audit.
- Dependency advisories remain; no fabricated clean audit result.

The API was left unchanged. Mocked browser tracking proves frontend behavior, not the PHP backend. No production access or deployment was attempted.

## Exact cPanel release checklist

Primary guide: `DEPLOY.md`; the redesign requires no new server configuration.

1. Confirm the actual domain document root in cPanel. Source defaults remain `https://gamadesk.ir`, base `/`, normally `public_html/`. For another origin/path, use the documented `VITE_SITE_URL` and trailing-slash `VITE_BASE`; do not change the canonical to the reference site.
2. Back up current public static files **including dotfiles**, API code, and private storage to a private location outside the web root. Record current PHP environment/origin settings. Do not overwrite, relocate or delete private analytics storage.
3. Build locally with `npm ci && npm run lint && npm test && npm run build && node scripts/images.mjs`. No Node server is needed on cPanel.
4. Enable “show hidden files”. Upload the **contents** of `dist/` to the verified web root: generated `.htaccess`, `index.html`, `404.html`, `assets/`, `fonts/`, `images/`, `icons/`, `favicon.svg`, `logo-mark.svg`, `og-image.jpg`, `robots.txt`, `sitemap.xml`, `llms.txt`. Use `dist/.htaccess`, never unprocessed `public/.htaccess`.
5. Upload existing `api/` separately to the matching `/api/` path, including `.htaccess`, `.user.ini`, `track.php`, `bootstrap.php`, `csp-report.php` and the retired `lead.php`. Keep `lead.php` at HTTP 410. Preserve private storage and environment settings; PHP 8.2+, optional `pdo_sqlite` with NDJSON fallback. Never chmod 777 or place PHP settings in Apache directives.
6. Do not upload source, Git, node_modules, package/build files, environment secrets, screenshots, databases or logs.
7. Verify HTTPS and HTTP/www redirects, canonical hostname, every asset type, mobile rendering, deep links, real 404s for missing assets, security headers/CSP and browser console. Verify intended Telegram destination independently; test CTA tracking with the real PHP endpoint and inspect private storage/logs through authorized operator access only. Confirm no public data endpoints or PHP/Apache errors.
8. Roll back if checks fail: restore previous static build and generated `.htaccess` together, restore previous API code if changed, and recheck assets/headers/CTA. Do not blindly restore or delete analytics data; code rollback does not reverse database migrations. Retain protected backups and apply the existing retention policy.
