import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ArrowLeft, Save } from "lucide-react";
import { api } from "../../../services/api";
import type { Client, Project } from "../../../types";

interface ClientFormProps {
  client?: Client | null;
  onClose: () => void;
}

export function ClientForm({ client, onClose }: ClientFormProps) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({
    name: "",
    phone: "",
    email: "",
    company: "",
    inn: "",
    status: "new" as Client["status"],
    projectId: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProjects();
    if (client) {
      setFormData({
        name: client.name,
        phone: client.phone,
        email: client.email || "",
        company: client.company || "",
        inn: client.inn || "",
        status: client.status,
        projectId: client.projectId || "",
        notes: client.notes || "",
      });
    }
  }, [client]);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data || []);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон обязателен";
    } else if (
      !/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/[\s-()]/g, ""))
    ) {
      newErrors.phone = "Неверный формат телефона";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Неверный формат email";
    }

    if (formData.inn && !/^[0-9]{10,12}$/.test(formData.inn)) {
      newErrors.inn = "ИНН должен содержать 10 или 12 цифр";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (client) {
        await api.updateClient(client.id, formData);
      } else {
        await api.createClient(formData);
      }
      onClose();
    } catch (error: any) {
      console.error("Error saving client:", error);

      if (error.response?.data?.errors) {
        // Map backend validation errors (e.g. { phone: "Invalid format" })
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({
          submit: "Ошибка сохранения. Проверьте данные и попробуйте снова.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev: Record<string, string>) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {client ? "Редактировать клиента" : "Новый клиент"}
          </h1>
          <p className="text-gray-600 mt-2">
            {client
              ? "Обновите информацию о клиенте"
              : "Добавьте нового клиента в базу"}
          </p>
        </div>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Имя *"
                placeholder="Иван Иванович Иванов"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("name", e.target.value)
                }
                error={errors.name}
              />

              <div className="space-y-2">
                <Input
                  label="Телефон *"
                  placeholder="+7 (XXX) XXX-XX-XX"
                  value={formData.phone}
                  onChange={(e) => {
                    let value = e.target.value;
                    const digits = value.replace(/\D/g, "");

                    // Basic +7 formatting logic
                    if (digits.length <= 11) {
                      let formatted = "";
                      if (digits.length > 0) formatted += "+7";
                      if (digits.length > 1)
                        formatted += " (" + digits.substring(1, 4);
                      if (digits.length > 4)
                        formatted += ") " + digits.substring(4, 7);
                      if (digits.length > 7)
                        formatted += "-" + digits.substring(7, 9);
                      if (digits.length > 9)
                        formatted += "-" + digits.substring(9, 11);
                      handleChange("phone", formatted);
                    } else if (value.length < formData.phone.length) {
                      // Allow deletion
                      handleChange("phone", value);
                    }
                  }}
                  maxLength={18} // +7 (123) 456-78-90
                  error={errors.phone}
                />
              </div>

              <Input
                label="Email"
                type="email"
                placeholder="client@example.com"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("email", e.target.value)
                }
                error={errors.email}
              />

              <Input
                label="Компания"
                placeholder='ООО "Название"'
                value={formData.company}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("company", e.target.value)
                }
              />

              <Input
                label="ИНН"
                placeholder="1234567890"
                value={formData.inn}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("inn", e.target.value)
                }
                error={errors.inn}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус *
                </label>
                <select
                  value={formData.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleChange("status", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="new">Новый</option>
                  <option value="in_progress">В работе</option>
                  <option value="completed">Завершен</option>
                  <option value="rejected">Отклонен</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Проект
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleChange("projectId", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Без проекта</option>
                  {projects.map((project: Project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Заметки
              </label>
              <textarea
                value={formData.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleChange("notes", e.target.value)
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Дополнительная информация о клиенте..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
