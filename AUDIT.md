# GAMAS website engineering audit — 2026-10-05

**State:** implementation changes and static-build checks are complete for this checkout. Browser interaction, PHP runtime/API, Apache/cPanel, assistive-technology and live-bot checks remain open; this is **not** a deployment sign-off.

## Executive summary

The site remains Persian RTL React/Vite/`vite-react-ssg`, with prerendered HTML, plain CSS, self-hosted assets and a small PHP click tracker for static cPanel hosting. No framework or server migration was made. The most consequential source-level changes remove the retired email form, make the tracker click-only and best-effort, clarify privacy and demo claims, reduce mobile overflow risk without hiding page overflow globally, and make subfolder output explicit and build-checked.

The root and `/gamas/` production builds, lint, full npm dependency audit and postbuild checks pass. The current optional Playwright scripts could not be executed because this environment had no browser binary and the Chromium CDN download failed. PHP was parsed with a PHP-7 grammar parser, but `php -l`, the PHP runtime, Apache and a live cPanel account were unavailable.

## Findings and changes

| Priority | Finding / risk | Change and current evidence |
|---|---|---|
| P0 — routing | A stale lead-form/API path and missing-asset handling could produce confusing failed requests or app-shell false 200s. | Removed the form and its automatic API calls; `api/lead.php` now returns explicit `410 Gone`. The prerendered HTML contains no form/email input or lead endpoint. Apache rules leave `/api/` and PHP native, and do not rewrite missing dotted asset requests to `index.html`. Static output was inspected; real browser/Apache response codes were not. |
| P0 — subfolder assets | Root-absolute font references and mismatched build/deploy bases can produce font/asset 404s below the domain root. | Build output is base-aware; postbuild checks CSS font URLs and aligns `RewriteBase`. The `/gamas/` build passed assertions for canonical/OG URLs, assets, font paths, crawler files and rewrite base. No live Apache subfolder was tested. |
| P0 — mobile layout | Global horizontal clipping can conceal overflow instead of fixing its cause. | Removed `overflow-x: clip` from `body`; the page uses constrained grid/flex tracks, wrapping and component-local clipping only where artwork/UI needs it. Added an optional 320–1440 px overflow harness. It was not run without Chromium, so “no overflow” is not claimed as a measured browser result. |
| P1 — unsupported visual proof | The hero artwork previously included an illustrative percentage and detailed fake chat/note output that could be mistaken for real bot results. | Replaced the screen with textless abstract UI, updated its alt/caption, and removed the illustrative metric. The demo section and CTA explicitly identify the interaction as simulated. |
| P1 — privacy and retention | The old email-capture path and earlier copy did not reflect the current product/API and bot-side storage behavior. | Removed the lead form, kept the endpoint as 410, added schema-v3 retirement of the old SQLite `leads` table and opportunistic removal of `leads.ndjson`, and rewrote privacy/deployment copy. The site explains external processors, temporary-file cleanup, possible transcript/note retention without automatic expiry, website click analytics, host access logs and backup limitations. Historical backups still require operator review. |
| P1 — tracking/security | Browser-facing tracking should not collect unnecessary identifiers, trust arbitrary hosts, or let storage failure masquerade as a rate limit. | Click records contain a section and time; app logs no longer append the raw client IP. Rate-limit filenames use a keyed HMAC pseudonym in private storage. Exact scheme/host/port allowlisting uses `GAMAS_ALLOWED_ORIGINS`; storage/limiter failure returns 503 and an exceeded limit returns 429. The endpoint has no public read route. PHP runtime behavior remains untested. |
| P1 — product claims | File types, limits, output format, pricing, accuracy and the demo must not overstate the bot. | Copy was checked against the public bot repository: supported audio/video/PowerPoint examples, default 2 GB app limit (provider/hosting limits may differ), TXT transcript, DOCX notes when generation succeeds, and raw transcript fallback are qualified. ODP/OTP, PDF, images and ZIP are not advertised as accepted. No price, testimonial, accuracy percentage or performance promise was added. Live configuration was not checked. |
| P2 — accessibility and mobile usability | Small text, contrast and touch targets were weak in selected areas; motion and mixed-direction content need explicit handling. | Increased selected demo/footer text sizes and control targets (including the inline privacy link), darkened sampled primary/muted colors, retained skip/landmark/keyboard patterns, added accessible demo progress/status state, and kept reduced-motion and bidi handling. Sampled token ratios are listed below; no browser accessibility engine or screen reader was run. |
| P2 — performance/SEO | Static first paint, image/font payloads and crawler metadata should remain suitable for static hosting. | Retained SSG prerendering; optimized the hero formats; kept responsive below-fold illustrations, local fonts, preloads, canonical/OG/Twitter metadata, and generated base-aware robots/sitemap/llms files. Build byte sizes are reported as build output only—not real-user speed or Web Vitals. |
| P2 — operational docs | Previous deployment steps referred to the retired form and old privacy/CSRF model. | Rewrote `DEPLOY.md` and `README.md` for current API, exact-origin setup, storage, schema migration, cPanel upload, verification and rollback. Historical design notes and screenshots are marked as archived. |

### Bot facts used for copy

The public `AmiraliGhamkhar/Gamas_bot` source was reviewed read-only. It supports audio, video and PowerPoint processing; raw transcript is delivered as TXT, and structured DOCX notes are delivered when note generation succeeds. The default application file-size limit in the reviewed code is 2 GB, though provider/hosting limits may differ. The reviewed database can retain Telegram identifiers, file metadata, transcripts and notes; automatic transcript/note expiry was not defined in that code. External speech/language services may be configured. These findings do **not** prove the live bot is online, configured the same way today, or subject to any unreviewed provider policy.

