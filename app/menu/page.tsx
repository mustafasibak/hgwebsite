import MenuEmbed from '@/components/MenuEmbed'
import MenuPhoto from '@/components/MenuPhoto'
import { site } from '@/lib/site'

export const metadata = {
  title: 'Speisekarte – HHanse Grill Hamburg Bergedorf',
  description: 'Grillgerichte, Burger, Schnitzel, Croques, Pasta und mehr – alles Halal, täglich frisch.',
}

export default function MenuPage() {
  return (
    <div className="container" style={{ padding: '32px 20px 48px', maxWidth: 1120 }}>
      <MenuEmbed />

      <div style={{ marginTop: 36, textAlign: 'center' }}>
        <a
          href={`tel:${site.phoneRaw}`}
          className="btn btn-primary"
          style={{ fontSize: '1.05rem', padding: '12px 28px' }}
        >
          Vorbestellen zum Abholen
        </a>
      </div>

      <div style={{ marginTop: 36 }}>
        <div className="section-title">Original-Speisekarte</div>
        <MenuPhoto />
      </div>

      <p style={{
        marginTop: 16, fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.7,
      }}>
        Alle Preise sind unverbindlich. Es gelten die Preise in der Karte vor Ort.
        Allergenkennzeichnung auf Anfrage. Abbildungen der Speisen sind Dekoration.
      </p>
    </div>
  )
}
