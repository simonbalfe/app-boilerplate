import { SectionHeader } from '@shared/components/marketing/section-header'
import { GitFork, Rocket, Wrench } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: GitFork,
    title: 'Clone & Configure',
    description:
      'Fork the repo, set your environment variables, and connect your database. Five minutes to a running app.',
  },
  {
    number: '02',
    icon: Wrench,
    title: 'Build Your Product',
    description:
      'Focus on your unique features. Auth, payments, and infrastructure are handled. Just add your business logic.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Deploy & Scale',
    description:
      'Push to production with Docker or Cloudflare. Your SaaS is ready for users from day one.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-b bg-muted/50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="How It Works"
          title="Three steps to launch"
          description="From clone to production in an afternoon. No boilerplate fatigue."
        />

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">{step.number}</span>
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent">
                  <step.icon className="size-5 text-accent-foreground" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
