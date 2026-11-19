import type { MenuCategory, MenuItem } from '@/lib/menu-data'
import { menuItemPhotoExtras, menuItemPhotos } from '@/lib/menu-item-photos'
import { menuItemPhotoVersions } from '@/lib/menu-item-photo-versions'

const PLACEHOLDER_DIR = '/placeholders'

/** Categories with a dedicated placeholder SVG in public/placeholders/ */
const PLACEHOLDER_SLUGS = new Set([
  'klassiker', 'grillgerichte', 'grillplatten', 'snacks', 'wings-strips',
  'croque', 'pasta', 'fisch', 'salate', 'super-spar-menus', 'menu-pommes',
  'beilagen', 'saucen', 'getraenke',
])

function withPhotoCacheBust(src: string): string {
  const version = menuItemPhotoVersions[src]
  return version ? `${src}?v=${version}` : src
}

export function categoryShowsImage(cat: MenuCategory): boolean {
  return cat.showImage !== false
}

export function itemHasPhoto(item: MenuItem): boolean {
  return Boolean(item.image || menuItemPhotos[item.id])
}

export function getCategoryPlaceholder(cat: MenuCategory): string {
  const slug = PLACEHOLDER_SLUGS.has(cat.slug) ? cat.slug : 'klassiker'
  return `${PLACEHOLDER_DIR}/${slug}.svg`
}

export function itemShowsImage(item: MenuItem, cat: MenuCategory): boolean {
  if (item.showImage === false) return false
  if (itemHasPhoto(item)) return true
  return categoryShowsImage(cat)
}

export function getStaticItemPhoto(itemId: string): string | undefined {
  const src = menuItemPhotos[itemId]
  return src ? withPhotoCacheBust(src) : undefined
}

export function getItemImage(
  item: MenuItem,
  cat: MenuCategory,
  options?: { fillMissingInGroup?: boolean },
): string | null {
  if (item.showImage === false) return null
  // mapItem already picks static /essen/ or admin blob; don't override here.
  if (item.image) return item.image
  const staticPhoto = getStaticItemPhoto(item.id)
  if (staticPhoto) return staticPhoto
  if (options?.fillMissingInGroup || categoryShowsImage(cat)) {
    return getCategoryPlaceholder(cat)
  }
  return null
}

/** Primary + optional extra slides for the item detail modal. */
export function getItemGalleryImages(
  item: MenuItem,
  cat: MenuCategory,
): string[] {
  const primary = getItemImage(item, cat)
  if (!primary || primary.startsWith('/placeholders/')) {
    return primary ? [primary] : []
  }
  const extras = (menuItemPhotoExtras[item.id] ?? []).map(src => withPhotoCacheBust(src))
  const seen = new Set<string>()
  const gallery: string[] = []
  for (const src of [primary, ...extras]) {
    const key = src.split('?')[0]
    if (seen.has(key)) continue
    seen.add(key)
    gallery.push(src)
  }
  return gallery
}

export function getItemAlt(item: MenuItem, _cat: MenuCategory): string {
  if (item.imageAlt) return item.imageAlt
  return item.desc ? `${item.name} – ${item.desc}` : item.name
}
