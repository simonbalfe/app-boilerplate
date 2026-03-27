import { z } from 'zod'

const clientEnvSchema = z.object({
  VITE_APP_URL: z.string().url(),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  VITE_STRIPE_PRICE_ID: z.string().optional(),
  VITE_POSTHOG_KEY: z.string().optional(),
  VITE_POSTHOG_HOST: z.string().url().optional(),
  VITE_SENTRY_DSN: z.string().optional(),
})

const parsed = clientEnvSchema.safeParse(import.meta.env)

if (!parsed.success) {
  throw new Error(`Invalid client environment variables: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`)
}

const data = parsed.data

const env = {
  APP_URL: data.VITE_APP_URL,
  STRIPE_PUBLISHABLE_KEY: data.VITE_STRIPE_PUBLISHABLE_KEY,
  STRIPE_PRICE_ID: data.VITE_STRIPE_PRICE_ID,
  POSTHOG_KEY: data.VITE_POSTHOG_KEY,
  POSTHOG_HOST: data.VITE_POSTHOG_HOST,
  SENTRY_DSN: data.VITE_SENTRY_DSN,
}

export default env
