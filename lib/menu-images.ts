import type { MenuCategory, MenuItem } from '@/lib/menu-data'
import { menuItemPhotos } from '@/lib/menu-item-photos'

const PLACEHOLDER_DIR = '/placeholders'

export function categoryShowsImage(cat: MenuCategory): boolean {
  return cat.showImage !== false
}

export function itemHasPhoto(item: MenuItem): boolean {
  return Boolean(item.image || menuItemPhotos[item.id])
}

export function itemShowsImage(item: MenuItem, cat: MenuCategory): boolean {
  if (item.showImage === false) return false
  if (itemHasPhoto(item)) return true
  return categoryShowsImage(cat)
}

export function getItemImage(item: MenuItem, cat: MenuCategory): string | null {
  if (!itemShowsImage(item, cat)) return null
  if (item.image) return item.image
  if (menuItemPhotos[item.id]) return menuItemPhotos[item.id]
  return `${PLACEHOLDER_DIR}/${cat.slug}.svg`
}

export function getItemAlt(item: MenuItem, _cat: MenuCategory): string {
  if (item.imageAlt) return item.imageAlt
  return item.desc ? `${item.name} – ${item.desc}` : item.name
}
