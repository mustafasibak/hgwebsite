import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const envPath = resolve(process.cwd(), '.env.local')

if (!existsSync(envPath)) {
  console.warn('[load-env-local] No .env.local found — run: npx vercel env pull .env.local --environment=production')
} else {
  const content = readFileSync(envPath, 'utf8')
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const eq = line.indexOf('=')
    if (eq === -1) continue

    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    value = value.replace(/\\n/g, '\n')

    if (process.env[key] === undefined || process.env[key] === '') {
      process.env[key] = value
    }
  }
}
