# Bilal Ahamad Resume Website

This repository contains a responsive resume site built with **HTML**, **Tailwind CSS** and a small amount of JavaScript. The page uses a glossy glassmorphism design with animated section reveals and a dark/light theme toggle saved in `localStorage`.

Sections include About, Skills, Experience, Projects, Education, Testimonials and Contact. A download button links to `docs/Bilal_Ahamad_Resume.pdf` so you can easily provide your own resume.

The contact form sends data to a small Vercel Serverless Function located in `api/contact.js`. Configure SMTP credentials in your Vercel project settings so the function can deliver email without any activation steps.

### Required Environment Variables

Set the following variables in Vercel:

- `SMTP_HOST` – your mail server host
- `SMTP_PORT` – the server port
- `SMTP_USER` – SMTP username
- `SMTP_PASS` – SMTP password
- `SMTP_FROM` – sender address
- `SMTP_TO` – recipient address (defaults to `SMTP_FROM`)

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

### Vercel Output Directory

If Vercel shows a "No Output Directory named 'public'" error, ensure that `vercel.json` exists with `{"outputDirectory": "."}` so the root folder is served.
