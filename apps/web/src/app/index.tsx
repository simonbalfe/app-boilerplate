import { CtaSection } from '@marketing/components/cta-section'
import { FeaturesSection } from '@marketing/components/features-section'
import { Footer } from '@marketing/components/footer'
import { HeroSection } from '@marketing/components/hero-section'
import { HowItWorksSection } from '@marketing/components/how-it-works-section'
import { Navbar } from '@marketing/components/navbar'
import { TechStackSection } from '@marketing/components/tech-stack-section'
import { seo } from '@marketing/lib/seo'
import { jsonLdScript, softwareAppSchema } from '@marketing/lib/schema'
import { createFileRoute } from '@tanstack/react-router'
import { siteConfig } from '@/src/site.config'

export const Route = createFileRoute('/')({
  head: () => ({
    ...seo({
      title: `${siteConfig.name} | ${siteConfig.tagline}`,
      path: '/',
    }),
    scripts: [jsonLdScript(softwareAppSchema())],
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
