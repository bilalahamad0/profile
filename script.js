// Theme toggle logic with localStorage
const toggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const root = document.documentElement;
const storedTheme = localStorage.getItem('theme');

function setTheme(mode) {
  if (mode === 'dark') {
    root.classList.add('dark');
    toggle.textContent = '☀️';
    toggle.setAttribute('aria-pressed', 'true');
  } else {
    root.classList.remove('dark');
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
  });
}

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();
