import { menuCategories, type MenuCategory, type MenuItem } from '@/lib/menu-data'
import { compareSaladItems } from '@/lib/salad-order'

export type Locale = 'de' | 'en'

export const VEGGIE_TAB = '__veggie__' as const
export const NACHTISCH_TAB = '__nachtisch__' as const
export type MenuTab = typeof VEGGIE_TAB | typeof NACHTISCH_TAB | string

const TRAILING_CATEGORY_SLUGS = ['saucen', 'getraenke'] as const

/** Category tabs with Saucen & Getränke last (after Veggie/Nachtisch). */
export function getMenuTabOrder(): MenuTab[] {
  const trailing = new Set<string>(TRAILING_CATEGORY_SLUGS)
  const main = menuCategories.filter(c => !trailing.has(c.slug)).map(c => c.slug)
  return [...main, VEGGIE_TAB, NACHTISCH_TAB, ...TRAILING_CATEGORY_SLUGS]
}

const VEGGIE_EXCLUDE_IDS = new Set(['555'])

const MEAT_PATTERN = /hähnchen|huhn|pute|rind|lamm|fleisch|gyros|schinken|thunfisch|garnelen|lachs|fisch|adana|kebab|pastirma|sucuk|salami|frikadelle|currywurst|knacker|schawarma|schwarma|geflügel|leberkäse|spieß|steak|burger\s*\(beef\)|rührei/i
const VEGGIE_PATTERN = /veggie|vegi\.|vegetarisch|falafel|gemüse-teller|camembert|mozzarella|schafkäse|weißkäse|lohbrügger|knoblauchbrot|gemischter salat/i

export function isVeggieItem(item: MenuItem): boolean {
  if (VEGGIE_EXCLUDE_IDS.has(item.id)) return false
  if (item.badge === 'Veggie') return true
  const text = `${item.name} ${item.desc || ''}`
  if (MEAT_PATTERN.test(text)) return false
  return VEGGIE_PATTERN.test(text)
}

export type VeggieEntry = { item: MenuItem; cat: MenuCategory }

/** Salads last in Veggie tab, klein → groß per type */
export function sortVeggieEntries(entries: VeggieEntry[]): VeggieEntry[] {
  const mains: VeggieEntry[] = []
  const salads: VeggieEntry[] = []

  for (const entry of entries) {
    if (entry.cat.slug === 'salate') salads.push(entry)
    else mains.push(entry)
  }

  salads.sort((a, b) => compareSaladItems(a.item.id, b.item.id))

  return [...mains, ...salads]
}

const categoryEn: Record<string, string> = {
  'Klassiker': 'Classics',
  'Grillgerichte': 'Grill Dishes',
  'Grillplatten': 'Grill Platters',
  'Snacks': 'Snacks',
  'Wings/Strips': 'Wings/Strips',
  'Croque': 'Croque',
  'Pasta': 'Pasta',
  'Fisch': 'Fish',
  'Salate': 'Salads',
  'Super-Spar-Menüs': 'Value Meals',
  'Menü mit Pommes + Getränk (0,3 l)': 'Menu with Fries + Drink (0.3 l)',
  'Beilagen': 'Sides',
  'Saucen': 'Sauces',
  'Getränke': 'Drinks',
  Veggie: 'Veggie',
  'Nachtisch (nach Anfrage)': 'Desserts (on request)',
}

const tagEn: Record<string, string> = {
  Gluten: 'Gluten',
  Sahne: 'Cream',
  Ei: 'Egg',
  Milch: 'Milk',
  Sesam: 'Sesame',
  Senf: 'Mustard',
  Fisch: 'Fish',
  Sellerie: 'Celery',
}

const nameEnById: Record<string, string> = {
  '111': 'Whole grilled chicken',
  '1': '1/2 grilled chicken with sauce',
  '2': '1/2 grilled chicken with fries',
  '102': '1/2 grilled chicken',
}

