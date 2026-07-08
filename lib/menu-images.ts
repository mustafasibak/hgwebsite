import type { MenuCategory, MenuItem } from '@/lib/menu-data'
import { menuItemPhotos } from '@/lib/menu-item-photos'
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

export function getItemAlt(item: MenuItem, _cat: MenuCategory): string {
  if (item.imageAlt) return item.imageAlt
  return item.desc ? `${item.name} – ${item.desc}` : item.name
}
