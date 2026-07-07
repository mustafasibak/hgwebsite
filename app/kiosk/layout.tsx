import type { Metadata } from 'next'
import { LOGO } from '@/lib/site'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Kiosk – HHanse Grill',
  description: 'Speisekarte zum Durchstöbern im Restaurant.',
  icons: { icon: LOGO },
}

export default function KioskLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <div className="kiosk-shell">{children}</div>
      </body>
    </html>
  )
}
