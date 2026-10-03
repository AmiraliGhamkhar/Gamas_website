/**
 * Machine-readable entity graph for the whole site.
 *
 * Lives next to src/lib/constants.js — the data it describes — so the bot
 * handle, origin and deploy path can never drift between the page and the
 * structured data. Rendered server-side by vite-react-ssg, so it is present in
 * dist/index.html without JavaScript.
 *
 * One @graph, not three disconnected nodes: WebSite and SoftwareApplication
 * both point at Organization via `publisher`, and Organization carries
 * `sameAs` for the Telegram bot, so an answer engine that learns the bot from
 * Telegram can resolve this page as the same entity.
 *
 * Only facts that are visible on the page are asserted. No `offers`: pricing is
 * still undecided and access is by approval, so a price claim would be false.
 */
import { BOT_URL_BASE, SITE_ORIGIN, SITE_URL, sitePath } from '../lib/constants'

const DESCRIPTION =
  'ربات تلگرامی فارسی: ویس، ویدیو و پاورپوینت کلاس را به جزوه‌ای مرتب و فارسی تبدیل می‌کند.'
const ORGANIZATION_ID = `${SITE_URL}#organization`

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'گاماس',
      alternateName: 'Gamas Bot',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}${sitePath('favicon.svg')}`,
        width: 64,
        height: 64,
      },
      sameAs: [BOT_URL_BASE],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      url: SITE_URL,
      name: 'گاماس',
      description: DESCRIPTION,
      inLanguage: 'fa-IR',
      publisher: { '@id': ORGANIZATION_ID },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}#software`,
      name: 'گاماس',
      alternateName: 'Gamas Bot',
      url: SITE_URL,
      description: DESCRIPTION,
      applicationCategory: 'EducationApplication',
      applicationSubCategory: 'Lecture-notes assistant',
      operatingSystem: 'Telegram',
      inLanguage: 'fa',
      downloadUrl: BOT_URL_BASE,
      publisher: { '@id': ORGANIZATION_ID },
      sameAs: [BOT_URL_BASE],
    },
  ],
}

export default function StructuredData() {
  // Escaped so a future value containing "<" cannot break out of the script tag.
  const jsonLdHtml = JSON.stringify(graph).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
}
