import type { LunchDay } from '@/lib/mittagstisch-data'
import { lunchDayForToday } from '@/lib/mittagstisch'
import type { Locale } from '@/lib/menu-i18n'
import { t } from '@/lib/menu-i18n'

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI']

function formatPrice(p: number) {
  return p.toFixed(2).replace('.', ',') + ' €'
}

type MittagstischWeekViewProps = {
  week: LunchDay[]
  locale?: Locale
  /** Compact layout for kiosk tab */
  compact?: boolean
}

/** Shared week plan UI — same data as /mittagstisch (API + fallback). */
export default function MittagstischWeekView({
  week,
  locale = 'de',
  compact = false,
}: MittagstischWeekViewProps) {
  const todayPlan = lunchDayForToday(week)

  return (
    <div className={`mittagstisch-week${compact ? ' mittagstisch-week--compact' : ''}`}>
      <div className="mittagstisch-week-intro info-box">
        <p className="mittagstisch-week-lead">
          {t(locale, 'mittagstischLead')}
        </p>
        <p className="mittagstisch-week-hours">
          {t(locale, 'mittagstischHours')}
        </p>
      </div>

      <div className="mittagstisch-week-days">
        {todayPlan && (
          <div
            key={todayPlan.date}
            className="mittagstisch-day info-box mittagstisch-day--today"
          >
            <div className="mittagstisch-day-header">
              <span className="mittagstisch-day-name">
                {todayPlan.day}
                <span className="mittagstisch-day-badge">
                  {t(locale, 'mittagstischToday')}
                </span>
              </span>
            </div>
            <div className="mittagstisch-day-meals">
              {todayPlan.meals.map((meal, i) => (
                <div key={`${todayPlan.date}-${i}`} className="mittagstisch-meal">
                  <div className="mittagstisch-meal-info">
                    <div className="mittagstisch-meal-name">
                      <span className="mittagstisch-meal-roman">{ROMAN[i] ?? i + 1}.</span>
                      {meal.name}
                    </div>
                    {meal.desc && (
                      <div className="mittagstisch-meal-desc">{meal.desc}</div>
                    )}
                  </div>
                  <div className="mittagstisch-meal-price">{formatPrice(meal.price)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
