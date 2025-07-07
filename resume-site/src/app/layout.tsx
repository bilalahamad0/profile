'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import './globals.css';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    if (theme === 'dark') {
      document.body.classList.add('page-overview', 'theme-dark');
    } else {
      document.body.classList.remove('page-overview', 'theme-dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeUp');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <html lang="en" className="font-sans">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Resume and portfolio of Bilal Ahamad" />
        <link rel="canonical" href="https://bilalahamad.com" />
        <meta property="og:title" content="Bilal Ahamad - Technical QA Lead" />
        <meta property="og:description" content="Accomplished QA leader with expertise in hardware, IoT and automotive systems" />
        <meta property="og:url" content="https://bilalahamad.com" />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Bilal Ahamad',
              jobTitle: 'Technical QA Lead',
              url: 'https://bilalahamad.com',
              sameAs: [
                'https://linkedin.com/in/bilalahamad',
                'https://github.com/bilalahamad0',
              ],
            }),
          }}
        />
      </head>
      <body className={theme === 'dark' ? 'page-overview theme-dark' : undefined}>
        <a href="#maincontent" className="sr-only focus:not-sr-only">Skip to content</a>
        <header className="sticky top-0 z-20 backdrop-blur glass">
          <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
            <Link href="/" className="font-semibold text-lg">Bilal Ahamad</Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/skills">Skills</Link>
              <Link href="/experience">Experience</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/education">Education</Link>
              <Link href="/testimonials">Testimonials</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://github.com/bilalahamad0" aria-label="GitHub" target="_blank" rel="noopener" className="hover:underline">
                GitHub
              </a>
              <a href="https://linkedin.com/in/bilalahamad" aria-label="LinkedIn" target="_blank" rel="noopener" className="hover:underline">
                LinkedIn
              </a>
              <button onClick={toggleTheme} aria-label="Toggle theme" aria-pressed={theme==='dark'} className="p-2 border rounded">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </nav>
        </header>
        {children}
        <footer className="text-center py-6 text-sm">&copy; {new Date().getFullYear()} Bilal Ahamad</footer>
      </body>
    </html>
  );
}
