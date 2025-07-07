// Theme toggle logic with localStorage
const toggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const root = document.documentElement;
const body = document.body;
const storedTheme = localStorage.getItem('theme');

function setTheme(mode) {
  if (mode === 'dark') {
    root.classList.add('dark');
    body.classList.add('page-overview', 'theme-dark');
    toggle.textContent = '☀️';
    toggle.setAttribute('aria-pressed', 'true');
  } else {
    root.classList.remove('dark');
    body.classList.remove('page-overview', 'theme-dark');
    toggle.textContent = '🌙';
    toggle.setAttribute('aria-pressed', 'false');
  }
  localStorage.setItem('theme', mode);
}

// Initialize theme
if (storedTheme) {
  setTheme(storedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  setTheme('dark');
}

// Toggle handler
toggle.addEventListener('click', () => {
  if (root.classList.contains('dark')) {
    setTheme('light');
  } else {
    setTheme('dark');
  }
});

// Mobile navigation toggle
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
  });
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.add('hidden');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Showcase auto scroll
const showcase = document.getElementById('showcase');
if (showcase) {
  const slides = showcase.querySelectorAll('.slide');
  let current = 0;
  setInterval(() => {
    current = (current + 1) % slides.length;
    showcase.scrollTo({ left: slides[current].offsetLeft, behavior: 'smooth' });
  }, 4000);
  showcase.addEventListener('wheel', (e) => {
    if (e.deltaY === 0) return;
    e.preventDefault();
    showcase.scrollLeft += e.deltaY;
  }, { passive: false });
}
