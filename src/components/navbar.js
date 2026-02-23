import { getSession, logout } from '../services/authService.js';
import { isAdmin } from '../services/roleService.js';

export async function renderNavbar(active = '') {
  const session = await getSession().catch(() => null);
  const user = session?.user ?? null;
  const admin = user ? await isAdmin(user.id) : false;

  const nav = document.createElement('nav');
  nav.className = 'navbar navbar-expand-lg bg-white border-bottom sticky-top';
  nav.innerHTML = `
    <div class="container container-narrow">
      <a class="navbar-brand" href="/index.html">AutoServiceHub</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navMain">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link ${active==='home'?'active':''}" href="/index.html">Начало</a></li>
          ${user ? `<li class="nav-item"><a class="nav-link ${active==='dashboard'?'active':''}" href="/dashboard.html">Моите заявки</a></li>` : ''}
          ${user ? `<li class="nav-item"><a class="nav-link ${active==='create'?'active':''}" href="/create-request.html">Нова заявка</a></li>` : ''}
          ${admin ? `<li class="nav-item"><a class="nav-link ${active==='admin'?'active':''}" href="/admin.html">Админ</a></li>` : ''}
        </ul>

        <div class="d-flex gap-2 align-items-center">
          ${user
            ? `<span class="text-secondary small d-none d-lg-inline"> ${user.email}</span>
               <button id="btnLogout" class="btn btn-outline-dark btn-sm">Изход</button>`
            : `<a class="btn btn-outline-dark btn-sm" href="/login.html">Вход</a>
               <a class="btn btn-dark btn-sm" href="/register.html">Регистрация</a>`
          }
        </div>
      </div>
    </div>
  `;

  document.body.prepend(nav);

  if (user) {
    nav.querySelector('#btnLogout')?.addEventListener('click', async () => {
      await logout();
      window.location.href = '/index.html';
    });
  }
}
