import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
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
  Clock,
  Download,
} from "lucide-react";
import { api } from "../../../services/api";
import type { Statistics as StatsType } from "../../../types";

export function Statistics() {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7days");

  useEffect(() => {
    loadStatistics();
  }, [dateRange]);

  const loadStatistics = async () => {
    setLoading(true);
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
        <div className="text-gray-500">Загрузка статистики...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Нет данных</div>
      </div>
    );
  }

  const successRate =
    stats.totalCalls > 0
      ? ((stats.successfulCalls / stats.totalCalls) * 100).toFixed(1)
      : "0";

  const pieData = (stats.callsByResult || []).map((item) => ({
    name: item.result,
    value: item.count,
  }));

  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6b7280"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Статистика</h1>
          <p className="text-gray-600 mt-2">Аналитика и отчеты по звонкам</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="7days">7 дней</option>
            <option value="30days">30 дней</option>
            <option value="90days">90 дней</option>
          </select>
          <Button variant="secondary" className="flex-1 sm:flex-none">
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Всего клиентов</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalClients}
              </p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12% за период</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Всего звонков</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalCalls}
              </p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+8% за период</span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Phone className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Конверсия</p>
              <p className="text-3xl font-bold text-gray-900">{successRate}%</p>
              <div className="flex items-center mt-2 text-sm text-red-600">
                <TrendingDown className="w-4 h-4 mr-1" />
                <span>-2% за период</span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Средняя длительность</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.floor(stats.averageCallDuration / 60)}:
                {String(stats.averageCallDuration % 60).padStart(2, "0")}
              </p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+15% за период</span>
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calls by Day */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Звонки по дням
            </h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.callsByDay || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                    })
                  }
                  stroke="#6b7280"
                />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  labelFormatter={(date) =>
                    new Date(date).toLocaleDateString("ru-RU")
                  }
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" name="Звонков" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Calls by Result */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Результаты звонков
            </h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
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
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
            Динамика звонков
          </h2>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={stats.callsByDay || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "short",
                  })
                }
                stroke="#6b7280"
              />
              <YAxis stroke="#6b7280" />
              <Tooltip
                labelFormatter={(date) =>
                  new Date(date).toLocaleDateString("ru-RU")
                }
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Количество звонков"
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
            Детализация результатов
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Результат
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Количество
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Процент
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Тренд
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(stats.callsByResult || []).map((result, index) => {
                  const percentage = (
                    (result.count / stats.totalCalls) *
                    100
                  ).toFixed(1);
                  const trend = index % 2 === 0 ? "+" : "-";
                  const trendValue = (Math.random() * 10).toFixed(1);

                  return (
                    <tr key={result.result} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-3"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="font-medium text-gray-900">
                            {result.result}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {result.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-700">
                            {percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm ${trend === "+" ? "text-green-600" : "text-red-600"}`}
                        >
                          {trend}
                          {trendValue}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
