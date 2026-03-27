import { useTheme } from '@shared/components/providers/theme-provider'
import { useUser } from '@shared/hooks/use-user'
import { api } from '@shared/lib/api-client'
import { authClient } from '@shared/lib/auth-client'
import { useCheckout } from '@shared/lib/checkout-api'
import { Link, useLocation } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/avatar'
import { Badge } from '@ui/components/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@ui/components/sidebar'
import { cn } from '@ui/lib/utils'
import {
  ChevronUp,
  Crown,
  Home,
  LogOut,
  Moon,
  Settings,
  Sparkles,
  Sun,
  User as UserIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Settings', url: '/settings', icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()
  const pathname = location.pathname
  const { user } = useUser()
  const { theme, setTheme } = useTheme()
  const { handleCheckout, isLoading } = useCheckout(user?.id)
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null)
  const [tier, setTier] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      void api.api.subscription.check
        .$get()
        .then((res) => res.json())
        .then((data) => {
          setIsSubscribed(data.isSubscribed)
          setTier(data.tier)
        })
    }
  }, [user])

  const handleSignOut = async () => {
    await authClient.signOut()
    window.location.href = '/auth'
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex size-8 items-center justify-center shrink-0">
                  <img src="/logo.svg" alt="LaunchStack" className="size-6" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-sm tracking-tight">LaunchStack</span>
                  <span className="text-xs text-muted-foreground">
                    {tier ? `${tier} Plan` : 'SaaS Boilerplate'}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className={cn(
                      'h-9 rounded-md text-[0.9375rem] font-normal gap-3 text-foreground/70 transition-colors',
                      pathname === item.url && 'text-foreground font-medium bg-accent',
                    )}
                  >
                    <Link to={item.url}>
                      <item.icon className="size-[1.125rem] stroke-[1.75]" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-7 rounded-md">
                    <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'User'} />
                    <AvatarFallback className="rounded-md bg-primary/10 text-primary text-xs font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() ?? <UserIcon className="size-3.5" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium text-sm">{user?.name ?? 'User'}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {isSubscribed && <Crown className="size-3.5 text-primary" />}
                    <ChevronUp className="size-4 text-muted-foreground" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                {!isSubscribed && (
                  <>
                    <DropdownMenuItem
                      onClick={handleCheckout}
                      disabled={isLoading}
                      className="cursor-pointer font-medium text-primary focus:text-primary focus:bg-primary/8"
                    >
                      <Sparkles className="mr-2 size-4" />
                      {isLoading ? 'Loading...' : 'Upgrade to Pro'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="cursor-pointer"
                >
                  <Sun className="mr-2 size-4 dark:hidden" />
                  <Moon className="mr-2 hidden size-4 dark:block" />
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </DropdownMenuItem>
                {tier && (
                  <DropdownMenuItem disabled>
                    <Badge variant={tier === 'Pro' ? 'default' : 'secondary'} className="mr-2">
                      {tier}
                    </Badge>
                    Current Plan
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
