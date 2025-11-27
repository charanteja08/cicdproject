import crypto from 'crypto';

const otpCache = new Map(); // email -> { hash, expiresAt }

const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

export const generateOtp = (email) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresIn = Number(process.env.OTP_EXPIRY_MS || 5 * 60 * 1000);
  otpCache.set(email, {
    hash: hashOtp(otp),
    expiresAt: Date.now() + expiresIn,
  });
  return otp;
};

export const verifyOtp = (email, otp) => {
  const cached = otpCache.get(email);
  if (!cached) return false;
  const { hash, expiresAt } = cached;
  if (Date.now() > expiresAt) {
    otpCache.delete(email);
    return false;
  }
  const matches = hash === hashOtp(otp);
  if (matches) {
    otpCache.delete(email);
  }
  return matches;
};

export const clearOtp = (email) => otpCache.delete(email);

