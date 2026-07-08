'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import Image from 'next/image'
import type { MenuCategory, MenuItem } from '@/lib/menu-data'
import { getItemImage, itemHasPhoto } from '@/lib/menu-images'
import { getCutoutPhotoStyle, isCutoutPhoto } from '@/lib/menu-item-photos'
import {
  VEGGIE_TAB,
  NACHTISCH_TAB,
  getMenuTabOrder,
  categoryLabel,
  formatItemPrice,
  isNachtischTab,
  isVeggieItem,
  sortVeggieEntries,
  itemAltText,
  itemLabel,
  t,
  translateTag,
  type MenuTab,
} from '@/lib/menu-i18n'
import { resolveItemAllergens, saladHasDressingNote } from '@/lib/allergen-info'
import { formatAdditiveCodes, resolveItemAdditiveCodes } from '@/lib/additive-info'
import MenuAdditiveLegend from '@/components/MenuAdditiveLegend'
import { useMenuLocale } from '@/components/MenuLocaleContext'
import { site } from '@/lib/site'

type MenuMode = 'website' | 'kiosk'

function cutoutFrameStyle(src: string, itemId?: string): React.CSSProperties | undefined {
  if (!isCutoutPhoto(src)) return undefined
  const { scale, shiftX, shiftY } = getCutoutPhotoStyle(src, itemId)
  return {
    '--cutout-scale': scale,
    '--cutout-shift-x': shiftX,
    '--cutout-shift-y': shiftY,
  } as React.CSSProperties
}

type MenuEmbedProps = {
  menuCategories: MenuCategory[]
  mode?: MenuMode
  showSearch?: boolean
  showAllCategories?: boolean
}

type CartLine = { id: string; name: string; price: number; qty: number }
type DetailSelection = { item: MenuItem; cat: MenuCategory }
type DisplayEntry = { item: MenuItem; cat: MenuCategory }

const fmt = (n: number) => n.toFixed(2).replace('.', ',') + ' €'

