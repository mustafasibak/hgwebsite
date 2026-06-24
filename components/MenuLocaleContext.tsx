'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Locale } from '@/lib/menu-i18n'

type MenuLocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const MenuLocaleContext = createContext<MenuLocaleContextValue | null>(null)

export function MenuLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('de')
  return (
    <MenuLocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </MenuLocaleContext.Provider>
  )
}

export function useMenuLocale(): MenuLocaleContextValue {
  const ctx = useContext(MenuLocaleContext)
  if (!ctx) {
    return { locale: 'de', setLocale: () => {} }
  }
  return ctx
}
