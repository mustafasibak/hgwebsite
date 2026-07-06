import type { MenuItem } from '@/lib/menu-data'

export type AdditiveCode = {
  code: string
  de: string
  en: string
}

/** Printed Speisekarte footer legend (numbers shown on Getränke cards). */
export const MENU_ADDITIVE_LEGEND: AdditiveCode[] = [
  { code: '1', de: 'Sorbinsäure', en: 'Sorbic acid' },
  { code: '2', de: 'Benzoesäure', en: 'Benzoic acid' },
  { code: '11', de: 'Konservierungsstoffe', en: 'Preservatives' },
  { code: '12', de: 'Antioxidationsmittel', en: 'Antioxidants' },
  { code: '14', de: 'Farbstoff', en: 'Colouring' },
  { code: '15', de: 'Koffeinhaltig', en: 'Contains caffeine' },
  { code: '17', de: 'mit Geschmacksverstärker', en: 'with flavour enhancer' },
]

/** Postmix / Premix soft drinks (0,33 l & 0,5 l). */
const SOFT_DRINK_CODES = ['1', '2', '11', '12', '14', '15', '17'] as const

const DRINK_CODES_BY_ID: Record<string, readonly string[]> = {
  '70': SOFT_DRINK_CODES,
  '73': SOFT_DRINK_CODES,
  '276': ['11'],
  '77': ['11', '12', '14'],
  '76': ['15'],
  '179': ['15'],
  '180': ['15'],
  '181': ['15'],
  '182': ['15'],
  '75': [],
  '275': [],
  '176': [],
  '376': [],
}

export function resolveDrinkAdditives(item: MenuItem): string[] {
  if (DRINK_CODES_BY_ID[item.id]) {
    return [...DRINK_CODES_BY_ID[item.id]]
  }
  if (nameIsSoftDrink(item)) return [...SOFT_DRINK_CODES]
  return []
}

function nameIsSoftDrink(item: MenuItem): boolean {
  return /softgetränk|softdrink|cola|fanta|sprite|mezzo|pepsi|limo/i.test(item.name)
}

/** Comma-separated code numbers for display on cards (matches printed menu). */
export function formatAdditiveCodes(codes: string[]): string {
  if (codes.length === 0) return ''
  return [...new Set(codes)].sort((a, b) => Number(a) - Number(b)).join(', ')
}

/** @deprecated use formatAdditiveCodes */
export function formatAdditiveLabel(
  codes: string[],
  _locale: 'de' | 'en',
  _withEnhancer = false,
): string {
  return formatAdditiveCodes(codes)
}

export function drinkHasFlavourEnhancer(item: MenuItem): boolean {
  return resolveDrinkAdditives(item).includes('17')
}

/** One-line legend as on printed Speisekarte footer. */
export function additiveLegendLine(locale: 'de' | 'en'): string {
  const label = locale === 'de' ? 'Zusatzstoffe' : 'Additives'
  const parts = MENU_ADDITIVE_LEGEND.map(
    c => `${c.code}=${locale === 'de' ? c.de : c.en}`,
  )
  return `${label}: ${parts.join(', ')}`
}
