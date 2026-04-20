import { useUser } from '@shared/hooks/use-user'
import { Link } from '@tanstack/react-router'
import { Button } from '@ui/components/button'
import { ArrowRight, Github } from 'lucide-react'

export function CtaSection() {
  const { user } = useUser()

  return (
    <section id="pricing" className="border-b bg-muted/50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Start building <span className="text-primary">today</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Open source, free forever. Clone the repo and ship your SaaS this week.
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
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
