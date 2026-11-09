export type LunchMeal = {
  name: string
  desc?: string
  price: number
}

export type LunchDay = {
  day: string
  date: string
  meals: LunchMeal[]
}

// Fallback when the live API is down. Weekend entries are only merged into a
// live Mo–Fr week when their `date` matches that week’s Sa/So (see mittagstisch.ts).
export const fallbackWeekPlan: LunchDay[] = [
  {
    day: 'Montag',
    date: '2026-11-02',
    meals: [
      { name: 'Rinderroulade', desc: 'Rotkohl, Salzkartoffeln, Salatbeilage', price: 9.5 },
      { name: 'Leberkäse', desc: '2 Spiegeleier, Bratkartoffeln, Salatbeilage', price: 8.0 },
      { name: 'Chili Burger (Beef)', desc: 'Tomate, Salat, Sauce', price: 6.5 },
    ]
  },
  {
    day: 'Dienstag',
    date: '2026-11-03',
    meals: [
      { name: 'Bunter Grillteller', desc: '(Lamm, Rind, Pute) Knobibrot, Bratkartoffeln, Salatbeilage', price: 12.0 },
      { name: 'Hühnerfrikassee', desc: 'Spargel-Erbsen-Wurzelgemüse, Sahnesauce, Reis', price: 7.5 },
      { name: 'Schwarme Sandwich', desc: 'Pommes, Tomaten, Gurken, Salat', price: 5.5 },
      { name: 'Linsensuppe', desc: 'Brot', price: 4.0 },
    ]
  },
  {
    day: 'Mittwoch',
    date: '2026-11-04',
    meals: [
      { name: 'Puten Steak', desc: 'Kroketten, Knobibrot, Sauce Hollandaise', price: 9.5 },
      { name: 'Spaghetti Bolognese', desc: 'Tomatensoße, Rinderhackfleisch, Parmesankäse', price: 8.5 },
      { name: 'Vegan Burg', desc: 'Soja Fleisch, Ketchup, Tomaten, Gurke', price: 5.5 },
      { name: 'Linsensuppe', desc: 'Brot', price: 4.0 },
    ]
  },
  {
    day: 'Donnerstag',
    date: '2026-11-05',
    meals: [
      { name: 'XXL Mix Grillteller', desc: '2stk. Putensteak, 2 Stk. Rindersteak, Bratkartoffeln knobibrot, Sauce', price: 15.0 },
      { name: 'Lasagne', desc: 'Rinderhackfleisch, Käse Sahne Sauce, überbacken', price: 8.5 },
      { name: 'Big Hamburger Menü', desc: 'Pommes + 0,33l Getränke', price: 10.0 },
      { name: 'Linsensuppe', desc: 'Brot', price: 4.0 },
    ]
  },
  {
    day: 'Freitag',
    date: '2026-11-06',
    meals: [
      { name: '2 Adana Spieße', desc: 'Reis, Tzatziki salatbeilage', price: 13.0 },
      { name: 'Rinder Gulasch', desc: 'Champignon, Makkaroni, Gewürzgurke, Salatbeilage', price: 8.5 },
      { name: 'Lachspfanne', desc: 'Lachsfilet, Dill, Makkaroni, Sahnesauce, Salatbeil', price: 11.0 },
      { name: 'Linsensuppe', desc: 'Brot', price: 4.0 },
    ]
  },
  {
    day: 'Samstag',
    date: '2026-11-07',
    meals: [
      { name: '4 Stk. Lammkotelett', desc: 'Reis, Tzatziki, Salatbeilage', price: 14.0 },
      { name: 'Lachspfanne', desc: 'Lachsfilet, Dill, Makkaroni, Sahnesauce, Salatbeil', price: 11.0 },
      { name: 'Linsensuppe', desc: 'Brot', price: 4.0 },
    ]
  },
]
