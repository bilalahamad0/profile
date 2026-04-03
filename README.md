# Bilal Ahamad | Professional Portfolio Website

An interactive, premium digital portfolio built entirely from scratch to showcase engineering history, open-source projects, and technical certifications. Designed specifically to present a world-class professional developer footprint bridging into a cohesive, highly polished "Dark Glass Bento" UI.

## ⚡ Highlighted Tech Stack
* **Core Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
* **Styling & Layout**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Motion & Interactions**: [Framer Motion](https://www.framer.com/motion/) powering fluid viewport reveals and real-time SVG DOM animations.
* **Icons**: [Lucide React](https://lucide.dev/)
* **Backend Utilities**: Serverless `nodemailer` API routes, live GitHub REST API fetching.

## 🚀 Architectural Features

* **Built From Scratch**: Completely custom, hand-coded components designed to replace standard CVs with a dynamic, immersive experience.
* **Bento Grid Architecture**: A tightly woven "glassmorphism" layout that wraps multiple data contexts (LinkedIn, Experience, Technical Arsenal) smoothly into viewport grids.
* **Google Developer Integration**: Features a bespoke interactive horizontal reel mapping digital badges seamlessly onto physical event photography.
* **Serverless Edge Networking**: Integrates native form submissions that proxy straight to automated email routing without third-party form builders.

---

## 🛠 Required Environment Variables

To properly launch the Contact Form logic in Vercel, navigate to **Settings -> Environment Variables** and map:

- `SMTP_HOST` – your mail server host (e.g., `smtp.gmail.com`)
- `SMTP_PORT` – the server port (e.g., `465`)
- `SMTP_USER` – SMTP username (your gmail address)
- `SMTP_PASS` – SMTP App Password (do not use primary password)
- `SMTP_FROM` – Sender Address
- `SMTP_TO` – Recipient Address

Example `.env.local`:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_TO=your-email@gmail.com
```

## 💻 Local Development

1. Clone repository and install dependencies.
```bash
cd resume-site
npm install
```
2. Spawn the Next.js development server.
```bash
npm run dev
```
3. Load `localhost:3000` to review the local build.

## 🚢 Deployment (Vercel)

The site is built securely on Vercel utilizing automatic GitHub CI/CD deployments. Pushing an update to the `main` branch automatically packages the Next.js distribution bundle, securely injects environment variables, and pushes updates straight to `bilalahamad.com`.
