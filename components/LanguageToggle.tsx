'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { Locale } from '@/lib/menu-i18n'

const OPTIONS: { id: Locale; label: string; code: string }[] = [
  { id: 'de', label: 'Deutsch', code: 'DE' },
  { id: 'en', label: 'English', code: 'EN' },
  { id: 'ar', label: 'العربية', code: 'ع' },
]

type LanguageToggleProps = {
  locale: Locale
  onChange: (locale: Locale) => void
}

export default function LanguageToggle({ locale, onChange }: LanguageToggleProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const current = OPTIONS.find(o => o.id === locale) ?? OPTIONS[0]

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('touchstart', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('touchstart', close)
    }
  }, [open])

  return (
    <div className="lang-picker" ref={rootRef}>
      <button
        type="button"
        className="lang-picker-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen(o => !o)}
      >
        <span className="lang-picker-code">{current.code}</span>
        <span className="lang-picker-caret" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <ul id={listId} className="lang-picker-menu" role="listbox">
          {OPTIONS.map(option => (
            <li key={option.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={locale === option.id}
                className={`lang-picker-option${locale === option.id ? ' lang-picker-option--active' : ''}`}
                onClick={() => {
                  onChange(option.id)
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
