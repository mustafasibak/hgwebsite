'use client'

import { useTranslation } from '@payloadcms/ui'
import React, { useEffect, useRef } from 'react'

type Props = {
  children: React.ReactNode
}

/** Ensures the admin UI stays in German even if an old English cookie is set. */
export default function ForceGermanProvider({ children }: Props) {
  const { i18n, switchLanguage } = useTranslation()
  const didSwitch = useRef(false)

  useEffect(() => {
    if (didSwitch.current || i18n.language === 'de' || !switchLanguage) return
    didSwitch.current = true
    void switchLanguage('de')
  }, [i18n.language, switchLanguage])

  return <>{children}</>
}
