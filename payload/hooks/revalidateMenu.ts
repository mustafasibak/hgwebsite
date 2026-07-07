import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

function revalidateMenuPaths() {
  if (process.env.PAYLOAD_SEEDING === 'true') return

  try {
    revalidatePath('/menu')
    revalidatePath('/kiosk')
  } catch {
    // revalidatePath only works inside Next.js — skip during CLI seed/migrate.
  }
}

export const revalidateMenu: CollectionAfterChangeHook = () => {
  revalidateMenuPaths()
}

export const revalidateMenuDelete: CollectionAfterDeleteHook = () => {
  revalidateMenuPaths()
}
