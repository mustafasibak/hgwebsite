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

const WEEKDAY_OFFSET: Record<string, number> = {
  Montag: 0,
  Dienstag: 1,
  Mittwoch: 2,
  Donnerstag: 3,
  Freitag: 4,
  Samstag: 5,
  Sonntag: 6,
}

/** Calendar date in Europe/Berlin as YYYY-MM-DD */
export function berlinToday(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function addIsoDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + days)
  return dt.toISOString().slice(0, 10)
}

function cleanText(s: string): string {
  return s
    .replace(/["„“']/g, '')
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
 * The restaurant CMS weekplan often only returns Mo–Fr.
 * Fill Sa/So from fallback only when that fallback entry is for *this*
 * week's weekend date — never reuse last week's Saturday dishes.
 */
function mergeMissingWeekendDays(week: LunchDay[]): LunchDay[] {
  if (week.length === 0) return week

  let monday: string | null = null
  for (const d of week) {
    const off = WEEKDAY_OFFSET[d.day]
    if (off != null) {
      monday = addIsoDays(d.date, -off)
      break
    }
  }
  if (!monday) return week

  const present = new Set(week.map(d => d.day))
  const result = [...week]

  for (const dayName of ['Samstag', 'Sonntag'] as const) {
    if (present.has(dayName)) continue
    const date = addIsoDays(monday, WEEKDAY_OFFSET[dayName])
    const template = fallbackWeekPlan.find(
      d => d.day === dayName && d.date === date && d.meals.length > 0,
    )
    if (!template) continue
    result.push({ day: dayName, date, meals: template.meals })
  }

  return result.sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Holt den aktuellen Wochenplan vom bestehenden Backend des Restaurants.
 * Fällt auf die gebündelten Beispieldaten zurück, wenn die API nicht erreichbar ist.
 */
export async function getWeekPlan(): Promise<{ week: LunchDay[]; live: boolean }> {
  try {
    const res = await fetch(API_URL, {
      signal: AbortSignal.timeout(5000),
      // Short TTL so newly entered days show up quickly after CMS edits
      next: { revalidate: 120 },
    })
    if (!res.ok) throw new Error(`API ${res.status}`)
    const data: { weekPlan: ApiDay[] } = await res.json()
    const week = mergeMissingWeekendDays(
      data.weekPlan.map(toLunchDay).filter(d => d.meals.length > 0),
    )
    if (week.length === 0) throw new Error('Leerer Wochenplan')
    return { week, live: true }
  } catch {
    return { week: fallbackWeekPlan, live: false }
  }
}
