const nodemailer = require('nodemailer');
require('dotenv').config();

const createTransporter = () => {
  if (process.env.EMAIL_HOST) {
    const port = Number(process.env.EMAIL_PORT || 465);
    const secure = typeof process.env.EMAIL_SECURE === 'string'
      ? process.env.EMAIL_SECURE.toLowerCase() === 'true'
      : port === 465;
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port,
      secure,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }
  if (process.env.EMAIL_SERVICE) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
};

async function main() {
  const transporter = createTransporter();
  const to = process.argv[2] || process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: 'Test Email - Cargo Backend',
    text: 'This is a test email from Cargo backend using current SMTP settings.',
  });
  console.log('✅ Test email sent:', info.messageId);
}

main().catch(err => {
  console.error('❌ Test email failed:', err);
  process.exit(1);
});
