import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const revalidateMenu: CollectionAfterChangeHook = () => {
  revalidatePath('/menu')
  revalidatePath('/kiosk')
}

export const revalidateMenuDelete: CollectionAfterDeleteHook = () => {
  revalidatePath('/menu')
  revalidatePath('/kiosk')
}
