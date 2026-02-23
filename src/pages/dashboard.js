import '../styles/app.css';
import { renderNavbar } from '../components/navbar.js';
import { requireAuthOrRedirect } from '../services/authService.js';
import { listMyRequests } from '../services/requestService.js';
import { toast } from '../lib/ui.js';

async function main() {
  await renderNavbar('dashboard');

  const session = await requireAuthOrRedirect('/login.html');
  if (!session) throw new Error('No session');

  const userId = session.user.id;

  async function load() {
    try {
      const items = await listMyRequests(userId);
      const tbody = document.querySelector('#tbl tbody');
      tbody.innerHTML = items.map(r => `
        <tr>
          <td class="text-secondary small">${new Date(r.created_at).toLocaleString()}</td>
          <td><a href="/request.html?id=${r.id}" class="link-dark fw-semibold">${escapeHtml(r.title)}</a></td>
          <td>${renderStatus(r.status)}</td>
        </tr>
      `).join('');

      document.querySelector('#count').textContent = String(items.length);
    } catch (err) {
      toast(err?.message ?? 'Грешка при зареждане', 'danger');
    }
  }

  function renderStatus(s) {
    const map = {
      new: 'bg-primary',
      in_progress: 'bg-warning text-dark',
      done: 'bg-success',
      rejected: 'bg-danger'
    };
    const cls = map[s] ?? 'bg-secondary';
    return `<span class="badge ${cls}">${s}</span>`;
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  await load();
}

main();