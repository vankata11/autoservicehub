# AutoServiceHub (SoftUni AI Capstone)

Multi-page JS app for creating and tracking car service requests with file uploads.

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://dashing-cannoli-44cb1a.netlify.app)

## Screenshots

### Landing Page
(Add screenshot here later)

### Dashboard
(Add screenshot here later)

### Admin Panel
(Add screenshot here later)

## Tech
- Vite + vanilla JS (no React/Vue, no TypeScript)
- Bootstrap 5 (CDN)
- Supabase: Auth + Postgres DB + Storage

## Pages (7)
- `index.html` – Landing
- `login.html` – Login
- `register.html` – Register
- `dashboard.html` – My requests
- `create-request.html` – Create request + upload up to 5 files
- `request.html` – Request details + download uploaded files (signed URLs)
- `admin.html` – Admin panel: list all requests, change status, delete

## Database schema (4+ tables)
- `profiles`
- `roles`
- `user_roles`
- `service_requests`
- `request_files`

Migrations:
- `supabase/migrations/001_init.sql`
- `supabase/migrations/002_storage_policies.sql`

## Local setup

### 1) Create Supabase project
- Create a new project in Supabase.
- Go to **Settings → API** and copy:
  - Project URL
  - anon key

### 2) Configure env
Copy `.env.example` → `.env` and fill:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### 3) Apply DB migrations
Open Supabase **SQL Editor** and run:
- `supabase/migrations/001_init.sql`

### 4) Configure Storage
1. Create a bucket:
   - Storage → New bucket → name: `request-files`
   - Recommended: **Private** bucket (safer)
2. Run `supabase/migrations/002_storage_policies.sql` in SQL Editor.

### 5) Install & run
```
npm install
npm run dev
```

Open: http://localhost:5173

## Demo accounts
After deploying, create these users via Register:
- demo user: `demo@demo.com` / `demo123`
- admin: `admin@demo.com` / `demo123`

### Make admin user an admin
After `admin@demo.com` registers, get its user_id:
- Supabase → Authentication → Users → copy user id

Then run this SQL (replace `<ADMIN_USER_UUID>`):
```sql
insert into public.user_roles(user_id, role_id)
select '<ADMIN_USER_UUID>'::uuid, r.id
from public.roles r
where r.name='admin'
on conflict (user_id) do update set role_id = excluded.role_id;
```

Log out / log in again. You should see **Admin** in the navbar.

## Deployment (Netlify/Vercel)
- Build command: `npm run build`
- Output directory: `dist`
- Set env vars in the hosting platform (same as .env).

## Security
- RLS is enabled on all tables.
- Storage bucket policies enforce per-user folder access.
- Admin privileges are derived from DB role mapping (`public.is_admin()`).

## Architecture Overview

Project structure:
- `src/pages/` – page scripts (one per HTML page)
- `src/services/` – business logic (Supabase calls)
- `src/components/` – UI components (navbar)
- `src/lib/` – guards + UI helpers

Security:
- Row Level Security (RLS) enabled for all public tables
- Role-based access via `roles` + `user_roles` and `public.is_admin()`
- File access via signed URLs (private bucket)

## Live Demo

Production site:
https://dashing-cannoli-44cb1a.netlify.app

### Netlify Environment Variables

Make sure the following variables are configured in Netlify:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY