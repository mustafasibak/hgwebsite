/** Item photos in public/essen – keyed by menu item id */
export const menuItemPhotos: Record<string, string> = {
  '2': '/essen/halbespommes2-removebg-preview.png',
  '4': '/essen/hotdog4-removebg-preview.png',
  '28': '/essen/calamares28.jpeg',
  '47': '/essen/knobibrot47-removebg-preview.png',
  '51': '/essen/chickenburger51-removebg-preview.png',
  '110': '/essen/gyrosteller110-removebg-preview.png',
  '116': '/essen/schnitzel116-nobg.png',
  '112': '/essen/fitpfanne112.png',
  '126': '/essen/leberkaese126-removebg-preview.png',
  '213': '/essen/schnitzel213.png',
  '249': '/essen/makaronipfanne249.png',
  '252': '/essen/mixgrill252.png',
  '349': '/essen/pasta349-removebg-preview.png',
  '404': '/essen/falafelteller404-nobg.png',
  '49': '/essen/bolognese49.png',
  '68': '/essen/croquegyros68.png',
  '257': '/essen/cheeseburgermenu257.png',
  '312': '/essen/adana312.png',
  '314': '/essen/currywurstpommes314.png',
}

export function isCutoutPhoto(src: string): boolean {
  return (
    src.includes('-removebg-preview.') ||
    src.includes('-nobg.') ||
    /^\/essen\/[a-z]+\d+\.png$/.test(src)
  )
}
