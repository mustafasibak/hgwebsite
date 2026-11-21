/**
 * Regression: grouping + weekday naming must work for weekends.
 * Run: node --test lib/mittagstisch.test.mjs
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { groupDailyBoard, weekdayNameForDate } from './mittagstisch.ts'

describe('mittagstisch daily board', () => {
  it('names Saturday correctly', () => {
    assert.equal(weekdayNameForDate('2026-11-21'), 'Samstag')
    assert.equal(weekdayNameForDate('2026-11-22'), 'Sonntag')
    assert.equal(weekdayNameForDate('2026-11-16'), 'Montag')
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
    assert.equal(week[0].meals.length, 2)
    assert.equal(week[0].meals[0].name, 'Lachspfanne')
    assert.equal(week[0].meals[1].name, 'Rinder Gulasch')
  })
})
