# Skolkök — Vercel edition

Private school-kitchen handbook: recipes, editable cooking steps, photo OCR, quantities, profile, backup/restore, and iPhone home-screen metadata.

## Runtime

This branch uses **Next.js on Vercel + Supabase Auth, Postgres and private Storage**. The Sites/Cloudflare deployment remains at its original source commit; do not publish this branch through Sites.

## Connect the dedicated Supabase project

1. Create a Supabase project in an appropriate EU region. Do not use an unrelated app's database.
2. Run `supabase/migrations/202610060001_skolkok.sql` in its SQL Editor.
3. Disable public sign-ups. In Authentication → Users, create the owner account with a password and confirmed email.
4. Add its user UUID to the allowlist using SQL: `insert into public.skolkok_members(user_id) values ('OWNER_USER_UUID');`
5. Set these variables in Vercel for the intended environments and in `.env.local` for local development:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (the project's public/publishable key, never a service-role key)
   - `SKOLKOK_OWNER_EMAIL` (the confirmed owner's email)
6. Redeploy. Sign in and verify a recipe and image can be saved, reloaded and backed up.

No service-role key is required. APIs verify the owner with Supabase Auth; row-level security and the private image bucket additionally restrict access by user UUID and the member allowlist. Missing configuration leaves the app closed with a setup message.

## Local commands

Use Node 22.13+ or Node 24. After setting the environment and applying the migration:

```sh
npm ci
npm run dev
npm run build
npm start
```

Vercel: framework Next.js, root repository root, build `npm run build`, output `.next` (configured in `vercel.json`).

## Move existing data safely

Keep the original app running until migration is verified. In the old app, use **Sao lưu & khôi phục → Xuất sao lưu** to export recipes, school settings and images. In the new app, sign in and restore that file, selecting school settings if desired. Existing recipes are preserved. Retry within the same restore session is idempotent. A fresh import creates new recipe IDs, so do not import a completed backup twice.

The backup format does not include the profile/avatar; set these again in the new app. Compare recipe counts, open several images, verify quantities, and export a fresh backup before switching daily usage. The old home-screen icon opens the old URL; add the Vercel URL as a new Safari home-screen app after validation.

Images upload directly to private Supabase Storage, up to 10 MB each. Recipe metadata in a restore request is capped at 4 MB (images are separate); split unusually large backups before import. No offline editing is provided.

## Status

Source migration is independent of provisioning. A successful Next.js build does not prove the database, storage policies or owner login are provisioned; validate those against the configured Supabase project before production use.
