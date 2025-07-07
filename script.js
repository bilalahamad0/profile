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

// Fade in sections on scroll
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fadeUp');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));
