# Payload CMS – Menu setup

## Local development (Docker Postgres)

```bash
docker compose up -d
```

Link this repo to your Vercel project (one-time):

```bash
npx vercel link
npx vercel env pull .env.local
```

Add to `.env.local` manually if needed:

```
PAYLOAD_SECRET=local-dev-secret-change-me-32chars
USE_PAYLOAD_MENU=false
```

Run dev server:

```bash
npm run dev
```

Run migrations + seed menu + photos:

```bash
node scripts/payload-migrate.mjs
npm run seed:menu
```

Then set `USE_PAYLOAD_MENU=true` in `.env.local` and restart dev to test CMS-driven menu.

## Environment (Vercel + local)

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
|----------|---------|
| `PAYLOAD_PUBLIC_SERVER_URL` | Your live site URL, e.g. `https://hgwebsite-alpha.vercel.app` |
| `PAYLOAD_SECRET` | Random 32+ character secret |
| `DATABASE_URL` or `POSTGRES_URL` | Auto-added by Neon — no manual copy needed |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob for uploaded dish photos |
| `USE_PAYLOAD_MENU` | Set `true` after DB is seeded |

While `USE_PAYLOAD_MENU=false`, `/menu` and `/kiosk` use the static menu in `lib/menu-data.ts`.

## First-time setup

1. Create **Vercel Postgres** and **Vercel Blob** on the project.
2. Add env vars in Vercel (and locally in `.env.local`).
3. Deploy once (or run locally with Postgres).
4. Seed the menu:
   ```bash
   npm run seed:menu
   ```
5. Open `/admin` and create the owner account (first visit — email + password).
6. Set `USE_PAYLOAD_MENU=true` and redeploy.

## Owner usage

- Admin: `/admin`
- **Speisekarte → Kategorien** – tab order, icons
- **Speisekarte → Gerichte** – add/edit dishes, prices, photos, allergen tags
- Changes appear on `/menu` and `/kiosk` within about a minute (ISR + revalidation)

## Rollback

Set `USE_PAYLOAD_MENU=false` to revert to the static menu without removing Payload.
