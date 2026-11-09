import type { MenuCategory, MenuItem } from '@/lib/menu-data'

/** Allergen labels on cards (matches Allergenkennzeichnung at the counter). */
export type AllergenTag =
  | 'Gluten'
  | 'Sahne'
  | 'Ei'
  | 'Milch'
  | 'Sesam'
  | 'Senf'
  | 'Fisch'
  | 'Sellerie'

const ALLERGEN_ORDER: AllergenTag[] = [
  'Gluten', 'Milch', 'Sahne', 'Ei', 'Senf', 'Sesam', 'Fisch', 'Sellerie',
]

function sortAllergens(tags: Iterable<string>): AllergenTag[] {
  const set = new Set<string>()
  for (const t of tags) set.add(t)
  return ALLERGEN_ORDER.filter(t => set.has(t))
}

function union(...groups: AllergenTag[][]): AllergenTag[] {
  return sortAllergens(groups.flat())
}

function text(item: MenuItem): string {
  return `${item.name} ${item.desc ?? ''}`.toLowerCase()
}

function has(item: MenuItem, pattern: RegExp): boolean {
  return pattern.test(text(item))
}

/** Kitchen sheet bundles (Allergenkennzeichnung). */
/** Plain mixed salad — no inherent gluten; dressing allergens are separate. */
const SALAD = [] as const satisfies readonly AllergenTag[]
const DRESSING = ['Milch', 'Ei', 'Senf'] as const satisfies readonly AllergenTag[]
/** Shared fryer — kitchen notes gluten risk on fried sides. */
const POMMES = ['Gluten'] as const satisfies readonly AllergenTag[]
/** Fried potatoes themselves aren’t egg/mustard — don’t invent those. */
const BRATKARTOFFELN = [] as const satisfies readonly AllergenTag[]
const JAEGER_SAUCE = ['Gluten', 'Sellerie', 'Senf', 'Sahne'] as const satisfies readonly AllergenTag[]
const CURRYWURST = ['Gluten', 'Senf', 'Sellerie'] as const satisfies readonly AllergenTag[]
const BRATWURST = ['Gluten', 'Senf', 'Sellerie'] as const satisfies readonly AllergenTag[]
const BURGER_BUN = ['Gluten', 'Sesam', 'Senf'] as const satisfies readonly AllergenTag[]
const WINGS_STRIPS = ['Gluten'] as const satisfies readonly AllergenTag[]
const SCHNITZEL = ['Gluten', 'Ei', 'Senf'] as const satisfies readonly AllergenTag[]
const HAEHNSCHNITZEL = ['Gluten', 'Ei'] as const satisfies readonly AllergenTag[]
const CROQUE = ['Gluten', 'Milch', 'Ei'] as const satisfies readonly AllergenTag[]
const FRIKADELLE = ['Gluten', 'Senf', 'Ei'] as const satisfies readonly AllergenTag[]
const SEELACHS = ['Gluten'] as const satisfies readonly AllergenTag[]
const FALAFEL = ['Sesam'] as const satisfies readonly AllergenTag[]
const CALAMARES = ['Gluten'] as const satisfies readonly AllergenTag[]
const JAEGER_ZIGEUNER = ['Gluten', 'Sellerie', 'Senf'] as const satisfies readonly AllergenTag[]
const RAHMSAUCE = ['Gluten', 'Sellerie', 'Milch'] as const satisfies readonly AllergenTag[]
const SOUR_TZATZIKI = ['Milch'] as const satisfies readonly AllergenTag[]
const MAYO = ['Ei', 'Senf'] as const satisfies readonly AllergenTag[]
const REMOULADE = ['Ei', 'Senf', 'Fisch'] as const satisfies readonly AllergenTag[]
const HANSE_SAUCE = ['Ei', 'Senf', 'Fisch'] as const satisfies readonly AllergenTag[]
const KNOBLAUCH_SAUCE = ['Ei', 'Senf', 'Milch'] as const satisfies readonly AllergenTag[]
const KETCHUP = ['Sellerie'] as const satisfies readonly AllergenTag[]
const KARTOFFEL_NUDEL_SALAT = ['Milch', 'Senf'] as const satisfies readonly AllergenTag[]
const MARKTSALAT = ['Fisch', 'Ei'] as const satisfies readonly AllergenTag[]
const CHEFSALAT = ['Milch', 'Ei'] as const satisfies readonly AllergenTag[]
const BAUERNSALAT = ['Milch'] as const satisfies readonly AllergenTag[]
const GRILLTELLER = ['Sellerie', 'Sahne'] as const satisfies readonly AllergenTag[]
const CARBONARA = ['Sahne', 'Ei'] as const satisfies readonly AllergenTag[]
const HOTDOG = ['Senf', 'Sahne'] as const satisfies readonly AllergenTag[]
const FISCHBURGER = ['Gluten', 'Sahne', 'Sesam'] as const satisfies readonly AllergenTag[]
const CHICKENBURGER = ['Gluten', 'Ei'] as const satisfies readonly AllergenTag[]
const PITA = ['Gluten', 'Sahne'] as const satisfies readonly AllergenTag[]

