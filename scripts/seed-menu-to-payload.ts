/**
 * One-time import of static menu + photos into Payload.
 * Usage: npm run seed:menu
 * (Pull production env first: npx vercel env pull .env.local --environment=production)
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { staticMenuCategories } from '../lib/menu-data'
import { menuItemEnById } from '../lib/menu-i18n'
import { menuItemPhotos } from '../lib/menu-item-photos'
import { menuItemSearchDefaults } from '../lib/menu-item-search-defaults'

import type { Payload } from 'payload'

const root = join(import.meta.dirname, '..')

/** Deploy sync: repo /essen/ → Payload when filename changed. */
const STATIC_DISH_PHOTOS: { itemNumber: string; path: string; alt: string }[] = [
  { itemNumber: '49', path: '/essen/bolognese49.png', alt: 'Spaghetti Bolognese' },
  { itemNumber: '80', path: '/essen/haehnchenspezial80.png', alt: '1/2 Grill Hähnchen Spezial' },
  { itemNumber: '126', path: '/essen/leberkaese126.png', alt: 'Leberkäse mit Spiegelei und Bratkartoffeln' },
  { itemNumber: '449', path: '/essen/makaroniveggie449.png', alt: 'Makkaroni Vegi. mit Tomatensauce und Salat' },
  { itemNumber: '252', path: '/essen/mixgrill252.png', alt: 'Mix Grill-Teller' },
]

const NACHTISCH_ITEMS = [
  {
    itemNumber: 'rote-gruetze',
    name: 'Rote Grütze mit Vanillensauce',
    nameEn: menuItemEnById['rote-gruetze'].nameEn,
    image: '/essen/rotegruetzemitvanillensauce-removebg-preview.png',
    imageAlt: 'Rote Grütze mit Vanillensauce',
  },
] as const

async function syncEnglishTranslations(payload: Payload) {
  const updates: Array<{ itemNumber: string; nameEn?: string; descriptionEn?: string }> = []

  for (const cat of staticMenuCategories) {
    for (const item of cat.items) {
      const en = menuItemEnById[item.id]
      const nameEn = item.nameEn ?? en?.nameEn
      const descriptionEn = item.descEn ?? en?.descEn
      if (nameEn || descriptionEn) {
        updates.push({
          itemNumber: item.id,
          ...(nameEn ? { nameEn } : {}),
          ...(descriptionEn ? { descriptionEn } : {}),
        })
      }
    }
  }

  for (const item of NACHTISCH_ITEMS) {
    if (item.nameEn) {
      updates.push({ itemNumber: item.itemNumber, nameEn: item.nameEn })
    }
  }

  let synced = 0
  for (const patch of updates) {
    const existing = await payload.find({
      collection: 'menu-items',
      where: { itemNumber: { equals: patch.itemNumber } },
      limit: 1,
    })
    const doc = existing.docs[0]
    if (!doc) continue

    const data: Record<string, string> = {}
    if (patch.nameEn && doc.nameEn !== patch.nameEn) data.nameEn = patch.nameEn
    if (patch.descriptionEn && doc.descriptionEn !== patch.descriptionEn) {
      data.descriptionEn = patch.descriptionEn
    }
    if (Object.keys(data).length === 0) continue

    await payload.update({
      collection: 'menu-items',
      id: doc.id,
      data,
    })
    synced++
    console.log(`Updated EN: #${patch.itemNumber}`)
  }

  if (synced > 0) {
    console.log(`Synced ${synced} English menu translation(s).`)
  }
}

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

async function syncSearchKeywords(payload: Payload) {
  let synced = 0
  for (const [itemNumber, defaults] of Object.entries(menuItemSearchDefaults)) {
    const existing = await payload.find({
      collection: 'menu-items',
      where: { itemNumber: { equals: itemNumber } },
      limit: 1,
    })
    const doc = existing.docs[0]
    if (!doc) continue

    const current =
      (doc.searchKeywords as { keyword?: string }[] | undefined)
        ?.map(row => row.keyword?.trim())
        .filter((k): k is string => Boolean(k)) ?? []

    const merged = [...new Set([...current, ...defaults])]
    const missing = defaults.some(d => !current.includes(d))
    if (!missing) continue

    await payload.update({
      collection: 'menu-items',
      id: doc.id,
      data: {
        searchKeywords: merged.map(keyword => ({ keyword })),
      },
    })
    synced++
    console.log(`Synced Suchbegriffe: #${itemNumber}`)
  }

  if (synced > 0) {
    console.log(`Synced ${synced} dish search keyword list(s).`)
  }
}

