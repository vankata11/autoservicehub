-- Storage bucket: request-files
-- 1) Create bucket in Supabase UI (Storage -> New bucket)
--    Name: request-files
--    Recommended: Private bucket (safer), because we use signed URLs.
-- 2) Then run these policies in SQL Editor.

-- Allow authenticated users to upload into their own folder: userId/*
-- This uses the object name (path) to check ownership.

-- Enable RLS on storage.objects is already managed, but policies are needed.
-- Note: storage policies live under "storage" schema.

create policy if not exists "upload_own_files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'request-files'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy if not exists "read_own_files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'request-files'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy if not exists "delete_own_files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'request-files'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Admin can read everything
create policy if not exists "admin_read_all_files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'request-files'
  and public.is_admin()
);
