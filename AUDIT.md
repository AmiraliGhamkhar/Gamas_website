# Gamas website — code and deployment audit

**Audit date:** 2026-09-29  
**Scope:** tracked frontend, PHP API, storage/database logic, static assets and metadata, build configuration, Apache/PHP hosting files, and the project documentation. This is a code review—not a penetration test or a verification of a live cPanel account.

## Summary

The project is a statically pre-rendered React/Vite landing page with a small PHP API for the waitlist and CTA events. It is structurally suitable for cPanel shared hosting: Node is only needed to build; Apache serves `dist/`; PHP runs the two API endpoints; data is stored outside `public_html` where possible.

The review found and fixed several functional, privacy, deployment, and dependency issues:

| Area | Finding | Resolution |
|---|---|---|
| Build dependency | The locked Vite 5 release and its bundled `esbuild` had known development-server advisories. | Upgraded to Vite 6.4.3; `npm audit` now reports no vulnerabilities. |
| CTA tracking | A `sendBeacon()` return value of `false` was treated as success, dropping the event instead of trying `fetch()`. | A rejected beacon now falls back to `fetch()` with `keepalive`. |
| Waitlist | A one-second anti-spam timing check could return fake success for a legitimate quick submission; the confirmation also promised email follow-up although no mailer exists. | Removed the timing check and now state clearly that submissions are stored but no automatic follow-up email is sent. CSRF, origin validation, honeypot, input validation, and rate limiting remain. |
| CTA database | The API returned a cumulative click total that the UI did not use, and stored IP/user-agent with CTA records. | Removed the total from the response and stopped storing click IP/user-agent. Existing SQLite values are cleared on upgrade; SQLite events older than 90 days are periodically removed. The no-SQLite click log is non-identifying and capped at 1 MiB. |
| Storage permissions | Visitor data directories and database/log files could inherit broader default permissions. | Private data directories are set to `0700`; stored files are set to `0600`. |
| cPanel addon-domain storage | Using the immediate parent of a nested DocumentRoot could place `gamas_data` inside a broader `public_html` tree. | Storage candidates are resolved at the account-home level and rejected if they fall under the current DocumentRoot or its `public_html`; only the protected `data/` fallback may live in-root. |
| cPanel/subfolder paths | Optional `VITE_BASE` instructions did not match hard-coded frontend/API/crawler paths. | Assets, API calls, canonical metadata, robots.txt, sitemap.xml, and Apache API exclusions now honor `/` or a supported subfolder base. |
| Product metadata | Structured data advertised a zero-price pre-order while the page says pricing is not finalized; the mobile CTA also claimed a free trial. | Removed the fabricated offer and the “free trial” wording. |
| Footer date | The Persian copyright year was hard-coded to 1404 and had become stale. | It now uses the Persian calendar year dynamically. |
| Visible TODOs | Pricing, plans, and testimonials showed developer-facing TODO cards. | Replaced them with an honest “not announced” pricing/plans status and an empty testimonial state; no price or review was invented. |
| Privacy notice | The waitlist note described audio processing rather than what this website stores. | The form and privacy section now disclose the waitlist fields and CTA-event handling. |
| Deploy hardening | Raw NDJSON and SQLite sidecar files were not covered by the static deny rules. | Added NDJSON/JSONL and SQLite WAL/SHM/journal protections and build-output checks. |
| Frontend UX | Switching from an open mobile menu to desktop could leave body scrolling locked; closed menu links remained reachable. | The menu closes at desktop width, supports Escape, restores focus, hides closed links from keyboard/screen-reader navigation, and accounts for the sticky header when scrolling to anchors. |
| Configuration | Several visible bot handles/links ignored `VITE_BOT_USERNAME`. | Frontend links and labels now use the configured username consistently. |
| Development server | Vite must bind all interfaces for proxied previews, but previously accepted arbitrary Host headers and broad CORS. | Host checks stay enabled with only the Arena preview domain added; broad CORS is removed from dev and preview servers. Do not expose a development server on an untrusted network. |

## Checks performed

- `npm ci` and `npm run lint`.
- Production SSG build for the cPanel root (`VITE_BASE=/`).
- Production SSG build for a subfolder (`VITE_BASE=/gamas/`); checked emitted asset/API paths, canonical metadata, robots.txt, and sitemap.xml.
- `npm audit` and `npm audit --omit=dev`.
- Parsed all PHP files with a PHP grammar parser.
- Checked the generated build for missing `.htaccess`, leaked manifests, source/config files, and sensitive data/database/log extensions.

## cPanel deployment requirements

For the default root deployment:

1. Build locally/CI with Node 20.19+, 22.13+, or 24+: `npm ci && npm run build`.
2. Upload the **contents** of `dist/` (including the hidden `.htaccess`) to `public_html/`.
3. Upload `api/` to `public_html/api/`.
4. Use a maintained PHP release (PHP 8.2+ recommended; 7.4 is only the compatibility floor). `pdo_sqlite` is recommended but optional; the backend has an NDJSON fallback.
5. Keep visitor data outside `public_html` where possible. The API defaults to a private sibling directory and falls back to a protected `data/` directory.

The full upload, SSL, permissions, verification, rollback, Cloudflare, and hosting notes are in [`DEPLOY.md`](DEPLOY.md). Node is not required on the cPanel server.

## Remaining items to resolve before production

- **Waitlist retention:** email, source, IP address, user-agent, and timestamp are retained for leads, with no automatic deletion policy. Choose a retention period and backup/deletion procedure appropriate to the service.
- **Hosting-specific verification:** this environment has no PHP runtime or Apache/cPanel account, so PHP was syntax-parsed but the endpoints, `.htaccess`, `.user.ini`, file permissions, SSL redirects, and actual database writes still need smoke-testing on the target host. Follow `DEPLOY.md` §6 after upload.
- **Cloudflare:** if the domain is actually proxied through Cloudflare, set `GAMAS_TRUST_CF_IP=1`; otherwise leave it unset. Misconfiguration can make all visitors share the proxy IP for rate limiting.
- **Product decisions:** pricing and plan details are not finalized, and there are no customer quotes to publish yet. The page now states this without developer-facing TODO cards or fabricated testimonials; decide pricing before accepting paid users, and add reviews only with consent.
- **External bot verification:** this checkout contains the website and its PHP waitlist/tracking APIs, not the Telegram bot's processing backend. Verify supported formats, third-party processors, and retention claims against the bot configuration before launch.
- **Operational ownership:** decide who can read/export/delete leads and back up `~/gamas_data`; the website does not send email or provide an admin dashboard.
