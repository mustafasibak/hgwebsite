'use client'
import type { Locale } from '@/lib/menu-i18n'
import { t } from '@/lib/menu-i18n'

type LanguageToggleProps = {
  locale: Locale
  onChange: (locale: Locale) => void
}

export default function LanguageToggle({ locale, onChange }: LanguageToggleProps) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={`lang-toggle-btn${locale === 'de' ? ' lang-toggle-btn--active' : ''}`}
        onClick={() => onChange('de')}
        aria-pressed={locale === 'de'}
        title={t('de', 'langDe')}
      >
        <span className="lang-flag" aria-hidden="true">🇩🇪</span>
        <span className="lang-code">DE</span>
      </button>
      <button
        type="button"
        className={`lang-toggle-btn${locale === 'en' ? ' lang-toggle-btn--active' : ''}`}
        onClick={() => onChange('en')}
        aria-pressed={locale === 'en'}
        title={t('en', 'langEn')}
      >
        <span className="lang-flag" aria-hidden="true">🇬🇧</span>
        <span className="lang-code">EN</span>
      </button>
    </div>
  )
}
