document.addEventListener('DOMContentLoaded', () => {
  hideLoader();
  initThemeToggle();
  initContactForm();
  initCurrentYear();
});

function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hidden'), 800);
}

function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
  }

  toggle.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';

    if (next === 'light') {
      document.body.setAttribute('data-theme', 'light');
    } else {
      document.body.removeAttribute('data-theme');
    }

    localStorage.setItem('theme', next);
  });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.scrollToSection = scrollToSection;

function initCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initContactForm() {
  const steps = Array.from(document.querySelectorAll('.step'));
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const submitBtn = document.getElementById('submitBtn');
  const statusEl = document.getElementById('formStatus');
  const progressBar = document.getElementById('formProgressBar');
  const stepDots = Array.from(document.querySelectorAll('.step-dot'));
  const form = document.getElementById('contactForm');

  if (!steps.length || !nextBtn || !prevBtn || !submitBtn || !statusEl || !progressBar || !form) return;

  let currentStep = 0;

  function setFieldState(field, isValid) {
    field.classList.toggle('error', !isValid);
  }

  function validateStep(index) {
    const step = steps[index];
    if (!step) return false;

    const fields = Array.from(step.querySelectorAll('input, textarea, select'));
    let valid = true;

    fields.forEach((field) => {
      const isRequired = field.hasAttribute('required');
      const value = field.value.trim();

      let ok = true;

      if (isRequired && !value) {
        ok = false;
      }

      if (ok && field.type === 'email' && value) {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      if (ok && field.type === 'url' && value) {
        ok = /^https?:\/\/.+/i.test(value);
      }

      if (!ok) valid = false;
      setFieldState(field, ok);
    });

    return valid;
  }

  function updateProgress() {
    const progress = ((currentStep + 1) / steps.length) * 100;
    progressBar.style.width = progress + '%';

    stepDots.forEach((dot, i) => {
      dot.classList.toggle('active', i <= currentStep);
    });
  }

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
    });

    prevBtn.style.display = index === 0 ? 'none' : 'inline-flex';
    nextBtn.style.display = index === steps.length - 1 ? 'none' : 'inline-flex';
    submitBtn.style.display = index === steps.length - 1 ? 'inline-flex' : 'none';

    updateProgress();
  }

  function clearStatus() {
    statusEl.textContent = '';
    statusEl.className = 'form-status';
  }

  nextBtn.addEventListener('click', () => {
    if (!validateStep(currentStep)) {
      statusEl.textContent = 'Merci de compléter tous les champs de cette étape avant de continuer.';
      statusEl.className = 'form-status error';
      return;
    }

    clearStatus();
    if (currentStep < steps.length - 1) {
      currentStep += 1;
      showStep(currentStep);
    }
  });

  prevBtn.addEventListener('click', () => {
    clearStatus();
    if (currentStep > 0) {
      currentStep -= 1;
      showStep(currentStep);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      statusEl.textContent = 'Merci de compléter tous les champs avant l’envoi.';
      statusEl.className = 'form-status error';
      return;
    }

    statusEl.textContent = 'Message envoyé avec succès. Nous reviendrons vers toi sous 24h.';
    statusEl.className = 'form-status success';
    form.reset();
    currentStep = 0;
    showStep(currentStep);
  });

  showStep(currentStep);
}