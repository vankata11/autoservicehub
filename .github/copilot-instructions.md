# AutoServiceHub - Agent Instructions (SoftUni AI Capstone)

## Project goals
- Multi-page JavaScript app built with Vite, HTML, CSS, Bootstrap (no React/Vue, no TypeScript).
- Supabase backend: Auth, DB, Storage.
- Modular architecture: pages, services, utils/components.
- Security: RLS policies in DB + Storage policies.

## Coding rules
- Keep each page in its own HTML file at project root.
- Each page has an entry module in /src/pages/<page>.js
- Shared code goes in /src/services, /src/lib, /src/components.
- Avoid monolithic files. Prefer small modules with single responsibility.
- Use async/await and handle Supabase errors with try/catch.
- Never put secrets in the repo. Use .env with VITE_SUPABASE_*.

## Data model
- profiles (1:1 with auth.users)
- roles, user_roles (for admin/user roles)
- service_requests (owner_id, status)
- request_files (links to storage paths)

## Access control
- All access control must be enforced by RLS (client-side checks are only UX).
- Admin is determined by public.is_admin() based on user_roles/roles.

## UI expectations
- Bootstrap 5 components. Keep it clean and simple.
- Show errors as toast notifications (see src/lib/ui.js).
