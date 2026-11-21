/**
 * Smoke-check: today's Mittagstisch must resolve from the owner's daily board
 * (menu_items), for any weekday including Sa/So.
 *
 * Exit 0 = today's dishes found (or board intentionally empty before publish).
 * Exit 1 = wiring/regression (still depending on Mo–Fr weekplan only).
 *
 * Usage: node scripts/check-mittagstisch.mjs
 */
const DAILY = 'https://api.hhansegrill-halal.de/api/menu_items'
const WEEKLY = 'https://api.hhansegrill-halal.de/api/weekplan/0'

function berlinToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function weekdayName(iso) {
  const names = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
  return names[new Date(`${iso}T12:00:00Z`).getUTCDay()]
}

const today = berlinToday()
const dayName = weekdayName(today)

const [dailyRes, weeklyRes] = await Promise.all([fetch(DAILY), fetch(WEEKLY)])
if (!dailyRes.ok) {
  console.error(`FAIL: menu_items HTTP ${dailyRes.status}`)
  process.exit(1)
}
const daily = await dailyRes.json()
const weekly = weeklyRes.ok ? await weeklyRes.json() : { weekPlan: [] }

if (!Array.isArray(daily)) {
  console.error('FAIL: menu_items did not return an array — do not use weekplan as primary')
  process.exit(1)
}

const todayDaily = daily.filter(i => i?.date === today)
const weekDates = (weekly.weekPlan ?? []).map(d => d.date)
const todayInWeekplan = weekDates.includes(today)

console.log(`Berlin today: ${today} (${dayName})`)
console.log(`menu_items today: ${todayDaily.length} dish(es)`)
console.log(`weekplan/0 dates: ${weekDates.join(', ') || '(none)'}`)
console.log(`today in weekplan/0: ${todayInWeekplan}`)

if (todayDaily.length > 0) {
  for (const item of todayDaily.sort((a, b) => (a.row_order ?? 0) - (b.row_order ?? 0))) {
    console.log(`  - ${item.meal?.name} ${item.price}€`)
  }
  console.log('OK: daily board has today — site should show Mittagstisch without manual fixes')
  process.exit(0)
}

if (!todayInWeekplan) {
  console.log(
    'OK: owner has not published today on menu_items yet (and weekplan has no today). Showing empty is correct — do not invent dishes.',
  )
  process.exit(0)
}

console.error(
  'WARN: today only exists on weekplan/0, not menu_items. Site prefers menu_items; ask owner to publish the daily board.',
)
process.exit(0)
