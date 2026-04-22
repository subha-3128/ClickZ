# ClickZ Link Manager (React + Supabase)

A responsive link manager app with:

- Google login/logout using Supabase Auth
- Per-user links stored in Supabase Postgres
- Optional logo upload to Supabase Storage
- Copy link on card click
- Loading skeleton state and empty state

## 1. Prerequisites

- Node.js 22+ (LTS recommended)
- A Supabase account
- A Google Cloud project for OAuth credentials

## 2. Create Supabase Project

1. Go to Supabase and create a new project.
2. Open Project Settings -> API.
3. Copy:
- Project URL
- Publishable anon key

## 3. Configure Environment Variables

1. Copy `.env.example` to `.env`.
2. Fill in real values:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 4. Setup Database + RLS + Storage

1. Open Supabase SQL Editor.
2. Run the SQL in `supabase/schema.sql`.

This creates:

- `public.links` table
- RLS policies for select/insert/update/delete limited to each user
- `link-logos` storage bucket
- Storage policies for upload/update/delete by owner + public read

## 5. Enable Google Auth Provider

1. In Supabase Dashboard, go to Authentication -> Providers -> Google.
2. Enable Google provider.
3. Create OAuth credentials in Google Cloud Console:
- Create OAuth client ID (Web application)
- Add authorized redirect URI:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

4. Copy Google Client ID and Client Secret into Supabase Google provider fields.
5. Save provider settings.

## 6. Configure Redirect URLs in Supabase

In Supabase Dashboard:

1. Go to Authentication -> URL Configuration.
2. Set Site URL:

```text
http://localhost:5173
```

3. Add additional redirect URLs (for local + production):

```text
http://localhost:5173
https://your-production-domain.com
```

## 7. Install and Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## 8. Available Scripts

- `npm run dev` - start dev server
- `npm run lint` - run ESLint
- `npm run build` - production build
- `npm run preview` - preview production build

## 9. Project Files

- `src/App.jsx` - UI, auth flow, links list, modal, skeleton, clipboard copy
- `src/lib/supabase.js` - Supabase client setup
- `supabase/schema.sql` - table schema + RLS + storage policies
- `.env.example` - required frontend environment variables

## 10. Notes

- Session is persisted by Supabase auth client.
- If user is not logged in, app shows the Google login screen.
- If user is logged in, app shows links dashboard.
- Logout returns user to login screen.
- On click/tap of a link card, app copies the link and shows "Link copied" toast.
