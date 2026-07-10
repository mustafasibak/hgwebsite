'use client'

import type { ReactNode } from 'react'
import { useMenuLocale } from '@/components/MenuLocaleContext'

export default function KioskLocaleRoot({ children }: { children: ReactNode }) {
  const { locale } = useMenuLocale()
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <div className="kiosk-locale-root" dir={dir} lang={locale}>
      {children}
    </div>
  )
}
