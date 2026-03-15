import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'
import { z } from 'zod'

const currentDir = dirname(fileURLToPath(import.meta.url))
const rootEnvPath = resolve(currentDir, '../../.env')

loadEnv(existsSync(rootEnvPath) ? { path: rootEnvPath } : undefined)

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().default(''),
  STRIPE_WEBHOOK_SECRET: z.string().default(''),
  UPSTASH_REDIS_REST_URL: z.string().default(''),
  UPSTASH_REDIS_REST_TOKEN: z.string().default(''),
  RESEND_API_KEY: z.string().default(''),
  RESEND_FROM: z.string().default(''),
  GOOGLE_CLIENT_ID: z.string().default(''),
  GOOGLE_CLIENT_SECRET: z.string().default(''),
  VITE_APP_URL: z.string().url().default('http://localhost:3000'),
})

const parsed = serverEnvSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('[CONFIG] Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

const env = parsed.data

export const config = {
  NODE_ENV: env.NODE_ENV,
  DATABASE_URL: env.DATABASE_URL,
  BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET,
  STRIPE_SECRET_KEY: env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: env.STRIPE_WEBHOOK_SECRET,
  UPSTASH_REDIS_REST_URL: env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: env.UPSTASH_REDIS_REST_TOKEN,
  RESEND_API_KEY: env.RESEND_API_KEY,
  RESEND_FROM: env.RESEND_FROM,
  GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
  APP_URL: env.VITE_APP_URL,
}

const mask = (v: string) => (v ? `${v.slice(0, 4)}***` : '(empty)')

console.log('[CONFIG] Env vars loaded:', {
  NODE_ENV: config.NODE_ENV,
  DATABASE_URL: mask(config.DATABASE_URL),
  BETTER_AUTH_SECRET: mask(config.BETTER_AUTH_SECRET),
  STRIPE_SECRET_KEY: mask(config.STRIPE_SECRET_KEY),
  STRIPE_WEBHOOK_SECRET: mask(config.STRIPE_WEBHOOK_SECRET),
  UPSTASH_REDIS_REST_URL: mask(config.UPSTASH_REDIS_REST_URL),
  UPSTASH_REDIS_REST_TOKEN: mask(config.UPSTASH_REDIS_REST_TOKEN),
  RESEND_API_KEY: mask(config.RESEND_API_KEY),
  RESEND_FROM: config.RESEND_FROM || '(empty)',
  GOOGLE_CLIENT_ID: mask(config.GOOGLE_CLIENT_ID),
  GOOGLE_CLIENT_SECRET: mask(config.GOOGLE_CLIENT_SECRET),
  APP_URL: config.APP_URL,
  envFilePath: rootEnvPath,
  envFileExists: existsSync(rootEnvPath),
})