const ui = {
  de: {
    kioskNotice: 'Hier wird nicht bestellt – bitte bestellen Sie an der Kasse.',
    browseHint: 'Tippen Sie auf ein Gericht, um Details und Preise zu sehen.',
    metaHint: 'Alle Preise inkl. MwSt. · Halal-zertifiziert',
    footerPriceNote:
      'Alle Preise in dieser Karte sind unverbindlich! Es gelten die Tagespreise im Restaurant!',
    footerImageNote:
      'Alle Abbildungen der Speisen sind Dekoration und ohne Gewähr!',
    additiveLegendHeading: 'Zusatzstoffe',
    additiveLegendNote: 'Zahlen auf Gerichten beziehen sich auf diese Legende.',
    searchPlaceholder: 'Gericht oder Nr. suchen…',
    emptySearch: 'Kein Gericht gefunden für',
    detailsLabel: 'Details anzeigen',
    close: 'Schließen',
    kioskDetailNotice: 'Bestellung nur an der Kasse – hier wird nicht bestellt.',
    veggieTab: 'Veggie',
    langDe: 'Deutsch',
    langEn: 'English',
    priceTbd: 'Preis folgt',
    allergensLabel: 'Allergene',
    additivesLabel: 'Zusatzstoffe',
    dressingNote: 'Salat mit Dressing – Allergene können je nach Dressing variieren (Milch, Ei, Senf).',
    nachtischTab: 'Nachtisch (nach Anfrage)',
    nachtischLead: 'Wechselndes Angebot – bitte an der Kasse nachfragen.',
    nachtischHint: 'Preise & Verfügbarkeit erhalten Sie direkt an der Theke.',
  },
  en: {
    kioskNotice: 'No ordering here – please order at the counter.',
    browseHint: 'Tap a dish to see details and prices.',
    metaHint: 'All prices incl. VAT · Halal certified',
    footerPriceNote:
      'All prices on this menu are non-binding! In-restaurant daily prices apply!',
    footerImageNote:
      'All food images are for decoration only and not guaranteed!',
    additiveLegendHeading: 'Additives (counter sign)',
    additiveLegendNote: 'Numbers on dishes refer to this legend.',
    searchPlaceholder: 'Search dish or item no…',
    emptySearch: 'No dish found for',
    detailsLabel: 'Show details',
    close: 'Close',
    kioskDetailNotice: 'Order at the counter only – no ordering on this screen.',
    veggieTab: 'Veggie',
    langDe: 'German',
    langEn: 'English',
    priceTbd: 'Price TBD',
    allergensLabel: 'Allergens',
    additivesLabel: 'Additives',
    dressingNote: 'Salad with dressing – allergens may vary by dressing (milk, egg, mustard).',
    nachtischTab: 'Desserts (on request)',
    nachtischLead: 'Selection varies – please ask at the counter.',
    nachtischHint: 'Prices and availability are given at the counter.',
  },
} as const

export function t(locale: Locale, key: keyof typeof ui.de): string {
  return ui[locale][key]
}

export function categoryLabel(name: string, locale: Locale): string {
  if (locale === 'de') return name
  return categoryEn[name] ?? name
}

export function translateTag(tag: string, locale: Locale): string {
  if (locale === 'de') return tag
  return tagEn[tag] ?? tag
}

/** Keep dish-style names (Art) and similar tokens intact during desc translation */
const PROTECTED_TOKENS = [
  '„Wiener Art"', '„Jäger Art"', '„Balkan Art"', '„Hamburger Art"',
  'Wiener Art', 'Jäger Art', 'Balkan Art', 'Hamburger Art',
  'HHanse-Art', 'Thüringer-Art', 'Nachwahl',
]

