import env from '@/src/env'
import { useLocation } from '@tanstack/react-router'
import posthog from 'posthog-js'
import { usePostHog } from 'posthog-js/react'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { Suspense, useEffect } from 'react'

const hasValidPostHogConfig =
  typeof env.POSTHOG_KEY === 'string' &&
  env.POSTHOG_KEY.startsWith('phc_') &&
  typeof env.POSTHOG_HOST === 'string' &&
  env.POSTHOG_HOST.length > 0

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!hasValidPostHogConfig) {
      return
    }

    posthog.init(env.POSTHOG_KEY, {
      api_host: env.POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_exceptions: true,
    })
  }, [])

  if (!hasValidPostHogConfig) {
    return <>{children}</>
  }

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  )
}

function PostHogPageView() {
  const location = useLocation()
  const posthog = usePostHog()

  useEffect(() => {
    if (!hasValidPostHogConfig) {
      return
    }

    let url = window.origin + location.pathname
    if (location.searchStr) {
      url = url + location.searchStr
    }
    posthog.capture('$pageview', { $current_url: url })
  }, [location.pathname, location.searchStr, posthog])

  return null
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}
