import env from '@/src/env'
import { createFileRoute } from '@tanstack/react-router'

const MARKETING_ROUTES = [{ path: '/', changefreq: 'weekly', priority: '1.0' }]

export const Route = createFileRoute('/sitemap.xml' as any)({
  server: {
    handlers: {
      GET: () => {
        const siteUrl = env.APP_URL
        const today = new Date().toISOString().split('T')[0]

        const urls = MARKETING_ROUTES.map(
          (route) => `  <url>
    <loc>${siteUrl}${route.path}</loc>
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
