import { execSync } from 'node:child_process'

function hasDatabaseUrl() {
  return Boolean(
    process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URI,
  )
}

if (!hasDatabaseUrl()) {
  console.log('Skipping menu seed: no DATABASE_URL (expected locally with Neon-linked Vercel env)')
  process.exit(0)
}

console.log('Running menu seed on deploy...')
execSync('./node_modules/.bin/tsx scripts/seed-menu-to-payload.ts', {
  stdio: 'inherit',
  env: { ...process.env, PAYLOAD_SEEDING: 'true' },
})
