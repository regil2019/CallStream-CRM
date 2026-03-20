import prisma from "../utils/prisma";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { User, Role, Prisma } from "@prisma/client";
import { z } from "zod";
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
});

const generateToken = (user: User): string => {
  const options: SignOptions = {
    expiresIn: 86400,
  };
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    options,
  );
};

export const registerSchema = z.object({
  email: z.string().email("Некорректный формат email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
  name: z.string().min(1, "Имя обязательно"),
  phone: z
    .string()
    .transform((val) => val.replace(/[^\d+]/g, ""))
    .refine((val) => {
      if (!val) return true;
      // Allow +7 or 8 followed by 10 digits, or just 10 digits
      const phoneRegex = /^(\+7|7|8)?\d{10}$/;
      return phoneRegex.test(val);
    }, "Некорректный формат телефона")
    .transform((val) => {
      if (!val) return undefined;
      let digits = val.replace(/[^\d]/g, "");
      if (digits.length === 10) return "+7" + digits;
      if (digits.length === 11) {
        if (digits.startsWith("8") || digits.startsWith("7")) {
          return "+7" + digits.slice(1);
        }
      }
      return val;
    })
    .optional(),
});

export const loginSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    password: z.string(),
  })
  .refine((data) => data.email || data.phone, {
    message: "Необходимо указать Email или телефон",
    path: ["email", "phone"],
  });

export const verifySchema = z.object({
  phone: z.string(),
  code: z.string(),
});

export class AuthService {
  static async register(data: z.infer<typeof registerSchema>) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          data.phone ? { phone: data.phone } : undefined,
        ].filter(Boolean) as Prisma.UserWhereInput[],
      },
    });

    if (existingUser) {
      const isEmail = existingUser.email === data.email;
      const error: any = new Error(
        isEmail
          ? "Этот email уже зарегистрирован"
          : "Этот номер телефона уже зарегистрирован",
      );
      error.statusCode = 409;
      error.details = { field: isEmail ? "email" : "phone" };
      throw error;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name ?? undefined,
        phone: (data.phone ?? undefined) as any,
        role: Role.MANAGER,
        isVerified: true,
      },
    });

    const token = generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    };
  }

  static async verify(phone: string, code: string) {
    const storedCode = await redis.get(`verify:${phone}`);
    if (!storedCode || storedCode !== code) {
      throw new Error("Недействительный или истекший код");
    }

    const user = await prisma.user.update({
      where: { phone },
      data: { isVerified: true },
    });

    await redis.del(`verify:${phone}`);

    return { token: generateToken(user) };
  }

  static async login(data: z.infer<typeof loginSchema>) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          data.email ? { email: data.email } : undefined,
          data.phone ? { phone: data.phone } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      throw new Error("Неверные учетные данные");
    }

    return {
      token: generateToken(user),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    };
  }

  static async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      const error = new Error("Пользователь не найден");
      (error as any).statusCode = 404;
      throw error;
    }

    return user;
  }
}
