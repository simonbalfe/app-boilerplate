import { ThemeToggle } from '@shared/components/theme-toggle'
import { useUser } from '@shared/hooks/use-user'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Badge } from '@ui/components/badge'
import { Button } from '@ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/components/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@ui/components/chart'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/components/table'
import { Tabs, TabsList, TabsTrigger } from '@ui/components/tabs'
import {
  Activity,
  Check,
  CreditCard,
  DollarSign,
  Loader2,
  MoreVertical,
  Plus,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, XAxis } from 'recharts'

export const Route = createFileRoute('/dashboard')({
  ssr: false,
  head: () => ({
    meta: [{ title: 'Dashboard' }, { name: 'robots', content: 'noindex, nofollow' }],
  }),
  component: DashboardPage,
})

const visitorData = [
  { date: 'Jun 24', visitors: 186, revenue: 400 },
  { date: 'Jun 25', visitors: 305, revenue: 300 },
  { date: 'Jun 26', visitors: 237, revenue: 450 },
  { date: 'Jun 27', visitors: 473, revenue: 350 },
  { date: 'Jun 28', visitors: 409, revenue: 280 },
  { date: 'Jun 29', visitors: 314, revenue: 450 },
  { date: 'Jun 30', visitors: 420, revenue: 500 },
]

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'var(--chart-1)',
  },
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

const barChartData = [
  { name: 'Jan', chart1: 400, chart2: 240, chart3: 180 },
  { name: 'Feb', chart1: 300, chart2: 139, chart3: 220 },
  { name: 'Mar', chart1: 200, chart2: 380, chart3: 250 },
  { name: 'Apr', chart1: 278, chart2: 390, chart3: 190 },
  { name: 'May', chart1: 189, chart2: 480, chart3: 280 },
]

const barChartConfig = {
  chart1: { label: 'Chart 1', color: 'var(--chart-1)' },
  chart2: { label: 'Chart 2', color: 'var(--chart-2)' },
  chart3: { label: 'Chart 3', color: 'var(--chart-3)' },
} satisfies ChartConfig

const coreColors = [
  { name: 'background', variable: '--background', class: 'bg-background' },
  { name: 'foreground', variable: '--foreground', class: 'bg-foreground' },
  { name: 'primary', variable: '--primary', class: 'bg-primary' },
  { name: 'primary-fg', variable: '--primary-foreground', class: 'bg-primary-foreground' },
  { name: 'secondary', variable: '--secondary', class: 'bg-secondary' },
  { name: 'secondary-fg', variable: '--secondary-foreground', class: 'bg-secondary-foreground' },
  { name: 'muted', variable: '--muted', class: 'bg-muted' },
  { name: 'muted-fg', variable: '--muted-foreground', class: 'bg-muted-foreground' },
  { name: 'accent', variable: '--accent', class: 'bg-accent' },
  { name: 'accent-fg', variable: '--accent-foreground', class: 'bg-accent-foreground' },
  { name: 'destructive', variable: '--destructive', class: 'bg-destructive' },
]

const surfaceColors = [
  { name: 'card', variable: '--card', class: 'bg-card' },
  { name: 'card-fg', variable: '--card-foreground', class: 'bg-card-foreground' },
  { name: 'popover', variable: '--popover', class: 'bg-popover' },
  { name: 'popover-fg', variable: '--popover-foreground', class: 'bg-popover-foreground' },
]

const chartColors = [
  { name: 'chart-1', variable: '--chart-1', class: 'bg-chart-1' },
  { name: 'chart-2', variable: '--chart-2', class: 'bg-chart-2' },
  { name: 'chart-3', variable: '--chart-3', class: 'bg-chart-3' },
  { name: 'chart-4', variable: '--chart-4', class: 'bg-chart-4' },
  { name: 'chart-5', variable: '--chart-5', class: 'bg-chart-5' },
]

const utilityColors = [
  { name: 'border', variable: '--border', class: 'bg-border' },
  { name: 'input', variable: '--input', class: 'bg-input' },
  { name: 'ring', variable: '--ring', class: 'bg-ring' },
]

