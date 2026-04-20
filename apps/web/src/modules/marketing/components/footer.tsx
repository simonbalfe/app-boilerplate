import { Link } from '@tanstack/react-router'
import { Separator } from '@ui/components/separator'
import { Github, Zap } from 'lucide-react'
import { siteConfig } from '@/src/site.config'

export function Footer() {
  return (
    <footer className="py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary">
              <Zap className="size-4 text-primary-foreground" aria-hidden="true" />
            </div>
            {siteConfig.name}
          </Link>

          <nav aria-label="Footer navigation" className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </a>
          </nav>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub repository"
          >
            <Github className="size-5" aria-hidden="true" />
          </a>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-muted-foreground">
          Built by developers, for developers.
        </p>
      </div>
    </footer>
  )
}
