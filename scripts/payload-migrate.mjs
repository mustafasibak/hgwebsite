import { execSync } from 'node:child_process'

function getDatabaseUrl() {
  const pooled =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URI ||
    ''
  const direct =
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ''
  if (process.env.PAYLOAD_MIGRATING === 'true' && direct) return direct
  return pooled || direct
}

if (!getDatabaseUrl()) {
  console.log('Skipping Payload migrate: no DATABASE_URL configured')
  process.exit(0)
}

console.log('Running Payload database migrations...')
execSync('payload migrate', {
  stdio: 'inherit',
  env: { ...process.env, PAYLOAD_MIGRATING: 'true' },
})
