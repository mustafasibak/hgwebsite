import Link from 'next/link'
import Logo from '@/components/Logo'
import GuruBadge from '@/components/GuruBadge'
import { site } from '@/lib/site'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--header)',
      color: '#f0e6cc',
      borderTop: '3px solid var(--border-dark)',
      marginTop: 40,
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 32, padding: '36px 20px',
      }}>
        <div>
          <Logo height={80} link={false} />
          <p style={{ marginTop: 12, fontSize: '0.9rem', lineHeight: 1.7, color: '#c9b88a' }}>
            Halal-zertifizierter Grill-Imbiss in <br />
            Hamburg Bergedorf.
          </p>
          <div style={{ marginTop: 16 }}>
            <GuruBadge width={140} />
          </div>
        </div>

        <div>
          <div className="section-title" style={{ marginBottom: 12, fontSize: '0.85rem' }}>Seiten</div>
          {[
            { href: '/', label: 'Startseite' },
            { href: '/menu', label: 'Speisekarte' },
            { href: '/mittagstisch', label: 'Mittagstisch' },
            { href: '/anfahrt', label: 'Anfahrt' },
            { href: '/kontakt', label: 'Kontakt' },
            { href: '/datenschutz', label: 'Datenschutz (DSGVO)' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{
              display: 'block', color: '#e8dcc0', fontSize: '0.9rem',
              padding: '3px 0', textDecoration: 'none',
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        <div>
          <div className="section-title" style={{ marginBottom: 12, fontSize: '0.85rem' }}>Kontakt</div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: '#e8dcc0' }}>
            {site.address}<br />
            {site.city}<br />
            Tel. {site.phone}<br />
            {site.email}<br />
            {site.website}
          </p>
          <p style={{ marginTop: 10, fontSize: '0.85rem', color: '#c9b88a' }}>
            {site.hours}<br />
            {site.payment}
          </p>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid #4a3f2e',
        textAlign: 'center', padding: '14px 20px',
        fontSize: '0.8rem', color: '#9a8a6a',
      }}>
        © {new Date().getFullYear()} {site.name} · Alle Preise inkl. MwSt. ·{' '}
        <Link href="/datenschutz" style={{ color: 'inherit' }}>Datenschutzerklärung</Link>
      </div>
    </footer>
  )
}
