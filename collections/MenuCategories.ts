import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/lib/payload-access'
import { revalidateMenu, revalidateMenuDelete } from '@/payload/hooks/revalidateMenu'

export const MenuCategories: CollectionConfig = {
  slug: 'menu-categories',
  labels: {
    singular: 'Kategorie',
    plural: 'Kategorien',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'sortOrder'],
    group: 'Speisekarte',
    description:
      'Kategorie anklicken zum Bearbeiten. Reihenfolge steuert die Tab-Reihenfolge auf der Speisekarte.',
  },
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  defaultSort: 'sortOrder',
  hooks: {
    afterChange: [revalidateMenu],
    afterDelete: [revalidateMenuDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name (DE)',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL-Kennung, z. B. klassiker, grillgerichte',
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon',
      admin: {
        description: 'Emoji für Tabs, z. B. 🥩',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Reihenfolge',
    },
    {
      name: 'showImage',
      type: 'checkbox',
      defaultValue: true,
      label: 'Bilder anzeigen',
    },
  ],
}
