import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { mailer } from '../config/mailer.js';
import { generateOtp, verifyOtp } from '../services/otpService.js';

const router = Router();
const allowedEmail = process.env.ALLOWED_ADMIN_EMAIL;

const ensureAdminEmail = (email) => email && email.toLowerCase() === allowedEmail?.toLowerCase();

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!ensureAdminEmail(email)) {
    return res.status(403).json({ message: 'Unauthorized email address.' });
  }

  try {
    const otp = generateOtp(email);
    await mailer.sendMail({
      from: process.env.GMAIL_USER,
      to: allowedEmail,
      subject: 'Agrizen Admin OTP',
      html: `<p>Your one-time password is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });
    res.json({ message: 'OTP sent successfully.' });
  } catch (err) {
    console.error('[otp] failed to send email:', err);
    res.status(500).json({ message: 'Failed to send OTP. Please retry in a moment.' });
  }
});

router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!ensureAdminEmail(email)) {
    return res.status(403).json({ message: 'Unauthorized email address.' });
  }
  if (!otp) {
    return res.status(400).json({ message: 'OTP is required.' });
  }

  const isValid = verifyOtp(email, otp);
  if (!isValid) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }

  const token = jwt.sign(
    { email: allowedEmail, role: 'ADMIN' },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({ message: 'OTP verified.', token });
});

export default router;

