'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { site } from '@/lib/site'

export default function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Start' },
    { href: '/menu', label: 'Speisekarte' },
    { href: '/mittagstisch', label: 'Mittagstisch' },
    { href: '/anfahrt', label: 'Anfahrt' },
    { href: '/kontakt', label: 'Kontakt' },
  ]

  return (
    <header style={{ borderBottom: '3px solid var(--border-dark)' }}>
      <div style={{ background: 'var(--header)', color: '#fff', textAlign: 'center', padding: '6px 16px', fontSize: '0.85rem' }}>
        Halal Zertifiziert &nbsp;·&nbsp; حلال &nbsp;·&nbsp; {site.hours}
      </div>

      <nav style={{ background: 'var(--cream)', borderBottom: '2px solid var(--border)' }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexWrap: 'wrap', gap: 12, padding: '12px 20px',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
            {links.map(l => (
              <Link key={l.href} href={l.href} style={{
                padding: '8px 12px',
                fontSize: '0.95rem',
                fontWeight: pathname === l.href ? 700 : 400,
                color: pathname === l.href ? 'var(--accent-dark)' : 'var(--text)',
                textDecoration: pathname === l.href ? 'underline' : 'none',
                textUnderlineOffset: 4,
              }}>
                {l.label}
              </Link>
            ))}
            <a href={`tel:${site.phoneRaw}`} className="btn btn-primary" style={{ marginLeft: 8 }}>
              {site.phone}
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}
