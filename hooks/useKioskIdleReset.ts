'use client'

import { useEffect, useRef } from 'react'
import { KIOSK_IDLE_RESET_MS } from '@/lib/kiosk-session'

/**
 * After idleMs without interaction, call onIdle (typically requestKioskReset).
 * Pointer/keyboard count as activity; scrolling alone does not extend the timer
 * so a half-scrolled page still resets when the guest walks away.
 */
export function useKioskIdleReset(
  enabled: boolean,
  onIdle: () => void,
  idleMs: number = KIOSK_IDLE_RESET_MS,
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
