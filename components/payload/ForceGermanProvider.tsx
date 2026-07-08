'use client'

import { useTranslation } from '@payloadcms/ui'
import React, { useEffect } from 'react'

type Props = {
  children: React.ReactNode
}

/** Ensures the admin UI stays in German even if an old English cookie is set. */
export default function ForceGermanProvider({ children }: Props) {
  const { i18n, switchLanguage } = useTranslation()

  useEffect(() => {
    if (i18n.language !== 'de' && switchLanguage) {
      void switchLanguage('de')
    }
  }, [i18n.language, switchLanguage])

  return <>{children}</>
}
