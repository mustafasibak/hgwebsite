import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { LOGO } from '@/lib/site'
import '../globals.css'

export const metadata: Metadata = {
  title: 'HHanse Grill – Halal Grill & Imbiss Hamburg Bergedorf',
  description: 'Halal-zertifizierter Grill-Imbiss in Hamburg Bergedorf. Täglich frisch. Mo–So 11:30–23:00 Uhr. Kurt-A.-Körber-Chaussee 3.',
  icons: { icon: LOGO },
}

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
