import env from '@/src/env'
import { CtaSection } from '@shared/components/marketing/cta-section'
import { FeaturesSection } from '@shared/components/marketing/features-section'
import { Footer } from '@shared/components/marketing/footer'
import { HeroSection } from '@shared/components/marketing/hero-section'
import { HowItWorksSection } from '@shared/components/marketing/how-it-works-section'
import { Navbar } from '@shared/components/marketing/navbar'
import { TechStackSection } from '@shared/components/marketing/tech-stack-section'
import { seo } from '@shared/lib/seo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    ...seo({
      title: 'SaaS Boilerplate | Ship Your SaaS in Record Time',
      description:
        'Open source SaaS starter with auth, payments, database, and email. Built with TanStack Start, React 19, Hono, Drizzle, and Stripe. Clone and launch in an afternoon.',
    }),
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'SaaS Boilerplate',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Any',
          description:
            'Open source SaaS boilerplate with auth, payments, database, and email built in.',
          url: env.APP_URL,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }),
      },
    ],
  }),
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TechStackSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
