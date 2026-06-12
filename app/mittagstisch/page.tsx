import { site } from '@/lib/site'
import { getWeekPlan } from '@/lib/mittagstisch'

export const metadata = {
  title: 'Mittagstisch – HHanse Grill Hamburg Bergedorf',
  description: 'Wöchentlich wechselnder Mittagstisch – immer ab 11:00 Uhr, solange der Vorrat reicht.',
}

function formatPrice(p: number) {
  return p.toFixed(2).replace('.', ',') + ' €'
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI']

export default async function MittagstischPage() {
  const { week, live } = await getWeekPlan()
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="container" style={{ padding: '32px 20px 48px' }}>
      <div className="section-title">Mittagstisch</div>

      <div className="info-box" style={{ borderTop: 'none', marginBottom: 24 }}>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
          Unser Mittagstisch wechselt wöchentlich – jeden Tag vier frisch zubereitete
          Gerichte zum günstigen Preis.
        </p>
        <p style={{ marginTop: 10, fontWeight: 700, color: 'var(--accent-dark)' }}>
          Mo – So · immer ab 11:00 Uhr · solange der Vorrat reicht
        </p>
        {!live && (
          <p style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--muted)' }}>
            Beispielwoche – das aktuelle Tagesangebot erfragen Sie telefonisch.
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {week.map(day => {
          const isToday = day.date === today
          return (
            <div
              key={day.date}
              className="info-box"
              style={{
                padding: 0,
                overflow: 'hidden',
                borderColor: isToday ? 'var(--accent)' : 'var(--border)',
                boxShadow: isToday ? '0 2px 12px rgba(224, 112, 0, 0.25)' : 'none',
              }}
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '10px 20px',
                background: isToday ? 'var(--accent)' : 'var(--surface2)',
                color: isToday ? '#fff' : 'var(--text)',
                borderBottom: '2px solid var(--border)',
              }}>
                <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                  {day.day}
                  {isToday && <span style={{
                    marginLeft: 10, fontSize: '0.7rem', fontWeight: 700,
                    background: '#fff', color: 'var(--accent-dark)',
                    padding: '2px 8px', borderRadius: 4,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    verticalAlign: 'middle',
                  }}>Heute</span>}
                </span>
              </div>

              <div>
                {day.meals.map((meal, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', gap: 16,
                    padding: '12px 20px',
                    borderBottom: i < day.meals.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        <span style={{ color: 'var(--accent-dark)', marginRight: 8 }}>{ROMAN[i] ?? i + 1}.</span>
                        {meal.name}
                      </div>
                      {meal.desc && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 2 }}>
                          {meal.desc}
                        </div>
                      )}
                    </div>
                    <div style={{
                      fontWeight: 700, whiteSpace: 'nowrap',
                      color: 'var(--accent-dark)', fontSize: '1.02rem',
                    }}>
                      {formatPrice(meal.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <p className="info-box" style={{ marginTop: 24, fontSize: '0.9rem' }}>
        Fragen zum Tagesangebot? Einfach anrufen:{' '}
        <a href={`tel:${site.phoneRaw}`} style={{ fontWeight: 700 }}>{site.phone}</a>
      </p>
    </div>
  )
}
