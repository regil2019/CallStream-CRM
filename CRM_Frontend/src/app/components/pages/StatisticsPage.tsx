import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Phone,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { useState } from "react";

const callsDataByDay = [
  { day: "Пн", успешно: 12, неУспешно: 5, перезвонить: 3 },
  { day: "Вт", успешно: 15, неУспешно: 4, перезвонить: 2 },
  { day: "Ср", успешно: 18, неУспешно: 6, перезвонить: 4 },
  { day: "Чт", успешно: 14, неУспешно: 3, перезвонить: 5 },
  { day: "Пт", успешно: 20, неУспешно: 7, перезвонить: 3 },
  { day: "Сб", успешно: 8, неУспешно: 2, перезвонить: 1 },
  { day: "Вс", успешно: 5, неУспешно: 1, перезвонить: 1 },
];

const resultsPieData = [
  { name: "Успешно", value: 92, color: "#22c55e" },
  { name: "Не отвечает", value: 28, color: "#94a3b8" },
  { name: "Отказ", value: 15, color: "#ef4444" },
  { name: "Перезвонить", value: 19, color: "#eab308" },
];

const managerStats = [
  { name: "Иван Петров", звонки: 85, конверсия: 68 },
  { name: "Мария Сидорова", звонки: 72, конверсия: 61 },
  { name: "Алексей Смирнов", звонки: 45, конверсия: 73 },
  { name: "Елена Васильева", звонки: 58, конверсия: 65 },
];

const monthlyTrend = [
  { month: "Окт", клиенты: 45, звонки: 180 },
  { month: "Ноя", клиенты: 52, звонки: 210 },
  { month: "Дек", клиенты: 61, звонки: 245 },
  { month: "Янв", клиенты: 58, звонки: 232 },
  { month: "Фев", клиенты: 73, звонки: 292 },
];

export function StatisticsPage() {
  const [period, setPeriod] = useState("week");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Статистика</h1>
          <p className="text-gray-500 mt-1">Аналитика и отчеты по работе</p>
        </div>
        <div className="flex items-center gap-3">
          <Label>Период:</Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="quarter">Квартал</SelectItem>
              <SelectItem value="year">Год</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Новых клиентов</p>
                <p className="text-3xl font-bold mt-1">73</p>
                <div className="flex items-center gap-1 mt-2 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+12% от прошлого месяца</span>
                </div>
              </div>
              <Users className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Всего звонков</p>
                <p className="text-3xl font-bold mt-1">292</p>
                <div className="flex items-center gap-1 mt-2 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+8% от прошлого месяца</span>
                </div>
              </div>
              <Phone className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Конверсия</p>
                <p className="text-3xl font-bold mt-1">67%</p>
                <div className="flex items-center gap-1 mt-2 text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-sm">-3% от прошлого месяца</span>
                </div>
              </div>
              <CheckCircle className="h-12 w-12 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Средняя длительность</p>
                <p className="text-3xl font-bold mt-1">8:42</p>
                <div className="flex items-center gap-1 mt-2 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+15% от прошлого месяца</span>
                </div>
              </div>
              <Calendar className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calls by Day */}
        <Card>
          <CardHeader>
            <CardTitle>Звонки по дням недели</CardTitle>
            <CardDescription>
              Распределение звонков и их результатов
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={callsDataByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="успешно" fill="#22c55e" name="Успешно" />
                <Bar dataKey="неУспешно" fill="#ef4444" name="Не успешно" />
                <Bar dataKey="перезвонить" fill="#eab308" name="Перезвонить" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Results Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Результаты звонков</CardTitle>
            <CardDescription>Общее распределение результатов</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resultsPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {resultsPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manager Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Эффективность менеджеров</CardTitle>
            <CardDescription>Количество звонков и конверсия</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={managerStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="звонки" fill="#3b82f6" name="Звонки" />
                <Bar dataKey="конверсия" fill="#22c55e" name="Конверсия %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Динамика по месяцам</CardTitle>
            <CardDescription>Рост клиентов и активности</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="клиенты"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Клиенты"
                />
                <Line
                  type="monotone"
                  dataKey="звонки"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Звонки"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Manager Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Детальная статистика по менеджерам</CardTitle>
          <CardDescription>
            Подробная информация о работе каждого менеджера
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {managerStats.map((manager, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{manager.name}</h4>
                  <div className="flex gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Звонков</p>
                      <p className="text-lg font-bold">{manager.звонки}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Конверсия</p>
                      <p className="text-lg font-bold text-green-600">
                        {manager.конверсия}%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Прогресс конверсии</span>
                    <span className="font-medium">{manager.конверсия}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${manager.конверсия}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
