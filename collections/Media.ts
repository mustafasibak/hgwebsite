import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/lib/payload-access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Medien',
    plural: 'Medien',
  },
  admin: {
    group: 'Speisekarte',
    description: 'Fotos werden meist direkt beim Gericht hochgeladen. Hier alle Medien verwalten.',
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
