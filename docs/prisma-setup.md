# Prisma 7 + Accelerate + Migrations (direct DB)

## URLs
- `DATABASE_URL` (prisma+postgres://...): Data Proxy / Accelerate URL used at **runtime** by the PrismaClient (`src/shared/infra/database/prismaClient.ts`) via `prisma.config.ts`.
- `DIRECT_DATABASE_URL` (postgres://...): **Direct Postgres** URL used only for CLI migrations. Data Proxy does not support `prisma migrate dev`.

## Env files
- `.env` (local, not committed): set real `DATABASE_URL` and `DIRECT_DATABASE_URL`.
- `.env.example`: placeholders for both URLs + `PORT`.

## Commands (package.json)
- First migration: `npm run prisma:migrate:init`
- Next schema changes: `npm run prisma:migrate`
- Regenerate client (if needed): `npm run prisma:generate`

Scripts load `.env` in the shell and then override `DATABASE_URL` with `DIRECT_DATABASE_URL` before running `prisma migrate dev`. Prisma 7 does not support `--url` for migrate dev.

## Prisma config (prisma.config.ts)
- Reads `DATABASE_URL` for the datasource (runtime).
- No URL inside `schema.prisma` (only generator + datasource + models).

## Notes / gotchas
- Data Proxy cannot run `prisma migrate dev`; always use the direct URL for migrations (via env override).
- After changing the schema, run migrate with the direct URL, then regenerate the client if needed.
- Keep `DATABASE_URL` pointing to the Data Proxy for the application runtime; do not swap it with the direct URL in your app env.
