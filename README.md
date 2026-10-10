# Gamas website

Persian, right-to-left landing page for **Gamas**, a Telegram bot that uses AI to transcribe class speech and prepare study notes from supported audio, video and PowerPoint files.

The site keeps its existing React + Vite + `vite-react-ssg` architecture. It is pre-rendered as static HTML for cPanel; Node is used only at build time. Styling is plain CSS, with self-hosted Vazirmatn and Lalezar fonts. A small PHP endpoint records CTA clicks; the former email form is retired.

## Build and deploy

```bash
npm ci
npm run lint
npm test
npm run build       # static production output in dist/
```

The production target is **`https://gamadesk.ir`** deployed at the `public_html/` root with the Telegram bot at **`https://t.me/Gamas_jozveh_bot`**. Both are the source defaults, so a plain `npm run build` produces the correct canonical URLs and CTA links. Build-time overrides are documented in [`.env.example`](.env.example); copy it to an untracked `.env.local` or export the variables.

The default Telegram username (`Gamas_jozveh_bot`) is the fallback baked into the source. It can still be overridden at build time; the override itself does not prove ownership or live availability:

```bash
VITE_BOT_USERNAME=your_bot_username npm run build
```

Only after independently confirming the username and destination, a deploy operator may also set `VITE_BOT_IDENTITY_VERIFIED=true`; that explicit attestation is what allows JSON-LD to link the bot as the organization’s `sameAs`. No build or source snapshot verifies live Telegram identity.

For a subfolder such as `https://gamadesk.ir/gamas/`:

```bash
VITE_BASE=/gamas/ VITE_SITE_URL=https://gamadesk.ir npm run build
```

Upload the contents of `dist/` (including `.htaccess`) to `public_html/`, then upload `api/` to `public_html/api/`. For a subfolder build, put both under the matching subfolder. Node is not required on cPanel. See [`DEPLOY.md`](DEPLOY.md) for PHP, Apache, storage, privacy, exact-origin configuration, verification and rollback details.

## Repository map

| Path | Purpose |
|---|---|
| `src/` | React page, accessible components, Persian RTL copy and CSS |
| `public/` | Self-hosted fonts, responsive image assets, crawler files and production `.htaccess` |
| `api/` | `track.php` for CTA events, retired `lead.php` (410), shared PHP storage/security helpers |
| `scripts/postbuild.mjs` | Removes SSG manifests, emits base-aware crawler files, hashes inline scripts into CSP, and validates assets/deploy paths/sensitive files |
| `verify-*.mjs` | Optional Playwright browser harnesses for viewports, interactions, metadata and local assets; outputs go to ignored `docs/screenshots/current/` |
| `tests/product.test.js` | Dependency-free checks for username handling, CTA events and core product claims |
| `DEPLOY.md` | cPanel deployment and operational guide |
| `AUDIT.md` | Evidence-based engineering audit and validation limits |

## Optional browser regression checks

The page itself needs no browser-test package. To run the optional Playwright harnesses locally, install the tool/browser temporarily, start the Vite server in another terminal, then run the checks:

```bash
npm install --no-save --package-lock=false playwright
npx playwright install chromium
npm run dev
# in another terminal:
BASE_URL=http://127.0.0.1:5173/ node verify-redesign.mjs
BASE_URL=http://127.0.0.1:5173/ node verify-deep.mjs
BASE_URL=http://127.0.0.1:5173/ node verify-final.mjs
```

The interaction harness stubs Telegram and `/api/track.php`; it does not test PHP or contact the live bot. Screenshots/reports go under ignored `docs/screenshots/current/`. These tools are optional and are not part of the production build or cPanel upload.

## Runtime notes

- Build: Node 20.19+, 22.13+, or 24+.
- PHP: 7.4 is the compatibility floor; use a maintained release (8.2+ recommended).
- `pdo_sqlite` is optional for the small CTA tracker; it falls back to a private NDJSON file.
- Set `GAMAS_ALLOWED_ORIGINS` to a comma-separated list of **full origins** only when the canonical deployed origin differs from `https://gamadesk.ir`. Scheme and port are checked, not just the hostname.
- Set `GAMAS_DATA_DIR` to a private directory outside `public_html` when cPanel does not derive a suitable account-home directory automatically.
- Set `GAMAS_TRUST_CF_IP=1` only when Cloudflare is actually the trusted reverse proxy.

The site does not collect email addresses. The site’s privacy section is based on the pinned, reviewed bot-source revision—not live provider/account settings—and warns that no automatic deletion period is defined for bot transcripts or notes. The default Telegram handle is unverified until the deploy operator checks it.
