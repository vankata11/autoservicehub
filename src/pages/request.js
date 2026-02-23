import '../styles/app.css';
import { renderNavbar } from '../components/navbar.js';
import { requireAuthOrRedirect, getUser } from '../services/authService.js';
import { getRequestById, listRequestFiles } from '../services/requestService.js';
import { createSignedUrl } from '../services/storageService.js';
import { isAdmin } from '../services/roleService.js';
import { toast, setText } from '../lib/ui.js';

await renderNavbar('');

const session = await requireAuthOrRedirect('/login.html');
if (!session) throw new Error('No session');

const userId = session.user.id;
const admin = await isAdmin(userId);

const id = new URLSearchParams(window.location.search).get('id');
if (!id) {
  window.location.href = '/dashboard.html';
}

async function load() {
  try {
    const req = await getRequestById(id);

    // If not admin, ensure ownership (extra client-side guard; RLS is the real protection)
    if (!admin && req.owner_id !== userId) {
      toast('Нямаш достъп до тази заявка.', 'danger');
      window.location.href = '/dashboard.html';
      return;
    }

    setText(document.querySelector('#title'), req.title);
    setText(document.querySelector('#car'), req.car_model);
    setText(document.querySelector('#desc'), req.description);
    document.querySelector('#status').innerHTML = renderStatus(req.status);
    setText(document.querySelector('#created'), new Date(req.created_at).toLocaleString());

    const files = await listRequestFiles(id);
    const ul = document.querySelector('#files');
    if (!files.length) {
      ul.innerHTML = `<li class="list-group-item text-secondary">Няма качени файлове.</li>`;
      return;
    }

    ul.innerHTML = '';
    for (const f of files) {
      const url = await createSignedUrl(f.file_path, 60 * 10);
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <div class="me-2">
          <div class="fw-semibold">${escapeHtml(f.original_name)}</div>
          <div class="text-secondary small">${new Date(f.created_at).toLocaleString()}</div>
        </div>
        <a class="btn btn-outline-dark btn-sm" href="${url}" target="_blank" rel="noopener">Изтегли</a>
      `;
      ul.appendChild(li);
    }
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
