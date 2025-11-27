import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { otpLimiter } from './middlewares/rateLimiter.js';
import { verifyMailerConfig } from './config/mailer.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/admin/otp', otpLimiter, authRoutes);

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`OTP service listening on port ${port}`);
  await verifyMailerConfig();
});

