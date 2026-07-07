/** Neon/Vercel inject DATABASE_URL or POSTGRES_URL; local dev may use DATABASE_URI. */
export function getDatabaseUrl(): string {
  const pooled =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URI ||
    ''
  const direct =
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ''

  // Neon migrations/DDL need the direct (non-pooled) URL when available.
  if (process.env.PAYLOAD_MIGRATING === 'true' && direct) {
    return direct
  }

  return pooled || direct
}

export function hasDatabaseUrl(): boolean {
  return Boolean(getDatabaseUrl())
}
