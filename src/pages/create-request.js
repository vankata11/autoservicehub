import '../styles/app.css';
import { renderNavbar } from '../components/navbar.js';
import { requireAuthOrRedirect } from '../services/authService.js';
import { createRequest } from '../services/requestService.js';
import { uploadRequestFile } from '../services/storageService.js';
import { addRequestFile } from '../services/requestService.js';
import { toast } from '../lib/ui.js';

async function main() {
  await renderNavbar('create');

  const session = await requireAuthOrRedirect('/login.html');
  if (!session) throw new Error('No session');

  const userId = session.user.id;

  document.querySelector('#formCreate').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.querySelector('#title').value.trim();
    const car = document.querySelector('#car').value.trim();
    const description = document.querySelector('#description').value.trim();
    const fileInput = document.querySelector('#files');

    try {
      const req = await createRequest({
        owner_id: userId,
        title,
        car_model: car,
        description,
        status: 'new'
      });

      const files = [...(fileInput.files ?? [])].slice(0, 5);
      for (const f of files) {
        const uploaded = await uploadRequestFile(userId, req.id, f);
        await addRequestFile({
          request_id: req.id,
          owner_id: userId,
          file_path: uploaded.path,
          original_name: uploaded.originalName
        });
      }

      toast('Заявката е създадена!', 'success');
      window.location.href = `/request.html?id=${req.id}`;
    } catch (err) {
      toast(err?.message ?? 'Грешка при създаване', 'danger');
    }
  });
}

main();