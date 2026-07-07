import type { Access } from 'payload'

/** Logged-in Payload admin users can manage menu content. */
export const adminOnly: Access = ({ req: { user } }) => Boolean(user)
