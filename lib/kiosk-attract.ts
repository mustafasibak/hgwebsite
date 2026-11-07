import { menuItemPhotoVersions } from '@/lib/menu-item-photo-versions'

/** Rotating dish photos on kiosk attract screen (paths under /essen). */
const ATTRACT_PHOTO_PATHS = [
  '/essen/mixgrill252.png',
  '/essen/leberkaese126.png',
  '/essen/bolognese49.png',
  '/essen/gyrosteller110-removebg-preview.png',
  '/essen/adana312.png',
  '/essen/falafelteller404-nobg.png',
  '/essen/grillplatter666-removebg-preview-removebg-preview.png',
  '/essen/haehnchenspezial80.png',
] as const

export function kioskAttractPhotoUrl(path: string): string {
  const v = menuItemPhotoVersions[path]
  return v ? `${path}?v=${v}` : path
}

export const kioskAttractPhotos = ATTRACT_PHOTO_PATHS.map(kioskAttractPhotoUrl)

export const KIOSK_ATTRACT_SLIDE_MS = 8_000
