import { useState } from "react";
import { Button } from "../ui/button";
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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus, Phone, Clock, User, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Call {
  id: number;
  clientName: string;
  clientPhone: string;
  date: string;
  time: string;
  duration: string;
  result: "успешно" | "не отвечает" | "отказ" | "перезвонить";
  notes: string;
  manager: string;
  projectName?: string;
}

const mockCalls: Call[] = [
  {
    id: 1,
    clientName: "Алексей Смирнов",
    clientPhone: "+7 (495) 123-45-67",
    date: "2026-02-15",
    time: "10:30",
    duration: "12:45",
    result: "успешно",
    notes: "Клиент согласился на встречу. Назначено на 18.02 в 14:00",
    manager: "Иван Петров",
    projectName: "Весенняя кампания 2026",
  },
  {
    id: 2,
    clientName: "Мария Иванова",
    clientPhone: "+7 (495) 234-56-78",
    date: "2026-02-15",
    time: "11:15",
    duration: "05:20",
    result: "перезвонить",
    notes: "Клиент занят, попросил перезвонить завтра после 15:00",
    manager: "Иван Петров",
    projectName: "Весенняя кампания 2026",
  },
  {
    id: 3,
    clientName: "Дмитрий Петров",
    clientPhone: "+7 (812) 345-67-89",
    date: "2026-02-15",
    time: "09:45",
    duration: "00:00",
    result: "не отвечает",
    notes: "Не взял трубку",
    manager: "Мария Сидорова",
    projectName: "Реактивация клиентов",
  },
  {
    id: 4,
    clientName: "Елена Васильева",
    clientPhone: "+7 (495) 456-78-90",
    date: "2026-02-14",
    time: "16:20",
    duration: "08:15",
    result: "отказ",
    notes: "Клиент не заинтересован в данный момент",
    manager: "Мария Сидорова",
  },
];

export function CallsPage() {
  const [calls, setCalls] = useState<Call[]>(mockCalls);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterResult, setFilterResult] = useState<string>("все");

  const handleAddCall = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newCall: Call = {
      id: Date.now(),
      clientName: formData.get("clientName") as string,
      clientPhone: formData.get("clientPhone") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      duration: formData.get("duration") as string,
      result: formData.get("result") as any,
      notes: formData.get("notes") as string,
      manager: formData.get("manager") as string,
      projectName: (formData.get("projectName") as string) || undefined,
    };

    setCalls([newCall, ...calls]);
    setIsAddDialogOpen(false);
    toast.success("Звонок успешно зарегистрирован");
  };

  const filteredCalls =
    filterResult === "все"
      ? calls
      : calls.filter((call) => call.result === filterResult);

  const getResultColor = (result: string) => {
    switch (result) {
      case "успешно":
        return "bg-green-100 text-green-800";
      case "не отвечает":
        return "bg-gray-100 text-gray-800";
      case "отказ":
        return "bg-red-100 text-red-800";
      case "перезвонить":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Звонки</h1>
          <p className="text-gray-500 mt-1">История и регистрация звонков</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Зарегистрировать звонок
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Новый звонок</DialogTitle>
              <DialogDescription>
                Зарегистрируйте информацию о звонке
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCall} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Имя клиента *</Label>
                  <Input id="clientName" name="clientName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Телефон *</Label>
                  <Input
                    id="clientPhone"
                    name="clientPhone"
                    type="tel"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Дата *</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Время *</Label>
                  <Input id="time" name="time" type="time" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Длительность *</Label>
                  <Input
                    id="duration"
                    name="duration"
                    placeholder="MM:SS"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="result">Результат *</Label>
                  <Select name="result" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите результат" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="успешно">Успешно</SelectItem>
                      <SelectItem value="не отвечает">Не отвечает</SelectItem>
                      <SelectItem value="отказ">Отказ</SelectItem>
                      <SelectItem value="перезвонить">Перезвонить</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Менеджер *</Label>
                  <Input id="manager" name="manager" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectName">Проект</Label>
                  <Input id="projectName" name="projectName" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Заметки *</Label>
                <Textarea id="notes" name="notes" rows={3} required />
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Всего звонков</p>
                <p className="text-2xl font-bold mt-1">{calls.length}</p>
              </div>
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Успешных</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {calls.filter((c) => c.result === "успешно").length}
                </p>
              </div>
              <Phone className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Требуют повтора</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">
                  {
                    calls.filter(
                      (c) =>
                        c.result === "перезвонить" ||
                        c.result === "не отвечает",
                    ).length
                  }
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Отказов</p>
                <p className="text-2xl font-bold mt-1 text-red-600">
                  {calls.filter((c) => c.result === "отказ").length}
                </p>
              </div>
              <Phone className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label>Фильтр по результату:</Label>
            <Select value={filterResult} onValueChange={setFilterResult}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="все">Все</SelectItem>
                <SelectItem value="успешно">Успешно</SelectItem>
                <SelectItem value="не отвечает">Не отвечает</SelectItem>
                <SelectItem value="отказ">Отказ</SelectItem>
                <SelectItem value="перезвонить">Перезвонить</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>История звонков ({filteredCalls.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата и время</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Длительность</TableHead>
                <TableHead>Результат</TableHead>
                <TableHead>Менеджер</TableHead>
                <TableHead>Проект</TableHead>
                <TableHead>Заметки</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{call.date}</p>
                        <p className="text-sm text-gray-600">{call.time}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{call.clientName}</p>
                      <p className="text-sm text-gray-600">
                        {call.clientPhone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {call.duration}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getResultColor(call.result)}
                      variant="secondary"
                    >
                      {call.result}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {call.manager}
                    </div>
                  </TableCell>
                  <TableCell>
                    {call.projectName ? (
                      <span className="text-sm text-gray-600">
                        {call.projectName}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2 max-w-md">
                      <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {call.notes}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
