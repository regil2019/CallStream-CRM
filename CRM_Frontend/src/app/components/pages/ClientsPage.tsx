import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Search,
  Plus,
  Upload,
  Edit,
  Trash2,
  Phone,
  Mail,
  Building,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { clientService } from "../../../services/client.service";
import type { Client } from "../../../types";

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchClients();
  }, [currentPage, searchTerm]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const result = await clientService.getClients({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      });
      // The backend returns an object with 'clients' array and pagination info
      // but clientService.getClients returns response.data.data
      // Let's verify the actual structure.
      setClients(result.clients || result.data || []);
      setTotalPages(result.totalPages || 0);
      setTotalItems(result.total || 0);
    } catch (error) {
      toast.error("Ошибка при загрузке клиентов");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await clientService.createClient({
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        company: formData.get("company") as string,
        inn: formData.get("inn") as string,
        status: formData.get("status") as any,
      });
      toast.success("Клиент успешно добавлен");
      setIsAddDialogOpen(false);
      fetchClients();
    } catch (error) {
      toast.error("Ошибка при добавлении клиента");
    }
  };

  const handleEditClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingClient) return;

    const formData = new FormData(e.currentTarget);

    try {
      await clientService.updateClient(editingClient.id, {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        company: formData.get("company") as string,
        inn: formData.get("inn") as string,
        status: formData.get("status") as any,
      });
      toast.success("Клиент успешно обновлен");
      setIsEditDialogOpen(false);
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      toast.error("Ошибка при обновлении клиента");
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm("Вы уверены, что хотите удалить этого клиента?")) {
      try {
        await clientService.deleteClient(id);
        toast.success("Клиент успешно удален");
        fetchClients();
      } catch (error) {
        toast.error("Ошибка при удалении клиента");
      }
    }
  };

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    if (!file) return;

    const toastId = toast.loading("Импорт клиентов...");
    try {
      const result = await clientService.uploadBulk(file);
      toast.success(
        `Импорт завершен: ${result.successful} успешно, ${result.duplicates} дубликатов`,
        { id: toastId },
      );
      setIsUploadDialogOpen(false);
      fetchClients();
    } catch (error) {
      toast.error("Ошибка при импорте клиентов", { id: toastId });
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "NEW":
        return "Новый";
      case "IN_PROGRESS":
        return "В работе";
      case "CONVERTED":
        return "Закрыт";
      case "INTERESTED":
        return "Заинтересован";
      case "NOT_INTERESTED":
        return "Не заинтересован";
      case "UNREACHABLE":
        return "Недозвон";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "NEW":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "CONVERTED":
        return "bg-green-100 text-green-800";
      case "INTERESTED":
        return "bg-purple-100 text-purple-800";
      case "NOT_INTERESTED":
        return "bg-red-100 text-red-800";
      case "UNREACHABLE":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Клиенты</h1>
          <p className="text-gray-500 mt-1">Управление базой клиентов</p>
        </div>
        <div className="flex gap-3">
          <Dialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Импорт
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Массовая загрузка клиентов</DialogTitle>
                <DialogDescription>
                  Загрузите файл с данными клиентов (CSV, XLSX)
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Выберите файл</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Система автоматически проверит дубли по телефону и ИНН
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  Загрузить
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить клиента
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Новый клиент</DialogTitle>
                <DialogDescription>
                  Заполните информацию о клиенте
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddClient} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя *</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Компания</Label>
                    <Input id="company" name="company" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inn">ИНН</Label>
                    <Input id="inn" name="inn" placeholder="10 или 12 цифр" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Статус</Label>
                    <Select name="status" defaultValue="новый">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="новый">Новый</SelectItem>
                        <SelectItem value="в работе">В работе</SelectItem>
                        <SelectItem value="закрыт">Закрыт</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Заметки</Label>
                  <Textarea id="notes" name="notes" rows={3} />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button type="submit">Сохранить</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск по имени, телефону, компании или ИНН..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список клиентов ({totalItems})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Имя</TableHead>
                    <TableHead>Контакты</TableHead>
                    <TableHead>Компания</TableHead>
                    <TableHead>ИНН</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата создания</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.name}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {client.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {client.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          {client.company || "—"}
                        </div>
                      </TableCell>
                      <TableCell>{client.inn || "—"}</TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(client.status)}
                          variant="secondary"
                        >
                          {getStatusLabel(client.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {client.createdAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingClient(client);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500">
                    Страница {currentPage} из {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingClient && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Редактировать клиента</DialogTitle>
              <DialogDescription>
                Измените информацию о клиенте
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Имя *</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingClient.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Телефон *</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    type="tel"
                    defaultValue={editingClient.phone}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    defaultValue={editingClient.email}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Компания</Label>
                  <Input
                    id="edit-company"
                    name="company"
                    defaultValue={editingClient.company}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-inn">ИНН</Label>
                  <Input
                    id="edit-inn"
                    name="inn"
                    defaultValue={editingClient.inn}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Статус</Label>
                  <Select name="status" defaultValue={editingClient.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="новый">Новый</SelectItem>
                      <SelectItem value="в работе">В работе</SelectItem>
                      <SelectItem value="закрыт">Закрыт</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Заметки</Label>
                <Textarea
                  id="edit-notes"
                  name="notes"
                  rows={3}
                  defaultValue={editingClient.notes}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingClient(null);
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
