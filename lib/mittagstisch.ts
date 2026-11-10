import type { LunchDay, LunchMeal } from '@/lib/mittagstisch-data'

const API_URL = 'https://api.hhansegrill-halal.de/api/weekplan/0'

type ApiIngredient = { ingredient: string | null }
type ApiMeal = {
  row_order: number | null
  price: string
  meal: { name: string }
  ingredients: ApiIngredient[]
}
type ApiDay = { day: string; date: string; meals: ApiMeal[] }

/** Today as YYYY-MM-DD (same calendar day as the restaurant CMS dates). */
function todayIsoDate(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

/** Today’s row from the API week plan, only when that date has meals. */
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

function toLunchDay(d: ApiDay): LunchDay {
  const meals: LunchMeal[] = [...(d.meals ?? [])]
    .sort((a, b) => (a.row_order ?? 0) - (b.row_order ?? 0))
    .map(m => {
      const desc = cleanText(m.ingredients.map(i => i.ingredient ?? '').join(', '))
      return {
        name: titleCase(m.meal.name),
        ...(desc ? { desc } : {}),
        price: parseFloat(m.price),
      }
    })
  return { day: d.day, date: d.date, meals }
}

/**
 * Live week plan from the restaurant CMS — only days that have dishes.
 * Owner edits on the old site show up within ~1 minute.
 */
export async function getWeekPlan(): Promise<{ week: LunchDay[]; live: boolean }> {
  try {
    const res = await fetch(API_URL, {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`API ${res.status}`)
    const data: { weekPlan: ApiDay[] } = await res.json()
    const week = (data.weekPlan ?? [])
      .map(toLunchDay)
      .filter(d => d.meals.length > 0)
      .sort((a, b) => a.date.localeCompare(b.date))
    return { week, live: true }
  } catch {
    return { week: [], live: false }
  }
}
