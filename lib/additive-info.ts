import type { MenuItem } from '@/lib/menu-data'

export type AdditiveCode = {
  code: string
  de: string
  en: string
}

/** Counter sign at the restaurant (WhatsApp photo 2) – full Zusatzstoffe legend. */
export const COUNTER_ADDITIVE_LEGEND: AdditiveCode[] = [
  { code: '1', de: 'Sorbinsäure', en: 'Sorbic acid' },
  { code: '2', de: 'Benzoesäure', en: 'Benzoic acid' },
  { code: '3', de: 'Chininhaltig', en: 'Contains quinine' },
  { code: '4', de: 'Phosphat', en: 'Phosphate' },
  { code: '5', de: 'Nährwertangaben', en: 'Nutrition information' },
  { code: '6', de: 'Gefärbt mit Frucht- und Pflanzenauszügen', en: 'Coloured with fruit/plant extracts' },
  { code: '9', de: 'Süßstoffe', en: 'Sweeteners' },
  { code: '10', de: 'Konserviert', en: 'Preserved' },
  { code: '11', de: 'Mit Antioxidationsmittel', en: 'With antioxidant' },
  { code: '12', de: 'Enthält eine Phenylalaninquelle', en: 'Contains a phenylalanine source' },
  { code: '13', de: 'Farbstoffe', en: 'Colourings' },
  { code: '14', de: 'Koffeinhaltig', en: 'Contains caffeine' },
  { code: '15', de: 'Fruchtsaftgetränk', en: 'Fruit juice drink' },
  { code: '16', de: 'Nur bei Postmix / Premix', en: 'Postmix / premix only' },
  { code: '17', de: 'mit Geschmacksverstärker', en: 'with flavour enhancer' },
]

/** Postmix soft drinks – counter codes 16 + Geschmacksverstärker (no superscripts on printed Speisekarte). */
const POSTMIX_SOFT_DRINK = ['16', '17'] as const

/**
 * Zusatzstoff codes on printed Speisekarte (speisekarte.jpg), keyed by item id.
 * Allergen words on the paper menu stay on cards via allergen-info; numbers only here.
 */
export const MENU_ITEM_ADDITIVE_CODES: Record<string, readonly string[]> = {
  // Grillgerichte
  '216': ['1', '2', '17'],
  // Klassiker
  '12': ['1', '11', '17'],
  '14': ['11', '12', '17'],
  '15': ['11', '12', '17'],
  '19': ['1', '2', '11', '17'],
  '117': ['1', '11', '17'],
  '120': ['1', '11', '17'],
  '316': ['1', '11', '17'],
  // Snacks – Burger
  '51': ['11', '14'],
  '55': ['11', '14'],
  '56': ['11', '14'],
  '57': ['11', '14'],
  '58': ['11', '14'],
  '459': ['11', '14'],
  // Menüs mit Pommes
  '255': ['11', '14'],
  '257': ['11', '14'],
  '356': ['11', '14'],
  '358': ['11', '14'],
  '351': ['11', '14'],
  '314': ['11', '12', '17'],
  // Pasta
  '124': ['11', '12'],
  // Fisch
  '403': ['11', '14'],
  '23': ['11', '14'],
  '457': ['11', '14'],
  // Croque
  '63': ['11', '12'],
  '66': ['11', '12'],
  '160': ['11', '12'],
  '41': ['11', '12', '17'],
  '65': ['1', '2'],
  '340': ['11', '12', '14', '17'],
  // Beilagen / Saucen
  '32': ['11', '14'],
  '36': ['11', '14'],
  '33': ['1', '11', '14', '17'],
  '133': ['1', '11', '14', '17'],
  '45': ['1', '2', '11', '14', '17'],
  // Salate (Chefsalat on printed menu)
  '142': ['11'],
  '44': ['11'],
  // Getränke (Postmix – Thekenauszeichnung Nr. 16 + Geschmacksverstärker)
  '70': POSTMIX_SOFT_DRINK,
  '73': POSTMIX_SOFT_DRINK,
}

export function resolveItemAdditiveCodes(item: MenuItem): string[] {
  if (MENU_ITEM_ADDITIVE_CODES[item.id]) {
    return [...MENU_ITEM_ADDITIVE_CODES[item.id]]
  }
  if (nameIsPostmixSoftDrink(item)) return [...POSTMIX_SOFT_DRINK]
  return []
}

function nameIsPostmixSoftDrink(item: MenuItem): boolean {
  return /softgetränk|softdrink|cola|fanta|sprite|mezzo|pepsi|limo/i.test(item.name)
}

export function formatAdditiveCodes(codes: string[]): string {
  if (codes.length === 0) return ''
  return [...new Set(codes)].sort((a, b) => Number(a) - Number(b)).join(', ')
}

export function additiveLegendEntry(code: string, locale: 'de' | 'en'): string {
  const entry = COUNTER_ADDITIVE_LEGEND.find(c => c.code === code)
  if (!entry) return code
  return locale === 'de' ? entry.de : entry.en
}
