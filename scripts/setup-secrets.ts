import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createInterface } from 'node:readline'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const envFile = process.argv[2] ?? '.env'
const envPath = resolve(ROOT, envFile)

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

function run(cmd: string) {
  execSync(cmd, { stdio: 'inherit' })
}

async function main() {
  if (!existsSync(envPath)) {
    console.error(`Error: ${envFile} not found`)
    process.exit(1)
  }

  try {
    execSync('gh --version', { stdio: 'ignore' })
  } catch {
    console.error('Error: GitHub CLI (gh) is not installed')
    process.exit(1)
  }

  console.log(`Loading secrets from ${envFile} into GitHub repository secrets...`)
  run(`gh secret set -f ${envPath}`)

  console.log('')
  console.log('Additional secrets required for deployment (not in .env):')
  console.log('  CLOUDFLARE_API_TOKEN  - Cloudflare API token with Workers permissions')
  console.log('  CLOUDFLARE_ACCOUNT_ID - Your Cloudflare account ID')
  console.log('')

  const setCfToken = await prompt('Set CLOUDFLARE_API_TOKEN now? (y/N) ')
  if (setCfToken.toLowerCase() === 'y') {
    const token = await prompt('CLOUDFLARE_API_TOKEN: ')
    if (token) {
      execSync(`gh secret set CLOUDFLARE_API_TOKEN --body "${token}"`)
      console.log('CLOUDFLARE_API_TOKEN set.')
    }
  }

  const setCfAccount = await prompt('Set CLOUDFLARE_ACCOUNT_ID now? (y/N) ')
  if (setCfAccount.toLowerCase() === 'y') {
    const accountId = await prompt('CLOUDFLARE_ACCOUNT_ID: ')
    if (accountId) {
      execSync(`gh secret set CLOUDFLARE_ACCOUNT_ID --body "${accountId}"`)
      console.log('CLOUDFLARE_ACCOUNT_ID set.')
    }
  }

  console.log('')
  console.log('Done. Verify with: gh secret list')
}

main()
