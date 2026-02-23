import { supabase } from '../lib/supabaseClient.js';

export async function isAdmin(userId) {
  if (!userId) return false;
  const { data, error } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    // If RLS blocks, you'll see it here. Ensure policies are applied.
    console.warn(error);
    return false;
  }
  const roleName = data?.roles?.name;
  return roleName === 'admin';
}
