import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ui/components/card'

export const Route = createFileRoute('/test')({
  head: () => ({
    meta: [
      { title: 'Design System Test' },
      { name: 'description', content: 'Testing typography and design tokens' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: TestPage,
})

function TestPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 space-y-16">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold">Design System Test</h1>
        <p className="text-muted-foreground text-lg">
          This page demonstrates the shared design system, Tailwind configuration, and typography
          across both the marketing template and SaaS boilerplate.
        </p>
      </header>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold border-b pb-2">Typography</h2>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="text-5xl font-light leading-tight">
              Heading 1 (text-5xl) - The quick brown fox
            </div>
            <div className="text-4xl font-light leading-tight">
              Heading 2 (text-4xl) - The quick brown fox
            </div>
            <div className="text-3xl font-light leading-tight">
              Heading 3 (text-3xl) - The quick brown fox
            </div>
            <div className="text-2xl font-light leading-tight">
              Heading 4 (text-2xl) - The quick brown fox
            </div>
            <div className="text-xl font-light leading-tight">
              Heading 5 (text-xl) - The quick brown fox
            </div>
            <div className="text-lg font-light leading-tight">
              Heading 6 (text-lg) - The quick brown fox
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-base">
              <strong>Body text (base):</strong> Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Small muted text:</strong> This is smaller text often used for captions,
              helper text, or secondary information that shouldn&apos;t dominate the visual
              hierarchy.
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Extra small text:</strong> Used for fine print, timestamps, or metadata.
            </p>
          </div>

          <div className="space-y-2">
            <p>
              Inline styles: <strong>Bold text</strong>, <em>italic text</em>,{' '}
              <code>inline code</code>, and{' '}
              <a href="#" className="text-primary underline">
                links
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold border-b pb-2">Color Palette</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div
              className="h-20 rounded-lg border"
              style={{ backgroundColor: 'var(--background)' }}
            />
            <p className="text-sm font-medium">Background</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-lg" style={{ backgroundColor: 'var(--foreground)' }} />
            <p className="text-sm font-medium">Foreground</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-lg" style={{ backgroundColor: 'var(--primary)' }} />
            <p className="text-sm font-medium">Primary</p>
          </div>
          <div className="space-y-2">
            <div
              className="h-20 rounded-lg border"
              style={{ backgroundColor: 'var(--secondary)' }}
            />
            <p className="text-sm font-medium">Secondary</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-lg border" style={{ backgroundColor: 'var(--muted)' }} />
            <p className="text-sm font-medium">Muted</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-lg border" style={{ backgroundColor: 'var(--accent)' }} />
            <p className="text-sm font-medium">Accent</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-lg" style={{ backgroundColor: 'var(--destructive)' }} />
            <p className="text-sm font-medium">Destructive</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-lg border" style={{ backgroundColor: 'var(--card)' }} />
            <p className="text-sm font-medium">Card</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="space-y-2">
            <div className="h-16 rounded-lg" style={{ backgroundColor: 'var(--chart-1)' }} />
            <p className="text-xs font-medium">Chart 1</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 rounded-lg" style={{ backgroundColor: 'var(--chart-2)' }} />
            <p className="text-xs font-medium">Chart 2</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 rounded-lg" style={{ backgroundColor: 'var(--chart-3)' }} />
            <p className="text-xs font-medium">Chart 3</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 rounded-lg" style={{ backgroundColor: 'var(--chart-4)' }} />
            <p className="text-xs font-medium">Chart 4</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 rounded-lg" style={{ backgroundColor: 'var(--chart-5)' }} />
            <p className="text-xs font-medium">Chart 5</p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold border-b pb-2">Buttons</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">States</h3>
            <div className="flex flex-wrap gap-4">
              <Button>Enabled</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold border-b pb-2">Cards</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here with supporting text.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                This is the card content area. You can put any content here including text, images,
                or other components.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>With different content to show variety.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <span className="text-sm font-medium">Pro</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Minimal Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A simpler card layout with just title and content.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold border-b pb-2">Shadows</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="h-20 rounded-lg bg-card shadow-2xs border" />
            <p className="text-sm font-medium">Shadow 2XS</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-lg bg-card shadow-xs border" />
            <p className="text-sm font-medium">Shadow XS</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-lg bg-card shadow-sm border" />
            <p className="text-sm font-medium">Shadow SM</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-lg bg-card shadow border" />
            <p className="text-sm font-medium">Shadow (default)</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-lg bg-card shadow-md border" />
            <p className="text-sm font-medium">Shadow MD</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-lg bg-card shadow-lg border" />
            <p className="text-sm font-medium">Shadow LG</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-lg bg-card shadow-xl border" />
            <p className="text-sm font-medium">Shadow XL</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 rounded-lg bg-card shadow-2xl border" />
            <p className="text-sm font-medium">Shadow 2XL</p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold border-b pb-2">Border Radius</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="h-20 bg-muted rounded-sm border" />
            <p className="text-sm font-medium">Rounded SM</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-muted rounded-md border" />
            <p className="text-sm font-medium">Rounded MD</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-muted rounded-lg border" />
            <p className="text-sm font-medium">Rounded LG</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-muted rounded-xl border" />
            <p className="text-sm font-medium">Rounded XL</p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold border-b pb-2">Spacing Scale</h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-primary" />
            <span className="text-sm font-mono">1 (0.25rem / 4px)</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-primary" />
            <span className="text-sm font-mono">2 (0.5rem / 8px)</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-4 h-8 bg-primary" />
            <span className="text-sm font-mono">4 (1rem / 16px)</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary" />
            <span className="text-sm font-mono">8 (2rem / 32px)</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-8 bg-primary" />
            <span className="text-sm font-mono">16 (4rem / 64px)</span>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold border-b pb-2">Font Families</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="font-sans text-lg">
              Font Sans (Geist): The quick brown fox jumps over the lazy dog. 0123456789
            </p>
            <p className="text-sm text-muted-foreground font-mono">font-sans</p>
          </div>
          <div className="space-y-2">
            <p className="font-mono text-lg">
              Font Mono (Geist Mono): The quick brown fox jumps over the lazy dog. 0123456789
            </p>
            <p className="text-sm text-muted-foreground font-mono">font-mono</p>
          </div>
          <div className="space-y-2">
            <p className="font-serif text-lg">
              Font Serif: The quick brown fox jumps over the lazy dog. 0123456789
            </p>
            <p className="text-sm text-muted-foreground font-mono">font-serif</p>
          </div>
        </div>
      </section>

      <footer className="pt-8 border-t">
        <p className="text-sm text-muted-foreground">
          Source: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">saas-boilerplate</code> —
          Compare with{' '}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs">marketing-template/test</code> to
          verify design system consistency.
        </p>
      </footer>
    </main>
  )
}
