import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ArrowLeft, Save } from "lucide-react";
import { api } from "../../../services/api";
import type { Project } from "../../../types";

interface ProjectFormProps {
  project?: Project | null;
  onClose: () => void;
}

export function ProjectForm({ project, onClose }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || ("active" as Project["status"]),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Название проекта обязательно";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (project) {
        await api.updateProject(project.id, formData);
      } else {
        await api.createProject(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
      setErrors({ submit: "Ошибка сохранения. Попробуйте снова." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
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
            {project ? "Редактировать проект" : "Новый проект"}
          </h1>
          <p className="text-gray-600 mt-2">
            {project
              ? "Обновите информацию о проекте"
              : "Создайте новый проект"}
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

            <Input
              label="Название проекта *"
              placeholder="Холодные звонки - Февраль 2026"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Описание проекта или кампании..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Активный</option>
                <option value="completed">Завершен</option>
                <option value="archived">Архив</option>
              </select>
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
