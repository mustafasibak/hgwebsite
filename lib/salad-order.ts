/** Klein → groß pairs per salad type (Salate tab + Veggie tab) */
const SALAD_PAIRS: readonly (readonly [string, string])[] = [
  ['341', '141'], // gemischter
  ['344', '444'], // Weißkäse
  ['42', '43'], // Markt
  ['142', '44'], // Chef
  ['242', '244'], // Hawaii
  ['342', '144'], // Fitness
]

const saladSortIndex = new Map<string, number>(
  SALAD_PAIRS.flatMap(([klein, gross], typeIndex) => [
    [klein, typeIndex * 2],
    [gross, typeIndex * 2 + 1],
  ]),
)

export function compareSaladItems(aId: string, bId: string): number {
  return (saladSortIndex.get(aId) ?? 999) - (saladSortIndex.get(bId) ?? 999)
}

export function isSaladCategory(slug: string): boolean {
  return slug === 'salate'
}
