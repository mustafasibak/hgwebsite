'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { KIOSK_ATTRACT_SLIDE_MS, kioskAttractPhotos } from '@/lib/kiosk-attract'
import { requestKioskReset } from '@/lib/kiosk-session'
import { useKioskAttractIdle } from '@/hooks/useKioskAttractIdle'
import { LOGO, site } from '@/lib/site'

export default function KioskAttractOverlay() {
  const [visible, setVisible] = useState(false)
  const [slide, setSlide] = useState(0)

  const enterAttract = useCallback(() => {
    requestKioskReset()
    setSlide(0)
    setVisible(true)
  }, [])

  const wake = useCallback(() => {
    setVisible(false)
    requestKioskReset()
  }, [])

  useKioskAttractIdle(!visible, enterAttract)

  useEffect(() => {
    if (!visible || kioskAttractPhotos.length < 2) return
    const id = window.setInterval(() => {
      setSlide(prev => (prev + 1) % kioskAttractPhotos.length)
    }, KIOSK_ATTRACT_SLIDE_MS)
    return () => window.clearInterval(id)
  }, [visible])

  if (!visible) return null

  return (
    <button
      type="button"
      className="kiosk-attract"
      onClick={wake}
      aria-label="Speisekarte öffnen"
    >
      <div className="kiosk-attract__slides" aria-hidden>
        {kioskAttractPhotos.map((src, i) => (
          <AttractSlide key={src} active={i === slide} src={src} />
        ))}
        <div className="kiosk-attract__shade" />
      </div>
      <div className="kiosk-attract__content">
        <Image
          src={LOGO}
          alt=""
          width={200}
          height={200}
          className="kiosk-attract__logo"
          priority
        />
        <p className="kiosk-attract__brand">{site.name}</p>
        <p className="kiosk-attract__tagline">{site.tagline}</p>
        <p className="kiosk-attract__cta">Tippen, um die Speisekarte anzusehen</p>
      </div>
    </button>
  )
}

function AttractSlide({ src, active }: { src: string; active: boolean }) {
  return (
    <div className={`kiosk-attract__slide${active ? ' kiosk-attract__slide--active' : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" />
    </div>
  )
}
