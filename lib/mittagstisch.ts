import type { LunchDay, LunchMeal } from '@/lib/mittagstisch-data'

/**
 * Mittagstisch source of truth = the owner's DAILY lunch board.
 *
 * ✅ ALWAYS use:  https://api.hhansegrill-halal.de/api/menu_items
 *    Same feed as https://hhansegrill-halal.de/mittagstisch (incl. Sa/So).
 *
 * ❌ Do NOT use weekplan/0 as primary — it is Mo–Fr only and makes weekends
 *    look "broken" even when the owner has published today's dishes.
 *
 * weekplan/0 is only a last-resort fallback when the daily board is down AND
 * it happens to contain today's date (typical for some weekdays).
 */
const DAILY_API_URL = 'https://api.hhansegrill-halal.de/api/menu_items'
const WEEKPLAN_API_URL = 'https://api.hhansegrill-halal.de/api/weekplan/0'

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
type ApiWeekDay = {
  day: string
  date: string
  meals: Array<{
    row_order: number | null
    price: string
    available?: number | boolean | null
    meal: { name: string }
    ingredients?: ApiIngredient[]
  }>
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
  const available = item.available === 1 || item.available === true || item.available == null
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

function weekPlanToLunchDays(weekPlan: ApiWeekDay[]): LunchDay[] {
  return weekPlan
    .map(d => {
      const meals = [...(d.meals ?? [])]
        .sort((a, b) => (a.row_order ?? 0) - (b.row_order ?? 0))
        .map(toLunchMeal)
        .filter((m): m is LunchMeal => Boolean(m))
      return {
        day: d.day || weekdayNameForDate(d.date),
        date: d.date,
        meals,
      }
    })
    .filter(d => d.date && d.meals.length > 0)
}

async function fetchDailyBoard(): Promise<LunchDay[] | null> {
  try {
    const res = await fetch(DAILY_API_URL, {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data: unknown = await res.json()
    if (!Array.isArray(data)) return null
    return groupDailyBoard(data as ApiMealItem[])
  } catch {
    return null
  }
}

async function fetchWeekPlanFallback(): Promise<LunchDay[] | null> {
  try {
    const res = await fetch(WEEKPLAN_API_URL, {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data: { weekPlan?: ApiWeekDay[] } = await res.json()
    return weekPlanToLunchDays(data.weekPlan ?? [])
  } catch {
    return null
  }
}

/**
 * Live Mittagstisch for every calendar day (Mo–So).
 * Prefers the daily board; falls back to weekplan only if daily is empty/unavailable
 * and weekplan already contains today's date (never invents weekend dishes).
 */
export async function getWeekPlan(): Promise<{ week: LunchDay[]; live: boolean }> {
  const today = todayIsoDate()
  const daily = await fetchDailyBoard()

  if (daily && daily.length > 0) {
    // Prefer today's row when the board returns multiple dates.
    const todayRow = daily.find(d => d.date === today)
    if (todayRow) return { week: [todayRow], live: true }
    return { week: daily, live: true }
  }

  const weekly = await fetchWeekPlanFallback()
  if (weekly && weekly.length > 0) {
    const todayRow = weekly.find(d => d.date === today)
    if (todayRow) return { week: [todayRow], live: true }
    // Daily empty + today not in weekplan (typical weekend): show nothing,
    // do not invent stale dishes.
    return { week: [], live: true }
  }

  return { week: [], live: false }
}
