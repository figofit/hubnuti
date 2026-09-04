// ---------- Mobilní navigace ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('#nav-links');
const navBackdrop = document.querySelector('#nav-backdrop');

const closeMobileNav = () => {
  navLinks.classList.remove('is-open');
  if (navBackdrop) navBackdrop.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflowY = '';
};

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    if (navBackdrop) navBackdrop.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflowY = isOpen ? 'hidden' : '';
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target.matches('a')) closeMobileNav();
  });

  if (navBackdrop) navBackdrop.addEventListener('click', closeMobileNav);
}

// ---------- Header: stín při scrollu ----------
const header = document.querySelector('#header');
const toTopBtn = document.querySelector('#to-top');

const onScroll = () => {
  const scrolled = window.scrollY > 12;
  if (header) header.classList.toggle('is-scrolled', scrolled);
  if (toTopBtn) toTopBtn.classList.toggle('is-visible', window.scrollY > 500);
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (toTopBtn) {
  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---------- FAQ akordeon ----------
document.querySelectorAll('.faq__item').forEach((item) => {
  const question = item.querySelector('.faq__question');
  if (!question) return;
  question.addEventListener('click', () => {
    const isOpen = item.classList.toggle('is-open');
    question.setAttribute('aria-expanded', String(isOpen));
  });
});

// ---------- Reveal animace při scrollu ----------
// Pojistka: i kdyby pozorovatel nějaký prvek minul (rychlý/needitočný scroll,
// starší prohlížeč na predváděcím notebooku…), po chvíli se zobrazí vše samo —
// na obchodní schůzce se nesmí stát, že zůstane sekce "neviditelná".
const revealTargets = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealTargets.forEach((target) => revealObserver.observe(target));

  window.setTimeout(() => {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  }, 2500);
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}

// ---------- Počítadla (roky praxe, pacienti, doporučení) ----------
const counters = document.querySelectorAll('[data-count-to]');
const animateCounter = (el) => {
  const target = Number(el.dataset.countTo);
  const suffix = el.dataset.suffix || '';
  if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = target.toLocaleString('cs-CZ') + suffix;
    return;
  }
  const duration = 1400;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString('cs-CZ') + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

if ('IntersectionObserver' in window && counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((counter) => counterObserver.observe(counter));
}

// ---------- Kontaktní formulář (demo bez backendu) ----------
// V produkci je potřeba formulář napojit na e-mail / CRM (např. Formspree,
// EmailJS, nebo vlastní endpoint) — teď jen simuluje odeslání.
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = contactForm.querySelector('[name="name"]');
    const phone = contactForm.querySelector('[name="phone"]');

    if (!name.value.trim() || !phone.value.trim()) {
      formStatus.textContent = 'Vyplňte prosím jméno a telefon, ať se vám můžeme ozvat.';
      formStatus.style.color = '#d96f36';
      return;
    }

    formStatus.textContent = `Děkujeme, ${name.value.trim()}! Ozveme se vám co nejdříve.`;
    formStatus.style.color = '';
    contactForm.reset();
  });
}