## Validation evidence

| Check | Result |
|---|---|
| `npm ci` | Passed from the committed lockfile. |
| `npm run lint` | Passed; ESLint reported zero warnings/errors. |
| `npm audit` | Passed; `found 0 vulnerabilities` for the full lockfile at audit time. |
| `npm run build` | Passed on the root base. Vite 6.4.3 emitted a prerendered `dist/index.html`; postbuild checks passed and stripped build manifests. Main JS: 191.66 kB (60.31 kB gzip); CSS: 40.39 kB (8.85 kB gzip). These are generated bundle sizes, not load-time measurements. |
| `VITE_BASE=/gamas/ VITE_SITE_URL=https://gamas.bot npm run build` | Passed. Postbuild checks passed; static assertions confirmed `/gamas/` canonical/OG, JS/CSS/font/image references, `RewriteBase`, crawler URLs, no public PHP/database/log artifacts, and no lead form/endpoint in the prerendered HTML. |
| Hero and OG images | Inspected. Hero variants are 941×1672: JPG 98,332 bytes, WebP 30,708 bytes, AVIF about 13 kB. OG image is 1200×630 and about 102 kB. These are asset sizes only. |
| Development-server host smoke | Vite returned HTTP 200 for a local request and a request using an `.e2b.app` Host header, confirming the Arena preview allowlist. This is not a browser test. |
| JavaScript syntax | `node --check` passed for all three optional Playwright harnesses and `scripts/postbuild.mjs`. |
| PHP source syntax | `api/bootstrap.php`, `api/track.php` and `api/lead.php` parsed with a PHP-7 grammar parser. This is not PHP execution or `php -l`. |
| Browser / responsive / accessibility | **Not run.** No Chromium/Firefox executable was available. Playwright Chromium download was attempted and failed with `ECONNRESET` from the CDN. Optional harnesses now cover mobile/desktop widths, overflow, touch targets, reduced motion, drawer focus/Escape, FAQ/disclosure, demo state, CTA tracking, metadata and local assets, but results do not exist for this checkout. |
| PHP/Apache/cPanel/API | **Not run.** PHP CLI and `apachectl` were unavailable; no live hosting account, headers, file permissions, redirect chain, database migration, API response, or Telegram bot configuration was tested. |
| Lighthouse / Web Vitals | **Not run for this version.** The archived `docs/screenshots/lighthouse-prod.json` refers to the old email endpoint and is explicitly not current evidence. |

### Sampled contrast calculations

Calculated from CSS hex tokens (not a complete rendered audit): `#5b737d` on `#fff9ef` = **4.78:1**; `#15759f` on `#fff9ef` = **4.92:1**; white on gradient endpoints `#15759f` / `#116d98` = **5.15:1 / 5.73:1**; `#d1e2e4` on `#0c3040` = **10.39:1**. Full element-by-element contrast, gradients over all stops, focus treatment and disabled/hover states still need browser review.

## Readiness scores

Scores are an engineering-review estimate, not Lighthouse, usability-study or production metrics. **10** means verified on the deployed target with relevant runtime/browser checks; **5** means substantial source/build work but important runtime evidence is missing.

| Area | Score | Basis |
|---|---:|---|
| Architecture and static deployment | 8.0/10 | Existing stack preserved; root and subfolder builds/postbuild pass; live Apache/cPanel remains unverified. |
| Security and privacy | 7.5/10 | Stronger exact-origin, private-storage and retention behavior in source; PHP/runtime/backup review remains open. |
| Mobile and responsive layout | 6.5/10 | CSS fixes and a responsive harness are in place; no real browser viewport run. |
| Accessibility | 7.0/10 | Semantic/keyboard/reduced-motion/RTL work is present; no assistive-technology or rendered audit. |
| Performance engineering | 7.5/10 | Small built CSS, split/static output, self-hosted fonts and optimized hero assets; no current Lighthouse or field data. |
| SEO and truthful content | 8.5/10 | Prerendered HTML, metadata/crawler output and bot-checked claims; no indexing/search-performance evidence. |
| Validation coverage | 5.0/10 | Lint, audit and both builds pass; browser, PHP, Apache, live API and cPanel checks are outstanding. |
| **Overall (unweighted mean)** | **7.1/10** | Good source/build readiness; incomplete runtime/deployment verification. |

## Required before release

1. Run the optional Playwright harnesses on Chromium and at least one mobile browser; inspect 320, 360, 375, 414, tablet and desktop widths, keyboard flow, reduced motion, images, fonts, console and network requests.
2. Run `php -l` and exercise the API on the target PHP version: allowed/disallowed origins, method, malformed section, limiter exhaustion/storage failure, SQLite and flat-file paths, HTTP 410, data permissions and legacy migration.
3. Upload to a staging cPanel account with the intended root/subfolder layout. Verify Apache modules/`AllowOverride`, `RewriteBase`, canonical redirects behind the real proxy, CSP/security/cache headers, real missing-asset 404s, deep links, API routing and `GAMAS_DATA_DIR` permissions.
4. Check/remove legacy lead data in every configured data directory, account snapshot and backup according to the operator’s retention/legal requirements. The code only handles the current configured path; it cannot erase provider backups.
5. Confirm current bot settings, external-provider data terms and live bot availability with the product owner. Do not infer these from this website build or the public source snapshot.
6. Generate a fresh Lighthouse/Web Vitals baseline only after the deploy target and browser environment are available; do not reuse the archived report.
