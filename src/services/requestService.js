import { supabase } from '../lib/supabaseClient.js';

export const REQUEST_STATUSES = ['new', 'in_progress', 'done', 'rejected'];

export async function createRequest(payload) {
  const { data, error } = await supabase
    .from('service_requests')
    .insert(payload)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function listMyRequests(userId) {
  const { data, error } = await supabase
    .from('service_requests')
    .select('id, title, status, created_at')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getRequestById(id) {
  const { data, error } = await supabase
    .from('service_requests')
    .select('*, profiles(full_name)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function listRequestFiles(requestId) {
  const { data, error } = await supabase
    .from('request_files')
    .select('id, file_path, original_name, created_at')
    .eq('request_id', requestId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addRequestFile(row) {
  const { data, error } = await supabase
    .from('request_files')
    .insert(row)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function adminListAllRequests() {
  const { data, error } = await supabase
    .from('service_requests')
    .select('id, title, status, created_at, owner_id, profiles(full_name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function adminUpdateStatus(id, status) {
  const { data, error } = await supabase
    .from('service_requests')
    .update({ status })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function adminDeleteRequest(id) {
  const { error } = await supabase
    .from('service_requests')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
