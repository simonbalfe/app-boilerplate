import { useUser } from '@shared/hooks/use-user'
import { api } from '@shared/lib/api-client'
import { authClient } from '@shared/lib/auth-client'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@ui/components/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/avatar'
import { Button } from '@ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/components/card'
import { LogOut, Trash2, User } from 'lucide-react'
import { useEffect } from 'react'

export const Route = createFileRoute('/settings')({
  ssr: false,
  head: () => ({
    meta: [{ title: 'Settings' }, { name: 'robots', content: 'noindex, nofollow' }],
  }),
  component: SettingsPage,
})

function SettingsPage() {
  const { user, loading } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      void navigate({ to: '/auth' })
    }
  }, [user, loading, navigate])

  const handleSignOut = async () => {
    await authClient.signOut()
    void navigate({ to: '/auth' })
  }

  const handleDeleteAccount = async () => {
    if (!user?.id) return
    await api.api.users.delete.$post({
      json: { userId: user.id },
    })
    await authClient.signOut()
    void navigate({ to: '/auth' })
  }

  if (loading || !user) {
    return null
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account settings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-5">
              <Avatar className="h-18 w-18">
                <AvatarImage src={user.image ?? undefined} alt={user.name || 'User'} />
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  {user.name?.charAt(0)?.toUpperCase() ?? <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your session</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full justify-start gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and
                    remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount}>
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
