import MenuEmbed from '@/components/MenuEmbed'
import KioskHeader from '@/components/KioskHeader'
import { MenuLocaleProvider } from '@/components/MenuLocaleContext'
import { getMenu } from '@/lib/menu-api'

export const metadata = {
  title: 'Speisekarte – Kiosk | HHanse Grill',
  description: 'Speisekarte zum Durchstöbern im Restaurant. Bestellung nur an der Kasse.',
}

/** CMS-driven menu — always read fresh data after admin edits */
export const revalidate = 0

export default async function KioskPage() {
  const menuCategories = await getMenu()

  return (
    <MenuLocaleProvider>
      <KioskHeader />
      <div className="kiosk-menu">
        <MenuEmbed mode="kiosk" menuCategories={menuCategories} />
      </div>
    </MenuLocaleProvider>
  )
}
