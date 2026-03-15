import { z } from 'zod'

const clientEnvSchema = z.object({
  VITE_APP_URL: z.string().url().default('http://localhost:3000'),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().default(''),
  VITE_STRIPE_PRICE_ID: z.string().default(''),
  VITE_POSTHOG_KEY: z.string().default(''),
  VITE_POSTHOG_HOST: z.string().url().default('https://us.i.posthog.com'),
})

const parsed = clientEnvSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('[ENV] Invalid client environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid client environment variables')
}

const data = parsed.data

const env = {
  APP_URL: data.VITE_APP_URL,
  STRIPE_PUBLISHABLE_KEY: data.VITE_STRIPE_PUBLISHABLE_KEY,
  STRIPE_PRICE_ID: data.VITE_STRIPE_PRICE_ID,
  POSTHOG_KEY: data.VITE_POSTHOG_KEY,
  POSTHOG_HOST: data.VITE_POSTHOG_HOST,
}

export default env
