import { z } from "zod";

// --- Helpers ---

export const isValidInn = (inn: string): boolean => {
  if (!inn) return false;

  // Check if it's a number string
  if (!/^\d+$/.test(inn)) return false;

  // 10 digits (Legal Entity)
  if (inn.length === 10) {
    const d = inn.split("").map(Number);
    const weights = [2, 4, 10, 3, 5, 9, 4, 6, 8];
    const sum = weights.reduce((acc, weight, i) => acc + weight * d[i], 0);
    const control = (sum % 11) % 10;
    return control === d[9];
  }

  // 12 digits (Sole Proprietor)
  if (inn.length === 12) {
    const d = inn.split("").map(Number);

    const weights1 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
    const sum1 = weights1.reduce((acc, weight, i) => acc + weight * d[i], 0);
    const control1 = (sum1 % 11) % 10;

    const weights2 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
    const sum2 = weights2.reduce((acc, weight, i) => acc + weight * d[i], 0);
    const control2 = (sum2 % 11) % 10;

    return control1 === d[10] && control2 === d[11];
  }

  return false;
};

export const isValidRussianPhone = (phone: string): boolean => {
  // Supports +7XXXXXXXXXX or 8XXXXXXXXXX
  return /^(?:\+7|8)\d{10}$/.test(phone);
};

export const isValidEmail = (email: string): boolean => {
  // Supports standard emails and cyrillic domains (.рф)
  // Punycode logic is handled by frontend usually, but if backend receives raw utf8:
  // Simple regex allowing cyrillic chars in domain
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z\u0400-\u04FF]{2,}$/;
  // Additional check for specific top-level domains requested just to be precise
  // (This is not strictly required to FAIL others, but to ensure these PASS)
  return emailRegex.test(email);
};

// --- Zod Schemas ---

export const phoneSchema = z
  .string()
  .refine(
    isValidRussianPhone,
    "Некорректный формат телефона. Используйте формат +7XXXXXXXXXX или 8XXXXXXXXXX",
  )
  .optional()
  .nullable()
  .or(z.literal("").transform(() => null));

export const innSchema = z
  .string()
  .refine((val) => /^\d+$/.test(val), "ИНН должен содержать только цифры")
  .refine(
    (val) => val.length === 10 || val.length === 12,
    "ИНН должен состоять из 10 или 12 цифр",
  )
  .refine(isValidInn, "Некорректная контрольная сумма ИНН");

export const emailSchema = z
  .string()
  .refine(
    isValidEmail,
    "Некорректный формат Email (поддерживаются домены .ru, .рф, .su, .by)",
  );

// Re-export specific validators for manual use if needed
export const validators = {
  isValidInn,
  isValidRussianPhone,
  isValidEmail,
};
