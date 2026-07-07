/** Public site URL for Payload admin (API calls, links). */
export function getServerURL(): string {
  const explicit =
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.SERVER_URL

  if (explicit) {
    return explicit.replace(/\/$/, '')
  }

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (productionHost) {
    return `https://${productionHost}`
  }

  const vercelHost = process.env.VERCEL_URL
  if (vercelHost) {
    return `https://${vercelHost}`
  }

  return 'http://localhost:3000'
}
