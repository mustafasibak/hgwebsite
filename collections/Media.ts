import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/lib/payload-access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Medien',
    plural: 'Medien',
  },
  admin: {
    hidden: true,
    group: 'Speisekarte',
    description: 'Fotos werden meist direkt beim Gericht hochgeladen. Diese Sammlung ist nur für Uploads im Hintergrund sichtbar.',
  },
  access: {
    read: () => true,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt-Text',
    },
  ],
  upload: true,
}
