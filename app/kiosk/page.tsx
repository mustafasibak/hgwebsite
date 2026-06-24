import MenuEmbed from '@/components/MenuEmbed'
import KioskHeader from '@/components/KioskHeader'
import { MenuLocaleProvider } from '@/components/MenuLocaleContext'

export const metadata = {
  title: 'Speisekarte – Kiosk | HHanse Grill',
  description: 'Speisekarte zum Durchstöbern im Restaurant. Bestellung nur an der Kasse.',
}

export default function KioskPage() {
  return (
    <MenuLocaleProvider>
      <KioskHeader />
      <div className="kiosk-menu">
        <MenuEmbed mode="kiosk" />
      </div>
    </MenuLocaleProvider>
  )
}
