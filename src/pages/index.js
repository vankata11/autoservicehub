import '../styles/app.css';
import { renderNavbar } from '../components/navbar.js';
import { getSession } from '../services/authService.js';

await renderNavbar('home');

const session = await getSession().catch(() => null);
const user = session?.user ?? null;

if (user) {
  document.querySelector('#cta').innerHTML = `
    <a class="btn btn-dark btn-lg" href="/dashboard.html">Към моите заявки</a>
    <a class="btn btn-outline-dark btn-lg" href="/create-request.html">Нова заявка</a>
  `;
} else {
  document.querySelector('#cta').innerHTML = `
    <a class="btn btn-dark btn-lg" href="/register.html">Започни</a>
    <a class="btn btn-outline-dark btn-lg" href="/login.html">Вход</a>
  `;
}
