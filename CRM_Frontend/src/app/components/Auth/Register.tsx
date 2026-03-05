import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardContent } from "../ui/card";
import { UserPlus } from "lucide-react";

interface RegisterProps {
  onToggleMode: () => void;
}

export function Register({ onToggleMode }: RegisterProps) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    phone?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    // Sanitize and normalize phone number
    let cleanPhone = phone.replace(/[^\d+]/g, "");
    if (cleanPhone.startsWith("8") && cleanPhone.length === 11) {
      cleanPhone = "+7" + cleanPhone.slice(1);
    }

    // Validate Russian phone number (+7XXXXXXXXXX)
    const phoneRegex = /^\+7\d{10}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setError(
        "Номер телефона должен быть в формате +7XXXXXXXXXX (например, +79161234567)",
      );
      return;
    }

    setLoading(true);
    setFieldErrors({});

    try {
      await register(email, password, name, cleanPhone);
    } catch (err: any) {
      if (err.response?.status === 409 && err.response?.data?.details?.field) {
        const field = err.response.data.details.field;
        setFieldErrors({ [field]: err.response.data.error });
      } else {
        const errorMessage =
          err.response?.data?.message ||
          "Ошибка регистрации. Попробуйте другой email или телефон";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Регистрация</h1>
          <p className="text-gray-600 mt-2">Создайте новый аккаунт</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя
              </label>
              <input
                type="text"
                placeholder="Иван Иванов"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="example@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={`w-full px-3 py-2 border ${fieldErrors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон *
              </label>
              <input
                type="tel"
                placeholder="+79161234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
                className={`w-full px-3 py-2 border ${fieldErrors.phone ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {fieldErrors.phone && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Формат: +7XXXXXXXXXX</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Подтверждение пароля
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onToggleMode}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Уже есть аккаунт? Войти
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
