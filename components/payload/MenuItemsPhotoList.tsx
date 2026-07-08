'use client'

import {
  Gutter,
  ListControls,
  ListHeader,
  PageControls,
  useConfig,
  useListQuery,
  useStepNav,
  useTranslation,
  useWindowInfo,
} from '@payloadcms/ui'
import { getTranslation } from '@payloadcms/translations'
import type { ListViewClientProps } from 'payload'
import { formatAdminURL } from 'payload/shared'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect } from 'react'
import { getStaticItemPhoto } from '@/lib/menu-images'

type PhotoValue = {
  alt?: string
  filename?: string
  url?: string
}

type MenuItemDoc = {
  id: number | string
  itemNumber?: string
  name?: string
  price?: number
  priceTbd?: boolean
  published?: boolean
  photo?: number | PhotoValue | null
  category?: { name?: string } | number | null
}

function payloadPhotoSrc(photo: MenuItemDoc['photo']): string | null {
  if (!photo || typeof photo !== 'object') return null
  const url = photo.url
  if (!url) return null
  if (url.startsWith('http') || url.startsWith('/')) return url
  return null
}

/** Same sources as the public menu: /essen/ default, then CMS upload. */
function resolvePhotoSrc(doc: MenuItemDoc): { src: string | null; source: 'static' | 'cms' | null } {
  if (doc.itemNumber) {
    const staticPhoto = getStaticItemPhoto(doc.itemNumber)
    if (staticPhoto) return { src: staticPhoto, source: 'static' }
  }
  const cms = payloadPhotoSrc(doc.photo)
  if (cms) return { src: cms, source: 'cms' }
  return { src: null, source: null }
}

function categoryName(category: MenuItemDoc['category']): string | null {
  if (!category || typeof category !== 'object') return null
  return category.name ?? null
}

function formatPrice(price?: number, priceTbd?: boolean): string {
  if (priceTbd) return 'Preis folgt'
  if (price == null) return '—'
  return `${price.toFixed(2).replace('.', ',')} €`
}

export default function MenuItemsPhotoList(props: ListViewClientProps) {
  const {
    collectionSlug,
    disableBulkDelete,
    disableBulkEdit,
    hasCreatePermission,
    hasDeletePermission,
    hasTrashPermission,
    newDocumentURL,
    viewType,
    Description,
  } = props

  const { data } = useListQuery()
  const router = useRouter()
  const { setStepNav } = useStepNav()
  const { i18n } = useTranslation()
  const {
    config: {
      routes: { admin: adminRoute },
    },
    getEntityConfig,
  } = useConfig()
  const {
    breakpoints: { s: smallBreak },
  } = useWindowInfo()

  const collectionConfig = getEntityConfig({ collectionSlug })
  const docs = (data?.docs ?? []) as MenuItemDoc[]

  useEffect(() => {
    setStepNav([
      {
        label: getTranslation(collectionConfig.labels?.plural, i18n) || 'Gerichte',
      },
    ])
  }, [collectionConfig.labels?.plural, i18n, setStepNav])

  const editUrl = useCallback(
    (id: number | string) =>
      formatAdminURL({ adminRoute, path: `/collections/${collectionSlug}/${id}` }),
    [adminRoute, collectionSlug],
  )

  const editPhotoUrl = useCallback(
    (id: number | string) => `${editUrl(id)}#field-photo`,
    [editUrl],
  )

  return (
    <div className="menu-items-photo-list">
      <Gutter className="menu-items-photo-list__wrap">
        <ListHeader
          collectionConfig={collectionConfig}
          Description={Description}
          disableBulkDelete={disableBulkDelete}
          disableBulkEdit={disableBulkEdit}
          hasCreatePermission={hasCreatePermission}
          hasDeletePermission={hasDeletePermission}
          hasTrashPermission={hasTrashPermission}
          i18n={i18n}
          isBulkUploadEnabled={false}
          isTrashEnabled={Boolean(collectionConfig.trash)}
          newDocumentURL={newDocumentURL}
          openBulkUpload={() => undefined}
          smallBreak={smallBreak}
          viewType={viewType}
        />

        <ListControls collectionConfig={collectionConfig} collectionSlug={collectionSlug} />

        {docs.length === 0 ? (
          <p className="menu-items-photo-list__empty">Noch keine Gerichte vorhanden.</p>
        ) : (
          <div className="menu-items-photo-list__grid">
            {docs.map(doc => {
              const { src, source } = resolvePhotoSrc(doc)
              const cat = categoryName(doc.category)
              return (
                <article key={doc.id} className="menu-items-photo-list__card">
                  <button
                    type="button"
                    className={`menu-items-photo-list__photo-btn${source === 'static' ? ' menu-items-photo-list__photo-btn--static' : ''}`}
                    onClick={() => router.push(editPhotoUrl(doc.id))}
                    title={
                      source === 'static'
                        ? 'Standardfoto von der Website – tippen zum Ersetzen'
                        : 'Foto bearbeiten oder ersetzen'
                    }
                  >
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt={doc.name || doc.itemNumber || 'Gericht'} />
                    ) : (
                      <span className="menu-items-photo-list__photo-placeholder">
                        Kein Foto
                        <small>Tippen zum Hochladen</small>
                      </span>
                    )}
                  </button>

                  <div className="menu-items-photo-list__body">
                    <div className="menu-items-photo-list__meta">
                      <span className="menu-items-photo-list__number">#{doc.itemNumber}</span>
                      {source === 'static' && (
                        <span className="menu-items-photo-list__badge menu-items-photo-list__badge--static">
                          Standardfoto
                        </span>
                      )}
                      {!doc.published && (
                        <span className="menu-items-photo-list__badge menu-items-photo-list__badge--draft">
                          Entwurf
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="menu-items-photo-list__title"
                      onClick={() => router.push(editUrl(doc.id))}
                    >
                      {doc.name || 'Unbenannt'}
                    </button>
                    {cat && <p className="menu-items-photo-list__category">{cat}</p>}
                    <p className="menu-items-photo-list__price">
                      {formatPrice(doc.price, doc.priceTbd)}
                    </p>
                    <div className="menu-items-photo-list__actions">
                      <button
                        type="button"
                        className="menu-items-photo-list__action"
                        onClick={() => router.push(editPhotoUrl(doc.id))}
                      >
                        Foto
                      </button>
                      <button
                        type="button"
                        className="menu-items-photo-list__action menu-items-photo-list__action--primary"
                        onClick={() => router.push(editUrl(doc.id))}
                      >
                        Bearbeiten
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        <PageControls collectionConfig={collectionConfig} />
      </Gutter>
    </div>
  )
}
