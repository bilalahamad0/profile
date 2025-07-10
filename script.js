// Theme toggle logic with localStorage
const toggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const body = document.body; const root = document.documentElement;
const storedTheme = localStorage.getItem('theme');

function setTheme(mode) {
  if (mode === 'dark') {
    body.classList.add("page-overview","theme-dark");root.classList.add("dark");
    toggle.textContent = '☀️';
    toggle.setAttribute('aria-pressed', 'true');
  } else {
    body.classList.remove("page-overview","theme-dark");root.classList.remove("dark");
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
  if (body.classList.contains('theme-dark')) {
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

// Contact form submission via serverless function
const contactForm = document.getElementById('contact-form');
const formMsg = document.getElementById('form-msg');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMsg.textContent = 'Sending...';
    const data = Object.fromEntries(new FormData(contactForm));
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        contactForm.reset();
        formMsg.textContent = 'Message sent!';
      } else {
        formMsg.textContent = 'Failed to send message.';
      }
    } catch {
      formMsg.textContent = 'Error sending message.';
    }
  });
}
