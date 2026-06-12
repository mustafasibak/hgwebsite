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

function cleanText(s: string): string {
  return s
    .replace(/["„“]/g, '')
    .replace(/\s*,\s*/g, ', ')
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
  const meals: LunchMeal[] = [...d.meals]
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
 * Holt den aktuellen Wochenplan vom bestehenden Backend des Restaurants.
 * Fällt auf die gebündelten Beispieldaten zurück, wenn die API nicht erreichbar ist.
 */
export async function getWeekPlan(): Promise<{ week: LunchDay[]; live: boolean }> {
  try {
    const res = await fetch(API_URL, {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 1800 },
    })
    if (!res.ok) throw new Error(`API ${res.status}`)
    const data: { weekPlan: ApiDay[] } = await res.json()
    const week = data.weekPlan.map(toLunchDay).filter(d => d.meals.length > 0)
    if (week.length === 0) throw new Error('Leerer Wochenplan')
    return { week, live: true }
  } catch {
    return { week: fallbackWeekPlan, live: false }
  }
}
