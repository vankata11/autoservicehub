export function qs(sel, root=document) { return root.querySelector(sel); }
export function qsa(sel, root=document) { return [...root.querySelectorAll(sel)]; }

export function setText(el, txt) {
  if (!el) return;
  el.textContent = txt ?? '';
}

export function show(el) { if (el) el.classList.remove('d-none'); }
export function hide(el) { if (el) el.classList.add('d-none'); }

export function toast(message, type='info') {
  const wrap = document.createElement('div');
  wrap.className = 'position-fixed bottom-0 end-0 p-3';
  wrap.style.zIndex = 1080;

  const bg = type === 'danger' ? 'text-bg-danger'
    : type === 'success' ? 'text-bg-success'
    : type === 'warning' ? 'text-bg-warning'
    : 'text-bg-primary';

  wrap.innerHTML = `
    <div class="toast align-items-center ${bg} border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">${escapeHtml(message)}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);
  wrap.querySelector('button')?.addEventListener('click', () => wrap.remove());
  setTimeout(() => wrap.remove(), 3800);
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
