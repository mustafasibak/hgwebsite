import type { LunchDay, LunchMeal } from '@/lib/mittagstisch-data'

/**
 * INVARIANT — do not change without updating lib/mittagstisch.test.mjs + CI:
 *
 * Mittagstisch ALWAYS comes from the owner's daily lunch board:
 *   https://api.hhansegrill-halal.de/api/menu_items
 * (= same feed as https://hhansegrill-halal.de/mittagstisch)
 *
 * This works every calendar day (Montag–Sonntag).
 *
 * NEVER call the weekly Speise-Plan API. That feed is Mo–Fr only and previously
 * made Samstag/Sonntag look broken even when the owner had already published
 * today’s dishes on the daily board.
 */
export const MITTAGSTISCH_DAILY_API_URL =
  'https://api.hhansegrill-halal.de/api/menu_items'

type ApiIngredient = { ingredient: string | null }
type ApiMealItem = {
  id?: number
  row_order: number | null
  date: string
  price: string
  available?: number | boolean | null
  meal: { name: string }
  ingredients?: ApiIngredient[]
}

const WEEKDAY_DE: Record<number, string> = {
  1: 'Montag',
  2: 'Dienstag',
  3: 'Mittwoch',
  4: 'Donnerstag',
  5: 'Freitag',
  6: 'Samstag',
  7: 'Sonntag',
}

/** Today as YYYY-MM-DD in Europe/Berlin (matches CMS dates). */
export function todayIsoDate(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

export function weekdayNameForDate(isoDate: string): string {
  // noon UTC avoids DST edge cases for calendar day → weekday
  const dow = new Date(`${isoDate}T12:00:00Z`).getUTCDay() // 0=Sun..6=Sat
  const isoDow = dow === 0 ? 7 : dow
  return WEEKDAY_DE[isoDow] ?? isoDate
}

/** Today’s row from the live board, only when that date has meals. */
export function lunchDayForToday(week: LunchDay[]): LunchDay | undefined {
  const day = week.find(d => d.date === todayIsoDate())
  if (!day || day.meals.length === 0) return undefined
  return day
}

function cleanText(s: string): string {
  return s
    .replace(/["„“']/g, '')
    .replace(/\s*,\s*/g, ', ')
    .replace(/(,\s*){2,}/g, ', ')
    .replace(/\s+/g, ' ')
    .replace(/^[\s,.]+|[\s,.]+$/g, '')
}

function titleCase(s: string): string {
  return cleanText(s)
    .split(' ')
    .map(w => (w && w[0] === w[0].toLowerCase() ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
}

function toLunchMeal(item: {
  price: string
  available?: number | boolean | null
  meal?: { name?: string } | null
  ingredients?: ApiIngredient[] | null
}): LunchMeal | null {
  const name = titleCase(item.meal?.name ?? '')
  if (!name) return null
  const desc = cleanText(
    (item.ingredients ?? [])
      .map(i => i.ingredient ?? '')
      .filter(Boolean)
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(', '),
  )
  const available =
    item.available === 1 || item.available === true || item.available == null
  return {
    name,
    ...(desc ? { desc } : {}),
    price: parseFloat(item.price),
    ...(available ? {} : { available: false }),
  }
}

/** Pure helper — exported for regression tests (any calendar day). */
export function groupDailyBoard(items: ApiMealItem[]): LunchDay[] {
  const byDate = new Map<string, ApiMealItem[]>()
  for (const item of items) {
    if (!item?.date) continue
    const list = byDate.get(item.date) ?? []
    list.push(item)
    byDate.set(item.date, list)
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayItems]) => {
      const meals = [...dayItems]
        .sort((a, b) => (a.row_order ?? 0) - (b.row_order ?? 0))
        .map(toLunchMeal)
        .filter((m): m is LunchMeal => Boolean(m))
      return {
        day: weekdayNameForDate(date),
        date,
        meals,
      }
    })
    .filter(d => d.meals.length > 0)
}

/**
 * Live Mittagstisch for every calendar day (Mo–So).
 * Only the daily board — never the weekly Speise-Plan API.
 */
export async function getWeekPlan(): Promise<{ week: LunchDay[]; live: boolean }> {
  try {
    const res = await fetch(MITTAGSTISCH_DAILY_API_URL, {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`API ${res.status}`)
    const data: unknown = await res.json()
    if (!Array.isArray(data)) throw new Error('menu_items is not an array')

    const week = groupDailyBoard(data as ApiMealItem[])
    const today = todayIsoDate()
    const todayRow = week.find(d => d.date === today)
    // Prefer a single today card when the board returns multiple dates.
    if (todayRow) return { week: [todayRow], live: true }
    return { week, live: true }
  } catch {
    return { week: [], live: false }
  }
}
