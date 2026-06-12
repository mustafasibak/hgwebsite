import Image from 'next/image'
import { MENU_IMAGE } from '@/lib/site'

export default function MenuPhoto() {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '3px solid var(--border-dark)',
      padding: 12,
    }}>
      <Image
        src={MENU_IMAGE}
        alt="HHanse Grill Speisekarte"
        width={1371}
        height={1962}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        priority
      />
    </div>
  )
}
