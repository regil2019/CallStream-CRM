import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Plus, Users, Calendar, Target, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "активный" | "завершен" | "приостановлен";
  clientsCount: number;
  completedCalls: number;
  totalCalls: number;
  manager: string;
}

const mockProjects: Project[] = [
  {
    id: 1,
    name: "Весенняя кампания 2026",
    description: "Привлечение новых клиентов в сегменте B2B",
    startDate: "2026-02-01",
    endDate: "2026-04-30",
    status: "активный",
    clientsCount: 45,
    completedCalls: 127,
    totalCalls: 180,
    manager: "Иван Петров",
  },
  {
    id: 2,
    name: "Реактивация клиентов",
    description: "Возврат неактивных клиентов",
    startDate: "2026-01-15",
    endDate: "2026-03-15",
    status: "активный",
    clientsCount: 28,
    completedCalls: 84,
    totalCalls: 140,
    manager: "Мария Сидорова",
  },
  {
    id: 3,
    name: "Новогодняя акция",
    description: "Специальные предложения для VIP клиентов",
    startDate: "2025-12-01",
    endDate: "2026-01-10",
    status: "завершен",
    clientsCount: 32,
    completedCalls: 96,
    totalCalls: 96,
    manager: "Алексей Смирнов",
  },
];

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newProject: Project = {
      id: Date.now(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      status: "активный",
      clientsCount: 0,
      completedCalls: 0,
      totalCalls: 0,
      manager: formData.get("manager") as string,
    };

    setProjects([...projects, newProject]);
    setIsAddDialogOpen(false);
    toast.success("Проект успешно создан");
  };

  const handleEditProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject) return;

    const formData = new FormData(e.currentTarget);

    const updatedProject: Project = {
      ...editingProject,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      manager: formData.get("manager") as string,
    };

    setProjects(
      projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
    );
    setIsEditDialogOpen(false);
    setEditingProject(null);
    toast.success("Проект успешно обновлен");
  };

  const handleDeleteProject = (id: number) => {
    if (confirm("Вы уверены, что хотите удалить этот проект?")) {
      setProjects(projects.filter((p) => p.id !== id));
      toast.success("Проект успешно удален");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "активный":
        return "bg-green-100 text-green-800";
      case "завершен":
        return "bg-gray-100 text-gray-800";
      case "приостановлен":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Проекты</h1>
          <p className="text-gray-500 mt-1">
            Управление проектами и распределение клиентов
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Создать проект
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Новый проект</DialogTitle>
              <DialogDescription>
                Создайте новый проект для работы с клиентами
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название проекта *</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea id="description" name="description" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Дата начала *</Label>
                  <Input id="startDate" name="startDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Дата окончания *</Label>
                  <Input id="endDate" name="endDate" type="date" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Ответственный менеджер *</Label>
                <Input id="manager" name="manager" required />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button type="submit">Создать</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {project.description}
                  </CardDescription>
                </div>
                <Badge
                  className={getStatusColor(project.status)}
                  variant="secondary"
                >
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Клиенты</p>
                    <p className="text-lg font-semibold">
                      {project.clientsCount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Звонки</p>
                    <p className="text-lg font-semibold">
                      {project.completedCalls}/{project.totalCalls}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Прогресс</span>
                  <span className="font-medium">
                    {Math.round(
                      getProgressPercentage(
                        project.completedCalls,
                        project.totalCalls,
                      ),
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={getProgressPercentage(
                    project.completedCalls,
                    project.totalCalls,
                  )}
                />
              </div>

              {/* Dates */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  {project.startDate} — {project.endDate}
                </span>
              </div>

              {/* Manager */}
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500">Менеджер</p>
                <p className="text-sm font-medium">{project.manager}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setEditingProject(project);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingProject && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Редактировать проект</DialogTitle>
              <DialogDescription>
                Измените информацию о проекте
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditProject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Название проекта *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingProject.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Описание</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  rows={3}
                  defaultValue={editingProject.description}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Дата начала *</Label>
                  <Input
                    id="edit-startDate"
                    name="startDate"
                    type="date"
                    defaultValue={editingProject.startDate}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">Дата окончания *</Label>
                  <Input
                    id="edit-endDate"
                    name="endDate"
                    type="date"
                    defaultValue={editingProject.endDate}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-manager">Ответственный менеджер *</Label>
                <Input
                  id="edit-manager"
                  name="manager"
                  defaultValue={editingProject.manager}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingProject(null);
                  }}
                >
                  Отмена
                </Button>
                <Button type="submit">Сохранить изменения</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
