import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/lib/payload-access'
import { revalidateMenu, revalidateMenuDelete } from '@/payload/hooks/revalidateMenu'

const ALLERGEN_OPTIONS = [
  { label: 'Gluten', value: 'Gluten' },
  { label: 'Milch', value: 'Milch' },
  { label: 'Sahne', value: 'Sahne' },
  { label: 'Ei', value: 'Ei' },
  { label: 'Senf', value: 'Senf' },
  { label: 'Sesam', value: 'Sesam' },
  { label: 'Fisch', value: 'Fisch' },
  { label: 'Sellerie', value: 'Sellerie' },
]

export const MenuItems: CollectionConfig = {
  slug: 'menu-items',
  labels: {
    singular: 'Gericht',
    plural: 'Gerichte',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['itemNumber', 'name', 'category', 'price', 'published'],
    listSearchableFields: ['itemNumber', 'name', 'description'],
    group: 'Speisekarte',
    description:
      'Gerichte als Fotokarten – auf ein Bild tippen zum Foto ändern, auf den Namen zum Bearbeiten.',
    components: {
      views: {
        list: {
          Component: '@/components/payload/MenuItemsPhotoList',
        },
      },
    },
  },
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  defaultSort: 'itemNumber',
  hooks: {
    afterChange: [revalidateMenu],
    afterDelete: [revalidateMenuDelete],
  },
  fields: [
    {
      name: 'itemNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Artikel-Nr.',
      admin: {
        description: 'Nummer auf der gedruckten Karte, z. B. 51 oder 314',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'menu-categories',
      required: true,
      label: 'Kategorie',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name (DE)',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschreibung (DE)',
    },
    {
      name: 'nameEn',
      type: 'text',
      label: 'Name (EN)',
    },
    {
      name: 'descriptionEn',
      type: 'textarea',
      label: 'Beschreibung (EN)',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Preis (€)',
      min: 0,
    },
    {
      name: 'priceTbd',
      type: 'checkbox',
      defaultValue: false,
      label: 'Preis folgt',
    },
    {
      name: 'badge',
      type: 'text',
      label: 'Badge',
      admin: {
        description: 'z. B. Veggie',
      },
    },
    {
      name: 'allergenTags',
      type: 'select',
      hasMany: true,
      label: 'Allergene (Zusatz)',
      options: ALLERGEN_OPTIONS,
      admin: {
        description: 'Zusätzlich zu automatischen Regeln auf der Website',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto',
      admin: {
        description:
          'Nach dem Hochladen unten auf Speichern klicken. Erscheint auf Speisekarte/Kiosk (sofern „Bild anzeigen“ aktiv ist).',
      },
    },
    {
      name: 'imageAlt',
      type: 'text',
      label: 'Foto Alt-Text',
    },
    {
      name: 'showImage',
      type: 'checkbox',
      label: 'Bild anzeigen',
      defaultValue: true,
      admin: {
        description: 'Deaktivieren für kompakte/text-only Karten',
      },
    },
    {
      name: 'compactCard',
      type: 'checkbox',
      defaultValue: false,
      label: 'Kompakte Karte',
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      label: 'Veröffentlicht',
      admin: {
        description: 'Ja = Gericht erscheint auf Speisekarte und Kiosk. Nein = ausgeblendet.',
      },
    },
  ],
}
