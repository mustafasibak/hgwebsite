import type { Metadata, Viewport } from 'next'
import { LOGO } from '@/lib/site'
import KioskTouchLock from '@/components/KioskTouchLock'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Kiosk – HHanse Grill',
  description: 'Speisekarte zum Durchstöbern im Restaurant.',
  icons: { icon: LOGO },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function KioskLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="kiosk-root">
      <body>
        <KioskTouchLock />
        <div className="kiosk-shell">{children}</div>
      </body>
    </html>
  )
}
