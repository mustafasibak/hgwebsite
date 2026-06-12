import Image from 'next/image'
import Link from 'next/link'
import { LOGO } from '@/lib/site'

type LogoProps = {
  height?: number
  link?: boolean
}

export default function Logo({ height = 72, link = true }: LogoProps) {
  const img = (
    <Image
      src={LOGO}
      alt="HHanse Grill Logo"
      width={Math.round(height * 0.85)}
      height={height}
      style={{ height, width: 'auto' }}
      priority
    />
  )

  if (!link) return img

  return (
    <Link href="/" style={{ display: 'inline-block', lineHeight: 0 }}>
      {img}
    </Link>
  )
}
