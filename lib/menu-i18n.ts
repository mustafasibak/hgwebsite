import type { MenuCategory, MenuItem } from '@/lib/menu-data'
import { compareSaladItems } from '@/lib/salad-order'

export type Locale = 'de' | 'en'

export const VEGGIE_TAB = '__veggie__' as const
export const NACHTISCH_TAB = '__nachtisch__' as const
export type MenuTab = typeof VEGGIE_TAB | typeof NACHTISCH_TAB | string

const TRAILING_CATEGORY_SLUGS = ['saucen', 'getraenke'] as const
const NACHTISCH_SLUG = 'nachtisch'

/** Category tabs with Saucen & Getränke last (after Veggie/Nachtisch). */
export function getMenuTabOrder(categories: MenuCategory[]): MenuTab[] {
  const trailing = new Set<string>(TRAILING_CATEGORY_SLUGS)
  const hasNachtischCategory = categories.some(c => c.slug === NACHTISCH_SLUG)
  const main = categories
    .filter(c => !trailing.has(c.slug) && c.slug !== NACHTISCH_SLUG)
    .map(c => c.slug)

  const tabs: MenuTab[] = [...main, VEGGIE_TAB]
  if (hasNachtischCategory) {
    tabs.push(NACHTISCH_SLUG)
  } else {
    tabs.push(NACHTISCH_TAB)
  }
  return [...tabs, ...TRAILING_CATEGORY_SLUGS]
}

