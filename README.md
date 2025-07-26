# Bilal Ahamad Resume Website

This repository contains a responsive resume site built with **HTML**, **Tailwind CSS** and a small amount of JavaScript. The page uses a glossy glassmorphism design with animated section reveals and a dark/light theme toggle saved in `localStorage`.

Sections include About, Skills, Experience, Projects, Education, Testimonials and Contact. A download button links to `docs/Bilal_Ahamad_Resume.pdf` so you can easily provide your own resume.
Place a headshot image at `public/Bilal_Profile_Pic.png` so the hero section displays your profile photo.

The contact form sends data to a small Vercel Serverless Function located in `api/contact.js`. Configure SMTP credentials in your Vercel project settings so the function can deliver email without any activation steps.

If you see a "Failed to send message" response, the function prints the underlying error in the Vercel logs and returns that error message in JSON. Check the logs for details. If the API responds with `Server email configuration missing: ...`, it means one or more of the variables below were not provided.

### Required Environment Variables

Set the following variables in Vercel:

- `SMTP_HOST` – your mail server host
- `SMTP_PORT` – the server port
- `SMTP_USER` – SMTP username
- `SMTP_PASS` – SMTP password
- `SMTP_FROM` – sender address
- `SMTP_TO` – recipient address (defaults to `SMTP_FROM`)

Add these under **Project Settings → Environment Variables** in Vercel (Production environment). The API lists any missing variables when you submit the form so you know exactly what to update.

The serverless function logs which SMTP variables are loaded. If any are missing it prints them in the logs and returns an error. When email sending fails for some other reason, the function now returns the underlying error message from Nodemailer to aid debugging.

Example `.env.local`:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=bilal.ahamad@gmail.com
SMTP_PASS=ihnw elom gvgx dwgd
SMTP_FROM=bilal.ahamad@gmail.com
SMTP_TO=bilal.ahamad@gmail.com
```

Vercel reads these same variable names from your project settings when you deploy. Add them under **Environment Variables** so the serverless function can send email in production.

When using Gmail, keep `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, and ensure `SMTP_SECURE` is not set to `false` so a secure SSL/TLS connection is used. A Gmail App Password is sufficient and you do **not** need to enable "Less secure apps".

### Testing locally

Create a `.env.local` file in the project root with the variables above and run:

```bash
npm install
npx vercel dev
```

The development server will read `.env.local` and proxy requests to `/api/contact`. Submit the contact form at `http://localhost:3000` to verify email delivery before deploying.
Check the terminal output for log messages indicating which SMTP variables were loaded.

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

Vercel automatically deploys the serverless function under `api/contact.js`. When the build completes, POST requests to `/api/contact` will be handled by the function with your configured SMTP credentials.

### Viewing Vercel Logs

1. Open your project in the [Vercel dashboard](https://vercel.com/dashboard).
2. Select **Deployments** and open the latest deployment.
3. Click the **Functions** tab and expand `/api/contact`.
4. Each invocation lists console output from the serverless function.

These logs show which SMTP variables were loaded, confirm the connection with `transporter.verify()`, and display any Nodemailer errors so you can diagnose configuration issues.

### Vercel Output Directory

If Vercel shows a "No Output Directory named 'public'" error, ensure that `vercel.json` exists with `{"outputDirectory": "."}` so the root folder is served.
