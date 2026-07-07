/**
 * One-time import of static menu + photos into Payload.
 * Usage: PAYLOAD_SECRET=... npx tsx scripts/seed-menu-to-payload.ts
 * (Neon/Vercel: DATABASE_URL or POSTGRES_URL from .env.local)
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import config from '../payload.config'
import { hasDatabaseUrl } from '../lib/database-url'
import { staticMenuCategories } from '../lib/menu-data'
import { menuItemPhotos } from '../lib/menu-item-photos'
import { getPayload } from 'payload'

const root = join(import.meta.dirname, '..')

async function seed() {
  if (!hasDatabaseUrl()) {
    console.error('DATABASE_URL, POSTGRES_URL, or DATABASE_URI is required')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const categoryIdBySlug = new Map<string, number>()

  for (let i = 0; i < staticMenuCategories.length; i++) {
    const cat = staticMenuCategories[i]
    const existing = await payload.find({
      collection: 'menu-categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })

    if (existing.docs[0]) {
      categoryIdBySlug.set(cat.slug, existing.docs[0].id as number)
      console.log(`Category exists: ${cat.name}`)
      continue
    }

    const doc = await payload.create({
      collection: 'menu-categories',
      data: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        sortOrder: i,
        showImage: cat.showImage !== false,
      },
    })
    categoryIdBySlug.set(cat.slug, doc.id as number)
    console.log(`Created category: ${cat.name}`)
  }

  for (const cat of staticMenuCategories) {
    const categoryId = categoryIdBySlug.get(cat.slug)
    if (!categoryId) continue

    for (const item of cat.items) {
      const existing = await payload.find({
        collection: 'menu-items',
        where: { itemNumber: { equals: item.id } },
        limit: 1,
      })

      if (existing.docs[0]) {
        console.log(`Item exists: #${item.id} ${item.name}`)
        continue
      }

      let photoId: number | undefined
      const staticPhoto = item.image || menuItemPhotos[item.id]
      if (staticPhoto) {
        const filePath = join(root, 'public', staticPhoto.replace(/^\//, '').split('?')[0])
        if (existsSync(filePath)) {
          const buffer = readFileSync(filePath)
          const filename = filePath.split('/').pop() || 'photo.png'
          const media = await payload.create({
            collection: 'media',
            data: { alt: item.imageAlt || item.name },
            file: {
              data: buffer,
              mimetype: filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
              name: filename,
              size: buffer.length,
            },
          })
          photoId = media.id as number
        }
      }

      await payload.create({
        collection: 'menu-items',
        data: {
          itemNumber: item.id,
          category: categoryId,
          name: item.name,
          description: item.desc,
          nameEn: item.nameEn,
          price: item.price,
          priceTbd: item.priceTbd ?? false,
          badge: item.badge,
          allergenTags: item.tags as never,
          imageAlt: item.imageAlt,
          showImage: item.showImage,
          compactCard: item.compactCard ?? false,
          published: true,
          ...(photoId ? { photo: photoId } : {}),
        },
      })
      console.log(`Created item: #${item.id} ${item.name}`)
    }
  }

  console.log('Seed complete.')
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
