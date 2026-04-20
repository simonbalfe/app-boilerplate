import { LayoutContent } from '@app/components/layout-content'
import { PostHogProvider } from '@shared/components/providers/posthog-provider'
import { ThemeProvider } from '@shared/components/providers/theme-provider'
import { jsonLdScript, organizationSchema, websiteSchema } from '@marketing/lib/schema'
import { seo } from '@marketing/lib/seo'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { useState } from 'react'
import env from '@/src/env'
import { siteConfig } from '@/src/site.config'
import '@/src/globals.css'

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap'

export const Route = createRootRoute({
  head: () => {
    const { meta, links } = seo({})
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: siteConfig.themeColor },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: siteConfig.shortName },
        { name: 'format-detection', content: 'telephone=no' },
        ...meta,
      ],
      links: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        { rel: 'preconnect', href: env.POSTHOG_HOST, crossOrigin: 'anonymous' },
        { rel: 'stylesheet', href: FONT_HREF },
        ...links,
      ],
      scripts: [jsonLdScript([organizationSchema(), websiteSchema()])],
    }
  },
  component: RootLayout,
})

function RootLayout() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang={siteConfig.language} suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <PostHogProvider>
              <LayoutContent>
                <Outlet />
              </LayoutContent>
            </PostHogProvider>
          </ThemeProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
