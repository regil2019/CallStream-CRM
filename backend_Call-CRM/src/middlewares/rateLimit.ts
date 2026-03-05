import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Слишком много запросов, пожалуйста, попробуйте позже.",
  },
});

export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Слишком много попыток входа, пожалуйста, попробуйте позже.",
  },
});