const sidebarColors = [
  { name: 'sidebar', variable: '--sidebar', class: 'bg-sidebar' },
  { name: 'sidebar-fg', variable: '--sidebar-foreground', class: 'bg-sidebar-foreground' },
  { name: 'sidebar-primary', variable: '--sidebar-primary', class: 'bg-sidebar-primary' },
  { name: 'sidebar-accent', variable: '--sidebar-accent', class: 'bg-sidebar-accent' },
  { name: 'sidebar-border', variable: '--sidebar-border', class: 'bg-sidebar-border' },
]

const shadows = [
  { name: '2xs', class: 'shadow-2xs' },
  { name: 'xs', class: 'shadow-xs' },
  { name: 'sm', class: 'shadow-sm' },
  { name: 'default', class: 'shadow' },
  { name: 'md', class: 'shadow-md' },
  { name: 'lg', class: 'shadow-lg' },
  { name: 'xl', class: 'shadow-xl' },
  { name: '2xl', class: 'shadow-2xl' },
]

const radiusSizes = [
  { name: 'sm', class: 'rounded-sm', size: 'calc(var(--radius) - 4px)' },
  { name: 'md', class: 'rounded-md', size: 'calc(var(--radius) - 2px)' },
  { name: 'lg', class: 'rounded-lg', size: 'var(--radius)' },
  { name: 'xl', class: 'rounded-xl', size: 'calc(var(--radius) + 4px)' },
]

