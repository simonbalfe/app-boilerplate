'use client'

import { AppSidebar } from '@app/components/app-sidebar'
import { useUser } from '@shared/hooks/use-user'
import { useLocation } from '@tanstack/react-router'
import { Separator } from '@ui/components/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@ui/components/sidebar'
import { Toaster } from '@ui/components/sonner'
import { Loader2 } from 'lucide-react'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/settings': 'Settings',
}

export const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const { user, loading } = useUser()

  if (location.pathname === '/' || location.pathname.startsWith('/auth')) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <>{children}</>
  }

  return (
    <SidebarProvider className="bg-sidebar">
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden flex flex-col rounded-l-2xl border-l border-t border-b shadow-sm">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1 size-7 text-muted-foreground hover:text-foreground transition-colors" />
          <Separator orientation="vertical" className="mr-1 h-3.5" />
          <span className="text-sm font-medium text-foreground/80">
            {PAGE_TITLES[location.pathname] ?? ''}
          </span>
        </header>
        <main className="flex-1 overflow-hidden flex flex-col">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
