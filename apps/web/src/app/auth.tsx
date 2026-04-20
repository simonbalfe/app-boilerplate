import { useUser } from '@shared/hooks/use-user'
import { authClient } from '@shared/lib/auth-client'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { siteConfig } from '@/src/site.config'
import { Alert, AlertDescription } from '@ui/components/alert'
import { Button } from '@ui/components/button'
import { Card, CardContent } from '@ui/components/card'
import { Input } from '@ui/components/input'
import { Separator } from '@ui/components/separator'
import { Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'

type AuthSearch = {
  callbackUrl?: string
}

export const Route = createFileRoute('/auth')({
  head: () => ({
    meta: [{ title: 'Sign In' }, { name: 'robots', content: 'noindex, nofollow' }],
  }),
  component: AuthPage,
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    callbackUrl: typeof search.callbackUrl === 'string' ? search.callbackUrl : undefined,
  }),
})

function AuthPageContent() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/auth' })
  const callbackUrl =
    typeof search.callbackUrl === 'string' && search.callbackUrl.startsWith('/')
      ? search.callbackUrl
      : '/dashboard'
  const { user, loading: userLoading } = useUser()

  useEffect(() => {
    if (!userLoading && user) {
      void navigate({ to: callbackUrl })
    }
  }, [user, userLoading, navigate, callbackUrl])

  const [isSignUp, setIsSignUp] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setNeedsVerification(false)

    try {
      if (isSignUp) {
        const result = await authClient.signUp.email(
          {
            email,
            password,
            name,
            callbackURL: '/auth',
          },
          {
            disableSignal: true,
          },
        )

        if (result.error) {
          setError(result.error.message ?? 'Something went wrong')
        } else {
          setShowVerification(true)
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        })
        if (result.error) {
          if (
            result.error.status === 403 ||
            result.error.message?.toLowerCase().includes('verify')
          ) {
            setNeedsVerification(true)
            setError('Please verify your email address to continue.')
          } else {
            setError(result.error.message ?? 'Invalid email or password')
          }
        } else {
          void navigate({ to: callbackUrl })
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await authClient.sendVerificationEmail({
        email,
        callbackURL: '/auth',
      })
      if (result.error) {
        setError(result.error.message ?? 'Failed to send verification email.')
      } else {
        setShowVerification(true)
        setNeedsVerification(false)
      }
    } catch {
      setError('Failed to send verification email.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const callbackURL = `${window.location.origin}${callbackUrl}`
      await authClient.signIn.social({
        provider: 'google',
        callbackURL,
      })
    } catch {
      setError('Failed to connect with Google')
    }
  }

  if (showVerification) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted p-4">
        <Card className="w-full max-w-[400px] shadow-lg">
          <CardContent className="flex flex-col gap-6 pt-8 pb-8 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
              <p className="text-muted-foreground">
                We&apos;ve sent a verification link to{' '}
                <span className="font-medium text-foreground">{email}</span>. Please check your
                inbox to verify your account.
              </p>
            </div>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowVerification(false)
                  setIsSignUp(false)
                }}
              >
                Return to Sign In
              </Button>
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the email?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium"
                  onClick={handleResendVerification}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Click to resend'}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-[400px] shadow-lg">
        <CardContent className="flex flex-col gap-6 pt-8 pb-8">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="flex size-10 items-center justify-center">
                <img src="/logo.svg" alt={siteConfig.name} className="size-8" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                {isSignUp ? 'Create an account' : 'Welcome back'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isSignUp
                  ? 'Enter your details below to get started'
                  : 'Enter your details below to continue'}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleAuth}
            className="w-full gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative flex items-center py-3">
            <Separator className="flex-1" />
            <span className="shrink mx-4 text-xs uppercase text-muted-foreground">
              Or continue with email
            </span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="flex flex-col gap-2">
                  {error}
                  {needsVerification && (
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium text-destructive-foreground underline"
                      onClick={handleResendVerification}
                      type="button"
                    >
                      Resend verification email
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {isSignUp && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-9"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-9"
              />
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-9 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!isSignUp && (
                <div className="flex justify-end">
                  <a
                    href="/auth/reset-password"
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </>
              ) : isSignUp ? (
                'Create account'
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            {isSignUp ? (
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium"
                  onClick={() => {
                    setIsSignUp(false)
                    setError(null)
                  }}
                >
                  Sign in
                </Button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium"
                  onClick={() => {
                    setIsSignUp(true)
                    setError(null)
                  }}
                >
                  Sign up
                </Button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  )
}
