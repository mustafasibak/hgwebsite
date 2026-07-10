'use client'
import { COUNTER_ADDITIVE_LEGEND } from '@/lib/additive-info'
import { t, type Locale } from '@/lib/menu-i18n'

export default function MenuAdditiveLegend({ locale }: { locale: Locale }) {
  return (
    <div className="menu-additive-legend-block">
      <p className="menu-hint menu-hint--meta menu-additive-legend-heading">
        {t(locale, 'additiveLegendHeading')}
      </p>
      <dl className="menu-additive-legend">
        {COUNTER_ADDITIVE_LEGEND.map(entry => (
          <div key={entry.code} className="menu-additive-legend-item">
            <dt>{entry.code}</dt>
            <dd>{locale === 'en' ? entry.en : entry.de}</dd>
          </div>
        ))}
      </dl>
      <p className="menu-hint menu-hint--meta menu-additive-legend-note">
        {t(locale, 'additiveLegendNote')}
      </p>
    </div>
  )
}
