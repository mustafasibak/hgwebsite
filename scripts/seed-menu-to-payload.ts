/**
 * One-time import of static menu + photos into Payload.
 * Usage: npm run seed:menu
 * (Pull production env first: npx vercel env pull .env.local --environment=production)
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { staticMenuCategories } from '../lib/menu-data'
import { menuItemPhotos } from '../lib/menu-item-photos'

import type { Payload } from 'payload'

const root = join(import.meta.dirname, '..')

const NACHTISCH_ITEMS = [
  {
    itemNumber: 'rote-gruetze',
    name: 'Rote Grütze mit Vanillensauce',
    nameEn: 'Red berry compote with vanilla sauce',
    image: '/essen/rotegruetzemitvanillensauce-removebg-preview.png',
    imageAlt: 'Rote Grütze mit Vanillensauce',
  },
] as const

async function ensureNachtischCategory(payload: Payload) {
  const existing = await payload.find({
    collection: 'menu-categories',
    where: { slug: { equals: 'nachtisch' } },
    limit: 1,
  })

  if (existing.docs[0]) {
    return existing.docs[0].id as number
  }

  const doc = await payload.create({
    collection: 'menu-categories',
    data: {
      name: 'Nachtisch (nach Anfrage)',
      slug: 'nachtisch',
      icon: '🍰',
      sortOrder: 115,
      showImage: true,
    },
  })
  console.log('Created category: Nachtisch (nach Anfrage)')
  return doc.id as number
}

async function seedNachtisch(payload: Payload) {
  const categoryId = await ensureNachtischCategory(payload)

  for (const item of NACHTISCH_ITEMS) {
    const existing = await payload.find({
      collection: 'menu-items',
      where: { itemNumber: { equals: item.itemNumber } },
      limit: 1,
    })

    if (existing.docs[0]) {
      console.log(`Nachtisch item exists: ${item.name}`)
      continue
    }

    let photoId: number | undefined
    const filePath = join(root, 'public', item.image.replace(/^\//, '').split('?')[0])
    if (existsSync(filePath)) {
      const buffer = readFileSync(filePath)
      const filename = filePath.split('/').pop() || 'photo.png'
      const media = await payload.create({
        collection: 'media',
        data: { alt: item.imageAlt },
        file: {
          data: buffer,
          mimetype: filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
          name: filename,
          size: buffer.length,
        },
      })
      photoId = media.id as number
    }

    await payload.create({
      collection: 'menu-items',
      data: {
        itemNumber: item.itemNumber,
        category: categoryId,
        name: item.name,
        nameEn: item.nameEn,
        price: 0,
        priceTbd: true,
        imageAlt: item.imageAlt,
        showImage: true,
        published: true,
        ...(photoId ? { photo: photoId } : {}),
      },
    })
    console.log(`Created Nachtisch item: ${item.name}`)
  }
}

async function seed() {
  const { hasDatabaseUrl, getDatabaseUrl } = await import('../lib/database-url')
  if (!hasDatabaseUrl()) {
    console.error('DATABASE_URL, POSTGRES_URL, or DATABASE_URI is required')
    console.error('Run: npx vercel env pull .env.local --environment=production')
    console.error('Then: npm run seed:menu')
    process.exit(1)
  }

  console.log('Using database:', getDatabaseUrl().replace(/:[^:@/]+@/, ':***@'))

  const { default: config } = await import('../payload.config')
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config })

  await seedNachtisch(payload)

  const existingItems = await payload.find({
    collection: 'menu-items',
    limit: 1,
  })
  if (existingItems.totalDocs > 0) {
    console.log(`Seed skipped: ${existingItems.totalDocs} menu items already in database.`)
    process.exit(0)
  }

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
