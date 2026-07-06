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

import { cutoutPhotoMetrics } from '@/lib/cutout-photo-metrics'

export function isCutoutPhoto(src: string): boolean {
  const path = src.split('?')[0]
  return (
    path.includes('-removebg-preview.') ||
    path.includes('-nobg.') ||
    /^\/essen\/[a-z]+\d+\.png$/.test(path)
  )
}

export function getCutoutPhotoStyle(src: string): { scale: number; shiftY: string } {
  const path = src.split('?')[0]
  return cutoutPhotoMetrics[path] ?? { scale: 1, shiftY: '0%' }
}
