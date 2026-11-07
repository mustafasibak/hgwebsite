/** Fired to return kiosk menu to default (top tab, no search, closed detail). */
export const KIOSK_RESET_EVENT = 'hhanse-kiosk-reset'

/** No touch/click on kiosk — reset scroll/tab/search for the next guest (ms). */
export const KIOSK_IDLE_RESET_MS = 45_000

/** Long idle — full-screen attract mode (ms). */
export const KIOSK_ATTRACT_IDLE_MS = 5 * 60 * 1000

export function requestKioskReset() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(KIOSK_RESET_EVENT))
  }
}
