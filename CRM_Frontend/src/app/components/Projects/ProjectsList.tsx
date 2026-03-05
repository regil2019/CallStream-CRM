import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Edit, Trash2, Users, Archive } from "lucide-react";
import { api } from "../../../services/api";
import type { Project } from "../../../types";
import { ProjectForm } from "./ProjectForm";

export function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data || []);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот проект?")) return;

    try {
      await api.deleteProject(id);
      loadProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProject(null);
    loadProjects();
  };

  const getStatusBadge = (status: Project["status"]) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      archived: "bg-gray-100 text-gray-800",
    };

    const labels = {
      active: "Активный",
      completed: "Завершен",
      archived: "Архив",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  if (showForm) {
    return <ProjectForm project={editingProject} onClose={handleFormClose} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Проекты</h1>
          <p className="text-gray-600 mt-2">
            Управление проектами и кампаниями
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Создать проект
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-gray-500">
              <Archive className="w-16 h-16 mb-4 text-gray-300" />
              <p>Проекты не найдены</p>
              <Button
                onClick={() => setShowForm(true)}
                variant="secondary"
                className="mt-4"
              >
                Создать первый проект
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {project.name}
                  </h3>
                  {getStatusBadge(project.status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {project.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    {project.clientsCount} клиентов
                  </span>
                </div>

                <div className="text-xs text-gray-500">
                  Создан:{" "}
                  {new Date(project.createdAt).toLocaleDateString("ru-RU")}
                </div>

                <div className="flex space-x-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Изменить</span>
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Удалить</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
