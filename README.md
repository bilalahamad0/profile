# Bilal Ahamad Resume Website

This repository contains a responsive resume site built with **HTML**, **Tailwind CSS** and a small amount of JavaScript. The page uses a glossy glassmorphism design with animated section reveals and a dark/light theme toggle saved in `localStorage`.

Sections include About, Skills, Experience, Projects, Education, Testimonials and Contact. A download button links to `docs/Bilal_Ahamad_Resume.pdf` so you can easily provide your own resume.

The contact form posts to [Formsubmit](https://formsubmit.co) so submissions work over HTTPS without requiring server-side code.

## Viewing Locally

Run the Tailwind build once before opening `index.html`:

```bash
npm run build
```

Then open `index.html` in your browser.

## Deploying

Deploy the files to any static host or use Vercel.

With the included `package.json`, simply run:

```bash
npm run deploy
```

This executes `npx vercel --prod` for you. After deployment, map the custom domain **bilalahamad.com** in your Vercel dashboard.
