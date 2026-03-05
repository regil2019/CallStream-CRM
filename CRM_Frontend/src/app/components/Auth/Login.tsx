import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardContent } from "../ui/card";
import { LogIn } from "lucide-react";

interface LoginProps {
  onToggleMode: () => void;
}

export function Login({ onToggleMode }: LoginProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError("Неверный email или пароль");
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
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Вход в CRM систему
          </h1>
          <p className="text-gray-600 mt-2">Введите ваши учетные данные</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              type="email"
              label="Email"
              placeholder="example@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              type="password"
              label="Пароль"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Вход..." : "Войти"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onToggleMode}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Нет аккаунта? Зарегистрироваться
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
