# Design and engineering decisions — 2026-10-05

This is the current decision record for the GAMAS landing page. The older redesign notes are archived in [`redesign-audit.md`](redesign-audit.md); the current findings and scorecard are in [`AUDIT.md`](../AUDIT.md).

## Scope kept intact

- Keep React 18, Vite 6, `vite-react-ssg`, prerendered static HTML, the small PHP API, Apache/cPanel delivery, and the Persian RTL interface.
- Node is a build-time dependency only; cPanel receives `dist/` and `api/`, not the Vite development server.
- Do not turn the site into a full-stack app, introduce an email service, or add analytics vendors.

## Product and content decisions

- The H1 explicitly names AI, and the primary action opens the Telegram bot. The secondary hero action points to a **clearly simulated** demonstration, never a “live” demo.
- The hero phone art now uses abstract, textless UI blocks instead of illustrative success/accuracy numbers or made-up lesson output. Its alt text and caption describe it as conceptual.
- Format, size, transcript and DOCX claims were compared with the public bot repository. The page names the reviewed formats and the default 2 GB application limit, while noting provider/hosting limits. PDF, images, ZIP, ODP and OTP are not advertised as supported.
- The bot implementation can send a TXT transcript and a structured DOCX when note generation succeeds; the site says the raw transcript remains available if note generation fails. No price, testimonial, success rate or accuracy percentage is asserted.
- The bot repo’s reviewed code sends audio and, when configured, transcript/slide text to external services; temporary media is cleaned up, while transcripts and notes may remain in SQLite with no automatic expiry in the reviewed implementation. The site privacy copy distinguishes those cases and also describes hosting access logs and its own click tracker. Live provider/account settings were not inspected.

## Privacy and API decisions

- Retire the email form. The page has no form/email field; `api/lead.php` is retained only as a JSON `410 Gone` response for stale clients.
- The only current site API is `POST /api/track.php`, called on a Telegram CTA click rather than page load. Event records contain a section and time, not raw IP or user-agent. The short-window limiter stores a keyed HMAC pseudonym in private files; cPanel/provider access logs remain outside that promise.
- Exact scheme + host + port are checked against `GAMAS_ALLOWED_ORIGINS`; do not infer a trusted origin from `HTTP_HOST`. Limiter/storage failure is distinguished from an exceeded limit (503 versus 429).
- Keep SQLite optional, retain the flat-file fallback, put data outside `public_html` by default, and migrate the former SQLite waitlist table / NDJSON file after deployment. Local code cannot remove historical copies in provider backups or other data directories; the operator must check those.

## Visual, mobile and accessibility decisions

- Preserve the Persian RTL layout and local Vazirmatn/Lalezar fonts. Styling remains plain CSS; removing Tailwind keeps the current custom page small and avoids adding a new UI dependency.
- Correct overflow at the layout level instead of hiding it on `body`; section-local clipping remains only for decorative artwork and bounded UI components. Keep `minmax(0, 1fr)`, wrapping and logical sizing where needed.
- Keep the 640/834/1068 px layout breakpoints and the ≤360 px action stacking. Primary/secondary controls, navigation, FAQ, privacy disclosure and footer/copy controls are sized for touch; the inline privacy link target was raised to 44 px.
- Preserve skip navigation, landmarks, a keyboard-trapped mobile drawer with Escape/focus return, native privacy disclosure, FAQ button state, explicit demo progress semantics, and mixed-direction isolation. The demo starts only when activated and respects `prefers-reduced-motion`.
- Adjusted sampled text/background token pairs. Examples calculated from the shipped hex colors: muted text `#5b737d` on `#fff9ef` = 4.78:1; primary `#15759f` on `#fff9ef` = 4.92:1; white on the CTA gradient endpoints `#15759f` / `#116d98` = 5.15:1 / 5.73:1; `#d1e2e4` on `#0c3040` = 10.39:1. These are sampled token calculations, not a full rendered WCAG audit.

## Static deployment and SEO decisions

- Keep prerendered HTML and metadata for the canonical origin. `scripts/postbuild.mjs` removes SSG manifests, checks for sensitive files and `.htaccess`, and regenerates base-aware `robots.txt`, `sitemap.xml` and `llms.txt`.
- Preserve cPanel root deployment as the default and verify `/gamas/` as a supported subfolder build. Base-aware paths are required for HTML, JavaScript, API, images, fonts, crawler files and `RewriteBase`.
- The Apache fallback intentionally does not rewrite `/api/`, PHP, real files, or missing dotted asset paths. Missing assets should remain 404s instead of receiving the app shell as a false 200.
- `public/.htaccess` uses fixed production hosts for redirects, restrictive source/data rules, CSP/security headers and cache buckets; it must still be checked on the actual hosting account because Apache modules and proxy behavior vary.

## Validation completed on the current source

| Check | Result |
|---|---|
| `npm ci` | Passed; dependencies installed from the lockfile. |
| `npm run lint` | Passed with zero warnings/errors. |
| `npm audit` | `found 0 vulnerabilities` for the full lockfile at audit time. |
| `npm run build` (root base) | Passed; Vite 6.4.3 prerendered `dist/index.html`; postbuild checks passed. |
| `VITE_BASE=/gamas/ VITE_SITE_URL=https://gamas.bot npm run build` | Passed; subfolder postbuild checks passed. Static assertions confirmed `/gamas/` metadata/assets/fonts, `RewriteBase`, crawler URLs, and no form/retired endpoint in the prerendered HTML. |
| Vite host smoke | `curl` received HTTP 200 locally and with an `.e2b.app` Host header; confirms preview-host allowlisting, not browser behavior. |
| `node --check` (three optional browser harnesses and postbuild script) | Passed. |
| PHP grammar parse | `api/bootstrap.php`, `api/track.php` and `api/lead.php` parsed with a PHP-7 grammar parser. This is not `php -l` or a runtime/API test. |
| Browser, PHP CLI and Apache | Not verified. No browser/PHP/Apache executable was available. Chromium download was attempted but the Playwright CDN connection failed with `ECONNRESET`; the optional browser harnesses therefore were not run. |

The root/subfolder builds validate emitted static files, not the live Telegram bot, PHP behavior, Apache directives, cPanel permissions, live redirects/headers, device rendering, screen-reader behavior or Web Vitals. The archived screenshots/Lighthouse JSON are from an older implementation and are not current evidence; see [`screenshots/README.md`](screenshots/README.md).
