import '../styles/app.css';
import { renderNavbar } from '../components/navbar.js';
import { requireAuthOrRedirect } from '../services/authService.js';
import { createRequest, addRequestFile } from '../services/requestService.js';
import { uploadRequestFile } from '../services/storageService.js';
import { toast } from '../lib/ui.js';
import { getAiServiceSuggestion } from '../lib/ai-helper.js';

async function main() {
  await renderNavbar('create');

  const session = await requireAuthOrRedirect('/login.html');
  if (!session) throw new Error('No session');

  const userId = session.user.id;

  const form = document.querySelector('#formCreate');
  const titleInput = document.querySelector('#title');
  const carInput = document.querySelector('#car');
  const descriptionInput = document.querySelector('#description');
  const fileInput = document.querySelector('#files');

  const aiIssueInput = document.getElementById('aiIssueInput');
  const aiSuggestBtn = document.getElementById('aiSuggestBtn');
  const aiUseSuggestionBtn = document.getElementById('aiUseSuggestionBtn');
  const aiSuggestionBox = document.getElementById('aiSuggestionBox');

  const aiPossibleIssue = document.getElementById('aiPossibleIssue');
  const aiRecommendedService = document.getElementById('aiRecommendedService');
  const aiUrgency = document.getElementById('aiUrgency');
  const aiAdvice = document.getElementById('aiAdvice');

  let lastSuggestion = null;

  function getUrgencyBadge(urgency) {
    if (urgency === 'Висока') {
      return '<span class="badge text-bg-danger">Висока</span>';
    }
    if (urgency === 'Средна') {
      return '<span class="badge text-bg-warning">Средна</span>';
    }
    return '<span class="badge text-bg-success">Ниска</span>';
  }

  if (aiSuggestBtn) {
    aiSuggestBtn.addEventListener('click', () => {
      const input = aiIssueInput?.value ?? '';
      const suggestion = getAiServiceSuggestion(input);

      lastSuggestion = suggestion;

      if (aiPossibleIssue) aiPossibleIssue.textContent = suggestion.possibleIssue;
      if (aiRecommendedService) aiRecommendedService.textContent = suggestion.recommendedService;
      if (aiUrgency) aiUrgency.innerHTML = getUrgencyBadge(suggestion.urgency);
      if (aiAdvice) aiAdvice.textContent = suggestion.advice;

      aiSuggestionBox?.classList.remove('d-none');
      aiUseSuggestionBtn?.classList.remove('d-none');
    });
  }

  if (aiUseSuggestionBtn) {
    aiUseSuggestionBtn.addEventListener('click', () => {
      if (!lastSuggestion) return;

      if (titleInput && !titleInput.value.trim()) {
        titleInput.value = lastSuggestion.recommendedService;
      }

      const aiText =
        `AI препоръка:\n` +
        `- Възможен проблем: ${lastSuggestion.possibleIssue}\n` +
        `- Препоръчана услуга: ${lastSuggestion.recommendedService}\n` +
        `- Спешност: ${lastSuggestion.urgency}\n` +
        `- Съвет: ${lastSuggestion.advice}`;

      if (descriptionInput) {
        if (!descriptionInput.value.trim()) {
          descriptionInput.value = aiText;
        } else if (!descriptionInput.value.includes('AI препоръка:')) {
          descriptionInput.value += `\n\n${aiText}`;
        }
      }

      toast('AI препоръката беше добавена към заявката.', 'success');
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.querySelector('#formCreate button[type="submit"]');
    const originalBtnText = submitBtn?.textContent ?? 'Създай';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Създаване...';
    }

    const title = titleInput.value.trim();
    const car = carInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title || title.length < 5) {
      toast('Заглавието трябва да е поне 5 символа.', 'warning');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
      return;
    }

    if (!car) {
      toast('Моля въведете модел на автомобила.', 'warning');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
      return;
    }

    if (!description || description.length < 10) {
      toast('Описанието трябва да е поне 10 символа.', 'warning');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
      return;
    }

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
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });
}

main();