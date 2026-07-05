const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('#nav-links');
const form = document.querySelector('#deficit-form');
const maintenanceInput = document.querySelector('#maintenance');
const deficitInput = document.querySelector('#deficit');
const result = document.querySelector('#calc-result');

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
