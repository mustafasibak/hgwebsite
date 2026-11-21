/**
 * Regression lock: Mittagstisch must stay on the daily board forever.
 * Run: node --import tsx --test lib/mittagstisch.test.mjs
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
  groupDailyBoard,
  weekdayNameForDate,
  MITTAGSTISCH_DAILY_API_URL,
} from './mittagstisch.ts'

const here = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(join(here, 'mittagstisch.ts'), 'utf8')

describe('mittagstisch source lock', () => {
  it('primary URL is the daily menu_items board', () => {
    assert.equal(
      MITTAGSTISCH_DAILY_API_URL,
      'https://api.hhansegrill-halal.de/api/menu_items',
    )
  })

  it('never fetches weekplan/0 (Mo–Fr only — caused weekend outages)', () => {
    assert.equal(source.includes('weekplan/0'), false)
    assert.equal(source.includes('weekplan'), false)
    assert.match(source, /api\/menu_items/)
  })
})

describe('mittagstisch daily board', () => {
  it('names every weekday including weekend', () => {
    assert.equal(weekdayNameForDate('2026-11-16'), 'Montag')
    assert.equal(weekdayNameForDate('2026-11-17'), 'Dienstag')
    assert.equal(weekdayNameForDate('2026-11-18'), 'Mittwoch')
    assert.equal(weekdayNameForDate('2026-11-19'), 'Donnerstag')
    assert.equal(weekdayNameForDate('2026-11-20'), 'Freitag')
    assert.equal(weekdayNameForDate('2026-11-21'), 'Samstag')
    assert.equal(weekdayNameForDate('2026-11-22'), 'Sonntag')
  })

  it('groups Saturday dishes from menu_items payloads', () => {
    const week = groupDailyBoard([
      {
        row_order: 2,
        date: '2026-11-21',
        price: '8.50',
        available: 1,
        meal: { name: 'Rinder Gulasch' },
        ingredients: [{ ingredient: 'Champignon' }],
      },
      {
        row_order: 1,
        date: '2026-11-21',
        price: '11.00',
        available: 1,
        meal: { name: 'Lachspfanne' },
        ingredients: [{ ingredient: 'Makkaroni' }],
      },
    ])
    assert.equal(week.length, 1)
    assert.equal(week[0].day, 'Samstag')
    assert.equal(week[0].date, '2026-11-21')
    assert.equal(week[0].meals[0].name, 'Lachspfanne')
    assert.equal(week[0].meals[1].name, 'Rinder Gulasch')
  })

  it('groups Sunday dishes the same way', () => {
    const week = groupDailyBoard([
      {
        row_order: 1,
        date: '2026-11-22',
        price: '9.00',
        available: 1,
        meal: { name: 'Test Sonntag' },
        ingredients: [],
      },
    ])
    assert.equal(week[0].day, 'Sonntag')
    assert.equal(week[0].meals[0].name, 'Test Sonntag')
  })
})
