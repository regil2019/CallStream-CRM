import {
  Users,
  FolderKanban,
  Phone,
  BarChart3,
  BookOpen,
  LogOut,
  Building2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface SidebarProps {
  user: any;
  currentPage: string;
  onPageChange: (page: any) => void;
  onLogout: () => void;
}

export function Sidebar({
  user,
  currentPage,
  onPageChange,
  onLogout,
}: SidebarProps) {
  const menuItems = [
    { id: "clients", label: "Клиенты", icon: Users },
    { id: "projects", label: "Проекты", icon: FolderKanban },
    { id: "calls", label: "Звонки", icon: Phone },
    { id: "statistics", label: "Статистика", icon: BarChart3 },
    { id: "references", label: "Справочники", icon: BookOpen },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">CRM Система</h1>
            <p className="text-xs text-gray-500">Панель управления</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 ${
                isActive
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  : "text-gray-700"
              }`}
              onClick={() => onPageChange(item.id)}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <Separator />

      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarFallback className="bg-blue-600 text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </Button>
      </div>
    </div>
  );
}
