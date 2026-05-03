document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initAccordion();
  initToolbar();
  initCurrentYear();
});

function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.setAttribute('data-theme', 'light');
  }

  toggle.addEventListener('click', () => {
    const isLight = document.body.getAttribute('data-theme') === 'light';

    if (isLight) {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}

function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach((item) => {
    const button = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    if (!button || !content) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      item.classList.toggle('open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
      content.hidden = isOpen;
    });
  });
}

function initToolbar() {
  const expandAllBtn = document.getElementById('expandAllBtn');
  const collapseAllBtn = document.getElementById('collapseAllBtn');
  const items = Array.from(document.querySelectorAll('.accordion-item'));

  if (!expandAllBtn || !collapseAllBtn || !items.length) return;

  expandAllBtn.addEventListener('click', () => {
    items.forEach((item) => {
      const button = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');
      item.classList.add('open');
      if (button) button.setAttribute('aria-expanded', 'true');
      if (content) content.hidden = false;
    });
  });

  collapseAllBtn.addEventListener('click', () => {
    items.forEach((item) => {
      const button = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');
      item.classList.remove('open');
      if (button) button.setAttribute('aria-expanded', 'false');
      if (content) content.hidden = true;
    });
  });
}

function initCurrentYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}