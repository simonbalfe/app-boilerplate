import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const WEB_DIR = resolve(ROOT_DIR, 'apps/web')
const ENV_FILE = resolve(ROOT_DIR, '.env')

const green = (msg: string) => console.log(`\x1b[32m${msg}\x1b[0m`)
const yellow = (msg: string) => console.log(`\x1b[33m${msg}\x1b[0m`)
const red = (msg: string) => console.log(`\x1b[31m${msg}\x1b[0m`)
const bold = (msg: string) => console.log(`\x1b[1m${msg}\x1b[0m`)

function parseEnvFile(filePath: string): Record<string, string> {
  const content = readFileSync(filePath, 'utf-8')
  const env: Record<string, string> = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex)
    let value = trimmed.slice(eqIndex + 1)
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (value) env[key] = value
  }
  return env
}

function run(cmd: string, cwd = ROOT_DIR) {
  execSync(cmd, { cwd, stdio: 'inherit' })
}

const SECRETS = [
  { key: 'DATABASE_URL', required: true },
  { key: 'BETTER_AUTH_SECRET', required: true },
  { key: 'GOOGLE_CLIENT_ID', required: true },
  { key: 'GOOGLE_CLIENT_SECRET', required: true },
  { key: 'VITE_APP_URL', required: true },
  { key: 'STRIPE_SECRET_KEY', required: false },
  { key: 'STRIPE_WEBHOOK_SECRET', required: false },
  { key: 'UPSTASH_REDIS_REST_URL', required: false },
  { key: 'UPSTASH_REDIS_REST_TOKEN', required: false },
  { key: 'RESEND_API_KEY', required: false },
  { key: 'RESEND_FROM', required: false },
  { key: 'SENTRY_DSN', required: false },
  { key: 'SENTRY_AUTH_TOKEN', required: false },
] as const

function main() {
  if (!existsSync(ENV_FILE)) {
    red("No .env file found. Run 'pnpm setup' first.")
    process.exit(1)
  }

  const env = parseEnvFile(ENV_FILE)

  const missing = SECRETS.filter((s) => s.required && !env[s.key]).map((s) => s.key)
  if (missing.length > 0) {
    red(`Missing required env vars: ${missing.join(', ')}`)
    red('Add them to your .env file and try again.')
    process.exit(1)
  }

  bold('\n[1/3] Building for Cloudflare Workers...\n')
  run('pnpm build', WEB_DIR)

  bold('\n[2/3] Deploying to Cloudflare Workers...\n')
  run('pnpm wrangler deploy', WEB_DIR)

  bold('\n[3/3] Pushing secrets to Cloudflare...\n')
  let secretCount = 0
  for (const { key } of SECRETS) {
    const val = env[key]
    if (!val) continue
    try {
      execSync(`echo ${JSON.stringify(val)} | pnpm wrangler secret put ${key}`, {
        cwd: WEB_DIR,
        stdio: 'pipe',
      })
      green(`  ${key} set`)
      secretCount++
    } catch (err) {
      red(`  Failed to set ${key}: ${(err as Error).message}`)
      process.exit(1)
    }
  }
  yellow(`  ${secretCount} secrets pushed\n`)

  console.log()
  green('Deployed to Cloudflare Workers')
  console.log()
  yellow('Set your custom domain in the Cloudflare dashboard:')
  console.log('  Workers & Pages > your worker > Settings > Domains & Routes')
}

main()
