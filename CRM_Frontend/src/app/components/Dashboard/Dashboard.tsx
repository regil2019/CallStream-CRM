import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Users, Phone, CheckCircle, Clock } from "lucide-react";
import { api } from "../../../services/api";
import type { Statistics } from "../../../types";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const data = await api.getStatistics();
      setStats(data);
    } catch (error) {
      console.error("Error loading statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Всего клиентов",
      value: stats?.totalClients || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Всего звонков",
      value: stats?.totalCalls || 0,
      icon: Phone,
      color: "bg-green-500",
    },
    {
      title: "Успешных звонков",
      value: stats?.successfulCalls || 0,
      icon: CheckCircle,
      color: "bg-purple-500",
    },
    {
      title: "Средняя длительность",
      value: `${Math.floor((stats?.averageCallDuration || 0) / 60)} мин`,
      icon: Clock,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
        <p className="text-gray-600 mt-2">Обзор системы CRM</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card>
                <CardContent className="flex items-center space-x-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Звонки по дням
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(stats?.callsByDay || []).map((day) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(day.count / 70) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">
                      {day.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Результаты звонков
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(stats?.callsByResult || []).map((result) => {
                const colors: Record<string, string> = {
                  Успешно: "bg-green-500",
                  "Не ответил": "bg-yellow-500",
                  Занято: "bg-orange-500",
                  Отказ: "bg-red-500",
                };

                return (
                  <div
                    key={result.result}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${colors[result.result]}`}
                      />
                      <span className="text-sm text-gray-600">
                        {result.result}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {result.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
            Быстрые действия
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate("clients")}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left w-full"
            >
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900">Добавить клиента</h3>
              <p className="text-sm text-gray-600 mt-1">
                Создать новую запись клиента
              </p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate("projects")}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left w-full"
            >
              <Phone className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">Начать звонки</h3>
              <p className="text-sm text-gray-600 mt-1">
                Перейти к обзвоnu клиентов
              </p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate("projects")}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left w-full"
            >
              <CheckCircle className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-medium text-gray-900">Просмотр проектов</h3>
              <p className="text-sm text-gray-600 mt-1">
                Управление активными проектами
              </p>
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
