const nodemailer = require('nodemailer');

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
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }

  const requiredVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
  const missing = requiredVars.filter(v => !process.env[v]);
  if (missing.length) {
    res.status(500).json({ error: `Server email configuration missing: ${missing.join(', ')}` });

    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO || process.env.SMTP_FROM,
      replyTo: email,
      subject: `Contact from ${name}`,
      text: message,
      html: `<p>${message}</p><p>From: ${name} (${email})</p>`
    });
    res.status(200).json({ message: 'Message sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
};
