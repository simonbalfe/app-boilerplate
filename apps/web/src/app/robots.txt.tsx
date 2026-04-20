import { createFileRoute } from '@tanstack/react-router'
import { siteConfig } from '@/src/site.config'

export const Route = createFileRoute('/robots.txt' as any)({
  server: {
    handlers: {
      GET: () => {
        const lines = [
          'User-agent: *',
          'Allow: /',
          '',
          ...siteConfig.disallowPaths.map((p) => `Disallow: ${p}`),
          '',
          `Sitemap: ${siteConfig.url}/sitemap.xml`,
        ]

        return new Response(lines.join('\n'), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })
      },
    },
  },
})
