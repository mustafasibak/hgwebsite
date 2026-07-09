export type MenuItem = {
  id: string
  name: string
  desc?: string
  price: number
  priceTbd?: boolean
  nameEn?: string
  descEn?: string
  compactCard?: boolean
  tags?: string[]
  badge?: string
  image?: string
  imageAlt?: string
  showImage?: boolean
}

export type MenuCategory = {
  name: string
  slug: string
  icon: string
  showImage?: boolean
  items: MenuItem[]
}

// Stand: aktuelle Karte von api.hhansegrill-halal.de (Juni 2026)
export const staticMenuCategories: MenuCategory[] = [
  {
    name: 'Klassiker',
    slug: 'klassiker',
    icon: '⭐',
    items: [
      { id: '102', name: '1/2 Grillhähnchen', price: 5.5 },
      { id: '1', name: '1/2 Grillhähnchen mit Sauce', price: 6.5 },
      { id: '2', name: '1/2 Grillhähnchen mit Pommes', price: 8.5 },
      { id: '111', name: 'Ganz Grillhähnchen', price: 11.0 },
      { id: '116', name: 'Schnitzel Jäger Art', desc: 'Pommes', price: 11.0, tags: ['Gluten', 'Sahne', 'Ei'] },
      { id: '5', name: 'Schnitzel „Wiener Art“', price: 6.5, tags: ['Gluten', 'Sahne', 'Ei'] },
      { id: '6', name: 'Schnitzel „Jäger Art“', price: 8.0, tags: ['Gluten', 'Sahne', 'Ei'] },
      { id: '7', name: 'Schnitzel „Balkan Art“', price: 8.0, tags: ['Gluten', 'Sahne', 'Ei'] },
      { id: '117', name: 'Schnitzel Balkan Art', desc: 'Pommes', price: 11.0, tags: ['Gluten', 'Sahne', 'Ei'] },
      { id: '12', name: 'Schaschlik Pute', desc: 'Frittiert', price: 5.0 },
      { id: '14', name: 'Riesen-Currywurst.(Geflügelfleisch)', price: 4.0 },
      { id: '15', name: 'Kleine-Currywurst (Geflügelfleisch)', price: 3.0 },
      { id: '19', name: 'Bratwurst (Geflügelfleisch) O.Ketchup.', desc: 'nach Thüringer-Art', price: 2.9 },
      { id: '20', name: 'Frikadelle', desc: '(Rind)', price: 3.5, tags: ['Gluten', 'Ei', 'Senf'] },
      { id: '404', name: 'Falafelteller (4 St)', desc: 'Salat, Tzatziki,Pommes', price: 8.0, tags: ['Milch', 'Sesam'] },
      { id: '120', name: 'Schnitzel HHanse-Art', desc: 'Truthahnschinken, Käse überbacken, Bratkartoffeln', price: 12.0, tags: ['Gluten', 'Ei', 'Milch'] },
      { id: '213', name: 'Schnitzel „Hamburger Art“', desc: 'Bratkartoffeln, Spiegelei', price: 12.0, tags: ['Gluten', 'Sahne', 'Ei'] },
      { id: '214', name: 'Hähnchenschnitzel', desc: 'Folienkartoffel, Sour Cream', price: 9.0, tags: ['Gluten', 'Sahne', 'Ei'] },
      { id: '320', name: 'Frikadelle „Jäger Art“(Rind)', desc: 'Bratkartoffeln', price: 8.5, tags: ['Gluten', 'Sahne', 'Ei'] },
      { id: '316', name: 'Schnitzel „Jäger Art“ O. Balkan Art', desc: 'Bratkartoffeln', price: 12.0, tags: ['Gluten', 'Sahne', 'Ei'] },
    ]
  },
  {
    name: 'Grillgerichte',
    slug: 'grillgerichte',
    icon: '🥩',
    items: [
      { id: '126', name: 'Leberkäse', desc: '2 Spiegeleier, Bratkartoffeln, Salatbeilage', price: 8.5 },
      { id: '9', name: 'Gyros Fleisch(250 g)', price: 6.0 },
      { id: '10', name: 'Gyros Teller', desc: '(Hähnchen)Krautsalat und Tzatziki', price: 8.0 },
      { id: '110', name: 'Gyros Teller', desc: '(Hähnchen) Krautsalat, (Pommes/Reis), Tzatziki', price: 11.0 },
      { id: '510', name: 'Gyros Überbacken', desc: '(Hähnchen)Schafskäse o. Gouda', price: 8.5, tags: ['Milch'] },
      { id: '400', name: 'Putensteak', desc: '(Pute)', price: 6.5 },
      { id: '54', name: 'Putensteak', desc: 'Folienkartoffel,Sour Cream, Knoblauchbrot', price: 9.9 },
      { id: '323', name: 'Lammkotelett-Teller', desc: '3 St. Lammkotelett, Reis, Tomatensauce', price: 14.0 },
      { id: '211', name: 'Bunter Steakteller', desc: 'Lamm, Pute und Rind, Knobibrot, Kräuterbutter, Bratkartoffeln', price: 14.0 },
      { id: '216', name: 'Balkanspieß', desc: 'feuriger Sauce, Bratkartoffeln, Salatbeilage', price: 8.5 },
      { id: '215', name: 'Rumpsteak', desc: 'Folienkartoffel, Sour Cream, Knobibrot,Salatbeilage', price: 15.5, tags: ['Milch'] },
    ]
  },
  {
    name: 'Grillplatten',
    slug: 'grillplatten',
    icon: '🍽️',
    items: [
      { id: '222', name: 'Grillplatte für 2 Personen', desc: 'Lamm, Rind, Pute, Beilage (Reis / Pommes / Bratkartoffeln, Kartoffelspalten), Knoblauchbrot, 2 Saucen, 2 Salate', price: 30.0 },
      { id: '333', name: 'Grillplatte für 3 Personen', desc: 'Lamm, Rind, Pute, Beilage (Reis / Pommes / Bratkartoffeln, Kartoffelspalten), Knoblauchbrot, 3 Saucen, 3 Salate', price: 42.0 },
      { id: '666', name: 'XXL Grillplatte für 2 Personen + 2 x 0,3l Getränk', desc: 'Lamm, Rind, Pute, Beilage (Reis / Pommes / Bratkartoffeln, Kartoffelspalten), Knoblauchbrot, 2 Saucen, 2 Salate, 1/2 Hähnchen, Adana Spieß, 2 Getränke', price: 40.0 },
    ]
  },
  {
    name: 'Snacks',
    slug: 'snacks',
    icon: '🍔',
    items: [
      { id: '558', name: 'Vitaminburger', desc: 'Rinderfleisch, Käse, Spiegelei', price: 6.5 },
      { id: '457', name: 'Lachs Burger', desc: 'Sauce,Tomate,Zwiebeln,Salat', price: 6.5 },
      { id: '658', name: 'XL Kebab Burger', desc: 'Kebab,Rührei,Käse,Pastirma, Salat, Sauce', price: 6.5 },
      { id: '355', name: 'Veggieburger', desc: 'Tomaten, Gurke, Sauce,Salat', price: 4.0 },
      { id: '758', name: 'Chili Burger', desc: 'Hähnchenfleisch', price: 6.0 },
      { id: '555', name: 'Vegan Burger', desc: 'Ketchup, Tomate,Gurke,Salat', price: 6.5 },
      { id: '455', name: 'Chili Burger (Beef)', price: 6.5 },
      { id: '459', name: 'Strips Burger', desc: 'Strips,Hähnchenbrust,Scharf Sauce, Salat', price: 5.5 },
      { id: '327', name: 'Schawarma Sandwich.', desc: 'Tomaten, Gurke, Salat. Sauce', price: 6.0 },
      { id: '127', name: 'Gyros Pita', desc: 'Tzatziki, Krautsalat,Tomate, Gurke', price: 5.5 },
      { id: '51', name: 'Chickenburger (Hähnchen)', price: 5.5, tags: ['Gluten', 'Ei'] },
      { id: '55', name: 'Hamburger(Rind)', price: 3.5, tags: ['Gluten', 'Milch', 'Sesam'] },
      { id: '56', name: 'Big Hamburger', price: 5.0, tags: ['Gluten', 'Sesam'] },
      { id: '57', name: 'Cheeseburger', price: 4.0, tags: ['Gluten', 'Sesam'] },
      { id: '58', name: 'Big Cheeseburger', price: 5.5, tags: ['Gluten', 'Sesam'] },
      { id: '155', name: 'Fitnessburger(Hähnchen)', desc: '6', price: 6.0, tags: ['Sahne', 'Sesam'] },
      { id: '227', name: 'Vegetarisch Pita', price: 5.0, tags: ['Sahne'] },
      { id: '157', name: 'Fischburger', price: 4.0, tags: ['Gluten', 'Sahne', 'Sesam'] },
      { id: '225', name: 'Falafel Sandwich XXL', price: 5.5, tags: ['Gluten', 'Milch', 'Sesam'] },
      { id: '251', name: 'Hähnchen Pita', price: 5.5, tags: ['Gluten', 'Sahne'] },
      { id: '4', name: 'Hotdog(Geflügel)', price: 2.5, tags: ['Sahne', 'Senf'] },
    ]
  },
  {
    name: 'Wings/Strips',
    slug: 'wings-strips',
    icon: '🍗',
    showImage: false,
    items: [
      { id: '260', name: 'Chicken Wings/Strips (4 Stk.)', desc: '+ Sauce', price: 5.0 },
      { id: '261', name: 'Chicken Wings/Strips (6 Stk.)', desc: '+ Sauce', price: 6.9 },
      { id: '262', name: 'Chicken Wings/Strips (9 Stk.)', desc: '+ Sauce', price: 9.9 },
      { id: '263', name: 'Chicken Wings/Strips (11 Stk.)', desc: '+ Sauce', price: 11.9 },
      { id: '460', name: 'Chicken Wings/Strips (4 Stk.) Menü', desc: 'inkl. Sauce, Pommes + Getränk', price: 10.9 },
      { id: '461', name: 'Chicken Wings/Strips (6 Stk.) Menü', desc: 'inkl. Sauce, Pommes + Getränk', price: 11.9 },
      { id: '462', name: 'Chicken Wings/Strips (9 Stk.) Menü', desc: 'inkl. Sauce, Pommes + Getränk', price: 14.9 },
      { id: '463', name: 'Chicken Wings/Strips (11 Stk.) Menü', desc: 'inkl. Sauce, Pommes + Getränk', price: 17.9 },
    ]
  },
  {
    name: 'Croque',
    slug: 'croque',
    icon: '🥖',
    items: [
      { id: '71', name: 'Groque Schawarma', desc: 'Gurke, Ei, Jalapinio', price: 9.5, tags: ['Gluten', 'Milch'] },
      { id: '172', name: 'Croque Chili', desc: 'Adana, Tomate, Jalapenos', price: 9.5, tags: ['Gluten', 'Milch'] },
      { id: '59', name: 'Croque Camembert Preiselbeeren', price: 7.0, tags: ['Gluten', 'Milch'] },
      { id: '160', name: 'Croque Pute', desc: 'Putenfleisch geformt, Ananas', price: 8.0, tags: ['Gluten', 'Milch'] },
      { id: '61', name: 'Croque Hähnchen', desc: 'Hähnchenfleisch + Tomaten', price: 8.0, tags: ['Gluten', 'Milch'] },
      { id: '62', name: 'Croque Frikadelle', desc: '+ Tomaten', price: 8.0, tags: ['Gluten', 'Milch'] },
      { id: '63', name: 'Croque Hawaii', desc: 'Truthahn-Schinken, Ananas', price: 8.0, tags: ['Gluten', 'Milch'] },
      { id: '64', name: 'Croque Madame', desc: 'Gurke, Tomate', price: 7.0, tags: ['Gluten', 'Milch'] },
      { id: '165', name: 'Croque Schafkäse', desc: 'Weißkäse, Tomate, Gurke', price: 8.0, tags: ['Gluten', 'Milch'] },
      { id: '65', name: 'Croque Salami', desc: 'Rindfleisch-Salami, Gurke', price: 8.0, tags: ['Gluten', 'Milch'] },
      { id: '66', name: 'Croque Monsieur', desc: 'Truthahn-Schinken, Tomate', price: 8.0, tags: ['Gluten', 'Milch'] },
      { id: '67', name: 'Croque Toulouse Thunfisch', desc: 'Tomaten, Zwiebeln', price: 8.0, tags: ['Gluten', 'Milch'] },
      { id: '68', name: 'Croque Gyros', desc: 'Tomaten,Hähnchenbrust', price: 8.0, tags: ['Gluten', 'Milch'] },
      { id: '69', name: 'Croque Spezial Camembertkäse', desc: 'Hähnchenschnitzel,Tomaten', price: 8.5, tags: ['Gluten', 'Milch'] },
      { id: '164', name: 'Croque Lohbrügger', desc: 'Spinat, Weißkäse, Tomate', price: 7.0, tags: ['Gluten', 'Milch'] },
      { id: '159', name: 'Croque Mozzarella', desc: 'Tomate, Käse', price: 7.0, tags: ['Gluten', 'Milch'] },
      { id: '340', name: 'Croque Mittelmeer', desc: 'Sucuk, Weißkäse, Peperoni, Gurke', price: 8.0, tags: ['Gluten', 'Milch'] },
      { id: '41', name: 'Croque Knacker', desc: 'Currywurst, Gewürzgurken, Tomaten, Zwiebeln', price: 8.0, tags: ['Gluten', 'Milch'] },
      { id: '50', name: 'Croque Germany', desc: 'Garnelen, Tomate, Zwiebeln, Peperoni', price: 9.5, tags: ['Gluten', 'Milch'] },
      { id: '440', name: 'Croque Pastirma', desc: 'Rinderschinken, Rührei, Tomate, Weißkäse, Peperoni', price: 9.5, tags: ['Gluten', 'Milch'] },
      { id: '100', name: 'Mini Croque', price: 5.5, showImage: false, compactCard: true, tags: ['Gluten', 'Milch'] },
      { id: '300', name: 'Extra Beilage', price: 1.5, showImage: false, compactCard: true },
    ]
  },
  {
    name: 'Pasta',
    slug: 'pasta',
    icon: '🍝',
    items: [
      { id: '152', name: 'Spaghetti Mailänder Art', desc: 'Hähnchenschnitzel, Tomatensauce', price: 9.5 },
      { id: '151', name: 'Makkaroni Überbacken', desc: 'Hähnchbrust mit Schafskäse, Spinat', price: 9.9 },
      { id: '150', name: 'Makkaroni Vegi. Überbacken.', desc: 'mit Sahnesauce, Schafskäse, Spinat', price: 9.5 },
      { id: '349', name: 'Makkaroni Napoli', desc: '2 Puten Medailons, Tomatensauce', price: 9.5 },
      { id: '49', name: 'Spaghetti Bolognese', desc: '(Rinderhack),Salatbeilage', price: 9.5 },
      { id: '124', name: 'Spaghetti Carbonara', desc: 'Truthahnschinken, Sahne, Ei', price: 9.5, tags: ['Sahne', 'Ei'] },
      { id: '249', name: 'Makkaroni Pfanne', desc: 'Gemüse, Hähnchenbrust, Gorgonzola-,Sahnesauce', price: 9.5, tags: ['Milch'] },
      { id: '449', name: 'Makkaroni Vegi.', desc: 'Tomatensauce oder Sahnesauce, Salatbeilage', price: 5.5 },
      { id: '149', name: 'Spaghetti mit Garnelen', desc: 'Tomatensauce', price: 14.0 },
      { id: '123', name: 'Lachs Pfanne', desc: 'Nudeln, Dillsahnesauce', price: 14.0 },
    ]
  },
  {
    name: 'Fisch',
    slug: 'fisch',
    icon: '🐟',
    items: [
      { id: '123', name: 'Lachs Pfanne', desc: 'Nudeln, Dillsahnesauce', price: 14.0 },
      { id: '149', name: 'Spaghetti mit Garnelen', desc: 'Tomatensauce', price: 14.0 },
      { id: '549', name: 'Garnelen Teller', desc: 'Folienkartoffel, Zwiebeln, Paprika, Rahmchampignons', price: 14.0, tags: ['Gluten', 'Sahne'] },
      { id: '403', name: 'Seelachsfilet', desc: 'Remoulade', price: 5.0, tags: ['Gluten', 'Milch'] },
      { id: '23', name: 'Seelachsfilet', desc: 'Remoulade, Kartoffelsalat', price: 7.0, tags: ['Gluten', 'Milch', 'Senf'] },
      { id: '28', name: 'Calamares-Ringe', desc: 'Knoblauchsauce', price: 6.0, tags: ['Gluten'] },
    ]
  },
  {
    name: 'Salate',
    slug: 'salate',
    icon: '🥗',
    items: [
      { id: '341', name: 'Kleiner gemischter Salat', desc: 'Eisbergsalat, Tomate, Gurke, Mais, Zwiebel, Peperoni,Dressing', price: 5.0 },
      { id: '141', name: 'Großer gemischter Salat', desc: 'Eisbergsalat, Tomate, Gurke, Mais, Zwiebel, Peperoni mit Dressing', price: 8.0 },
      { id: '344', name: 'Kleiner Weißkäsesalat', desc: 'Eisbergsalat,Weißkäse, Gurke, Tomate,Dressing', price: 5.9, tags: ['Milch'] },
      { id: '444', name: 'Großer Weißkäsesalat', desc: 'Eisbergsalat,Weißkäse,Gurke, Tomate,Dressing', price: 8.0, tags: ['Milch'] },
      { id: '42', name: 'Kleiner Marktsalat', desc: 'Thunfisch, Ei, Eisbergsalat, Tomate, Gurke, Mais, Zwiebeln,Dressing', price: 5.9, tags: ['Ei', 'Fisch'] },
      { id: '43', name: 'Großer Marktsalat', desc: 'Thunfisch, Ei, Eisbergsalat, Tomate, Gurke, Mais, Zwiebeln,Dressing', price: 8.0, tags: ['Ei', 'Fisch'] },
      { id: '142', name: 'Kleiner Chefsalat', desc: 'Eisbergsalat, Tomate, Gurke, Käse, Schinken, Dressing', price: 5.9, tags: ['Ei', 'Milch'] },
      { id: '44', name: 'Großer Chefsalat', desc: 'Eisbergsalat, Tomate, Gurke, Käse, Schinken, Dressing', price: 8.0, tags: ['Ei', 'Milch'] },
      { id: '242', name: 'Kleiner Hawaii-Salat', desc: 'Hähnchenbrustfilet, Eisbergsalat, Ananas Dressing', price: 5.9, tags: ['Ei'] },
      { id: '244', name: 'Großer Hawaii-Salat', desc: 'Hähnchenbrustfilet, Eisbergsalat, Ananas, Dressing', price: 8.0, tags: ['Ei'] },
      { id: '342', name: 'Kleiner Fitness-Teller-Salat', desc: 'Gyrosfleisch, Eisbergsalat, Ananas, Tomate, Gurke,Dressing', price: 6.9, tags: ['Milch'] },
      { id: '144', name: 'Großer Fitness-Teller-Salat', desc: 'Gyrosfleisch, Eisbergsalat, Ananas, Tomate, Gurke, Dressing', price: 9.0, tags: ['Milch'] },
    ]
  },
  {
    name: 'Super-Spar-Menüs',
    slug: 'super-spar-menus',
    icon: '💰',
    items: [
      { id: '312', name: 'Adana-Spieße', desc: 'mit Reis und Tzatziki,Salatbeilage', price: 14.0 },
      { id: '252', name: 'Mix Grill-Teller', desc: '2 Stk. Rindersteak, 2 Stk.Putensteak, Knobibrot, Bratkartoffeln, Sauce', price: 15.5, tags: ['Sellerie', 'Sahne'] },
      { id: '29', name: '3 Spiegeleier', desc: 'Bratkartoffeln,Salatbeilage', price: 8.0 },
      { id: '52', name: 'HHanse Grillteller Rind', desc: 'Zwei Steaks(Rind)Champignonrahmsauce, Bratkartoffeln', price: 9.9, tags: ['Gluten', 'Sahne'] },
      { id: '253', name: 'HHanse Grillteller Pute', desc: 'Zwei Putenmedaillons,Rahmchampignonsauce, Bratkartoffeln', price: 9.9, tags: ['Gluten', 'Sahne'] },
      { id: '129', name: 'Bauernfrühstück', desc: 'Truthahnschinken,Gewürzgurke', price: 8.0 },
      { id: '146', name: 'Gemüse-Teller', desc: 'Folienkartoffel,Sour Cream, Rahmchampignon, weißer käse überbacken', price: 8.5, tags: ['Milch'] },
      { id: '112', name: 'Fit Pfanne(Pute)', desc: 'Überbackene Kartoffeln, Sour Cream,Rahmchampignons, gegrillte Putenstreifen', price: 9.5, tags: ['Milch'] },
      { id: '11', name: 'Reis-Pfanne', desc: 'Gemüse, Hähnchenbrust,Reis', price: 9.5, tags: ['Gluten', 'Milch', 'Ei'] },
    ]
  },
  {
    name: 'Menü mit Pommes + Getränk (0,3 l)',
    slug: 'menu-pommes',
    icon: '🍟',
    items: [
      { id: '357', name: 'Fischburger Menü', desc: 'Ketchup / Mayo zur Wahl', price: 10.0 },
      { id: '3', name: '1/2 Hähnchen Menü', desc: 'Ketchup / Mayo zur Wahl', price: 12.0 },
      { id: '314', name: 'XXL Currywurst Menü', desc: 'Ketchup / Mayo zur Wahl', price: 10.0 },
      { id: '310', name: 'Gyros Teller Menü', desc: 'Ketchup / Mayo zur Wahl', price: 14.0 },
      { id: '255', name: 'Hamburger Menü', desc: 'Ketchup / Mayo zur Wahl', price: 9.7 },
      { id: '257', name: 'Cheeseburger Menü', desc: 'Ketchup / Mayo zur Wahl', price: 10.0 },
      { id: '351', name: 'Chickenburger Oder Chili Burger Menü', desc: 'Ketchup / Mayo zur Wahl', price: 11.5 },
      { id: '356', name: 'Big Hamburger Menü', desc: 'Ketchup / Mayo zur Wahl', price: 11.0 },
      { id: '358', name: 'Big Cheeseburger oder Fitness Burger Menü', desc: 'Ketchup / Mayo zur Wahl', price: 11.5 },
    ]
  },
  {
    name: 'Beilagen',
    slug: 'beilagen',
    showImage: false,
    icon: '🥔',
    items: [
      { id: '531', name: 'Reis oder Bulgur mit Sauce Nachwahl.', price: 4.0 },
      { id: '131', name: 'Doppelte Pommes', price: 6.0 },
      { id: '231', name: 'Kartoffelspalten', price: 3.0 },
      { id: '331', name: 'Kartoffelspalten', desc: 'mit Sour Cream', price: 4.0, tags: ['Milch'] },
      { id: '30', name: 'Bratkartoffeln', price: 4.0 },
      { id: '31', name: 'Pommes', price: 3.0 },
      { id: '431', name: 'Kroketten ohne Sauce', price: 3.0 },
      { id: '32', name: 'Hausgemachter Kartoffelsalat', price: 2.5, tags: ['Milch', 'Senf'] },
      { id: '36', name: 'Hausgemachter Nudelsalat', price: 2.5, tags: ['Milch', 'Senf'] },
      { id: '37', name: 'Krautsalat', price: 2.5 },
      { id: '38', name: 'Gurkensalat Essig Öl', price: 2.5 },
      { id: '39', name: 'Gurke in Sahne', price: 2.5, tags: ['Sahne'] },
      { id: '40', name: 'Bauernsalat', price: 2.5, tags: ['Milch'] },
      { id: '46', name: 'Folienkartoffel', desc: 'mit Sour Cream', price: 4.0, tags: ['Milch'] },
      { id: '47', name: 'Knoblauchbrot', price: 1.5, badge: 'Veggie' },
    ]
  },
  {
    name: 'Saucen',
    slug: 'saucen',
    showImage: false,
    icon: '🫙',
    items: [
      { id: '245', name: 'Zigeunersauce oder Jägersauce', price: 1.8, showImage: false, compactCard: true, tags: ['Gluten', 'Ei', 'Sellerie'] },
      { id: '33', name: 'Ketchup oder Mayonnaise Portion', price: 0.5, showImage: false, compactCard: true, tags: ['Ei', 'Senf'] },
      { id: '133', name: 'Extra Ketchup oder Mayonnaise', price: 1.0, showImage: false, compactCard: true, tags: ['Ei', 'Senf'] },
      { id: '45', name: 'Sauce: Sour Cream, Tzatziki, Knoblauch, Remoulade (Cocktail), Hanse-Sauce (scharf)', desc: 'Portion 100 g', price: 1.5, showImage: false, compactCard: true, tags: ['Milch'] },
    ]
  },
  {
    name: 'Getränke',
    slug: 'getraenke',
    showImage: false,
    icon: '🥤',
    items: [
      { id: '76', name: 'Kaffee', nameEn: 'Coffee', price: 2.0 },
      { id: '77', name: 'Heiße Schokolade', nameEn: 'Hot chocolate', desc: 'mit milch', descEn: 'with milk', price: 3.0 },
      { id: '179', name: 'Cappuccino', nameEn: 'Cappuccino', price: 2.7 },
      { id: '180', name: 'Milchkaffee', nameEn: 'White coffee', price: 2.7 },
      { id: '181', name: 'Latte Macchiato', nameEn: 'Latte macchiato', price: 3.0 },
      { id: '182', name: 'Espresso', nameEn: 'Espresso', price: 2.0 },
      { id: '75', name: 'Stilles Wasser', nameEn: 'Still water', price: 1.8 },
      { id: '275', name: 'Wasser mit Kohlensäure', nameEn: 'Sparkling water', price: 1.8 },
      { id: '70', name: '0,33L Softgetränke', nameEn: '0.33L soft drinks', desc: '(ohne Pfand)', descEn: '(no deposit)', price: 2.8 },
      { id: '73', name: '0,5L Softgetränke', nameEn: '0.5L soft drinks', desc: '(ohne Pfand)', descEn: '(no deposit)', price: 3.0 },
      { id: '276', name: 'Ayran', nameEn: 'Ayran', price: 1.2 },
      { id: '176', name: 'Kleiner Tee', nameEn: 'Tea (small)', price: 0.8 },
      { id: '376', name: 'Großer Tee', nameEn: 'Tea (large)', price: 1.3 },
    ]
  },
]

const staticItemOrderByCategory = new Map(
  staticMenuCategories.map(cat => [
    cat.slug,
    new Map(cat.items.map((item, index) => [item.id, index])),
  ]),
)

/** Preserve printed-menu order; Payload's itemNumber sort misplaces #100 / #300 etc. */
export function sortMenuItemsForCategory(slug: string, items: MenuItem[]): MenuItem[] {
  const order = staticItemOrderByCategory.get(slug)
  if (!order) return items
  return [...items].sort((a, b) => {
    const ai = order.get(a.id) ?? 9999
    const bi = order.get(b.id) ?? 9999
    if (ai !== bi) return ai - bi
    return a.id.localeCompare(b.id, undefined, { numeric: true })
  })
}
