import nodemailer from 'nodemailer';

export const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const verifyMailerConfig = async () => {
  try {
    await mailer.verify();
    console.log('[mailer] Gmail transporter ready');
  } catch (err) {
    console.error('[mailer] Verification failed:', err.message);
  }
};