function ColorSwatch({
  name,
  variable,
  colorClass,
}: { name: string; variable: string; colorClass: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-14 w-full rounded-lg border ${colorClass}`} />
      <div className="space-y-0.5">
        <p className="text-xs font-medium">{name}</p>
        <p className="text-[10px] text-muted-foreground font-mono leading-tight">{variable}</p>
      </div>
    </div>
  )
}

const documentSections = [
  {
    header: 'Cover page',
    type: 'Cover page',
    status: 'In Process',
    target: 18,
    limit: 5,
    reviewer: 'Eddie Lake',
  },
  {
    header: 'Table of contents',
    type: 'Table of contents',
    status: 'Done',
    target: 29,
    limit: 24,
    reviewer: 'Eddie Lake',
  },
  {
    header: 'Executive summary',
    type: 'Summary',
    status: 'In Process',
    target: 45,
    limit: 30,
    reviewer: 'Sarah Chen',
  },
  {
    header: 'Technical specs',
    type: 'Technical',
    status: 'Pending',
    target: 60,
    limit: 50,
    reviewer: 'Alex Kim',
  },
  {
    header: 'Budget overview',
    type: 'Financial',
    status: 'Done',
    target: 15,
    limit: 15,
    reviewer: 'Jordan Blake',
  },
]

function StatCard({
  title,
  value,
  description,
  trend,
  trendValue,
  icon: Icon,
}: {
  title: string
  value: string
  description: string
  trend: 'up' | 'down'
  trendValue: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="text-sm">{title}</CardDescription>
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        <div className="flex items-center gap-1.5 text-sm">
          <Badge
            variant={trend === 'up' ? 'default' : 'secondary'}
            className="gap-0.5 px-1.5 py-0 text-xs font-medium"
          >
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trendValue}
          </Badge>
          <span className="text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardPage() {
  const { user, loading } = useUser()
  const navigate = useNavigate()
  const [timePeriod, setTimePeriod] = useState('7days')

  useEffect(() => {
    if (!loading && !user) {
      void navigate({ to: '/auth' })
    }
  }, [user, loading, navigate])

  if (loading || !user) {
    return null
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user.name?.split(' ')[0] ?? 'there'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Quick Create
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value="$1,250.00"
            description="from last month"
            trend="up"
            trendValue="+12.5%"
            icon={DollarSign}
          />
          <StatCard
            title="New Customers"
            value="1,234"
            description="from last month"
            trend="down"
            trendValue="-20%"
            icon={Users}
          />
          <StatCard
            title="Active Accounts"
            value="45,678"
            description="from last month"
            trend="up"
            trendValue="+12.5%"
            icon={CreditCard}
          />
          <StatCard
            title="Growth Rate"
            value="4.5%"
            description="from last quarter"
            trend="up"
            trendValue="+4.5%"
            icon={Activity}
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Total Visitors</CardTitle>
                <CardDescription>Total for the last 3 months</CardDescription>
              </div>
              <Tabs value={timePeriod} onValueChange={setTimePeriod}>
                <TabsList>
                  <TabsTrigger value="3months">Last 3 months</TabsTrigger>
                  <TabsTrigger value="30days">Last 30 days</TabsTrigger>
                  <TabsTrigger value="7days">Last 7 days</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={visitorData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#colorVisitors)"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Tabs defaultValue="outline">
                <TabsList>
                  <TabsTrigger value="outline">Outline</TabsTrigger>
                  <TabsTrigger value="performance">
                    Past Performance
                    <Badge variant="secondary" className="ml-1.5">
                      3
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="personnel">
                    Key Personnel
                    <Badge variant="secondary" className="ml-1.5">
                      2
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="documents">Focus Documents</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  Customize Columns
                </Button>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Section
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Header</TableHead>
                  <TableHead>Section Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Target</TableHead>
                  <TableHead className="text-right">Limit</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentSections.map((section, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span className="text-xs">⋮⋮</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{section.header}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{section.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {section.status === 'Done' ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : section.status === 'In Process' ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                        )}
                        <span
                          className={
                            section.status === 'Done' ? 'text-primary' : 'text-muted-foreground'
                          }
                        >
                          {section.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{section.target}</TableCell>
                    <TableCell className="text-right">{section.limit}</TableCell>
                    <TableCell>{section.reviewer}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">Design Tokens</h2>
            <p className="text-sm text-muted-foreground">
              Every token defined in globals.css — colors, typography, radius, and shadows
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Core Colors</CardTitle>
                <CardDescription>
                  Primary semantic colors — indigo brand with blue-tinted neutrals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {coreColors.map((color) => (
                    <ColorSwatch
                      key={color.name}
                      name={color.name}
                      variable={color.variable}
                      colorClass={color.class}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chart Colors</CardTitle>
                <CardDescription>
                  5 hues spread across the color wheel — indigo, teal, purple, amber, coral
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-5 gap-4">
                  {chartColors.map((color) => (
                    <ColorSwatch
                      key={color.name}
                      name={color.name}
                      variable={color.variable}
                      colorClass={color.class}
                    />
                  ))}
                </div>
                <ChartContainer config={barChartConfig} className="h-[140px] w-full">
                  <BarChart data={barChartData}>
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="chart1" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="chart2" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="chart3" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Surface Colors</CardTitle>
                <CardDescription>Cards, popovers, and elevated surfaces</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {surfaceColors.map((color) => (
                    <ColorSwatch
                      key={color.name}
                      name={color.name}
                      variable={color.variable}
                      colorClass={color.class}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utility Colors</CardTitle>
                <CardDescription>Border, input, and focus ring tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {utilityColors.map((color) => (
                    <ColorSwatch
                      key={color.name}
                      name={color.name}
                      variable={color.variable}
                      colorClass={color.class}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sidebar Colors</CardTitle>
              <CardDescription>Dedicated sidebar navigation tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {sidebarColors.map((color) => (
                  <ColorSwatch
                    key={color.name}
                    name={color.name}
                    variable={color.variable}
                    colorClass={color.class}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>
                  --font-sans, --font-mono, --font-serif from globals.css
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground font-mono">--font-sans</p>
                    <p className="text-xl font-sans">The quick brown fox jumps over the lazy dog</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground font-mono">--font-mono</p>
                    <p className="text-xl font-mono">The quick brown fox jumps over the lazy dog</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground font-mono">--font-serif</p>
                    <p className="text-xl font-serif">
                      The quick brown fox jumps over the lazy dog
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Border Radius</CardTitle>
                <CardDescription>Derived from --radius: 0.625rem base value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {radiusSizes.map((radius) => (
                    <div key={radius.name} className="space-y-2">
                      <div className={`h-14 w-full bg-primary ${radius.class}`} />
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium">{radius.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{radius.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Shadow Scale</CardTitle>
              <CardDescription>
                8-step shadow progression — each level doubles the blur distance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
                {shadows.map((shadow) => (
                  <div key={shadow.name} className="space-y-2">
                    <div className={`h-16 w-full bg-card rounded-lg border ${shadow.class}`} />
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium">{shadow.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{shadow.class}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Components</CardTitle>
              <CardDescription>Buttons and badges using the design tokens above</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Buttons
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Badges
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
