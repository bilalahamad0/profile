const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables from .env.local in local development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  let body = '';
  await new Promise((resolve, reject) => {
    req.on('data', chunk => (body += chunk));
    req.on('end', resolve);
    req.on('error', reject);
  });

  try {
    body = JSON.parse(body);
  } catch {
    body = require('querystring').parse(body);
  }

  const { name, email, message } = body;
  const bad = [];
  if (!name || !name.trim()) bad.push('name');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) bad.push('email');
  if (!message || !message.trim()) bad.push('message');
  if (bad.length) {
    res.status(400).json({ error: `Invalid or missing: ${bad.join(', ')}` });
    return;
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
    SMTP_TO
  } = process.env;

  const requiredVars = { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM };
  const missing = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length) {
    res.status(500).json({ error: `Server email configuration missing: ${missing.join(', ')}` });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '465', 10),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: SMTP_TO || SMTP_FROM,
      replyTo: email,
      subject: `Contact from ${name}`,
      text: message,
      html: `<p>${message}</p><p>From: ${name} (${email})</p>`
    });
    res.status(200).json({ message: 'Message sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
