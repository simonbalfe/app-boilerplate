import env from '@/src/env'

export const siteConfig = {
  name: 'SaaS Boilerplate',
  shortName: 'SaaSBP',
  tagline: 'Ship Your SaaS in Record Time',
  description:
    'Open source SaaS starter with auth, payments, database, and email. Built with TanStack Start, React 19, Hono, Drizzle, and Stripe.',
  url: env.APP_URL,
  ogImage: '/og.png',
  locale: 'en_US',
  language: 'en',
  author: {
    name: 'Your Name',
    url: env.APP_URL,
  },
  twitter: {
    site: '@yourhandle',
    creator: '@yourhandle',
  },
  keywords: [
    'SaaS boilerplate',
    'TanStack Start',
    'React 19',
    'Hono',
    'Drizzle',
    'Stripe',
    'BetterAuth',
  ],
  themeColor: '#000000',
  nav: [
    { label: 'Features', href: '/#features' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Tech stack', href: '/#tech-stack' },
  ],
  disallowPaths: ['/dashboard', '/settings', '/auth', '/api/'],
} as const

export type SiteConfig = typeof siteConfig
