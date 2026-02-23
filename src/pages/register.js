import '../styles/app.css';
import { renderNavbar } from '../components/navbar.js';
import { register } from '../services/authService.js';
import { toast } from '../lib/ui.js';

async function main() {
  await renderNavbar('');

  document.querySelector('#formRegister').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.querySelector('#fullName').value.trim();
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value;
    const password2 = document.querySelector('#password2').value;

    if (password !== password2) {
      toast('Паролите не съвпадат', 'warning');
      return;
    }

    try {
      await register(email, password, fullName);
      toast('Регистрацията е успешна. Влез с акаунта си.', 'success');
      window.location.href = '/login.html';
    } catch (err) {
      toast(err?.message ?? 'Грешка при регистрация', 'danger');
    }
  });
}

main();