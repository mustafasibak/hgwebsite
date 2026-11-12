/**
 * Rotating dish photos on kiosk attract screen.
 * Use padded /kiosk-attract composites (not raw menu cutouts) so plates
 * stay fully readable at fullscreen without heavy crop/zoom.
 */
const ATTRACT_PHOTO_PATHS = [
  '/kiosk-attract/110-gyrosteller.jpg',
  '/kiosk-attract/312-adana.jpg',
  '/kiosk-attract/404-falafelteller.jpg',
  '/kiosk-attract/116-schnitzel.jpg',
  '/kiosk-attract/51-chickenburger.jpg',
  '/kiosk-attract/2-halbespommes.jpg',
  '/kiosk-attract/455-chiliburger.jpg',
  '/kiosk-attract/111-ganzhaehnchen.jpg',
] as const

export function kioskAttractPhotoUrl(path: string): string {
  return path
}

export const kioskAttractPhotos = ATTRACT_PHOTO_PATHS.map(kioskAttractPhotoUrl)

export const KIOSK_ATTRACT_SLIDE_MS = 8_000
