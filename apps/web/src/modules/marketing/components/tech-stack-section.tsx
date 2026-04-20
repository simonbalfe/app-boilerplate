import { SectionHeader } from '@marketing/components/section-header'

const stack = [
  { name: 'TanStack Start', category: 'Framework' },
  { name: 'React 19', category: 'UI' },
  { name: 'Hono', category: 'API' },
  { name: 'BetterAuth', category: 'Auth' },
  { name: 'Drizzle ORM', category: 'Database' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Stripe', category: 'Payments' },
  { name: 'Resend', category: 'Email' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'shadcn/ui', category: 'Components' },
  { name: 'Turborepo', category: 'Tooling' },
  { name: 'TypeScript', category: 'Language' },
]

export function TechStackSection() {
  return (
    <section id="tech-stack" className="border-b py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Tech Stack"
          title="Built on the modern web"
          description="A carefully selected stack that prioritizes developer experience, type safety, and production readiness."
        />

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {stack.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col items-center gap-1 rounded-lg border bg-card px-4 py-4 text-center shadow-sm"
            >
              <span className="text-sm font-medium text-foreground">{tech.name}</span>
              <span className="text-xs text-muted-foreground">{tech.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
