import config from '@payload-config'
import { hasDatabaseUrl } from '@/lib/database-url'
import { getPayload } from 'payload'
import {
  staticMenuCategories,
  type MenuCategory,
  type MenuItem,
} from '@/lib/menu-data'

type PayloadCategory = {
  id: number | string
  name: string
  slug: string
  icon?: string | null
  sortOrder: number
  showImage?: boolean | null
}

type PayloadMedia = {
  url?: string | null
  updatedAt?: string
}

type PayloadMenuItem = {
  itemNumber: string
  name: string
  description?: string | null
  nameEn?: string | null
  descriptionEn?: string | null
  price: number
  priceTbd?: boolean | null
  badge?: string | null
  allergenTags?: string[] | null
  imageAlt?: string | null
  showImage?: boolean | null
  compactCard?: boolean | null
  published?: boolean | null
  photo?: PayloadMedia | number | string | null
  category: PayloadCategory | number | string
}

function mediaUrl(photo: PayloadMenuItem['photo']): string | undefined {
  if (!photo || typeof photo === 'number' || typeof photo === 'string') return undefined
  const url = photo.url
  if (!url) return undefined
  if (photo.updatedAt) {
    const sep = url.includes('?') ? '&' : '?'
    return `${url}${sep}v=${encodeURIComponent(photo.updatedAt)}`
  }
  return url
}

function mapItem(doc: PayloadMenuItem): MenuItem {
  const image = mediaUrl(doc.photo)
  const tags = doc.allergenTags?.length ? [...doc.allergenTags] : undefined

  return {
    id: doc.itemNumber,
    name: doc.name,
    ...(doc.description ? { desc: doc.description } : {}),
    ...(doc.nameEn ? { nameEn: doc.nameEn } : {}),
    ...(doc.descriptionEn ? { descEn: doc.descriptionEn } : {}),
    price: doc.price,
    ...(doc.priceTbd ? { priceTbd: true } : {}),
    ...(doc.badge ? { badge: doc.badge } : {}),
    ...(tags ? { tags } : {}),
    ...(doc.compactCard ? { compactCard: true } : {}),
    ...(doc.showImage === false ? { showImage: false } : {}),
    ...(image ? { image, imageAlt: doc.imageAlt || doc.name } : {}),
  }
}

function mapCategory(cat: PayloadCategory, items: MenuItem[]): MenuCategory {
  return {
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon || '🍽️',
    ...(cat.showImage === false ? { showImage: false } : {}),
    items,
  }
}

async function getMenuFromPayload(): Promise<MenuCategory[]> {
  const payload = await getPayload({ config })

  const { docs: categories } = await payload.find({
    collection: 'menu-categories',
    sort: 'sortOrder',
    limit: 100,
    depth: 0,
  })

  const { docs: items } = await payload.find({
    collection: 'menu-items',
    where: { published: { equals: true } },
    sort: 'itemNumber',
    limit: 500,
    depth: 1,
  })

  const itemsByCategoryId = new Map<string, MenuItem[]>()
  for (const raw of items as PayloadMenuItem[]) {
    const cat = raw.category
    const catId = typeof cat === 'object' && cat !== null ? String(cat.id) : String(cat)
    const mapped = mapItem(raw)
    const list = itemsByCategoryId.get(catId) ?? []
    list.push(mapped)
    itemsByCategoryId.set(catId, list)
  }

  return (categories as PayloadCategory[]).map(cat =>
    mapCategory(cat, itemsByCategoryId.get(String(cat.id)) ?? []),
  )
}

export async function getMenu(): Promise<MenuCategory[]> {
  if (process.env.USE_PAYLOAD_MENU !== 'true') {
    return staticMenuCategories
  }
  if (!hasDatabaseUrl()) {
    return staticMenuCategories
  }
  try {
    return await getMenuFromPayload()
  } catch (err) {
    console.error('[getMenu] Payload fallback to static menu:', err)
    return staticMenuCategories
  }
}

export const MENU_REVALIDATE_SECONDS = 60
