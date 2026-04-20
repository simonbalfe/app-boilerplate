import { createFileRoute } from '@tanstack/react-router'
import { siteConfig } from '@/src/site.config'

type SitemapRoute = {
  path: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: string
}

const MARKETING_ROUTES: SitemapRoute[] = [{ path: '/', changefreq: 'weekly', priority: '1.0' }]

export const Route = createFileRoute('/sitemap.xml' as any)({
  server: {
    handlers: {
      GET: () => {
        const today = new Date().toISOString().split('T')[0]

        const urls = MARKETING_ROUTES.map(
          (route) => `  <url>
    <loc>${siteConfig.url}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
        ).join('\n')

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

        return new Response(xml, {
          headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        })
      },
    },
  },
})
