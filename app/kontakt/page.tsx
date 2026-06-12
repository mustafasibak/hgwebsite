'use client'
import { useState } from 'react'
import { site } from '@/lib/site'

export default function KontaktPage() {
  const [form, setForm] = useState({ name: '', email: '', tel: '', message: '' })
  const [sent, setSent] = useState(false)

  return (
    <div className="container" style={{ padding: '32px 20px 48px', maxWidth: 560 }}>
      <div className="section-title">Kontakt</div>

      <p style={{
        background: 'var(--surface2)', border: '2px solid var(--border)', borderTop: 'none',
        padding: '10px 16px', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 16,
      }}>
        Bitte beachten: Das Kontaktformular ist <b>nicht für Bestellungen</b> gedacht –
        Bestellungen nehmen wir gern telefonisch entgegen.
      </p>

      {sent ? (
        <div className="info-box" style={{ borderTop: 'none', textAlign: 'center', padding: 32 }}>
          <p style={{ fontWeight: 700, color: 'var(--accent-dark)', fontSize: '1.1rem' }}>Nachricht gesendet</p>
          <p style={{ marginTop: 8, color: 'var(--muted)' }}>Wir melden uns so schnell wie möglich bei Ihnen.</p>
        </div>
      ) : (
        <div className="info-box" style={{ borderTop: 'none' }}>
          {[
            { key: 'name', label: 'Ihr Name', type: 'text', placeholder: 'Max Mustermann' },
            { key: 'email', label: 'E-Mail', type: 'email', placeholder: 'max@email.de' },
            { key: 'tel', label: 'Telefon (optional)', type: 'tel', placeholder: '040 ...' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: '#fff', border: '2px solid var(--border)',
                  fontFamily: 'inherit', fontSize: '0.95rem',
                }}
              />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
              Nachricht
            </label>
            <textarea
              placeholder="Ihre Nachricht..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              rows={5}
              style={{
                width: '100%', padding: '10px 12px',
                background: '#fff', border: '2px solid var(--border)',
                fontFamily: 'inherit', fontSize: '0.95rem', resize: 'vertical',
              }}
            />
          </div>
          <button
            onClick={() => { if (form.name && form.email && form.message) setSent(true) }}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Nachricht senden
          </button>
        </div>
      )}

      <div className="info-box" style={{ marginTop: 16, fontSize: '0.9rem' }}>
        <strong>Lieber direkt anrufen?</strong>
        <a href={`tel:${site.phoneRaw}`} style={{ fontWeight: 700, fontSize: '1.05rem' }}>
          {site.phone}
        </a>
        <p style={{ marginTop: 6, color: 'var(--muted)' }}>{site.email}</p>
      </div>
    </div>
  )
}
