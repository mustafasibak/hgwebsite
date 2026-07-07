/** Neon/Vercel inject DATABASE_URL or POSTGRES_URL; local dev may use DATABASE_URI. */
export function getDatabaseUrl(): string {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URI ||
    ''
  )
}

export function hasDatabaseUrl(): boolean {
  return Boolean(getDatabaseUrl())
}
