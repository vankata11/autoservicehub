import { supabase } from '../lib/supabaseClient.js';

export const BUCKET = 'request-files';

export async function uploadRequestFile(userId, requestId, file) {
  const safeName = file.name.replaceAll(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${userId}/${requestId}/${Date.now()}_${safeName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });
  if (error) throw error;

  return { path, originalName: file.name };
}

export async function getPublicUrl(path) {
  // If you keep the bucket public, this works.
  // If bucket is private, use createSignedUrl instead (recommended).
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function createSignedUrl(path, expiresInSeconds = 60 * 10) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}
