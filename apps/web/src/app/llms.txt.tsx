import { createFileRoute } from '@tanstack/react-router'
import { siteConfig } from '@/src/site.config'

export const Route = createFileRoute('/llms.txt' as any)({
  server: {
    handlers: {
      GET: () => {
        const body = [
          `# ${siteConfig.name}`,
          '',
          `> ${siteConfig.description}`,
          '',
          '## Key pages',
          '',
          `- [Home](${siteConfig.url}/): ${siteConfig.tagline}`,
          '',
        ].join('\n')

        return new Response(body, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })
      },
    },
  },
})
