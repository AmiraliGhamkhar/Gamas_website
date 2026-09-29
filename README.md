# Gamas_website

Landing page for **Gamas**, a Persian Telegram bot that turns class audio,
video and PowerPoint files into structured notes.

React + Vite, pre-rendered with `vite-react-ssg`, GSAP for animation,
Tailwind for styling, self-hosted Vazirmatn + Lalezar fonts.

## Deploying

**Everything you need is in [`DEPLOY.md`](DEPLOY.md)** — cPanel shared
hosting (Apache + PHP), no Node on the server.

```bash
npm ci
npm run build      # → dist/  (also runs scripts/postbuild.mjs)
```

`dist/` is uploaded to `public_html/`; `api/` is uploaded to
`public_html/api/`. Visitor data is written to `~/gamas_data`, **outside**
the web root.

## Layout

| Path | What it is |
|---|---|
| `src/` | React app (SSG, single page) |
| `public/` | static assets — **and `public/.htaccess`, which Vite copies to `dist/.htaccess`** |
| `api/` | PHP endpoints: `lead.php` (email capture), `track.php` (CTA counter), `bootstrap.php` (shared) |
| `scripts/postbuild.mjs` | strips build manifests from `dist/` and fails the build on leaks |
| `DEPLOY.md` | cPanel deployment, hardening and rollback |
| `AUDIT.md` | findings, verification performed, and remaining production checks |

## Requirements

- **Build:** Node 20.19+, 22.13+, or 24+ (local or CI only — never on the server)
- **Runtime:** PHP 7.4+ for compatibility (PHP 8.2+ recommended), Apache 2.4,
  `pdo_sqlite` and `mbstring` recommended but optional — the backend falls back
  to flat files without them.

## Security notes

The API is same-origin only, CSRF-protected with a signed double-submit
cookie (no sessions), rate limited per IP, and honeypot checked. It never
leaks a filesystem path or stack trace. See `DEPLOY.md` §11 for the
shared-hosting gotchas.
