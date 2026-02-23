import '../styles/app.css';
import { renderNavbar } from '../components/navbar.js';
import { requireAdminOrRedirect } from '../lib/guards.js';
import { adminListAllRequests, adminUpdateStatus, adminDeleteRequest, REQUEST_STATUSES } from '../services/requestService.js';
import { toast } from '../lib/ui.js';

await renderNavbar('admin');

const session = await requireAdminOrRedirect();
if (!session) throw new Error('No admin session');

async function load() {
  try {
    const items = await adminListAllRequests();
    const tbody = document.querySelector('#tbl tbody');
    tbody.innerHTML = items.map(r => row(r)).join('');
    wireActions();
  } catch (err) {
    toast(err?.message ?? 'Грешка при зареждане', 'danger');
  }
}

function row(r) {
  const opts = REQUEST_STATUSES.map(s => `<option value="${s}" ${s===r.status?'selected':''}>${s}</option>`).join('');
  return `
    <tr data-id="${r.id}">
      <td class="text-secondary small">${new Date(r.created_at).toLocaleString()}</td>
      <td><a class="link-dark fw-semibold" href="/request.html?id=${r.id}">${escapeHtml(r.title)}</a></td>
      <td class="text-secondary small">${escapeHtml(r.profiles?.full_name ?? '')}</td>
      <td style="min-width: 180px;">
        <select class="form-select form-select-sm status">${opts}</select>
      </td>
      <td class="text-end">
        <button class="btn btn-outline-danger btn-sm del">Изтрий</button>
      </td>
    </tr>
  `;
}

function wireActions() {
  document.querySelectorAll('tr[data-id]').forEach(tr => {
    const id = tr.getAttribute('data-id');
    tr.querySelector('select.status')?.addEventListener('change', async (e) => {
      const status = e.target.value;
      try {
        await adminUpdateStatus(id, status);
        toast('Статусът е обновен', 'success');
      } catch (err) {
        toast(err?.message ?? 'Грешка при обновяване', 'danger');
      }
    });

    tr.querySelector('button.del')?.addEventListener('click', async () => {
      if (!confirm('Сигурен ли си, че искаш да изтриеш заявката?')) return;
      try {
        await adminDeleteRequest(id);
        toast('Изтрита заявка', 'success');
        await load();
      } catch (err) {
        toast(err?.message ?? 'Грешка при изтриване', 'danger');
      }
    });
  });
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