/** Ingredient / description phrases only (not dish-style names) */
const descPhrasePairs: [string, string][] = [
  ['Grillhähnchen', 'grilled chicken'],
  ['Hähnchenschnitzel', 'chicken schnitzel'],
  ['Hähnchenbrust', 'chicken breast'],
  ['Hähnchenfleisch', 'chicken'],
  ['Hähnchen', 'chicken'],
  ['Geflügelfleisch', 'poultry'],
  ['Geflügel', 'poultry'],
  ['Putenmedaillons', 'turkey medallions'],
  ['Putenfleisch', 'turkey'],
  ['Putensteak', 'turkey steak'],
  ['Pute', 'turkey'],
  ['Rindersteak', 'beef steak'],
  ['Rinderhack', 'beef mince'],
  ['Rindfleisch', 'beef'],
  ['Rind', 'beef'],
  ['Lammkotelett', 'lamb chop'],
  ['Lamm', 'lamb'],
  ['Truthahnschinken', 'turkey ham'],
  ['Spiegeleier', 'fried eggs'],
  ['Spiegelei', 'fried egg'],
  ['Bratkartoffeln', 'fried potatoes'],
  ['Folienkartoffel', 'baked potato'],
  ['Kartoffelsalat', 'potato salad'],
  ['Kartoffelspalten', 'potato wedges'],
  ['Knoblauchbrot', 'garlic bread'],
  ['Krautsalat', 'coleslaw'],
  ['Salatbeilage', 'side salad'],
  ['Tomatensauce', 'tomato sauce'],
  ['Sahnesauce', 'cream sauce'],
  ['Remoulade', 'remoulade'],
  ['Tzatziki', 'tzatziki'],
  ['Sour Cream', 'sour cream'],
  ['Schafskäse', 'feta cheese'],
  ['Weißkäse', 'white cheese'],
  ['überbacken', 'gratinated'],
  ['Überbacken', 'gratinated'],
  ['mit Pommes', 'with fries'],
  ['(Pommes/Reis)', '(fries/rice)'],
  ['Pommes', 'fries'],
  ['Getränk', 'drink'],
  ['Softgetränke', 'soft drinks'],
  ['Stilles Wasser', 'still water'],
  ['Wasser mit Kohlensäure', 'sparkling water'],
  ['Heiße Schokolade', 'hot chocolate'],
  ['Kleiner', 'small'],
  ['Großer', 'large'],
  ['gemischter Salat', 'mixed salad'],
  ['Weißkäsesalat', 'feta salad'],
  ['Chefsalat', 'chef salad'],
  ['Marktsalat', 'market salad'],
  ['Fitness-Teller-Salat', 'fitness plate salad'],
  ['Hawaii-Salat', 'Hawaii salad'],
  ['Eisbergsalat', 'iceberg lettuce'],
  ['Dressing', 'dressing'],
  ['Gurke', 'cucumber'],
  ['Gurken', 'pickles'],
  ['Tomate', 'tomato'],
  ['Tomaten', 'tomatoes'],
  ['Zwiebel', 'onion'],
  ['Zwiebeln', 'onions'],
  ['Spinat', 'spinach'],
  ['Ananas', 'pineapple'],
  ['Peperoni', 'peppers'],
  ['Jalapenos', 'jalapeños'],
  ['Jalapinio', 'jalapeño'],
  ['Garnelen', 'prawns'],
  ['Seelachsfilet', 'pollock fillet'],
  ['Calamares-Ringe', 'calamari rings'],
  ['Knoblauchsauce', 'garlic sauce'],
  ['Currywurst', 'currywurst'],
  ['Bratwurst', 'bratwurst'],
  ['Frikadelle', 'meatball'],
  ['Schnitzel', 'schnitzel'],
  ['Schaschlik', 'shashlik'],
  ['Gyros', 'gyros'],
  ['Gyrosfleisch', 'gyros meat'],
  ['Vegetarisch', 'vegetarian'],
  ['Veggieburger', 'veggie burger'],
  ['Gemüse-Teller', 'vegetable plate'],
  ['Makkaroni Vegi.', 'veggie macaroni'],
  ['Makkaroni', 'macaroni'],
  ['Spaghetti', 'spaghetti'],
  ['Bolognese', 'bolognese'],
  ['Carbonara', 'carbonara'],
  ['Bauernfrühstück', 'farmer breakfast'],
  ['Bauernsalat', 'farmer salad'],
  ['Hausgemachter', 'homemade'],
  ['Nudelsalat', 'pasta salad'],
  ['Kroketten', 'croquettes'],
  ['Ketchup', 'ketchup'],
  ['Mayonnaise', 'mayonnaise'],
  ['Portion', 'portion'],
  ['Zigeunersauce oder Jägersauce', 'Gypsy or hunter\'s sauce'],
  ['Ketchup oder Mayonnaise Portion', 'Ketchup or mayonnaise portion'],
  ['Extra Ketchup oder Mayonnaise', 'Extra ketchup or mayonnaise'],
  ['Sour Cream oder Tzatziki', 'Sour cream or tzatziki'],
  [
    'Sauce: Sour Cream, Tzatziki, Knoblauch, Remoulade (Cocktail), Hanse-Sauce (scharf)',
    'Sauce: sour cream, tzatziki, garlic, remoulade (cocktail), Hanse sauce (hot)',
  ],
  ['Knoblauch', 'garlic'],
  ['Remoulade (Cocktail)', 'remoulade (cocktail)'],
  ['Hanse-Sauce (scharf)', 'Hanse sauce (hot)'],
  ['Jägersauce', 'hunter\'s sauce'],
  ['Zigeunersauce', 'gypsy sauce'],
  ['zur Wahl', 'of choice'],
  ['ohne Sauce', 'without sauce'],
  ['ohne Pfand', 'no deposit'],
  ['für', 'for'],
  ['Personen', 'people'],
  ['Stk', 'pcs'],
  ['St.', 'pcs'],
  ['Grillplatte', 'grill platter'],
  ['Steakteller', 'steak plate'],
  ['Grillteller', 'grill plate'],
  ['Teller', 'plate'],
  ['Pfanne', 'pan'],
  ['Sandwich', 'sandwich'],
  ['Pita', 'pita'],
  ['Reis', 'rice'],
  ['Bulgur', 'bulgur'],
  ['Beilage', 'side'],
  ['Extra Beilage', 'extra side'],
  ['Kaffee', 'coffee'],
  ['Tee', 'tea'],
  ['mit', 'with'],
  ['und', 'and'],
  ['oder', 'or'],
  ['Truthahn', 'turkey'],
  ['inkl.', 'incl.'],
  ['Sauce', 'sauce'],
]

