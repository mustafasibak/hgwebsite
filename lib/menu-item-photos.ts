/** Item photos in public/essen – keyed by menu item id */
export const menuItemPhotos: Record<string, string> = {
  // Klassiker
  '2': '/essen/halbespommes2-removebg-preview.png',
  '116': '/essen/schnitzel116-nobg.png',
  '213': '/essen/schnitzel213-removebg-preview.png',
  '404': '/essen/falafelteller404-nobg.png',
  // Grillgerichte
  '54': '/essen/putensteak54.png',
  '110': '/essen/gyrosteller110-removebg-preview.png',
  '126': '/essen/leberkaese126-removebg-preview.png',
  '215': '/essen/rumpsteak215.png',
  '323': '/essen/lammkotelett323.png',
  // Grillplatten
  '666': '/essen/grillplatter666-removebg-preview-removebg-preview.png',
  // Snacks
  '4': '/essen/hotdog4.png',
  '51': '/essen/chickenburger51-nobg.png',
  '58': '/essen/bigcheeseburger58-removebg-preview-removebg-preview.png',
  '127': '/essen/gyrospita127.png',
  // Croque
  '68': '/essen/croquegyros68.png',
  // Pasta
  '49': '/essen/bolognese49.png',
  '249': '/essen/makaronipfanne249.png',
  '349': '/essen/makaroninapoli349.png',
  // Fisch
  '23': '/essen/seelachsfilet23.png',
  '28': '/essen/calamares28-removebg-preview.png',
  // Super-Spar-Menüs
  '52': '/essen/rindersteak52.png',
  '112': '/essen/fitpfanne112.png',
  '129': '/essen/bauernfruehstuck129-removebg-preview.png',
  '252': '/essen/mixgrill252.png',
  '312': '/essen/adana312.png',
  // Menü mit Pommes + Getränk
  '257': '/essen/cheeseburgermenu257.png',
  '314': '/essen/currywurstpommes314.png',
  // Beilagen
  '30': '/essen/bratkartoffeln30.png',
  '47': '/essen/knobibrot47-removebg-preview.png',
  // Salate
  '44': '/essen/grosserchefsalat44.png',
  '144': '/essen/grosserfitnesssalat144.png',
  '444': '/essen/grosserweisskaesesalat444.png',
}

import { cutoutPhotoMetrics, type CutoutPhotoMetrics } from '@/lib/cutout-photo-metrics'

export const defaultCutoutMetrics: CutoutPhotoMetrics = {
  scale: 0.92,
  shiftX: '0%',
  shiftY: '0%',
}

function photoBasename(src: string): string {
  const raw = src.split('?')[0]
  if (raw.startsWith('/')) {
    return raw.split('/').pop() || ''
  }
  try {
    return decodeURIComponent(new URL(raw).pathname.split('/').pop() || '')
  } catch {
    return raw.split('/').pop() || ''
  }
}

/** Resolve metrics key for /essen/ paths, blob URLs, and Vercel random suffixes. */
export function resolveCutoutMetricsKey(src: string, itemId?: string): string | undefined {
  if (itemId && menuItemPhotos[itemId]) {
    return menuItemPhotos[itemId].split('?')[0]
  }

  const basename = photoBasename(src)
  if (!basename) return undefined

  const direct = `/essen/${basename}`
  if (cutoutPhotoMetrics[direct]) return direct

  const baseStem = basename.replace(/\.[a-z]+$/i, '')
  for (const key of Object.keys(cutoutPhotoMetrics)) {
    const stem = key.replace('/essen/', '').replace(/\.[a-z]+$/i, '')
    if (baseStem === stem || baseStem.startsWith(`${stem}-`) || stem.startsWith(baseStem)) {
      return key
    }
  }

  return undefined
}

export function isCutoutPhoto(src: string): boolean {
  if (!src || src.startsWith('/placeholders/')) return false
  return true
}

export function getCutoutPhotoStyle(
  src: string,
  itemId?: string,
): CutoutPhotoMetrics {
  const key = resolveCutoutMetricsKey(src, itemId)
  if (key && cutoutPhotoMetrics[key]) return cutoutPhotoMetrics[key]
  return defaultCutoutMetrics
}
