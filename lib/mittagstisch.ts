import type { LunchDay, LunchMeal } from '@/lib/mittagstisch-data'

/**
 * Daily lunch board the owner edits at https://hhansegrill-halal.de/mittagstisch
 * (same feed as the in-restaurant screen) — NOT the weekly Speise-Plan.
 */
const DAILY_API_URL = 'https://api.hhansegrill-halal.de/api/menu_items'

type ApiIngredient = { ingredient: string | null }
type ApiMealItem = {
  id: number
  row_order: number | null
  date: string
  price: string
  available: number | boolean | null
  meal: { name: string }
  ingredients: ApiIngredient[]
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

function weekdayNameForDate(isoDate: string): string {
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

function toLunchMeal(item: ApiMealItem): LunchMeal {
  const desc = cleanText(
    (item.ingredients ?? [])
      .map(i => i.ingredient ?? '')
      .filter(Boolean)
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(', '),
  )
  const available = item.available === 1 || item.available === true
  return {
    name: titleCase(item.meal?.name ?? ''),
    ...(desc ? { desc } : {}),
    price: parseFloat(item.price),
    ...(available ? {} : { available: false }),
  }
}

function groupDailyBoard(items: ApiMealItem[]): LunchDay[] {
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
        .filter(m => m.name)
      return {
        day: weekdayNameForDate(date),
        date,
        meals,
      }
    })
    .filter(d => d.meals.length > 0)
}

/**
 * Live daily lunch board from the restaurant CMS.
 * Owner edits on /mittagstisch show up within ~1 minute.
 */
export async function getWeekPlan(): Promise<{ week: LunchDay[]; live: boolean }> {
  try {
    const res = await fetch(DAILY_API_URL, {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`API ${res.status}`)
    const data: unknown = await res.json()
    const items = Array.isArray(data) ? (data as ApiMealItem[]) : []
    const week = groupDailyBoard(items)
    return { week, live: true }
  } catch {
    return { week: [], live: false }
  }
}
