import { SectionHeader } from '@marketing/components/section-header'
import { CreditCard, Database, Lock, Mail, MonitorSmartphone, Zap } from 'lucide-react'

const features = [
  {
    icon: Lock,
    title: 'Authentication',
    description:
      'BetterAuth with Google OAuth and email/password. Session management, password resets, and email verification built in.',
  },
  {
    icon: CreditCard,
    title: 'Stripe Payments',
    description:
      'Checkout, subscriptions, and webhooks. Sync subscription state to your database automatically.',
  },
  {
    icon: Database,
    title: 'Database Ready',
    description:
      'PostgreSQL with Drizzle ORM. Type-safe queries, migrations, and schema management out of the box.',
  },
  {
    icon: Mail,
    title: 'Transactional Email',
    description:
      'Resend integration with React Email templates. Send beautiful emails from day one.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Responsive UI',
    description:
      'shadcn/ui components with Tailwind CSS. Dark mode, mobile-first, and fully accessible.',
  },
  {
    icon: Zap,
    title: 'Full-Stack TypeScript',
    description:
      'TanStack Start, Hono API, and Drizzle — end-to-end type safety across your entire stack.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-b py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Features"
          title="Everything you need to launch"
          description="Stop stitching together auth, payments, and email. It's all here, tested, and ready to go."
        />

        <div className="mx-auto mt-16 grid max-w-5xl gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-3 bg-card p-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent">
                <feature.icon className="size-5 text-accent-foreground" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
