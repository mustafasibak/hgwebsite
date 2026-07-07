import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/lib/payload-access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Benutzer',
    plural: 'Benutzer',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Einstellungen',
    description: 'Weitere Admin-Zugänge für Mitarbeiter anlegen.',
  },
  auth: true,
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
    admin: ({ req: { user } }) => Boolean(user),
  },
  fields: [],
}
