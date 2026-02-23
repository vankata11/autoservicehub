import { requireAuthOrRedirect } from '../services/authService.js';
import { isAdmin } from '../services/roleService.js';

export async function requireAdminOrRedirect() {
  const session = await requireAuthOrRedirect('/login.html');
  if (!session) return null;
  const ok = await isAdmin(session.user.id);
  if (!ok) {
    window.location.href = '/dashboard.html';
    return null;
  }
  return session;
}
