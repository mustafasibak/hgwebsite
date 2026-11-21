/**
 * Smoke-check against the owner's daily board (menu_items).
 * Works for any weekday; does not consult weekplan/0.
 *
 * Usage: npm run check:mittagstisch
 */
const DAILY = 'https://api.hhansegrill-halal.de/api/menu_items'

function berlinToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function weekdayName(iso) {
  const names = [
    'Sonntag',
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
  ]
  return names[new Date(`${iso}T12:00:00Z`).getUTCDay()]
}

const today = berlinToday()
const dayName = weekdayName(today)

const res = await fetch(DAILY)
if (!res.ok) {
  console.error(`FAIL: menu_items HTTP ${res.status}`)
  process.exit(1)
}

const daily = await res.json()
if (!Array.isArray(daily)) {
  console.error('FAIL: menu_items did not return an array')
  process.exit(1)
}

const todayDaily = daily.filter(i => i?.date === today)
console.log(`Berlin today: ${today} (${dayName})`)
console.log(`menu_items today: ${todayDaily.length} dish(es)`)

if (todayDaily.length > 0) {
  for (const item of todayDaily.sort((a, b) => (a.row_order ?? 0) - (b.row_order ?? 0))) {
    console.log(`  - ${item.meal?.name} ${item.price}€`)
  }
  console.log('OK: daily board has today')
  process.exit(0)
}

console.log(
  'OK: owner has not published today on menu_items yet — empty Mittagstisch is correct (no fake/stale dishes).',
)
process.exit(0)
