import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      { pathname: '/logo.png' },
      { pathname: '/speisekarte.jpg' },
      { pathname: '/placeholders/**' },
      { pathname: '/essen/**' },
      { pathname: '/api/media/file/**' },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Payload admin requires webpack production builds on Next.js 16.
  // Vercel defaults to Turbopack unless --webpack is used (see vercel.json).
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
