const nodemailer = require('nodemailer');

async function sendEmail({ subject, text, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.SMTP_TO || 'bilal.ahamad@gmail.com',
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  const [,, subject, text] = process.argv;
  if (!subject || !text) {
    console.error('Usage: node notify.js <subject> <text>');
    process.exit(1);
  }
  sendEmail({ subject, text });
}

module.exports = sendEmail;