export function isNachtischTab(tab: MenuTab): boolean {
  return tab === NACHTISCH_TAB || tab === NACHTISCH_SLUG
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
  'Nachtisch (nach Anfrage)': 'Desserts',
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

export type MenuItemEn = { nameEn: string; descEn?: string }

/** Authoritative EN copy by item id (static menu + Payload fallback). */
export const menuItemEnById: Record<string, MenuItemEn> = {
  '111': { nameEn: 'Whole grilled chicken' },
  '1': { nameEn: '1/2 grilled chicken with sauce' },
  '2': { nameEn: '1/2 grilled chicken with fries' },
  '102': { nameEn: '1/2 grilled chicken' },
  // Getränke
  '76': { nameEn: 'Coffee' },
  '77': { nameEn: 'Hot chocolate', descEn: 'with milk' },
  '179': { nameEn: 'Cappuccino' },
  '180': { nameEn: 'White coffee' },
  '181': { nameEn: 'Latte macchiato' },
  '182': { nameEn: 'Espresso' },
  '75': { nameEn: 'Still water' },
  '275': { nameEn: 'Sparkling water' },
  '70': { nameEn: '0.33L soft drinks', descEn: '(no deposit)' },
  '73': { nameEn: '0.5L soft drinks', descEn: '(no deposit)' },
  '276': { nameEn: 'Ayran' },
  '176': { nameEn: 'Tea (small)' },
  '376': { nameEn: 'Tea (large)' },
  // Nachtisch
  'rote-gruetze': { nameEn: 'Red berry compote with vanilla sauce' },
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
    nachtischTab: 'Desserts',
    nachtischLead: 'Rotating selection – ask at the counter what\'s available today.',
    nachtischHint: 'Prices and availability at the counter.',
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
  ['mit milch', 'with milk'],
  ['Kräuterbutter', 'herb butter'],
  ['Knobibrot', 'garlic bread'],
  ['Rahmchampignons', 'cream mushrooms'],
  ['Champignonrahmsauce', 'mushroom cream sauce'],
  ['Rahmchampignonsauce', 'mushroom cream sauce'],
  ['Dillsahnesauce', 'dill cream sauce'],
  ['Gewürzgurke', 'pickled gherkin'],
  ['Gewürzgurken', 'pickled gherkins'],
  ['feuriger Sauce', 'spicy sauce'],
  ['geformt', 'formed'],
  ['Nachwahl', 'of choice'],
  ['Nachwahl.', 'of choice'],
  ['mit', 'with'],
  ['und', 'and'],
  ['oder', 'or'],
  ['Truthahn', 'turkey'],
  ['inkl.', 'incl.'],
  ['Sauce', 'sauce'],
]

const WINGS_ITEM_IDS = /^26[0-3]$|^46[0-3]$/

/** Full dish names and name fragments (longer phrases first). */
const namePhrasePairs: [string, string][] = [
  ['XXL Grillplatte für 2 Personen + 2 x 0,3l Getränk', 'XXL grill platter for 2 incl. 2×0.3L drinks'],
  ['Grillplatte für 3 Personen', 'Grill platter for 3'],
  ['Grillplatte für 2 Personen', 'Grill platter for 2'],
  ['Großer gemischter Salat', 'Large mixed salad'],
  ['Kleiner gemischter Salat', 'Small mixed salad'],
  ['Großer Weißkäsesalat', 'Large feta salad'],
  ['Kleiner Weißkäsesalat', 'Small feta salad'],
  ['Großer Marktsalat', 'Large market salad'],
  ['Kleiner Marktsalat', 'Small market salad'],
  ['Großer Chefsalat', 'Large chef salad'],
  ['Kleiner Chefsalat', 'Small chef salad'],
  ['Großer Hawaii-Salat', 'Large Hawaii salad'],
  ['Kleiner Hawaii-Salat', 'Small Hawaii salad'],
  ['Großer Fitness-Teller-Salat', 'Large fitness plate salad'],
  ['Kleiner Fitness-Teller-Salat', 'Small fitness plate salad'],
  ['Reis oder Bulgur mit Sauce Nachwahl.', 'Rice or bulgur with sauce of choice'],
  ['Gurkensalat Essig Öl', 'Cucumber salad with vinaigrette'],
  ['Gurke in Sahne', 'Cucumber in cream'],
  ['Doppelte Pommes', 'Double fries'],
  ['Kroketten ohne Sauce', 'Croquettes (no sauce)'],
  ['Hausgemachter Kartoffelsalat', 'Homemade potato salad'],
  ['Hausgemachter Nudelsalat', 'Homemade pasta salad'],
  ['3 Spiegeleier', '3 fried eggs'],
  ['Groque Schawarma', 'Croque shawarma'],
  ['Riesen-Currywurst.(Geflügelfleisch)', 'Jumbo currywurst (poultry)'],
  ['Kleine-Currywurst (Geflügelfleisch)', 'Small currywurst (poultry)'],
  ['Bratwurst (Geflügelfleisch) O.Ketchup.', 'Bratwurst (poultry) with ketchup'],
  ['Falafelteller (4 St)', 'Falafel plate (4 pcs)'],
  ['Frikadelle „Jäger Art"(Rind)', 'Meatball hunter style (beef)'],
  ['Schnitzel HHanse-Art', 'Schnitzel HHanse style'],
  ['HHanse Grillteller Rind', 'HHanse grill plate beef'],
  ['HHanse Grillteller Pute', 'HHanse grill plate turkey'],
  ['Lammkotelett-Teller', 'Lamb chop plate'],
  ['Bunter Steakteller', 'Mixed steak plate'],
  ['Mix Grill-Teller', 'Mixed grill plate'],
  ['Gemüse-Teller', 'Vegetable plate'],
  ['Fit Pfanne(Pute)', 'Fit pan (turkey)'],
  ['Reis-Pfanne', 'Rice pan'],
  ['Garnelen Teller', 'Prawn plate'],
  ['Adana-Spieße', 'Adana skewers'],
  ['Bauernfrühstück', 'Farmer\'s breakfast'],
  ['Vegetarisch Pita', 'Vegetarian pita'],
  ['Falafel Sandwich XXL', 'Falafel sandwich XXL'],
  ['Hähnchen Pita', 'Chicken pita'],
  ['Gyros Pita', 'Gyros pita'],
  ['Gyros Fleisch(250 g)', 'Gyros meat (250 g)'],
  ['Gyros Überbacken', 'Gyros gratinated'],
  ['Schawarma Sandwich.', 'Shawarma sandwich'],
  ['Vitaminburger', 'Vitamin burger'],
  ['Lachs Burger', 'Salmon burger'],
  ['XL Kebab Burger', 'XL kebab burger'],
  ['Chili Burger (Beef)', 'Chili burger (beef)'],
  ['Strips Burger', 'Strips burger'],
  ['Chickenburger (Hähnchen)', 'Chicken burger'],
  ['Hamburger(Rind)', 'Hamburger (beef)'],
  ['Big Hamburger', 'Big hamburger'],
  ['Big Cheeseburger', 'Big cheeseburger'],
  ['Fitnessburger(Hähnchen)', 'Fitness burger (chicken)'],
  ['Hotdog(Geflügel)', 'Hot dog (poultry)'],
  ['1/2 Hähnchen Menü', '1/2 chicken menu'],
  ['XXL Currywurst Menü', 'XXL currywurst menu'],
  ['Gyros Teller Menü', 'Gyros plate menu'],
  ['Hamburger Menü', 'Hamburger menu'],
  ['Cheeseburger Menü', 'Cheeseburger menu'],
  ['Chickenburger Oder Chili Burger Menü', 'Chicken or chili burger menu'],
  ['Big Hamburger Menü', 'Big hamburger menu'],
  ['Big Cheeseburger oder Fitness Burger Menü', 'Big cheeseburger or fitness burger menu'],
  ['Fischburger Menü', 'Fish burger menu'],
  ['Spaghetti Mailänder Art', 'Spaghetti Milanese style'],
  ['Makkaroni Überbacken', 'Macaroni gratinated'],
  ['Makkaroni Vegi. Überbacken.', 'Veggie macaroni gratinated'],
  ['Makkaroni Napoli', 'Macaroni Napoli'],
  ['Spaghetti Bolognese', 'Spaghetti bolognese'],
  ['Spaghetti Carbonara', 'Spaghetti carbonara'],
  ['Makkaroni Pfanne', 'Macaroni pan'],
  ['Makkaroni Vegi.', 'Veggie macaroni'],
  ['Spaghetti mit Garnelen', 'Spaghetti with prawns'],
  ['Lachs Pfanne', 'Salmon pan'],
  ['Schaschlik Pute', 'Turkey shashlik'],
  ['Croque Camembert Preiselbeeren', 'Croque camembert with cranberries'],
  ['Croque Spezial Camembertkäse', 'Special croque camembert'],
  ['Croque Toulouse Thunfisch', 'Croque Toulouse tuna'],
  ['Croque Schafkäse', 'Croque feta'],
  ['Mini Croque', 'Mini croque'],
  ['Extra Beilage', 'Extra side'],
  ['Grillhähnchen', 'grilled chicken'],
  ['Hähnchenschnitzel', 'chicken schnitzel'],
  ['Hähnchenbrust', 'chicken breast'],
  ['Hähnchen', 'chicken'],
  ['Putensteak', 'turkey steak'],
  ['Putenmedaillons', 'turkey medallions'],
  ['Putenfleisch', 'turkey'],
  ['Rumpsteak', 'rump steak'],
  ['Rindersteak', 'beef steak'],
  ['Rinderhack', 'beef mince'],
  ['Rindfleisch', 'beef'],
  ['Lammkotelett', 'lamb chop'],
  ['Leberkäse', 'Leberkäse'],
  ['Balkanspieß', 'Balkan skewer'],
  ['Gyros Teller', 'Gyros plate'],
  ['Gyros Fleisch', 'Gyros meat'],
  ['Frikadelle', 'meatball'],
  ['Currywurst', 'currywurst'],
  ['Bratwurst', 'bratwurst'],
  ['Knoblauchbrot', 'garlic bread'],
  ['Folienkartoffel', 'baked potato'],
  ['Bratkartoffeln', 'fried potatoes'],
  ['Kartoffelspalten', 'potato wedges'],
  ['Kartoffelsalat', 'potato salad'],
  ['Krautsalat', 'coleslaw'],
  ['Nudelsalat', 'pasta salad'],
  ['Bauernsalat', 'farmer salad'],
  ['Salatbeilage', 'side salad'],
  ['Menü', 'Menu'],
  ['Getränk', 'drink'],
  ['Getränke', 'drinks'],
  ['Heiße Schokolade', 'Hot chocolate'],
  ['Milchkaffee', 'White coffee'],
  ['Stilles Wasser', 'Still water'],
  ['Wasser mit Kohlensäure', 'Sparkling water'],
  ['Softgetränke', 'soft drinks'],
  ['Kleiner Tee', 'Tea (small)'],
  ['Großer Tee', 'Tea (large)'],
  ['Kaffee', 'Coffee'],
  ['Kleiner', 'Small'],
  ['Großer', 'Large'],
  ['Ganz', 'Whole'],
  ['Vegetarisch', 'Vegetarian'],
  ['Veggieburger', 'Veggie burger'],
  ['Vegan Burger', 'Vegan burger'],
  ['Cheeseburger', 'Cheeseburger'],
  ['Chili Burger', 'Chili burger'],
  ['Fischburger', 'Fish burger'],
  ['Seelachsfilet', 'Pollock fillet'],
  ['Calamares-Ringe', 'Calamari rings'],
  ['Schnitzel', 'schnitzel'],
  ['Schaschlik', 'shashlik'],
  ['Spaghetti', 'spaghetti'],
  ['Makkaroni', 'macaroni'],
  ['Pommes', 'fries'],
  ['Reis', 'rice'],
  ['Bulgur', 'bulgur'],
  ['Spinat', 'spinach'],
  ['Ananas', 'pineapple'],
  ['Tomaten', 'tomatoes'],
  ['Tomate', 'tomato'],
  ['Gurke', 'cucumber'],
  ['Zwiebeln', 'onions'],
  ['Zwiebel', 'onion'],
  ['Garnelen', 'prawns'],
  ['Lachs', 'salmon'],
  ['Thunfisch', 'tuna'],
  ['Schinken', 'ham'],
  ['Salami', 'salami'],
  ['Camembert', 'camembert'],
  ['Mozzarella', 'mozzarella'],
  ['Schafkäse', 'feta'],
  ['Weißkäse', 'white cheese'],
  ['Käse', 'cheese'],
  ['Sauce', 'sauce'],
  ['Saucen', 'sauces'],
  ['Salat', 'salad'],
  ['Salate', 'salads'],
  ['Teller', 'plate'],
  ['Pfanne', 'pan'],
  ['Sandwich', 'sandwich'],
  ['Pita', 'pita'],
  ['Burger', 'burger'],
  ['Croque', 'Croque'],
  ['Spieß', 'skewer'],
  ['Spieße', 'skewers'],
  ['Steak', 'steak'],
  ['Grillplatte', 'grill platter'],
  ['Grillteller', 'grill plate'],
  ['Steakteller', 'steak plate'],
  ['Überbacken', 'gratinated'],
  ['Frittiert', 'deep-fried'],
  ['Hausgemachter', 'Homemade'],
  ['mit', 'with'],
  ['und', 'and'],
  ['oder', 'or'],
  ['für', 'for'],
  ['Personen', 'people'],
  ['Stk.', 'pcs'],
  ['Stk', 'pcs'],
  ['St.', 'pcs'],
  ['St', 'pcs'],
  ['Truthahn', 'turkey'],
  ['Geflügel', 'poultry'],
  ['Geflügelfleisch', 'poultry'],
  ['Rind', 'beef'],
  ['Lamm', 'lamb'],
  ['Pute', 'turkey'],
]

function wingsNameEn(name: string): string {
  return name
    .replace(/\((\d+)\s*Stk\.?\)/g, '($1 pcs)')
    .replace(/Menü/g, 'Menu')
}

function applyPhrasePairs(text: string, pairs: [string, string][]): string {
  let work = text
    .replace(/„/g, '"')
    .replace(/"/g, '"')
    .replace(/–/g, '-')

  const placeholders: string[] = []
  for (const token of PROTECTED_TOKENS) {
    const re = new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
    work = work.replace(re, (match) => {
      const key = `__P${placeholders.length}__`
      placeholders.push(match)
      return key
    })
  }

  const sorted = [...pairs].sort((a, b) => b[0].length - a[0].length)
  for (const [de, en] of sorted) {
    work = work.split(de).join(en)
  }

  placeholders.forEach((orig, i) => {
    work = work.split(`__P${i}__`).join(orig)
  })

  return work
}

function translateName(name: string, locale: Locale): string {
  if (locale === 'de' || !name) return name
  return applyPhrasePairs(name, namePhrasePairs)
}

function translateDesc(text: string, locale: Locale): string {
  if (locale === 'de' || !text) return text
  return applyPhrasePairs(text, descPhrasePairs)
}

export function itemLabel(item: MenuItem, locale: Locale): { name: string; desc?: string } {
  if (locale === 'de') {
    return { name: item.name, desc: item.desc }
  }
  const en = menuItemEnById[item.id]
  const name = item.nameEn
    ?? en?.nameEn
    ?? (WINGS_ITEM_IDS.test(item.id) ? wingsNameEn(item.name) : translateName(item.name, locale))
  return {
    name,
    desc: item.descEn
      ?? en?.descEn
      ?? (item.desc ? translateDesc(item.desc, locale) : undefined),
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
