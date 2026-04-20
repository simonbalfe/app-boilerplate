import { useUser } from '@shared/hooks/use-user'
import { Link } from '@tanstack/react-router'
import { Badge } from '@ui/components/badge'
import { Button } from '@ui/components/button'
import { ArrowRight, Github } from 'lucide-react'

export function HeroSection() {
  const { user } = useUser()

  return (
    <section className="relative overflow-hidden border-b pt-32 pb-20 md:pt-44 md:pb-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-accent)_0%,transparent_50%)]" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1 text-xs">
            <span className="size-1.5 rounded-full bg-primary" />
            Open Source & Free
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Ship your SaaS
            <br />
            <span className="text-primary">in record time</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Auth, payments, database, and email — all wired up. Stop rebuilding the same
            infrastructure and start building what matters.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {user ? (
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight />
                </Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight />
                </Link>
              </Button>
            )}
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github />
                Star on GitHub
              </a>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <div className="overflow-hidden rounded-xl border bg-card shadow-xl">
            <div className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-3">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="ml-3 text-xs text-muted-foreground">terminal</span>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed">
              <p className="text-muted-foreground">
                <span className="text-primary">$</span> npx create-saas-app my-app
              </p>
              <p className="mt-1 text-muted-foreground">
                <span className="text-primary">$</span> cd my-app && pnpm dev
              </p>
              <p className="mt-3 text-muted-foreground/60">
                ✓ Auth configured (Google OAuth + Email)
              </p>
              <p className="text-muted-foreground/60">✓ Stripe payments ready</p>
              <p className="text-muted-foreground/60">
                ✓ Database connected (PostgreSQL + Drizzle)
              </p>
              <p className="text-muted-foreground/60">✓ Email templates loaded (Resend)</p>
              <p className="mt-3 text-primary">Ready at http://localhost:3000</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
