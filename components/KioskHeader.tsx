'use client'
import LanguageToggle from '@/components/LanguageToggle'
import { useMenuLocale } from '@/components/MenuLocaleContext'
import { t } from '@/lib/menu-i18n'

export default function KioskHeader() {
  const { locale, setLocale } = useMenuLocale()

  return (
    <header className="kiosk-header">
      <div className="kiosk-header-bar">
        <p className="kiosk-notice">{t(locale, 'kioskNotice')}</p>
        <LanguageToggle locale={locale} onChange={setLocale} />
      </div>
    </header>
  )
}
