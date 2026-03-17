import '../styles/app.css';
import { renderNavbar } from '../components/navbar.js';
import { requireAdminOrRedirect } from '../lib/guards.js';
import {
  adminListAllRequests,
  adminUpdateStatus,
  adminDeleteRequest,
  REQUEST_STATUSES
} from '../services/requestService.js';
import { toast } from '../lib/ui.js';

async function main() {
  await renderNavbar('admin');

  const session = await requireAdminOrRedirect();
  if (!session) throw new Error('No admin session');

  let allItems = [];

  async function load() {
    const loading = document.querySelector('#loadingState');
    const error = document.querySelector('#errorState');
    const table = document.querySelector('#tbl');
    const emptyState = document.querySelector('#emptyState');

    try {
      loading?.classList.remove('d-none');
      error?.classList.add('d-none');
      emptyState?.classList.add('d-none');
      table?.classList.add('d-none');

      allItems = await adminListAllRequests();

      updateStats(allItems);
      renderRows(filterItems(allItems));
    } catch (err) {
      toast(err?.message ?? 'Грешка при зареждане', 'danger');
      error?.classList.remove('d-none');
      table?.classList.add('d-none');
    } finally {
      loading?.classList.add('d-none');
    }
  }

  function renderRows(items) {
    const table = document.querySelector('#tbl');
    const tbody = document.querySelector('#tbl tbody');
    const emptyState = document.querySelector('#emptyState');

    if (!tbody) return;

    if (!items.length) {
      tbody.innerHTML = '';
      table?.classList.add('d-none');
      emptyState?.classList.remove('d-none');
      return;
    }

    emptyState?.classList.add('d-none');
    table?.classList.remove('d-none');

    tbody.innerHTML = items.map((r) => row(r)).join('');
    wireActions();
  }

  function row(r) {
    const opts = REQUEST_STATUSES
      .map((s) => `<option value="${s}" ${s === r.status ? 'selected' : ''}>${formatStatus(s)}</option>`)
      .join('');

    return `
      <tr data-id="${r.id}">
        <td class="text-secondary small">${new Date(r.created_at).toLocaleString()}</td>
        <td>
          <a class="link-dark fw-semibold" href="/request.html?id=${r.id}">
            ${escapeHtml(r.title)}
          </a>
          <div class="small text-secondary">${escapeHtml(r.car_model ?? '')}</div>
        </td>
        <td class="text-secondary small">
          ${escapeHtml(r.profiles?.full_name ?? '')}
        </td>
        <td style="min-width: 180px;">
          <select class="form-select form-select-sm status">${opts}</select>
        </td>
        <td class="text-end">
          <button class="btn btn-outline-danger btn-sm del">
            Изтрий
          </button>
        </td>
      </tr>
    `;
  }

  function wireActions() {
    document.querySelectorAll('tr[data-id]').forEach((tr) => {
      const id = tr.getAttribute('data-id');

      tr.querySelector('select.status')?.addEventListener('change', async (e) => {
        const status = e.target.value;

        try {
          await adminUpdateStatus(id, status);
          toast('Статусът е обновен', 'success');
          await load();
        } catch (err) {
          toast(err?.message ?? 'Грешка при обновяване', 'danger');
        }
      });

      tr.querySelector('button.del')?.addEventListener('click', async (e) => {
        const confirmed = window.confirm('Сигурен ли си, че искаш да изтриеш заявката?');
        if (!confirmed) return;

        const btn = e.currentTarget;
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Изтриване...';

        try {
          await adminDeleteRequest(id);
          toast('Изтрита заявка', 'success');
          await load();
        } catch (err) {
          toast(err?.message ?? 'Грешка при изтриване', 'danger');
        } finally {
          btn.disabled = false;
          btn.textContent = originalText;
        }
      });
    });
  }

  function updateStats(items) {
    const total = items.length;
    const newCount = items.filter((r) => r.status === 'new').length;
    const inProgressCount = items.filter((r) => r.status === 'in_progress').length;
    const doneCount = items.filter((r) => r.status === 'done').length;

    const statTotal = document.getElementById('statTotal');
    const statNew = document.getElementById('statNew');
    const statInProgress = document.getElementById('statInProgress');
    const statDone = document.getElementById('statDone');

    if (statTotal) statTotal.textContent = total;
    if (statNew) statNew.textContent = newCount;
    if (statInProgress) statInProgress.textContent = inProgressCount;
    if (statDone) statDone.textContent = doneCount;
  }

  function filterItems(items) {
    const searchTerm = document.querySelector('#searchInput')?.value.trim().toLowerCase() ?? '';
    const statusValue = document.querySelector('#statusFilter')?.value ?? 'all';

    return items.filter((item) => {
      const title = item.title?.toLowerCase() ?? '';
      const carModel = item.car_model?.toLowerCase() ?? '';
      const description = item.description?.toLowerCase() ?? '';
      const fullName = item.profiles?.full_name?.toLowerCase() ?? '';

      const matchesSearch =
        !searchTerm ||
        title.includes(searchTerm) ||
        carModel.includes(searchTerm) ||
        description.includes(searchTerm) ||
        fullName.includes(searchTerm);

      const matchesStatus =
        statusValue === 'all' || item.status === statusValue;

      return matchesSearch && matchesStatus;
    });
  }

  function applyFilters() {
    renderRows(filterItems(allItems));
  }

  document.querySelector('#searchInput')?.addEventListener('input', applyFilters);
  document.querySelector('#statusFilter')?.addEventListener('change', applyFilters);

  function formatStatus(status) {
    if (status === 'new') return 'Нова';
    if (status === 'in_progress') return 'В процес';
    if (status === 'done') return 'Завършена';
    return status;
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