/**
 * Default Suchbegriffe — imported into Payload on deploy (seed sync).
 * Owners can add or change terms in admin; sync only adds missing defaults.
 */
export const menuItemSearchDefaults: Record<string, string[]> = {
  '47': ['knobi', 'knoblauch brot', 'knoblauchbrot'],
  '80': ['hähnchen spezial', 'spezial', 'knobi', 'halbes spezial'],
  '49': ['bolognese', 'spaghetti'],
  '102': ['halbes', 'halbes hähnchen', 'half chicken'],
  '1': ['halbes', 'halbes hähnchen', 'half chicken'],
  '2': ['halbes', 'halbes hähnchen', 'half chicken', 'hähnchen pommes'],
  '3': ['halbes', 'hähnchen menü', 'menu'],
  '111': ['ganzes', 'ganzes hähnchen', 'whole chicken'],
  '10': ['gyros teller', 'teller'],
  '110': ['gyros teller', 'teller'],
  '127': ['gyros pita', 'pita'],
  '252': ['mix grill', 'mix grill teller', 'grillteller'],
  '449': ['makaroni veggie', 'makkaroni vegi', 'tomatensauce', 'veggie pasta'],
  'buffalo-strips-4': ['buffalo', 'strips', 'buffalo strips'],
  '312': ['adana', 'spieß', 'spies'],
  '314': ['adana', 'spieß'],
  '51': ['currywurst', 'curry'],
  '116': ['currywurst', 'curry'],
  '126': ['leberkäse', 'leberkaese', 'spiegelei'],
  '45': ['sauce', 'dip', 'tzatziki', 'knoblauch', 'remoulade'],
  '28': ['calamari', 'calamares', 'ringe'],
  '404': ['falafel', 'veggie'],
  'rote-gruetze': ['grütze', 'gruetze', 'nachtisch', 'dessert'],
}

export function mergeSearchKeywords(
  itemId: string,
  fromCms?: string[] | null,
): string[] | undefined {
  const defaults = menuItemSearchDefaults[itemId] ?? []
  const cms = fromCms?.map(k => k.trim()).filter(Boolean) ?? []
  const merged = [...new Set([...cms, ...defaults])]
  return merged.length ? merged : undefined
}
