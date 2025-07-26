const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables from .env.local when running locally
dotenv.config();

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
  console.log('Loaded SMTP config', {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    hasPass: Boolean(SMTP_PASS),
    SMTP_FROM,
    SMTP_TO
  });
  const missing = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length) {
    const msg = `Server email configuration missing: ${missing.join(', ')}`;
    console.error(msg);
    res.status(500).json({ error: msg });
    return;
  }
  console.log('SMTP configuration validated');

  const port = parseInt(SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE !== 'false'
    : port === 465;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified, sending mail');
    await transporter.sendMail({
      from: SMTP_FROM,
      to: SMTP_TO || SMTP_FROM,
      replyTo: email,
      subject: `Contact from ${name}`,
      text: message,
      html: `<p>${message}</p><p>From: ${name} (${email})</p>`
    });
    console.log('Mail sent successfully');
    res.status(200).json({ message: 'Message sent' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: err.message || 'Failed to send message' });
  }
};
