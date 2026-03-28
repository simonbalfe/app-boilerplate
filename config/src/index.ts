import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'
import { z } from 'zod'

const currentDir = dirname(fileURLToPath(import.meta.url))
const rootEnvPath = resolve(currentDir, '../../.env')

loadEnv(existsSync(rootEnvPath) ? { path: rootEnvPath } : undefined)

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  VITE_APP_URL: z.url(),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().min(1),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM: z.string().min(1),
  SENTRY_DSN: z.string().min(1),
  SENTRY_AUTH_TOKEN: z.string().min(1),
  VITE_POSTHOG_KEY: z.string().min(1),
  VITE_POSTHOG_HOST: z.string().min(1),
})

const parsed = serverEnvSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

const env = parsed.data

export const config = {
  NODE_ENV: env.NODE_ENV,
  DATABASE_URL: env.DATABASE_URL,
  BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET,
  GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
  APP_URL: env.VITE_APP_URL,
  STRIPE_SECRET_KEY: env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: env.STRIPE_WEBHOOK_SECRET,
  UPSTASH_REDIS_REST_URL: env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: env.UPSTASH_REDIS_REST_TOKEN,
  RESEND_API_KEY: env.RESEND_API_KEY,
  RESEND_FROM: env.RESEND_FROM,
  SENTRY_DSN: env.SENTRY_DSN,
  SENTRY_AUTH_TOKEN: env.SENTRY_AUTH_TOKEN,
  POSTHOG_KEY: env.VITE_POSTHOG_KEY,
  POSTHOG_HOST: env.VITE_POSTHOG_HOST,
}
