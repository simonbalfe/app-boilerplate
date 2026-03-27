import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ENV_FILE = resolve(ROOT, '.env')
const ENV_EXAMPLE = resolve(ROOT, '.env.example')

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

function setEnvValue(path: string, key: string, value: string) {
  const content = readFileSync(path, 'utf-8')
  writeFileSync(path, content.replace(new RegExp(`^${key}=.*`, 'm'), `${key}=${value}`))
}

async function main() {
  if (!existsSync(ENV_FILE)) {
    copyFileSync(ENV_EXAMPLE, ENV_FILE)
    setEnvValue(ENV_FILE, 'BETTER_AUTH_SECRET', randomBytes(32).toString('base64'))
    setEnvValue(ENV_FILE, 'VITE_APP_URL', 'http://localhost:3000')

    const dbUrl = await prompt('DATABASE_URL (get one free at https://neon.tech): ')
    if (dbUrl) setEnvValue(ENV_FILE, 'DATABASE_URL', dbUrl)
  }

  execSync('pnpm install', { cwd: ROOT, stdio: 'inherit' })

  const hasDbUrl = readFileSync(ENV_FILE, 'utf-8').match(/^DATABASE_URL=.+$/m)
  if (hasDbUrl) {
    execSync('pnpm db:push', { cwd: ROOT, stdio: 'inherit' })
  }
}

main()
