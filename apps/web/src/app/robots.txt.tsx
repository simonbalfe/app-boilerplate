import env from '@/src/env'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/robots.txt' as any)({
  server: {
    handlers: {
      GET: () => {
        const siteUrl = env.APP_URL

        return new Response(
          [
            'User-agent: *',
            'Allow: /',
            '',
            'Disallow: /dashboard',
            'Disallow: /settings',
            'Disallow: /auth',
            'Disallow: /api/',
            '',
            `Sitemap: ${siteUrl}/sitemap.xml`,
          ].join('\n'),
          { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
        )
      },
    },
  },
})
