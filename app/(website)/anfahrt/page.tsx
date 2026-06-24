import { site } from '@/lib/site'

export default function AnfahrtPage() {
  return (
    <div className="container" style={{ padding: '32px 20px 48px' }}>
      <div className="section-title">Anfahrt &amp; Öffnungszeiten</div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20, marginTop: 0,
      }}>
        <div>
          {[
            { label: 'Adresse', value: `${site.address}\n${site.city}` },
            { label: 'Öffnungszeiten', value: site.hours },
            { label: 'Telefon', value: site.phone },
            { label: 'E-Mail', value: site.email },
            { label: 'Anbindung', value: 'Vom Bergedorfer Bahnhof nur ca. 3–5 Min. Fußweg' },
            { label: 'Parken', value: 'Gute Parkmöglichkeiten direkt vor Ort' },
            { label: 'Zahlung', value: site.payment },
          ].map(({ label, value }) => (
            <div key={label} className="info-box" style={{ marginBottom: 10 }}>
              <strong>{label}</strong>
              <span style={{ whiteSpace: 'pre-line' }}>{value}</span>
            </div>
          ))}

          <a href={`tel:${site.phoneRaw}`} className="btn btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: 8 }}>
            Jetzt anrufen
          </a>
        </div>

        <div style={{ border: '3px solid var(--border-dark)', overflow: 'hidden', minHeight: 360 }}>
          <iframe
            title="HHanse Grill Karte"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2374.5614978388!2d10.198829315955!3d53.488716279994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b18fa126a7e2db%3A0x9a07a59e3a7e3d6a!2sKurt-A.-K%C3%B6rber-Chaussee%203%2C%2021035%20Hamburg!5e0!3m2!1sde!2sde!4v1623456789012!5m2!1sde!2sde"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 360 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  )
}
