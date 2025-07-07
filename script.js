// Theme toggle logic with localStorage
const toggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const storedTheme = localStorage.getItem('theme');

function setTheme(mode) {
  if (mode === 'dark') {
    root.classList.add('dark');
    toggle.textContent = '☀️';
  } else {
    root.classList.remove('dark');
    toggle.textContent = '🌙';
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

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();
