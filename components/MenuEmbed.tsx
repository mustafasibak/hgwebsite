'use client'
import { useState, useRef } from 'react'
import { menuCategories, type MenuItem } from '@/lib/menu-data'
import { site } from '@/lib/site'

type MenuEmbedProps = {
  showSearch?: boolean
  showAllCategories?: boolean
}

type CartLine = { id: string; name: string; price: number; qty: number }

const fmt = (n: number) => n.toFixed(2).replace('.', ',') + ' €'

export default function MenuEmbed({ showSearch = true, showAllCategories = false }: MenuEmbedProps) {
  const [active, setActive] = useState(0)
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartLine[]>([])
  const [flash, setFlash] = useState<string | null>(null)
  const [open, setOpen] = useState(false) // mobile bottom-sheet
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const filtered = search.trim()
    ? menuCategories.map(cat => ({
        ...cat,
        items: cat.items.filter(i =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          (i.desc || '').toLowerCase().includes(search.toLowerCase())
        )
      })).filter(cat => cat.items.length > 0)
    : showAllCategories
      ? menuCategories
      : [menuCategories[active]]

  function addItem(item: MenuItem) {
    setCart(prev => {
      const found = prev.find(l => l.id === item.id)
      if (found) {
        return prev.map(l => l.id === item.id ? { ...l, qty: l.qty + 1 } : l)
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }]
    })
    setFlash(item.id)
    if (flashTimer.current) clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setFlash(null), 600)
  }

  function changeQty(id: string, delta: number) {
    setCart(prev =>
      prev
        .map(l => l.id === id ? { ...l, qty: l.qty + delta } : l)
        .filter(l => l.qty > 0)
    )
  }

  function removeItem(id: string) {
    setCart(prev => prev.filter(l => l.id !== id))
  }

  const count = cart.reduce((s, l) => s + l.qty, 0)
  const total = cart.reduce((s, l) => s + l.qty * l.price, 0)
  const empty = cart.length === 0

  return (
    <div className="menu-layout">
      <div className="menu-main">
        {showSearch && (
          <div style={{ maxWidth: 400, margin: '0 auto 20px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Gericht suchen..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8, color: 'var(--text)', fontSize: 15,
                outline: 'none', fontFamily: 'system-ui',
              }}
            />
          </div>
        )}

        <p style={{
          textAlign: 'center', fontSize: 13, color: 'var(--muted)',
          marginBottom: 6, fontStyle: 'italic',
        }}>
          Tippen Sie auf ein Gericht, um es zu Ihrer Bestellung hinzuzufügen.
        </p>
        <p style={{
          textAlign: 'center', fontSize: 11.5, color: 'var(--muted)',
          marginBottom: 24,
        }}>
          Alle Preise inkl. MwSt. · Halal-zertifiziert
        </p>

        {!search.trim() && !showAllCategories && (
          <div style={{
            overflowX: 'auto',
            marginBottom: 28,
            borderBottom: '1px solid var(--border)',
            paddingBottom: 12,
          }}>
            <div style={{
              display: 'flex', gap: 6, flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              {menuCategories.map((cat, i) => (
                <button key={cat.name} onClick={() => setActive(i)} style={{
                  padding: '8px 16px', borderRadius: 6, whiteSpace: 'nowrap',
                  background: active === i ? 'var(--accent)' : 'var(--surface)',
                  border: `1px solid ${active === i ? 'var(--accent)' : 'var(--border)'}`,
                  color: active === i ? '#fff' : 'var(--muted)',
                  fontWeight: 600, fontSize: 13,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          {filtered.map(cat => (
            <div key={cat.name} style={{ marginBottom: (search || showAllCategories) ? 40 : 0 }}>
              {(search || showAllCategories) && (
                <h3 style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 22, fontWeight: 700,
                  color: 'var(--accent-dark)',
                  marginBottom: 16,
                  paddingBottom: 8,
                  borderBottom: '2px solid var(--border)',
                }}>
                  {cat.icon} {cat.name}
                </h3>
              )}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 10,
              }}>
                {cat.items.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    className="menu-item"
                    data-flash={flash === item.id}
                    onClick={() => addItem(item)}
                    aria-label={`${item.name} hinzufügen`}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>
                          #{item.id}
                        </span>
                        {item.badge && (
                          <span style={{
                            background: 'var(--accent)',
                            color: '#fff',
                            fontSize: 10, fontWeight: 700,
                            padding: '2px 8px', borderRadius: 4,
                          }}>{item.badge}</span>
                        )}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', marginTop: 4 }}>
                        {item.name}
                      </div>
                      {item.desc && (
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>
                          {item.desc}
                        </div>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                          {item.tags.map(tag => (
                            <span key={tag} style={{
                              background: 'var(--surface2)',
                              color: 'var(--muted)',
                              fontSize: 10, padding: '2px 6px', borderRadius: 4,
                            }}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'flex-end', gap: 8, flexShrink: 0,
                    }}>
                      <span style={{
                        fontSize: 16, fontWeight: 700,
                        color: 'var(--accent-dark)', whiteSpace: 'nowrap',
                      }}>
                        {fmt(item.price)}
                      </span>
                      <span className="menu-item-plus" aria-hidden="true">+</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {search && filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 24px' }}>
              Kein Gericht gefunden für &quot;{search}&quot;
            </div>
          )}
        </div>
      </div>

      {/* Bestellübersicht */}
      <aside className="menu-cart" data-empty={empty} data-open={open}>
        <div className="menu-cart-inner">
          <button
            type="button"
            className="menu-cart-bar"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
          >
            <span>🛒 {count} {count === 1 ? 'Artikel' : 'Artikel'} · {fmt(total)}</span>
            <span aria-hidden="true">{open ? '▾' : '▴'}</span>
          </button>

          <div className="menu-cart-body">
            <div style={{
              background: 'var(--accent)', color: '#fff',
              padding: '12px 16px', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center',
            }}>
              <strong style={{ fontSize: '0.95rem', letterSpacing: '0.03em' }}>
                Ihre Bestellung
              </strong>
              {!empty && (
                <button
                  type="button"
                  onClick={() => { setCart([]); setOpen(false) }}
                  style={{
                    background: 'transparent', border: '1px solid rgba(255,255,255,0.5)',
                    color: '#fff', borderRadius: 6, padding: '3px 8px',
                    fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Leeren
                </button>
              )}
            </div>

            {empty ? (
              <p style={{
                padding: '24px 18px', color: 'var(--muted)',
                fontSize: '0.88rem', lineHeight: 1.6, textAlign: 'center',
              }}>
                Noch keine Gerichte ausgewählt.<br />
                Klicken Sie auf ein Gericht, um es hinzuzufügen.
              </p>
            ) : (
              <>
                <div style={{ padding: '6px 0', maxHeight: 360, overflowY: 'auto' }}>
                  {cart.map(line => (
                    <div key={line.id} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 16px',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
                          {line.name}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                          {fmt(line.price)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button type="button" onClick={() => changeQty(line.id, -1)} style={qtyBtn} aria-label="weniger">−</button>
                        <span style={{ minWidth: 18, textAlign: 'center', fontWeight: 700, fontSize: 13 }}>{line.qty}</span>
                        <button type="button" onClick={() => changeQty(line.id, +1)} style={qtyBtn} aria-label="mehr">+</button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.id)}
                        style={{
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          color: 'var(--muted)', fontSize: 16, lineHeight: 1, padding: 4,
                          fontFamily: 'inherit',
                        }}
                        aria-label="entfernen"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '12px 16px', borderTop: '2px solid var(--border)',
                  fontWeight: 700, fontSize: '1.05rem',
                }}>
                  <span>Summe</span>
                  <span style={{ color: 'var(--accent-dark)' }}>{fmt(total)}</span>
                </div>

                <div style={{ padding: '0 16px 16px', display: 'grid', gap: 8 }}>
                  <a
                    href={`tel:${site.phoneRaw}`}
                    className="btn btn-primary"
                    style={{ textAlign: 'center' }}
                  >
                    📞 Vorbestellen &amp; Abholen
                  </a>
                  <a
                    href={site.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ textAlign: 'center' }}
                  >
                    📍 Vor Ort bestellen
                  </a>
                  <p style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 2, lineHeight: 1.5 }}>
                    Bestellung telefonisch oder vor Ort <br /> 
                    keine Online-Zahlung
                    <br /> 
                    keine Lieferung
                    <br />
                  </p>
                  </div> 
              </>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}

const qtyBtn: React.CSSProperties = {
  width: 24, height: 24, borderRadius: 6,
  border: '1px solid var(--border-dark)',
  background: 'var(--surface)', color: 'var(--text)',
  fontSize: 15, fontWeight: 700, lineHeight: 1,
  cursor: 'pointer', fontFamily: 'inherit',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
