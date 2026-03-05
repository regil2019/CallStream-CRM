import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Upload,
  Phone,
  Mail,
  Building,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { api } from "../../../services/api";
import type { Client } from "../../../types";
import { ClientForm } from "./ClientForm";
import { ClientImport } from "./ClientImport";

export function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadClients();
  }, [page, search, statusFilter]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;

      const response = await api.getClients(params);
      setClients(response.clients || []);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этого клиента?")) return;

    try {
      await api.deleteClient(id);
      loadClients();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingClient(null);
    loadClients();
  };

  const getStatusBadge = (status: Client["status"]) => {
    const styles: Record<string, string> = {
      new: "bg-blue-100 text-blue-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    const labels: Record<string, string> = {
      new: "Новый",
      in_progress: "В работе",
      completed: "Завершен",
      rejected: "Отклонен",
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
    return <ClientForm client={editingClient} onClose={handleFormClose} />;
  }

  if (showImport) {
    return (
      <ClientImport
        onClose={() => {
          setShowImport(false);
          loadClients();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Клиенты</h1>
          <p className="text-gray-600 mt-2">Управление базой клиентов</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowImport(true)}
            className="flex-1 sm:flex-none"
          >
            <Upload className="w-4 h-4 mr-2" />
            Импорт
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="flex-1 sm:flex-none"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск по имени, телефону, компании..."
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все статусы</option>
                <option value="new">Новые</option>
                <option value="in_progress">В работе</option>
                <option value="completed">Завершенные</option>
                <option value="rejected">Отклоненные</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Загрузка...</div>
            </div>
          ) : clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Нет клиентов
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm">
                База клиентов пуста. Вы можете добавить клиентов вручную или
                импортировать их из Excel.
              </p>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowImport(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Импорт из файла
                </Button>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить вручную
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Клиент
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Контакты
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Компания
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clients.map((client: Client) => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {client.name}
                          </div>
                          {client.notes && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {client.notes}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center text-sm text-gray-900">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              {client.phone}
                            </div>
                            {client.email && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                {client.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {client.company && (
                            <div className="flex items-center text-sm text-gray-900">
                              <Building className="w-4 h-4 mr-2 text-gray-400" />
                              <div>
                                <div>{client.company}</div>
                                {client.inn && (
                                  <div className="text-xs text-gray-500">
                                    ИНН: {client.inn}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(client.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(client)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(client.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Страница {page} из {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setPage((p: number) => Math.min(totalPages, p + 1))
                    }
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
