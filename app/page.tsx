import Link from 'next/link'
import Logo from '@/components/Logo'
import { site } from '@/lib/site'
import { menuCategories } from '@/lib/menu-data'
import { getWeekPlan } from '@/lib/mittagstisch'

function formatPrice(p: number) {
  return p.toFixed(2).replace('.', ',') + ' €'
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI']

export default async function HomePage() {
  const { week } = await getWeekPlan()
  const today = new Date().toISOString().slice(0, 10)
  const todayPlan = week.find(d => d.date === today)

  return (
    <>
      <section style={{ background: 'var(--cream)', borderBottom: '2px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center', padding: '40px 20px 36px' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Logo height={160} link={false} />
          </div>

          <p style={{
            marginTop: 20, fontSize: '1.15rem', color: 'var(--muted)',
            fontWeight: 700,
          }}>
            {site.tagline}
          </p>
          <p style={{ marginTop: 8, fontSize: '1rem', color: 'var(--text)' }}>
            Frisch vom Grill · 100&nbsp;% Halal · Hamburg Bergedorf
          </p>

          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 16,
            justifyContent: 'center', marginTop: 28,
          }}>
            <div className="info-box" style={{ minWidth: 160, textAlign: 'left' }}>
              <strong>Öffnungszeiten</strong>
              Mo – So<br />11:30 – 23:00 Uhr
            </div>
            <div className="info-box" style={{ minWidth: 160, textAlign: 'left' }}>
              <strong>Telefon</strong>
              <a href={`tel:${site.phoneRaw}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>
                {site.phone}
              </a>
            </div>
            <div className="info-box" style={{ minWidth: 200, textAlign: 'left' }}>
              <strong>Adresse</strong>
              {site.address}<br />{site.city}
            </div>
          </div>

          <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/menu" className="btn btn-primary">Zur Speisekarte</Link>
            <Link href="/mittagstisch" className="btn btn-secondary">Mittagstisch</Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '36px 20px 0' }}>
        <div className="section-title">Willkommen bei uns</div>
        <div className="info-box" style={{ borderTop: 'none', fontSize: '0.95rem', lineHeight: 1.8 }}>
          <p>
            Bei HHanse Grill bekommen Sie frische Grillgerichte, Burger, Schnitzel, Croques,
            Pasta und mehr – alles Halal-zertifiziert und täglich frisch zubereitet.
            Ob zum Mitnehmen oder vor Ort: bei uns essen Sie zu 100&nbsp;% nur frische Zutaten.
          </p>
          <p style={{ marginTop: 12 }}>
            Anrufen, bestellen, abholen – wir freuen uns auf Ihren Besuch!
          </p>
        </div>
      </section>

      {todayPlan && (
        <section className="container" style={{ padding: '36px 20px 0' }}>
          <div className="section-title">Mittagstisch heute · {todayPlan.day}</div>
          <div className="info-box" style={{ borderTop: 'none', padding: 0, overflow: 'hidden' }}>
            {todayPlan.meals.map((meal, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', gap: 16,
                padding: '12px 20px',
                borderBottom: '1px solid var(--border)',
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
                <div style={{ fontWeight: 700, whiteSpace: 'nowrap', color: 'var(--accent-dark)' }}>
                  {formatPrice(meal.price)}
                </div>
              </div>
            ))}
            <div style={{ padding: '12px 20px', background: 'var(--surface2)' }}>
              <Link href="/mittagstisch" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                Ganze Woche ansehen →
              </Link>
              <span style={{ marginLeft: 12, fontSize: '0.85rem', color: 'var(--muted)' }}>
                Mo – So ab 11:00 Uhr, solange der Vorrat reicht
              </span>
            </div>
          </div>
        </section>
      )}

      <section className="container" style={{ padding: '36px 20px 40px' }}>
        <div className="section-title">Unsere Speisekarte</div>
        <div className="info-box" style={{ borderTop: 'none' }}>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16,
          }}>
            {menuCategories.map(cat => (
              <span key={cat.name} style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 6, padding: '6px 12px', fontSize: '0.85rem',
              }}>
                {cat.icon} {cat.name}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: 16 }}>
            Über 150 Gerichte – alle Preise inkl. MwSt., alle Fleischgerichte Halal-zertifiziert.
          </p>
          <Link href="/menu" className="btn btn-primary">Speisekarte ansehen</Link>
        </div>
      </section>

      <section style={{ background: 'var(--yellow-soft)', borderTop: '2px solid var(--border)', borderBottom: '2px solid var(--border)' }}>
        <div className="container" style={{
          display: 'flex', flexWrap: 'wrap', gap: 24,
          justifyContent: 'center', padding: '28px 20px', textAlign: 'center',
        }}>
          <div>
            <strong style={{ display: 'block', color: 'var(--accent-dark)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Öffnungszeiten</strong>
            <span style={{ fontSize: '1.05rem' }}>{site.hours}</span>
          </div>
          <div>
            <strong style={{ display: 'block', color: 'var(--accent-dark)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Adresse</strong>
            <span style={{ fontSize: '1.05rem' }}>{site.address}, {site.city}</span>
          </div>
          <div>
            <strong style={{ display: 'block', color: 'var(--accent-dark)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Zahlung</strong>
            <span style={{ fontSize: '1.05rem' }}>{site.payment}</span>
          </div>
          <div>
            <strong style={{ display: 'block', color: 'var(--accent-dark)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Bestellen</strong>
            <a href={`tel:${site.phoneRaw}`} style={{ fontSize: '1.05rem', color: 'var(--text)', textDecoration: 'none', fontWeight: 700 }}>
              {site.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