/** Tzatziki / Sour Cream on the kitchen sheet → Milch. */
function includesDairySauce(item: MenuItem): boolean {
  return has(item, /tzatziki|sour cream/i) || has(item, /gyros teller|gyros pita/i)
}

/** #80 — Knobi + Brot: only bread gluten (sauce bundle must not add Ei/Senf here). */
const ITEM_80_ONLY: Record<string, AllergenTag[]> = {
  '80': ['Gluten'],
}

function resolveFromKitchenSheet(item: MenuItem, cat: MenuCategory): AllergenTag[] {
  if (ITEM_80_ONLY[item.id]) {
    return [...ITEM_80_ONLY[item.id]]
  }

  const parts: AllergenTag[][] = []

  // Only real croques — not extras like #300 Extra Beilage in the croque tab.
  if (has(item, /croque|groque/i)) {
    parts.push([...CROQUE])
  }

  if (has(item, /hähnchenschnitzel/i)) {
    parts.push([...HAEHNSCHNITZEL])
  } else if (has(item, /schnitzel/i)) {
    parts.push([...SCHNITZEL])
  }

  if (has(item, /currywurst|croque knacker/i)) {
    parts.push([...CURRYWURST])
  }

  if (has(item, /bratwurst/i)) {
    parts.push([...BRATWURST])
  }

  if (has(item, /frikadelle/i)) {
    parts.push([...FRIKADELLE])
  }

  if (has(item, /seelachs/i)) {
    parts.push([...SEELACHS])
    if (has(item, /remoulade/i)) parts.push([...REMOULADE])
  }

  if (has(item, /falafel/i)) {
    parts.push([...FALAFEL])
  }

  if (has(item, /calamares/i)) {
    parts.push([...CALAMARES])
  }

  if (has(item, /gyros überbacken/i)) {
    parts.push([...JAEGER_SAUCE])
    if (has(item, /schafkäse|gouda/i)) {
      parts.push(['Milch'])
    }
  }

  if (cat.slug === 'wings-strips' && has(item, /wings|strips|crispy/i)) {
    parts.push([...WINGS_STRIPS])
  }

  // Do not match “Schnitzel Hamburger Art” — only actual burgers.
  if (
    has(item, /\bburger\b|cheeseburger|hamburger\(rind\)|big hamburger|big cheese/i) &&
    !has(item, /schnitzel/i)
  ) {
    parts.push([...BURGER_BUN])
  }

  if (has(item, /chickenburger/i)) {
    parts.push([...CHICKENBURGER])
  }

  if (has(item, /fischburger/i)) {
    parts.push([...FISCHBURGER])
  }

  if (has(item, /hotdog/i)) {
    parts.push([...HOTDOG])
  }

  if (has(item, /gyros pita|hähnchen pita|vegetarisch pita/i)) {
    parts.push([...PITA])
  }

  if (has(item, /carbonara/i)) {
    parts.push([...CARBONARA])
  }

  if (has(item, /marktsalat/i)) {
    parts.push([...MARKTSALAT])
  } else if (has(item, /chefsalat/i)) {
    parts.push([...CHEFSALAT])
  } else if (has(item, /hawaii-salat|hawaiisalat/i)) {
    parts.push(['Ei'])
  } else if (has(item, /fitness-teller-salat|fitness teller salat/i)) {
    parts.push([...SALAD])
  } else if (has(item, /weißkäsesalat/i)) {
    parts.push(['Milch'])
  } else if (cat.slug === 'salate') {
    parts.push([...SALAD])
  }

  if (cat.slug === 'salate' && has(item, /dressing/i)) {
    parts.push([...DRESSING])
  }

  if (has(item, /bauernsalat/i)) {
    parts.push([...BAUERNSALAT])
  }

  if (has(item, /kartoffelsalat|nudelsalat/i)) {
    parts.push([...KARTOFFEL_NUDEL_SALAT])
  }

  if (has(item, /spiegelei/i)) {
    parts.push(['Ei'])
  }

  if (has(item, /bratkartoffeln|bauernfrühstück/i) && item.id !== '30') {
    parts.push([...BRATKARTOFFELN])
  }

  if (has(item, /pommes|kroketten|kartoffelspalten/i) && !has(item, /kartoffelsalat/i)) {
    parts.push([...POMMES])
  }

  if (has(item, /folienkartoffel|sour cream|tzatziki/i) || includesDairySauce(item)) {
    parts.push([...SOUR_TZATZIKI])
  }

  if (has(item, /grillteller|mix grill|hhansen grillteller|grillplatte|bunter steak|mix hähnchen/i)) {
    parts.push([...GRILLTELLER])
  }

  if (has(item, /jägersauce|zigeunersauce/i) || (has(item, /jäger art|balkan art/i) && has(item, /schnitzel|frikadelle/i))) {
    parts.push([...JAEGER_ZIGEUNER])
  }

  if (has(item, /rahmsauce|rahmchampignon|champignonrahmsauce|dillsahne|sahnesauce|gorgonzola|fit pfanne|gemüse-teller|gemüseteller|reis-pfanne|gemüsepfanne|gurke in sahne/i)) {
    parts.push([...RAHMSAUCE])
  } else if (has(item, /makkaroni/i) && has(item, /sahne|gorgonzola|überbacken|käse/i)) {
    parts.push([...RAHMSAUCE])
  }

  if (has(item, /mayonnaise|ketchup oder mayo|extra ketchup/i)) {
    parts.push([...MAYO])
  }

  if (has(item, /ketchup/i) && !has(item, /mayonnaise|mayo/i)) {
    parts.push([...KETCHUP])
  }

  if (has(item, /remoulade|cocktail/i)) {
    parts.push([...REMOULADE])
  }

  if (has(item, /hanse-sauce|hanse sauce/i)) {
    parts.push([...HANSE_SAUCE])
  }

  // Only apply garlic-sauce allergens for standalone sauce items / dips —
  // not every dish that mentions Knoblauchsauce as a side (e.g. Calamares).
  if (cat.slug === 'saucen' && has(item, /knobi[\s-]*sauce|knoblauch[\s-]*sauce|knoblauch(?!\s*brot)/i)) {
    parts.push([...KNOBLAUCH_SAUCE])
  }

  if (cat.slug === 'saucen') {
    if (has(item, /zigeuner|jäger/i)) parts.push([...JAEGER_ZIGEUNER])
    if (has(item, /sour cream|tzatziki/i)) parts.push([...SOUR_TZATZIKI])
    if (has(item, /remoulade|cocktail/i)) parts.push([...REMOULADE])
    if (has(item, /hanse/i)) parts.push([...HANSE_SAUCE])
    if (has(item, /knoblauch/i)) parts.push([...KNOBLAUCH_SAUCE])
    if (has(item, /ketchup|mayonnaise|mayo/i)) parts.push([...MAYO], [...KETCHUP])
  }

  if (has(item, /milchkaffee|latte|cappuccino|heiße schokolade/i)) {
    parts.push(['Milch'])
  }

  if (has(item, /garnelen/i)) {
    parts.push([...RAHMSAUCE])
  }

  if (has(item, /knoblauchbrot/i)) {
    parts.push(['Gluten'])
  }

  if (parts.length === 0) return []

  return union(...parts)
}

/**
 * Prefer curated tags from menu-data (printed Speisekarte) when present.
 * Kitchen-sheet heuristics are a fallback only — they previously overrode
 * careful tags (e.g. Calamares + Knoblauchsauce → invented Milch/Ei/Senf).
 */
export function resolveItemAllergens(item: MenuItem, cat: MenuCategory): AllergenTag[] {
  if (item.tags && item.tags.length > 0) {
    return sortAllergens(item.tags)
  }

  return resolveFromKitchenSheet(item, cat)
}

export function saladHasDressingNote(item: MenuItem, cat: MenuCategory): boolean {
  return cat.slug === 'salate' && Boolean(item.desc?.toLowerCase().includes('dressing'))
}
