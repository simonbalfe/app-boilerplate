import { createFileRoute } from '@tanstack/react-router'
import { siteConfig } from '@/src/site.config'

export const Route = createFileRoute('/manifest.webmanifest' as any)({
  server: {
    handlers: {
      GET: () => {
        const body = JSON.stringify({
          name: siteConfig.name,
          short_name: siteConfig.shortName,
          description: siteConfig.description,
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: siteConfig.themeColor,
          icons: [
            { src: '/logo.svg', sizes: 'any', type: 'image/svg+xml' },
            { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
          ],
        })
        return new Response(body, {
          headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
        })
      },
    },
  },
})
