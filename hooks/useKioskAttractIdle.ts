'use client'

import { useEffect, useRef } from 'react'
import { KIOSK_ATTRACT_IDLE_MS } from '@/lib/kiosk-session'

/** Long idle — show attract / screensaver (menu should reset separately). */
export function useKioskAttractIdle(
  enabled: boolean,
  onIdle: () => void,
  idleMs: number = KIOSK_ATTRACT_IDLE_MS,
) {
  const onIdleRef = useRef(onIdle)
  onIdleRef.current = onIdle

  useEffect(() => {
    if (!enabled) return

    let timer: ReturnType<typeof setTimeout> | undefined

    const schedule = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => onIdleRef.current(), idleMs)
    }

    const activity = () => schedule()

    const events = ['pointerdown', 'touchstart', 'keydown', 'click'] as const
    for (const name of events) {
      window.addEventListener(name, activity, { passive: true })
    }
    schedule()

    return () => {
      if (timer) clearTimeout(timer)
      for (const name of events) {
        window.removeEventListener(name, activity)
      }
    }
  }, [enabled, idleMs])
}
