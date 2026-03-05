import React from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BookOpen,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  currentPage,
  onNavigate,
  isOpen,
  onToggle,
}: SidebarProps) {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Панель управления", icon: LayoutDashboard },
    { id: "clients", label: "Клиенты", icon: Users },
    { id: "projects", label: "Проекты", icon: Briefcase },
    { id: "reference", label: "Справочники", icon: BookOpen },
    { id: "statistics", label: "Статистика", icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-64 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <h1 className="text-xl font-bold">CRM Система</h1>
            <button
              onClick={onToggle}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onNavigate(item.id);
                        if (window.innerWidth < 1024) {
                          onToggle();
                        }
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-800">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Выход</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-30 lg:hidden bg-gray-900 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
}
