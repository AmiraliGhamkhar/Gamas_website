/**
 * Machine-readable entity graph for the page. Identity and deployment URLs are
 * shared with the UI; Telegram is linked only after an explicit build-time
 * identity attestation, not merely because a username override was supplied.
 */
import {
  BOT_IDENTITY_VERIFIED,
  BOT_URL_BASE,
  PRODUCT,
  SITE_ORIGIN,
  SITE_URL,
  sitePath,
} from '../lib/constants'

const DESCRIPTION = PRODUCT.seo.description
const ORGANIZATION_ID = `${SITE_URL}#organization`
const WEBSITE_ID = `${SITE_URL}#website`
const WEBPAGE_ID = `${SITE_URL}#webpage`
const SOFTWARE_ID = `${SITE_URL}#software`
const verifiedBotIdentity = BOT_IDENTITY_VERIFIED ? { sameAs: [BOT_URL_BASE] } : {}

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: PRODUCT.nameFa,
      alternateName: PRODUCT.nameLatin,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}${sitePath('favicon.svg')}`,
        width: 64,
        height: 64,
      },
      ...verifiedBotIdentity,
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_URL,
      name: PRODUCT.nameFa,
      description: DESCRIPTION,
      inLanguage: 'fa-IR',
      publisher: { '@id': ORGANIZATION_ID },
    },
    {
      '@type': 'WebPage',
      '@id': WEBPAGE_ID,
      url: SITE_URL,
      name: PRODUCT.seo.title,
      description: DESCRIPTION,
      inLanguage: 'fa-IR',
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': SOFTWARE_ID },
      mainEntity: { '@id': SOFTWARE_ID },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}${sitePath('og-image.jpg')}`,
        width: 1200,
        height: 630,
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': SOFTWARE_ID,
      name: PRODUCT.nameFa,
      alternateName: PRODUCT.nameLatin,
      url: SITE_URL,
      description: DESCRIPTION,
      applicationCategory: 'EducationApplication',
      applicationSubCategory: 'Persian lecture transcription and notes',
      inLanguage: 'fa',
      publisher: { '@id': ORGANIZATION_ID },
      ...verifiedBotIdentity,
    },
  ],
}

export default function StructuredData() {
  const jsonLdHtml = JSON.stringify(graph).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
}
