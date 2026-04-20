import { siteConfig } from '@/src/site.config'

type JsonLd = Record<string, unknown>

function absoluteUrl(path = '') {
  return `${siteConfig.url}${path}`
}

export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo.svg'),
    },
    sameAs: [siteConfig.twitter.site ? `https://twitter.com/${siteConfig.twitter.site.replace('@', '')}` : undefined].filter(
      Boolean,
    ),
  }
}

export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }
}

export function softwareAppSchema({
  price = '0',
  currency = 'USD',
  category = 'DeveloperApplication',
}: { price?: string; currency?: string; category?: string } = {}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    applicationCategory: category,
    operatingSystem: 'Any',
    description: siteConfig.description,
    url: siteConfig.url,
    offers: { '@type': 'Offer', price, priceCurrency: currency },
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function faqSchema(items: { question: string; answer: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

export function articleSchema({
  title,
  description,
  path,
  image,
  publishedAt,
  updatedAt,
}: {
  title: string
  description: string
  path: string
  image?: string
  publishedAt: string
  updatedAt?: string
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: absoluteUrl(path),
    image: image ? absoluteUrl(image) : absoluteUrl(siteConfig.ogImage),
    datePublished: publishedAt,
    dateModified: updatedAt ?? publishedAt,
    author: { '@type': 'Person', name: siteConfig.author.name },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.svg') },
    },
  }
}

export function jsonLdScript(data: JsonLd | JsonLd[]) {
  return {
    type: 'application/ld+json',
    children: JSON.stringify(data),
  }
}
