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

// Fallback: Wochenplan vom 2026-06-08 (wird live von der API überschrieben, wenn erreichbar)
export const fallbackWeekPlan: LunchDay[] = [
  {
    day: 'Montag',
    date: '2026-06-08',
    meals: [
      { name: '4 STK Lammkotelett', desc: 'Reis, Tzatziki salatbeilage', price: 14.0 },
      { name: 'Reispfanne', desc: 'Gemüse, Hähnchenbrust, Reis', price: 8.5 },
      { name: 'Gyros Jäger Art', desc: 'Gyrosfleisch, Käse Überbacken', price: 7.9 },
      { name: 'Fischburger', desc: 'Tomate, Gurke, Rostzwiebeln, Sauce', price: 3.9 },
    ]
  },
  {
    day: 'Dienstag',
    date: '2026-06-09',
    meals: [
      { name: 'Wiener Hackbraten', desc: 'Rotkohl, Salzkartoffeln, Salatbeilage', price: 9.0 },
      { name: 'Gyros Teller', desc: 'Reis, Tzatziki salatbeilage', price: 10.0 },
      { name: '3 Spiegeleier', desc: 'Bratkartoffeln, Salatbeilage', price: 6.9 },
      { name: 'Schwarme Sandwich', desc: 'Tomate, Gurke, Salat, Sauce', price: 5.5 },
    ]
  },
  {
    day: 'Mittwoch',
    date: '2026-06-10',
    meals: [
      { name: 'Bunter Grillteller', desc: '(Lamm, Rind, Pute) Knobibrot, Bratkartoffeln, Salatbeilage', price: 12.0 },
      { name: 'Makkaroni Bolognese', desc: 'Rinderhackfleisch, Tomatensauce, Nudeln', price: 7.9 },
      { name: 'Kebab Burger', desc: 'Pastırma, Ei, Käse, Tomaten, Salat, Sauce', price: 6.0 },
      { name: 'XXL Currywurst', desc: 'Pommes', price: 6.9 },
    ]
  },
  {
    day: 'Donnerstag',
    date: '2026-06-11',
    meals: [
      { name: 'XXL Grillteller', desc: '2stk. Putensteak, 2 Stk. Rindersteak, Bratkartoffeln knobibrot, Sauce', price: 15.0 },
      { name: 'Lasagne', desc: 'Rinderhackfleisch, Käse Überbacken', price: 8.5 },
      { name: 'Grispy Filet (4stk)', desc: 'Pommes, Sauce', price: 8.0 },
      { name: 'Vitamin Burger', desc: 'Käse, Ei, Sauce Tomate, Gurke', price: 6.0 },
    ]
  },
  {
    day: 'Freitag',
    date: '2026-06-12',
    meals: [
      { name: 'Lachspfanne', desc: 'Lachsfilet, Dill, Makkaroni, Sahnesauce, Salatbeil', price: 11.0 },
      { name: 'Rinder Gulasch', desc: 'Champignon, Makkaroni, Gewürzgurke, Salatbeilage', price: 8.5 },
      { name: 'Grill Teller (Rinder)', desc: '2 Steak, Rahmchampignon, Salatbeilage', price: 9.5 },
      { name: 'Chili Burger( Beef)', desc: 'Tomate, Gurke, Salat, Sauce', price: 6.0 },
    ]
  },
]
