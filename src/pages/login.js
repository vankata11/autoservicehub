import '../styles/app.css';
import { renderNavbar } from '../components/navbar.js';
import { login } from '../services/authService.js';
import { toast } from '../lib/ui.js';

async function main() {
  await renderNavbar('');

  document.querySelector('#formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value;

    try {
      await login(email, password);
      toast('Успешен вход!', 'success');
      window.location.href = '/dashboard.html';
    } catch (err) {
      toast(err?.message ?? 'Грешка при вход', 'danger');
    }
  });
}

main();