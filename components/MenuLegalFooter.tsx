'use client'
import { additiveLegendLine } from '@/lib/additive-info'
import { type Locale } from '@/lib/menu-i18n'

const copy = {
  de: {
    fryNote:
      'Hinweis: Wir frittieren nur mit 100 %-Pflanzenöl, cholesterinfrei und mit neutralem Geschmack. Unsere frischen Sorten enthalten wenig Fett.',
    priceNote:
      'Alle Preise in dieser Karte sind unverbindlich! Es gelten die Tagespreise im Restaurant!',
    imageNote:
      'Alle Abbildungen der Speisen sind Dekoration und ohne Gewähr!',
    drinkCodesHint: 'Nummern bei Getränken → Legende unten.',
  },
  en: {
    fryNote:
      'Note: We fry exclusively in 100% vegetable oil — cholesterol-free, neutral taste. Our fresh varieties are low in fat.',
    priceNote:
      'All prices on this menu are non-binding! In-restaurant daily prices apply!',
    imageNote:
      'All food images are for decoration only and not guaranteed!',
    drinkCodesHint: 'Numbers on drinks → legend below.',
  },
} as const

export default function MenuLegalFooter({ locale }: { locale: Locale }) {
  const c = copy[locale]

  return (
    <footer className="menu-legal-footer">
      <p className="menu-legal-footer-note">{c.fryNote}</p>
      <p className="menu-legal-footer-additives">{additiveLegendLine(locale)}</p>
      <p className="menu-legal-footer-hint">{c.drinkCodesHint}</p>
      <p className="menu-legal-footer-disclaimer">{c.priceNote}</p>
      <p className="menu-legal-footer-disclaimer">{c.imageNote}</p>
    </footer>
  )
}
