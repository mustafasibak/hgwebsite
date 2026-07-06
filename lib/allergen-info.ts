import type { MenuCategory, MenuItem } from '@/lib/menu-data'

/** Standard allergen labels used on cards (matches kitchen sheets). */
export type AllergenTag =
  | 'Gluten'
  | 'Sahne'
  | 'Ei'
  | 'Milch'
  | 'Sesam'
  | 'Senf'
  | 'Fisch'
  | 'Sellerie'

export type DressingAllergen = {
  id: string
  nameDe: string
  nameEn: string
  allergens: AllergenTag[]
}

/** Sheet 2 – salad dressings & Rahmchampignons */
export const DRESSING_ALLERGENS: DressingAllergen[] = [
  {
    id: 'american',
    nameDe: 'American Dressing',
    nameEn: 'American dressing',
    allergens: ['Senf', 'Ei'],
  },
  {
    id: 'essig-oel',
    nameDe: 'Essig & Öl',
    nameEn: 'Vinaigrette',
    allergens: ['Sellerie', 'Senf'],
  },
  {
    id: 'joghurt',
    nameDe: 'Joghurt Dressing',
    nameEn: 'Yoghurt dressing',
    allergens: ['Gluten', 'Senf', 'Ei'],
  },
  {
    id: 'rahmchampignons',
    nameDe: 'Rahmchampignons',
    nameEn: 'Cream mushrooms',
    allergens: ['Gluten', 'Sahne'],
  },
]

const ALLERGEN_ORDER: AllergenTag[] = [
  'Gluten', 'Milch', 'Sahne', 'Ei', 'Senf', 'Sesam', 'Fisch', 'Sellerie',
]

function sortAllergens(tags: Iterable<string>): AllergenTag[] {
  const set = new Set<string>()
  for (const t of tags) set.add(t)
  return ALLERGEN_ORDER.filter(t => set.has(t))
}

function nameHas(item: MenuItem, pattern: RegExp): boolean {
  return pattern.test(`${item.name} ${item.desc ?? ''}`)
}

type Rule = {
  test: (item: MenuItem, cat: MenuCategory) => boolean
  allergens: AllergenTag[]
}

/** Master kitchen sheet – pattern rules (union with item.tags in menu-data). */
const RULES: Rule[] = [
  {
    test: (item) => nameHas(item, /hähnchenschnitzel/i),
    allergens: ['Gluten', 'Ei'],
  },
  {
    test: (item) => nameHas(item, /schnitzel/i),
    allergens: ['Gluten', 'Sahne', 'Ei'],
  },
  {
    test: (item, cat) => cat.slug === 'croque' || nameHas(item, /croque|groque/i),
    allergens: ['Gluten', 'Milch'],
  },
  {
    test: (item) => nameHas(item, /^gyros fleisch|gyros überbacken|gyros teller/i),
    allergens: ['Milch'],
  },
  {
    test: (item) => nameHas(item, /gyros pita|hähnchen pita|vegetarisch pita/i),
    allergens: ['Gluten', 'Sahne'],
  },
  {
    test: (item) => nameHas(item, /frikadelle/i),
    allergens: ['Gluten', 'Senf', 'Ei'],
  },
  {
    test: (item) => nameHas(item, /seelachs/i),
    allergens: ['Gluten'],
  },
  {
    test: (item) => nameHas(item, /falafel/i),
    allergens: ['Sesam'],
  },
  {
    test: (item) => nameHas(item, /calamares/i),
    allergens: ['Gluten'],
  },
  {
    test: (item) => nameHas(item, /chickenburger/i),
    allergens: ['Gluten', 'Ei'],
  },
  {
    test: (item) => nameHas(item, /hotdog/i),
    allergens: ['Senf', 'Sahne'],
  },
  {
    test: (item) => nameHas(item, /fischburger/i),
    allergens: ['Gluten', 'Sahne', 'Sesam'],
  },
  {
    test: (item) => nameHas(item, /hamburger|cheeseburger|big cheese|big hamburger/i),
    allergens: ['Gluten', 'Sesam'],
  },
  {
    test: (item) => nameHas(item, /kartoffelsalat|nudelsalat/i),
    allergens: ['Sahne', 'Senf'],
  },
  {
    test: (item) => nameHas(item, /bauernsalat/i),
    allergens: ['Milch'],
  },
  {
    test: (item) => nameHas(item, /sour cream|tzatziki/i),
    allergens: ['Milch'],
  },
  {
    test: (item) => nameHas(item, /folienkartoffel|kartoffelspalten.*sour/i),
    allergens: ['Milch'],
  },
  {
    test: (item) => nameHas(item, /marktsalat/i),
    allergens: ['Ei', 'Fisch'],
  },
  {
    test: (item) => nameHas(item, /chefsalat/i),
    allergens: ['Milch', 'Ei'],
  },
  {
    test: (item) => nameHas(item, /fitness-teller|fitness teller|hansesalat/i),
    allergens: ['Milch'],
  },
  {
    test: (item) => nameHas(item, /hawaii-salat|hawaiisalat/i),
    allergens: ['Ei'],
  },
  {
    test: (item) => nameHas(item, /weißkäsesalat/i),
    allergens: ['Milch'],
  },
  {
    test: (item) => nameHas(item, /grillteller|mix grill|hhansen grillteller/i),
    allergens: ['Sellerie', 'Sahne'],
  },
  {
    test: (item) => nameHas(item, /carbonara/i),
    allergens: ['Sahne', 'Ei'],
  },
  {
    test: (item) => nameHas(item, /gemüse-teller|gemüseteller/i),
    allergens: ['Milch'],
  },
  {
    test: (item) => nameHas(item, /fit pfanne|fitpfanne/i),
    allergens: ['Milch'],
  },
  {
    test: (item) => nameHas(item, /makkaroni pfanne/i),
    allergens: ['Milch'],
  },
  {
    test: (item) => nameHas(item, /rumpsteak|putensteak.*folien|hüftsteak/i),
    allergens: ['Milch'],
  },
  {
    test: (item) => nameHas(item, /jägersauce/i),
    allergens: ['Gluten', 'Ei', 'Sahne'],
  },
  {
    test: (item) => nameHas(item, /zigeunersauce/i),
    allergens: ['Sellerie'],
  },
  {
    test: (item) => nameHas(item, /reis-pfanne|gemüsepfanne/i),
    allergens: ['Gluten', 'Milch', 'Ei'],
  },
  {
    test: (item) => nameHas(item, /mayonnaise|ketchup oder mayo/i),
    allergens: ['Ei', 'Senf'],
  },
  {
    test: (item) => nameHas(item, /rahmchampignon|champignonrahmsauce/i),
    allergens: ['Gluten', 'Sahne'],
  },
  {
    test: (item) => nameHas(item, /garnelen teller/i),
    allergens: ['Gluten', 'Sahne'],
  },
  {
    test: (item, cat) => cat.slug === 'salate' && nameHas(item, /dressing/i),
    allergens: [],
  },
]

export function resolveItemAllergens(item: MenuItem, cat: MenuCategory): AllergenTag[] {
  const merged = new Set<string>(item.tags ?? [])
  for (const rule of RULES) {
    if (rule.test(item, cat)) {
      for (const a of rule.allergens) merged.add(a)
    }
  }
  return sortAllergens(merged)
}

export function saladHasDressingNote(item: MenuItem, cat: MenuCategory): boolean {
  return cat.slug === 'salate' && Boolean(item.desc?.toLowerCase().includes('dressing'))
}
