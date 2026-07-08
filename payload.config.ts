import path from 'path'
import { fileURLToPath } from 'url'
import { de } from '@payloadcms/translations/languages/de'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { Media } from './collections/Media'
import { MenuCategories } from './collections/MenuCategories'
import { MenuItems } from './collections/MenuItems'
import { Users } from './collections/Users'
import { getDatabaseUrl } from './lib/database-url'
import { getServerURL } from './lib/server-url'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const blobToken = process.env.BLOB_READ_WRITE_TOKEN

export default buildConfig({
  serverURL: getServerURL(),
  admin: {
    user: Users.slug,
    theme: 'light',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '– HHanse Grill',
    },
    components: {
      providers: ['@/components/payload/ForceGermanProvider'],
    },
  },
  i18n: {
    supportedLanguages: { de },
    fallbackLanguage: 'de',
    translations: {
      de: de.translations,
    },
  },
  collections: [Users, Media, MenuCategories, MenuItems],
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: getDatabaseUrl(),
    },
    prodMigrations: migrations,
  }),
  sharp,
  plugins: blobToken
    ? [
        vercelBlobStorage({
          collections: {
            media: true,
          },
          token: blobToken,
        }),
      ]
    : [],
})
