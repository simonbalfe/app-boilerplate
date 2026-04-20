import { siteConfig } from '@/src/site.config'

interface SeoConfig {
  title?: string
  description?: string
  path?: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  noindex?: boolean
  keywords?: readonly string[]
  publishedAt?: string
  updatedAt?: string
}

function absolute(url: string) {
  if (url.startsWith('http')) return url
  return `${siteConfig.url}${url.startsWith('/') ? url : `/${url}`}`
}

export function seo({
  title,
  description = siteConfig.description,
  path = '',
  image = siteConfig.ogImage,
  imageAlt,
  type = 'website',
  noindex,
  keywords = siteConfig.keywords,
  publishedAt,
  updatedAt,
}: SeoConfig = {}) {
  const fullTitle = title
    ? title.includes(siteConfig.name)
      ? title
      : `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`

  const url = `${siteConfig.url}${path}`
  const imageUrl = absolute(image)

  const meta: Record<string, string>[] = [
    { title: fullTitle },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords.join(', ') },
    { name: 'author', content: siteConfig.author.name },

    { property: 'og:type', content: type },
    { property: 'og:site_name', content: siteConfig.name },
    { property: 'og:locale', content: siteConfig.locale },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: imageAlt ?? fullTitle },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: siteConfig.twitter.site },
    { name: 'twitter:creator', content: siteConfig.twitter.creator },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
  ]

  if (type === 'article') {
    if (publishedAt) meta.push({ property: 'article:published_time', content: publishedAt })
    if (updatedAt) meta.push({ property: 'article:modified_time', content: updatedAt })
  }

  if (noindex) meta.push({ name: 'robots', content: 'noindex, nofollow' })

  const links = [{ rel: 'canonical', href: url }]

  return { meta, links }
}