const WINGS_ITEM_IDS = /^26[0-3]$|^46[0-3]$/

function wingsNameEn(name: string): string {
  return name
    .replace(/\((\d+)\s*Stk\.?\)/g, '($1 Pcs)')
    .replace(/Menü/g, 'Menu')
}

function translateDesc(text: string, locale: Locale): string {
  if (locale === 'de' || !text) return text

  const placeholders: string[] = []
  let work = text
    .replace(/„/g, '"')
    .replace(/"/g, '"')
    .replace(/–/g, '-')

  for (const token of PROTECTED_TOKENS) {
    const re = new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
    work = work.replace(re, (match) => {
      const key = `__P${placeholders.length}__`
      placeholders.push(match)
      return key
    })
  }

  const sorted = [...descPhrasePairs].sort((a, b) => b[0].length - a[0].length)
  for (const [de, en] of sorted) {
    work = work.split(de).join(en)
  }

  placeholders.forEach((orig, i) => {
    work = work.split(`__P${i}__`).join(orig)
  })

  return work
}

export function itemLabel(item: MenuItem, locale: Locale): { name: string; desc?: string } {
  if (locale === 'de') {
    return { name: item.name, desc: item.desc }
  }
  const name = item.nameEn
    ?? nameEnById[item.id]
    ?? (WINGS_ITEM_IDS.test(item.id) ? wingsNameEn(item.name) : item.name)
  return {
    name,
    desc: item.desc ? translateDesc(item.desc, locale) : undefined,
  }
}

export function itemAltText(item: MenuItem, locale: Locale): string {
  const { name, desc } = itemLabel(item, locale)
  return desc ? `${name} – ${desc}` : name
}

export function formatItemPrice(item: MenuItem, locale: Locale): string | null {
  if (item.priceTbd) return t(locale, 'priceTbd')
  return null
}
