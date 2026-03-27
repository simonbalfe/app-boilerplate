import env from '@/src/env'

interface SeoConfig {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
}

export function seo({
  title,
  description,
  path = '',
  image,
  type = 'website',
  noindex,
}: SeoConfig) {
  const url = `${env.APP_URL}${path}`
  const imageUrl = image ? (image.startsWith('http') ? image : `${env.APP_URL}${image}`) : undefined

  const meta: Record<string, string>[] = [
    { title },
    { name: 'description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { name: 'twitter:card', content: imageUrl ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ]

  if (imageUrl) {
    meta.push(
      { property: 'og:image', content: imageUrl },
      { name: 'twitter:image', content: imageUrl },
    )
  }

  if (noindex) {
    meta.push({ name: 'robots', content: 'noindex, nofollow' })
  }

  const links = [{ rel: 'canonical', href: url }]

  return { meta, links }
}
