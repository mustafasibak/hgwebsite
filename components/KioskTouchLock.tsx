'use client'

import { useEffect } from 'react'

/** Pin zoom and reduce gesture conflicts on in-store kiosk browsers (e.g. WebPlayer). */
export default function KioskTouchLock() {
  useEffect(() => {
    const blockMultiTouch = (event: TouchEvent) => {
      if (event.touches.length > 1) event.preventDefault()
    }

    const blockGesture = (event: Event) => {
      event.preventDefault()
    }

    const blockCtrlWheel = (event: WheelEvent) => {
      if (event.ctrlKey) event.preventDefault()
    }

    const opts = { passive: false } as const
    document.addEventListener('touchmove', blockMultiTouch, opts)
    document.addEventListener('gesturestart', blockGesture, opts)
    document.addEventListener('gesturechange', blockGesture, opts)
    document.addEventListener('gestureend', blockGesture, opts)
    document.addEventListener('wheel', blockCtrlWheel, opts)

    return () => {
      document.removeEventListener('touchmove', blockMultiTouch)
      document.removeEventListener('gesturestart', blockGesture)
      document.removeEventListener('gesturechange', blockGesture)
      document.removeEventListener('gestureend', blockGesture)
      document.removeEventListener('wheel', blockCtrlWheel)
    }
  }, [])

  return null
}
