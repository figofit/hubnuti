const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('#nav-links');
const form = document.querySelector('#deficit-form');
const maintenanceInput = document.querySelector('#maintenance');
const deficitInput = document.querySelector('#deficit');
const result = document.querySelector('#calc-result');
const macroForm = document.querySelector('#macro-form');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

if (form && maintenanceInput && deficitInput && result) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const maintenance = Number(maintenanceInput.value);
    const deficit = Number(deficitInput.value);

    if (!maintenance || !deficit || deficit >= maintenance) {
      result.textContent = 'Zkontroluj čísla: deficit musí být menší než udržovací příjem.';
      return;
    }

    const target = maintenance - deficit;
    const daysForFatKg = Math.ceil(8000 / deficit);
    result.textContent = `Cíl: ${target.toLocaleString('cs-CZ')} kcal/den. 1 kg tuku ≈ ${daysForFatKg} dní při deficitu ${deficit.toLocaleString('cs-CZ')} kcal.`;
  });
}

if (macroForm) {
  macroForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const weight = Number(document.querySelector('#weight').value);
    const maintenance = Number(document.querySelector('#macro-maintenance').value);
    const deficit = Number(document.querySelector('#goal').value);
    const proteinRate = Number(document.querySelector('#protein-rate').value);
    const fatRate = Number(document.querySelector('#fat-rate').value);
    const macroResult = document.querySelector('#macro-result');

    if (!weight || !maintenance || deficit >= maintenance || !proteinRate || !fatRate) {
      macroResult.innerHTML = '<div><strong>Chyba</strong><span>Zkontroluj vstupy kalkulačky.</span></div>';
      return;
    }

    const calories = maintenance - deficit;
    const protein = Math.round(weight * proteinRate);
    const fat = Math.round(weight * fatRate);
    const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));

    macroResult.innerHTML = `
      <div><small>Kalorie</small><strong>${calories.toLocaleString('cs-CZ')}</strong><span>kcal/den</span></div>
      <div><small>Bílkoviny</small><strong>${protein.toLocaleString('cs-CZ')}</strong><span>g/den</span></div>
      <div><small>Tuky</small><strong>${fat.toLocaleString('cs-CZ')}</strong><span>g/den</span></div>
      <div><small>Sacharidy</small><strong>${carbs.toLocaleString('cs-CZ')}</strong><span>g/den</span></div>`;
  });
}

const dailyLogForm = document.querySelector('#daily-log-form');
const dailySummary = document.querySelector('#daily-summary');
const habitInputs = Array.from(document.querySelectorAll('[data-habit]'));
const toTop = document.querySelector('#toTop');
const todayKey = `itfit-body-log-${new Date().toISOString().slice(0, 10)}`;

function getDailyLog() {
  try {
    return JSON.parse(localStorage.getItem(todayKey)) || { habits: {} };
  } catch {
    return { habits: {} };
  }
}

function saveDailyLog(log) {
  localStorage.setItem(todayKey, JSON.stringify(log));
}

function renderDailyLog() {
  if (!dailySummary) return;
  const log = getDailyLog();
  const completed = Object.values(log.habits || {}).filter(Boolean).length;

  dailySummary.innerHTML = `
    <div><small>Váha</small><strong>${log.weight || '—'}</strong><span>kg</span></div>
    <div><small>Kroky</small><strong>${log.steps || '—'}</strong><span>dnes</span></div>
    <div><small>Protein</small><strong>${log.protein || '—'}</strong><span>g</span></div>
    <div><small>Návyky</small><strong>${completed}/5</strong><span>splněno</span></div>`;

  habitInputs.forEach((input) => {
    input.checked = Boolean(log.habits?.[input.dataset.habit]);
  });
}

if (dailyLogForm) {
  renderDailyLog();
  dailyLogForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const log = getDailyLog();
    log.weight = document.querySelector('#log-weight').value || log.weight || '';
    log.steps = document.querySelector('#log-steps').value || log.steps || '';
    log.protein = document.querySelector('#log-protein').value || log.protein || '';
    log.note = document.querySelector('#log-note').value || '';
    saveDailyLog(log);
    renderDailyLog();
  });
}

habitInputs.forEach((input) => {
  input.addEventListener('change', () => {
    const log = getDailyLog();
    log.habits = log.habits || {};
    log.habits[input.dataset.habit] = input.checked;
    saveDailyLog(log);
    renderDailyLog();
  });
});

if (toTop) {
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('show', window.scrollY > 700);
  });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
