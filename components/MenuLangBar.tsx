'use client'
import LanguageToggle from '@/components/LanguageToggle'
import { useMenuLocale } from '@/components/MenuLocaleContext'

export default function MenuLangBar() {
  const { locale, setLocale } = useMenuLocale()

  return (
    <div className="menu-lang-bar">
      <LanguageToggle locale={locale} onChange={setLocale} />
    </div>
  )
}
