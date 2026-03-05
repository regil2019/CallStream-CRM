import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

const categories = [
  "Приветствие",
  "Квалификация",
  "Презентация",
  "Работа с возражениями",
  "Закрытие сделки",
];

const objectionTemplates = [
  {
    id: 1,
    title: "Дорого",
    content:
      "Я понимаю, что цена — важный фактор. Давайте сравним ценность, которую вы получаете...",
  },
  {
    id: 2,
    title: "Я подумаю",
    content:
      "Отлично. Над чем именно вы хотите подумать? Возможно, у вас остались вопросы?",
  },
  {
    id: 3,
    title: "Отправьте КП",
    content:
      "Конечно. Чтобы предложение было максимально релевантным, позвольте уточнить пару деталей...",
  },
  {
    id: 4,
    title: "У нас есть поставщик",
    content:
      "Это замечательно, что вы уже работаете с кем-то. Мы не предлагаем менять их прямо сейчас, а рассмотреть альтернативу...",
  },
];

export function ReferencesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <div className="space-y-6 pt-6 px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Справочники</h1>
          <p className="text-gray-600 mt-2">
            База знаний, скрипты и шаблоны ответов
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Категории</h2>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeCategory === category
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Поиск по базе знаний..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">
                {activeCategory}
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {activeCategory === "Работа с возражениями" ? (
                <div className="grid gap-4">
                  {objectionTemplates
                    .filter(
                      (t) =>
                        t.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        t.content
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                    )
                    .map((template) => (
                      <div
                        key={template.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-medium text-gray-900 mb-2">
                          {template.title}
                        </h3>
                        <p className="text-gray-600 bg-gray-100 p-3 rounded-md border-l-4 border-blue-500">
                          {template.content}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-gray-500 py-8 text-center italic">
                  Выберите категорию "Работа с возражениями" для просмотра
                  примеров шаблонов.
                  <br />
                  (Демо-версия базы знаний)
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
