import '../styles/app.css';
import { renderNavbar } from '../components/navbar.js';
import { requireAuthOrRedirect } from '../services/authService.js';
import { getRequestById, listRequestFiles } from '../services/requestService.js';
import { createSignedUrl } from '../services/storageService.js';
import { isAdmin } from '../services/roleService.js';
import { toast, setText } from '../lib/ui.js';

async function main() {
  await renderNavbar('');

  const session = await requireAuthOrRedirect('/login.html');
  if (!session) throw new Error('No session');

  const userId = session.user.id;
  const admin = await isAdmin(userId);

  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) {
    window.location.href = '/dashboard.html';
    return;
  }

  async function load() {
    try {
      const req = await getRequestById(id);

      if (!admin && req.owner_id !== userId) {
        toast('Нямаш достъп до тази заявка.', 'danger');
        window.location.href = '/dashboard.html';
        return;
      }

      setText(document.querySelector('#title'), req.title);
      setText(document.querySelector('#car'), req.car_model);
      document.querySelector('#desc').innerHTML = nl2br(req.description ?? '');
      document.querySelector('#status').innerHTML = renderStatus(req.status);
      setText(document.querySelector('#created'), new Date(req.created_at).toLocaleString());

      renderAiSummary(req.description ?? '');

      const files = await listRequestFiles(id);
      const ul = document.querySelector('#files');
      const filesEmptyState = document.querySelector('#filesEmptyState');

      if (!files.length) {
        ul.innerHTML = '';
        filesEmptyState?.classList.remove('d-none');
        return;
      }

      filesEmptyState?.classList.add('d-none');
      ul.innerHTML = '';

      for (const f of files) {
        const url = await createSignedUrl(f.file_path, 60 * 10);
        const li = document.createElement('li');
        li.className = 'list-group-item px-0 py-3 border-0 border-bottom';
        li.innerHTML = `
          <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <div class="me-2">
              <div class="fw-semibold text-break">${escapeHtml(f.original_name)}</div>
              <div class="text-secondary small">${new Date(f.created_at).toLocaleString()}</div>
            </div>
            <a class="btn btn-outline-dark btn-sm" href="${url}" target="_blank" rel="noopener">Изтегли</a>
          </div>
        `;
        ul.appendChild(li);
      }
    } catch (err) {
      toast(err?.message ?? 'Грешка при зареждане', 'danger');
    }
  }

  function renderStatus(status) {
    const map = {
      new: '<span class="badge text-bg-primary">Нова</span>',
      in_progress: '<span class="badge text-bg-warning">В процес</span>',
      done: '<span class="badge text-bg-success">Завършена</span>',
      rejected: '<span class="badge text-bg-danger">Отказана</span>'
    };

    return map[status] ?? `<span class="badge text-bg-secondary">${escapeHtml(status)}</span>`;
  }

  function renderAiSummary(description) {
    const aiCard = document.querySelector('#aiSummaryCard');
    const aiContent = document.querySelector('#aiSummaryContent');

    if (!description || !description.includes('AI препоръка:')) {
      aiCard?.classList.add('d-none');
      return;
    }

    const aiText = description.split('AI препоръка:')[1]?.trim();

    if (!aiText) {
      aiCard?.classList.add('d-none');
      return;
    }

    aiContent.innerHTML = nl2br(aiText);
    aiCard?.classList.remove('d-none');
  }

  function nl2br(str) {
    return escapeHtml(str).replaceAll('\n', '<br>');
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