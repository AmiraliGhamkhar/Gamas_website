/**
 * Machine-readable entity graph for the site. Constants are shared with page
 * links and postbuild output so identity, canonical URL and deploy path agree.
 * Rendered by vite-react-ssg into the static HTML.
 */
import { BOT_URL_BASE, SITE_ORIGIN, SITE_URL, sitePath } from '../lib/constants'

const DESCRIPTION =
  'ربات تلگرامی فارسی برای تبدیل فایل‌های آموزشی به رونوشت گفتار و جزوه‌ی قابل مرور.'
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
      applicationSubCategory: 'Persian lecture transcription and notes',
      inLanguage: 'fa',
      publisher: { '@id': ORGANIZATION_ID },
      sameAs: [BOT_URL_BASE],
    },
  ],
}

export default function StructuredData() {
  const jsonLdHtml = JSON.stringify(graph).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
}
