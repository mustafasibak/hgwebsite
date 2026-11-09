import { fallbackWeekPlan, type LunchDay, type LunchMeal } from '@/lib/mittagstisch-data'

const API_URL = 'https://api.hhansegrill-halal.de/api/weekplan/0'

type ApiIngredient = { ingredient: string | null }
type ApiMeal = {
  row_order: number | null
  price: string
  meal: { name: string }
  ingredients: ApiIngredient[]
}
type ApiDay = { day: string; date: string; meals: ApiMeal[] }

/** Calendar date in Europe/Berlin as YYYY-MM-DD */
export function berlinToday(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

/** Put today first, then the rest of the week in original order. */
export function orderWeekWithTodayFirst(week: LunchDay[], today = berlinToday()): LunchDay[] {
  const idx = week.findIndex(d => d.date === today)
  if (idx <= 0) return week
  return [...week.slice(idx), ...week.slice(0, idx)]
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
 * Live Wochenplan from the restaurant CMS.
 * Only days that have dishes are shown — no empty “Noch kein Angebot” cards.
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
    if (week.length === 0) throw new Error('Leerer Wochenplan')
    return { week, live: true }
  } catch {
    return { week: fallbackWeekPlan.filter(d => d.meals.length > 0), live: false }
  }
}