async function syncItemPhotoFromStatic(
  payload: Payload,
  itemNumber: string,
  publicPath: string,
  alt: string,
) {
  const existing = await payload.find({
    collection: 'menu-items',
    where: { itemNumber: { equals: itemNumber } },
    limit: 1,
    depth: 1,
  })
  const doc = existing.docs[0]
  if (!doc) return

  const filePath = join(root, 'public', publicPath.replace(/^\//, '').split('?')[0])
  if (!existsSync(filePath)) {
    console.warn(`Photo file missing for #${itemNumber}: ${publicPath}`)
    return
  }

  const buffer = readFileSync(filePath)
  const filename = publicPath.split('/').pop() || 'photo.jpg'
  const photo = doc.photo as { filename?: string; filesize?: number } | number | null | undefined
  if (
    photo &&
    typeof photo === 'object' &&
    photo.filename === filename &&
    photo.filesize === buffer.length
  ) {
    return
  }
  const mimetype = filename.endsWith('.png') ? 'image/png' : 'image/jpeg'
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buffer,
      mimetype,
      name: filename,
      size: buffer.length,
    },
  })

  await payload.update({
    collection: 'menu-items',
    id: doc.id,
    data: { photo: media.id },
  })
  console.log(`Updated photo: #${itemNumber} → ${filename}`)
}

async function syncStaticDishPhotos(payload: Payload) {
  for (const dish of STATIC_DISH_PHOTOS) {
    await syncItemPhotoFromStatic(payload, dish.itemNumber, dish.path, dish.alt)
  }
}

/** Add dishes that exist in menu-data but are missing from Payload (e.g. new #80). */
async function ensureStaticMenuItems(payload: Payload) {
  const categoryIdBySlug = new Map<string, number>()
  for (const cat of staticMenuCategories) {
    const existing = await payload.find({
      collection: 'menu-categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })
    const id = existing.docs[0]?.id as number | undefined
    if (id) categoryIdBySlug.set(cat.slug, id)
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
      if (existing.docs[0]) continue

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

      const en = menuItemEnById[item.id]
      await payload.create({
        collection: 'menu-items',
        data: {
          itemNumber: item.id,
          category: categoryId,
          name: item.name,
          description: item.desc,
          nameEn: item.nameEn ?? en?.nameEn,
          descriptionEn: item.descEn ?? en?.descEn,
          price: item.price,
          priceTbd: item.priceTbd ?? false,
          badge: item.badge,
          allergenTags: item.tags as never,
          imageAlt: item.imageAlt || item.name,
          showImage: item.showImage,
          compactCard: item.compactCard ?? false,
          published: true,
          ...(photoId ? { photo: photoId } : {}),
        },
      })
      console.log(`Created missing menu item: #${item.id} ${item.name}`)
    }
  }
}

/** Items removed from the printed/static Speisekarte — hide on deploy seed. */
const RETIRED_ITEM_NUMBERS = ['102']

async function unpublishRetiredItems(payload: Payload) {
  for (const itemNumber of RETIRED_ITEM_NUMBERS) {
    const existing = await payload.find({
      collection: 'menu-items',
      where: { itemNumber: { equals: itemNumber } },
      limit: 10,
    })
    for (const doc of existing.docs) {
      if (doc.published === false) continue
      await payload.update({
        collection: 'menu-items',
        id: doc.id,
        data: { published: false },
      })
      console.log(`Unpublished retired item: #${itemNumber}`)
    }
  }
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
  await syncEnglishTranslations(payload)
  await syncSearchKeywords(payload)
  await ensureStaticMenuItems(payload)
  await unpublishRetiredItems(payload)
  await syncStaticDishPhotos(payload)

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
          nameEn: item.nameEn ?? menuItemEnById[item.id]?.nameEn,
          descriptionEn: item.descEn ?? menuItemEnById[item.id]?.descEn,
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