function normalizeIdQuery(q: string): string | null {
  const stripped = q.replace(/^#/, '').trim()
  if (!/^\d+$/.test(stripped)) return null
  return String(parseInt(stripped, 10))
}

function itemMatchesSearch(item: MenuItem, q: string, locale: 'de' | 'en'): boolean {
  const idNorm = normalizeIdQuery(q)
  if (idNorm && item.id === idNorm) return true

  const { name, desc } = itemLabel(item, locale)
  return name.toLowerCase().includes(q) ||
    (desc || '').toLowerCase().includes(q) ||
    item.name.toLowerCase().includes(q) ||
    (item.desc || '').toLowerCase().includes(q)
}

function displayPrice(item: MenuItem, locale: 'de' | 'en'): string {
  const tbd = formatItemPrice(item, locale)
  if (tbd) return tbd
  return fmt(item.price)
}

export default function MenuEmbed({
  menuCategories,
  mode = 'website',
  showSearch = true,
  showAllCategories = false,
}: MenuEmbedProps) {
  const isKiosk = mode === 'kiosk'
  const { locale } = useMenuLocale()
  const tabOrder = useMemo(() => getMenuTabOrder(menuCategories), [menuCategories])
  const [activeTab, setActiveTab] = useState<MenuTab>(() => menuCategories[0]?.slug ?? tabOrder[0])
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartLine[]>([])
  const [flash, setFlash] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<DetailSelection | null>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const veggieEntries = useMemo<DisplayEntry[]>(() => {
    const seen = new Set<string>()
    const entries: DisplayEntry[] = []
    for (const cat of menuCategories) {
      for (const item of cat.items) {
        if (isVeggieItem(item) && !seen.has(item.id)) {
          seen.add(item.id)
          entries.push({ item, cat })
        }
      }
    }
    return sortVeggieEntries(entries)
  }, [menuCategories])

  useEffect(() => {
    if (!detail) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [detail])

  const displayGroups = useMemo(() => {
    const q = search.trim().toLowerCase()

    if (q) {
      return menuCategories
        .map(cat => ({
          heading: categoryLabel(cat.name, locale),
          items: cat.items
            .filter(i => itemMatchesSearch(i, q, locale))
            .map(item => ({ item, cat })),
        }))
        .filter(g => g.items.length > 0)
    }

    if (showAllCategories) {
      return menuCategories.map(cat => ({
        heading: categoryLabel(cat.name, locale),
        items: cat.items.map(item => ({ item, cat })),
      }))
    }

    if (activeTab === VEGGIE_TAB) {
      return [{
        heading: categoryLabel('Veggie', locale),
        items: veggieEntries,
      }]
    }

    if (activeTab === NACHTISCH_TAB) {
      return []
    }

    if (activeTab === 'nachtisch') {
      const cat = menuCategories.find(c => c.slug === 'nachtisch')
      if (!cat) return []
      return [{
        heading: undefined,
        items: cat.items.map(item => ({ item, cat })),
      }]
    }

    const cat = menuCategories.find(c => c.slug === activeTab)
    if (!cat) return []
    return [{
      heading: undefined,
      items: cat.items.map(item => ({ item, cat })),
    }]
  }, [search, showAllCategories, activeTab, locale, veggieEntries, menuCategories])

  function addItem(item: MenuItem) {
    if (item.priceTbd) return
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

  function altFor(item: MenuItem, cat: MenuCategory) {
    if (locale === 'en') return itemAltText(item, locale)
    return item.imageAlt || (item.desc ? `${item.name} – ${item.desc}` : item.name)
  }

  return (
    <div className={`menu-layout${isKiosk ? ' menu-layout--kiosk' : ''}`}>
      <div className="menu-main">
        {!isKiosk && (
          <p className="menu-hint menu-hint--order">
            {locale === 'en'
              ? 'Tap a dish for details and to add to your order.'
              : 'Tippen Sie auf ein Gericht für Details und zur Bestellung.'}
          </p>
        )}
        {isKiosk && (
          <p className="menu-hint menu-hint--browse">
            {t(locale, 'browseHint')}
          </p>
        )}
        <p className="menu-hint menu-hint--meta">
          {locale === 'en' ? t(locale, 'metaHint') : 'Alle Preise inkl. MwSt. · Halal-zertifiziert'}
        </p>

        {showSearch && (
          <div className="menu-search menu-search--sticky">
            <input
              type="text"
              placeholder={locale === 'en' ? t(locale, 'searchPlaceholder') : 'Gericht suchen...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="menu-search-input"
            />
          </div>
        )}

        {!search.trim() && !showAllCategories && (
          <div className="menu-category-tabs">
            <div className="menu-category-tabs-inner">
              {tabOrder.map(tab => {
                  if (tab === VEGGIE_TAB) {
                    if (veggieEntries.length === 0) return null
                    return (
                      <button
                        key={tab}
                        type="button"
                        className={`menu-category-tab menu-category-tab--veggie${activeTab === VEGGIE_TAB ? ' menu-category-tab--active' : ''}`}
                        onClick={() => setActiveTab(VEGGIE_TAB)}
                      >
                        {t(locale, 'veggieTab')}
                      </button>
                    )
                  }
                  if (tab === NACHTISCH_TAB || tab === 'nachtisch') {
                    const nachtischCat = menuCategories.find(c => c.slug === 'nachtisch')
                    const label = nachtischCat
                      ? categoryLabel(nachtischCat.name, locale)
                      : t(locale, 'nachtischTab')
                    return (
                      <button
                        key={tab}
                        type="button"
                        className={`menu-category-tab menu-category-tab--nachtisch${isNachtischTab(activeTab) ? ' menu-category-tab--active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {label}
                      </button>
                    )
                  }
                  const cat = menuCategories.find(c => c.slug === tab)
                  if (!cat) return null
                  return (
                    <button
                      key={tab}
                      type="button"
                      className={`menu-category-tab${activeTab === tab ? ' menu-category-tab--active' : ''}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {categoryLabel(cat.name, locale)}
                    </button>
                  )
              })}
            </div>
          </div>
        )}

        <div>
          {isNachtischTab(activeTab) && !search.trim() && !showAllCategories && (
            <NachtischPanel locale={locale} showHardcodedItems={activeTab === NACHTISCH_TAB} />
          )}

          {displayGroups.map(group => (
            <div key={group.heading ?? 'single'} className={group.heading ? 'menu-category-block' : undefined}>
              {group.heading && (
                <h3 className="menu-category-heading">{group.heading}</h3>
              )}
              <div className="menu-item-grid">
                {(() => {
                  const fillMissingInGroup = group.items.some(({ item }) => itemHasPhoto(item))
                  return group.items.map(({ item, cat }) => {
                  const imageOpts = {
                    fillMissingInGroup: fillMissingInGroup && !item.compactCard,
                  }
                  const imageSrc = getItemImage(item, cat, imageOpts)
                  const hasImageArea = imageSrc != null
                  const cutout = imageSrc ? isCutoutPhoto(imageSrc) : false
                  const alt = altFor(item, cat)
                  const label = itemLabel(item, locale)
                  const allergens = resolveItemAllergens(item, cat)
                  const additiveCodes = formatAdditiveCodes(resolveItemAdditiveCodes(item))
                  const dressingNote = saladHasDressingNote(item, cat)
                  return (
                    <button
                      key={`${cat.slug}-${item.id}`}
                      type="button"
                      className={`menu-item${hasImageArea ? ' menu-item--with-image' : ''}${item.compactCard ? ' menu-item--compact' : ''}`}
                      data-flash={!isKiosk && flash === item.id}
                      onClick={() => setDetail({ item, cat })}
                      aria-label={`${alt} – ${locale === 'en' ? t(locale, 'detailsLabel') : 'Details anzeigen'}`}
                    >
                      {hasImageArea && (
                        <div
                          className={`menu-item-image${cutout ? ' menu-item-image--cutout' : ''}`}
                          style={cutout ? cutoutFrameStyle(imageSrc!, item.id) : undefined}
                        >
                          <Image
                            key={imageSrc}
                            src={imageSrc!}
                            alt={alt}
                            width={400}
                            height={300}
                            sizes="(max-width: 600px) 100vw, 280px"
                          />
                        </div>
                      )}
                      <div className="menu-item-body">
                        <div className="menu-item-meta">
                          <span className="menu-item-id">#{item.id}</span>
                          {item.badge && <span className="menu-item-badge">{item.badge}</span>}
                        </div>
                        <div className="menu-item-name">{label.name}</div>
                        {label.desc && (
                          <div className="menu-item-desc">{label.desc}</div>
                        )}
                        {allergens.length > 0 && (
                          <div className="menu-item-tags">
                            {allergens.map(tag => (
                              <span key={tag} className="menu-item-tag">
                                {translateTag(tag, locale)}
                              </span>
                            ))}
                          </div>
                        )}
                        {dressingNote && (
                          <p className="menu-item-note">{t(locale, 'dressingNote')}</p>
                        )}
                        {additiveCodes && (
                          <p className="menu-item-additives">
                            {t(locale, 'additivesLabel')}: {additiveCodes}
                          </p>
                        )}
                        <div className="menu-item-footer">
                          <span className={`menu-item-price${item.priceTbd ? ' menu-item-price--tbd' : ''}`}>
                            {displayPrice(item, locale)}
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })
                })()}
              </div>
            </div>
          ))}

          {search && displayGroups.length === 0 && !isNachtischTab(activeTab) && (
            <div className="menu-empty-search">
              {locale === 'en' ? t(locale, 'emptySearch') : 'Kein Gericht gefunden für'} &quot;{search}&quot;
            </div>
          )}
        </div>

        <MenuAdditiveLegend locale={locale} />
        <p className="menu-hint menu-hint--meta menu-hint--footer">
          {t(locale, 'footerPriceNote')}
        </p>
        <p className="menu-hint menu-hint--meta menu-hint--footer">
          {t(locale, 'footerImageNote')}
        </p>
      </div>

      {!isKiosk && (
        <aside className="menu-cart" data-empty={empty} data-open={open}>
          <div className="menu-cart-inner">
            <button
              type="button"
              className="menu-cart-bar"
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
            >
              <span>{count} {count === 1 ? 'Artikel' : 'Artikel'} · {fmt(total)}</span>
              <span aria-hidden="true">{open ? '▾' : '▴'}</span>
            </button>

            <div className="menu-cart-body">
              <div className="menu-cart-header">
                <strong>Ihre Bestellung</strong>
                {!empty && (
                  <button
                    type="button"
                    className="menu-cart-clear"
                    onClick={() => { setCart([]); setOpen(false) }}
                  >
                    Leeren
                  </button>
                )}
              </div>

              {empty ? (
                <p className="menu-cart-empty">
                  Noch keine Gerichte ausgewählt.<br />
                  Tippen Sie auf ein Gericht, um es hinzuzufügen.
                </p>
              ) : (
                <>
                  <div className="menu-cart-lines">
                    {cart.map(line => (
                      <div key={line.id} className="menu-cart-line">
                        <div className="menu-cart-line-info">
                          <div className="menu-cart-line-name">{line.name}</div>
                          <div className="menu-cart-line-price">{fmt(line.price)}</div>
                        </div>
                        <div className="menu-cart-line-qty">
                          <button type="button" onClick={() => changeQty(line.id, -1)} style={qtyBtn} aria-label="weniger">−</button>
                          <span>{line.qty}</span>
                          <button type="button" onClick={() => changeQty(line.id, +1)} style={qtyBtn} aria-label="mehr">+</button>
                        </div>
                        <button
                          type="button"
                          className="menu-cart-line-remove"
                          onClick={() => removeItem(line.id)}
                          aria-label="entfernen"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="menu-cart-total">
                    <span>Summe</span>
                    <span>{fmt(total)}</span>
                  </div>

                  <div className="menu-cart-actions">
                    <a href={`tel:${site.phoneRaw}`} className="btn btn-primary">
                      Vorbestellen &amp; Abholen
                    </a>
                    <a
                      href={site.maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      Vor Ort bestellen
                    </a>
                    <p className="menu-cart-disclaimer">
                      Bestellung telefonisch oder vor Ort · keine Online-Zahlung · keine Lieferung
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      )}

      {detail && (
        <ItemDetailModal
          item={detail.item}
          cat={detail.cat}
          isKiosk={isKiosk}
          locale={locale}
          onClose={() => setDetail(null)}
          onAdd={isKiosk ? undefined : () => {
            addItem(detail.item)
            setDetail(null)
            setOpen(true)
          }}
        />
      )}
    </div>
  )
}

function ItemDetailModal({
  item,
  cat,
  isKiosk,
  locale,
  onClose,
  onAdd,
}: {
  item: MenuItem
  cat: MenuCategory
  isKiosk: boolean
  locale: 'de' | 'en'
  onClose: () => void
  onAdd?: () => void
}) {
  const imageSrc = getItemImage(item, cat)
  const cutout = imageSrc ? isCutoutPhoto(imageSrc) : false
  const label = itemLabel(item, locale)
  const alt = locale === 'en' ? itemAltText(item, locale) : (item.imageAlt || (item.desc ? `${item.name} – ${item.desc}` : item.name))
  const canOrder = !isKiosk && !item.priceTbd
  const allergens = resolveItemAllergens(item, cat)
  const additiveCodes = formatAdditiveCodes(resolveItemAdditiveCodes(item))
  const dressingNote = saladHasDressingNote(item, cat)

  return (
    <div
      className="menu-item-detail-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-detail-title"
      onClick={onClose}
    >
      <div className="menu-item-detail" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="menu-item-detail-close"
          onClick={onClose}
          aria-label={locale === 'en' ? t(locale, 'close') : 'Schließen'}
        >
          ×
        </button>

        {imageSrc && (
          <div
            className={`menu-item-detail-image${cutout ? ' menu-item-detail-image--cutout' : ''}`}
            style={cutout ? cutoutFrameStyle(imageSrc, item.id) : undefined}
          >
            <Image
              src={imageSrc}
              alt={alt}
              width={800}
              height={600}
              priority
              sizes="(max-width: 700px) 100vw, 560px"
            />
          </div>
        )}

        <div className="menu-item-detail-content">
          <div className="menu-item-meta">
            <span className="menu-item-id">#{item.id}</span>
            {item.badge && <span className="menu-item-badge">{item.badge}</span>}
          </div>
          <h2 id="menu-detail-title" className="menu-item-detail-title">{label.name}</h2>
          {label.desc && <p className="menu-item-detail-desc">{label.desc}</p>}
          {allergens.length > 0 && (
            <div className="menu-item-tags">
              <span className="menu-item-tags-label">{t(locale, 'allergensLabel')}:</span>
              {allergens.map(tag => (
                <span key={tag} className="menu-item-tag">
                  {translateTag(tag, locale)}
                </span>
              ))}
            </div>
          )}
          {dressingNote && (
            <p className="menu-item-note">{t(locale, 'dressingNote')}</p>
          )}
          {additiveCodes && (
            <p className="menu-item-additives">
              {t(locale, 'additivesLabel')}: {additiveCodes}
            </p>
          )}
          <p className={`menu-item-detail-price${item.priceTbd ? ' menu-item-price--tbd' : ''}`}>
            {displayPrice(item, locale)}
          </p>
          {isKiosk ? (
            <>
              <p className="menu-item-detail-kiosk-notice">
                {t(locale, 'kioskDetailNotice')}
              </p>
              <button type="button" className="btn btn-secondary menu-item-detail-add" onClick={onClose}>
                {t(locale, 'close')}
              </button>
            </>
          ) : canOrder ? (
            <button type="button" className="btn btn-primary menu-item-detail-add" onClick={onAdd}>
              {locale === 'en' ? 'Add to order' : 'Zur Bestellung hinzufügen'}
            </button>
          ) : (
            <p className="menu-item-detail-kiosk-notice">
              {locale === 'en' ? 'Price not yet set – please ask at the counter.' : 'Preis noch nicht hinterlegt – bitte an der Kasse erfragen.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const NACHTISCH_ITEMS = [
  {
    id: 'rote-gruetze',
    nameDe: 'Rote Grütze mit Vanillensauce',
    nameEn: 'Red berry compote with vanilla sauce',
    image: '/essen/rotegruetzemitvanillensauce-removebg-preview.png',
  },
] as const

function NachtischPanel({
  locale,
  showHardcodedItems = true,
}: {
  locale: 'de' | 'en'
  showHardcodedItems?: boolean
}) {
  return (
    <div className="menu-nachtisch-panel">
      <div className="menu-nachtisch-window">
        <p className="menu-nachtisch-lead">{t(locale, 'nachtischLead')}</p>
        <p className="menu-nachtisch-hint">{t(locale, 'nachtischHint')}</p>
      </div>

      {showHardcodedItems && (
        <div className="menu-nachtisch-grid">
          {NACHTISCH_ITEMS.map(item => {
            const name = locale === 'de' ? item.nameDe : item.nameEn
            return (
              <article key={item.id} className="menu-nachtisch-card">
                <div
                  className="menu-nachtisch-card-image menu-item-image menu-item-image--cutout"
                  style={cutoutFrameStyle(item.image, item.id)}
                >
                  <Image
                    src={item.image}
                    alt={name}
                    width={320}
                    height={240}
                    sizes="(max-width: 600px) 45vw, 200px"
                  />
                </div>
                <p className="menu-nachtisch-card-name">{name}</p>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

const qtyBtn: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 6,
  border: '1px solid var(--border-dark)',
  background: 'var(--surface)', color: 'var(--text)',
  fontSize: 15, fontWeight: 700, lineHeight: 1,
  cursor: 'pointer', fontFamily: 'inherit',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  minWidth: 28, minHeight: 28,
}
