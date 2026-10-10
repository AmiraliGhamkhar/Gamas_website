/**
 * Machine-readable entity graph for the page. Identity and deployment URLs are
 * shared with the UI; Telegram is linked only after an explicit build-time
 * identity attestation, not merely because a username override was supplied.
 *
 * Types are chosen to describe what the page really shows:
 *   - Organization / WebSite / WebPage for the site and its publisher
 *   - SoftwareApplication for the Telegram bot (a software product, not a
 *     browser app, so it is not modelled as WebApplication)
 *   - HowTo for the genuine three-step flow shown in the "how it works" section
 *
 * No "AI-only" markup is used: Google documents no special schema for AI
 * features, and structured data must match visible content (see docs/seo-geo.md).
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
const HOWTO_ID = `${SITE_URL}#how`
const verifiedBotIdentity = BOT_IDENTITY_VERIFIED ? { sameAs: [BOT_URL_BASE] } : {}

// Keep the step text aligned with src/components/HowItWorks.jsx.
const HOW_TO_STEPS = [
  {
    name: 'فایل کلاس را بفرست',
    text: 'ویس، ویدیو یا پاورپوینت را در تلگرام برای ربات گاماس بفرست.',
  },
  {
    name: 'گفتار به متن می‌آید',
    text: 'هوش مصنوعی گفتار فارسی را پیاده می‌کند و در فایل ارائه از متن اسلایدها هم استفاده می‌شود.',
  },
  {
    name: 'رونوشت و جزوه را بگیر',
    text: `رونوشت ${PRODUCT.outputs.transcriptExtension} فرستاده می‌شود؛ اگر ساخت جزوه موفق شود، فایل Word (${PRODUCT.outputs.notesExtension}) هم می‌آید.`,
  },
]

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: PRODUCT.nameFa,
      alternateName: PRODUCT.nameLatin,
      url: SITE_URL,
      description: DESCRIPTION,
      inLanguage: PRODUCT.seo.language,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}${sitePath('logo-mark.svg')}`,
        width: 512,
        height: 512,
      },
      ...verifiedBotIdentity,
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_URL,
      name: PRODUCT.nameFa,
      alternateName: PRODUCT.nameLatin,
      description: DESCRIPTION,
      inLanguage: PRODUCT.seo.language,
      publisher: { '@id': ORGANIZATION_ID },
    },
    {
      '@type': 'WebPage',
      '@id': WEBPAGE_ID,
      url: SITE_URL,
      name: PRODUCT.seo.title,
      description: DESCRIPTION,
      inLanguage: PRODUCT.seo.language,
      datePublished: PRODUCT.seo.publishedOn,
      dateModified: PRODUCT.seo.updatedOn,
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
      inLanguage: PRODUCT.seo.language,
      featureList: [...PRODUCT.features],
      publisher: { '@id': ORGANIZATION_ID },
      ...verifiedBotIdentity,
    },
    {
      '@type': 'HowTo',
      '@id': HOWTO_ID,
      name: 'تبدیل ویس یا فایل کلاس به متن و جزوه‌ی فارسی',
      description:
        'در سه قدم فایل صوتی، ویدیویی یا پاورپوینت کلاس را در تلگرام به رونوشت متنی و جزوه‌ی فارسی تبدیل کن.',
      inLanguage: PRODUCT.seo.language,
      isPartOf: { '@id': WEBPAGE_ID },
      step: HOW_TO_STEPS.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        url: `${SITE_URL}#how`,
      })),
    },
  ],
}

export default function StructuredData() {
  const jsonLdHtml = JSON.stringify(graph).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
}
