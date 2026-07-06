'use client'
import { useId, useState } from 'react'
import { MENU_ADDITIVE_LEGEND, additiveLegendLine } from '@/lib/additive-info'
import { DRESSING_ALLERGENS } from '@/lib/allergen-info'
import { translateTag, t, type Locale } from '@/lib/menu-i18n'

type MenuInfoPanelProps = {
  locale: Locale
  variant: 'kiosk' | 'compact'
  showAdditives?: boolean
}

const infoCopy = {
  de: {
    allergenTitle: 'Allergenkennzeichnung',
    allergenIntro:
      'Angaben gemäß Küchenblatt. Salate mit Dressing: zusätzlich je nach Dressing.',
    dressingTitle: 'Salat-Dressings & Rahmchampignons',
    additiveTitle: 'Zusatzstoffe (Getränke)',
    additiveIntro:
      'Nummern auf Getränkekarten beziehen sich auf die Legende am Seitenende (wie auf der gedruckten Karte).',
    contains: 'enthält',
  },
  en: {
    allergenTitle: 'Allergen information',
    allergenIntro:
      'Based on kitchen reference sheet. Salads with dressing: see dressing section.',
    dressingTitle: 'Salad dressings & cream mushrooms',
    additiveTitle: 'Additives (drinks)',
    additiveIntro:
      'Numbers on drink cards refer to the legend at the bottom (as on the printed menu).',
    contains: 'contains',
  },
} as const

const LEGEND_ALLERGENS = [
  'Gluten', 'Milch', 'Sahne', 'Ei', 'Senf', 'Sesam', 'Fisch', 'Sellerie',
] as const

type SectionId = 'allergens' | 'dressings' | 'additives'

function AdditiveRow({ code, locale }: { code: typeof MENU_ADDITIVE_LEGEND[number]; locale: Locale }) {
  return (
    <div className="menu-info-row">
      <span className="menu-info-code">{code.code}</span>
      <span>{locale === 'de' ? code.de : code.en}</span>
    </div>
  )
}

function AccordionSection({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className={`menu-info-accordion${open ? ' menu-info-accordion--open' : ''}`}>
      <button
        type="button"
        className="menu-info-accordion-trigger"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
      >
        <span>{title}</span>
        <span className="menu-info-accordion-icon" aria-hidden />
      </button>
      <div id={id} className="menu-info-accordion-panel" hidden={!open}>
        {children}
      </div>
    </div>
  )
}

export default function MenuInfoPanel({
  locale,
  variant,
  showAdditives = true,
}: MenuInfoPanelProps) {
  const copy = infoCopy[locale]
  const compact = variant === 'compact'
  const panelId = useId()
  const [panelOpen, setPanelOpen] = useState(false)
  const [openSection, setOpenSection] = useState<SectionId | null>(null)

  const toggleSection = (section: SectionId) => {
    setOpenSection(current => (current === section ? null : section))
  }

  return (
    <aside
      className={`menu-info-panel${compact ? ' menu-info-panel--compact' : ''}${panelOpen ? ' menu-info-panel--expanded' : ''}`}
    >
      <button
        type="button"
        className="menu-info-panel-toggle"
        onClick={() => setPanelOpen(open => !open)}
        aria-expanded={panelOpen}
        aria-controls={panelId}
      >
        <span className="menu-info-panel-toggle-label">{t(locale, 'infoPanelTitle')}</span>
        <span className="menu-info-panel-toggle-hint">
          {panelOpen ? t(locale, 'infoPanelCollapse') : t(locale, 'infoPanelExpand')}
        </span>
        <span className="menu-info-panel-toggle-icon" aria-hidden />
      </button>

      <div id={panelId} className="menu-info-panel-body" hidden={!panelOpen}>
        <AccordionSection
          id={`${panelId}-allergens`}
          title={copy.allergenTitle}
          open={openSection === 'allergens'}
          onToggle={() => toggleSection('allergens')}
        >
          <p className="menu-info-intro">{copy.allergenIntro}</p>
          <div className="menu-item-tags menu-info-legend">
            {LEGEND_ALLERGENS.map(tag => (
              <span key={tag} className="menu-item-tag">
                {translateTag(tag, locale)}
              </span>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection
          id={`${panelId}-dressings`}
          title={copy.dressingTitle}
          open={openSection === 'dressings'}
          onToggle={() => toggleSection('dressings')}
        >
          <ul className="menu-info-list">
            {DRESSING_ALLERGENS.map(d => (
              <li key={d.id}>
                <strong>{locale === 'de' ? d.nameDe : d.nameEn}</strong>
                {' – '}
                {copy.contains}{' '}
                {d.allergens.map(a => translateTag(a, locale)).join(', ')}
              </li>
            ))}
          </ul>
        </AccordionSection>

        {showAdditives && (
          <AccordionSection
            id={`${panelId}-additives`}
            title={copy.additiveTitle}
            open={openSection === 'additives'}
            onToggle={() => toggleSection('additives')}
          >
            <p className="menu-info-intro">{copy.additiveIntro}</p>
            <div className="menu-info-additive-grid">
              {MENU_ADDITIVE_LEGEND.map(code => (
                <AdditiveRow key={code.code} code={code} locale={locale} />
              ))}
            </div>
            <p className="menu-info-footnote menu-info-footnote--legend">
              {additiveLegendLine(locale)}
            </p>
          </AccordionSection>
        )}
      </div>
    </aside>
  )
}
