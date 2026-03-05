import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Search, BookOpen, Mail, Phone as PhoneIcon } from "lucide-react";
import { Input } from "../ui/input";
import { api } from "../../../services/api";
import type { Script, Template } from "../../../types";

export function Reference() {
  const [activeTab, setActiveTab] = useState<"scripts" | "templates">(
    "scripts",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [scripts, setScripts] = useState<Script[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [loadedScripts, loadedTemplates] = await Promise.all([
          api.getScripts(),
          api.getTemplates(),
        ]);
        setScripts(loadedScripts || []);
        setTemplates(loadedTemplates || []);
      } catch (error) {
        console.error("Error loading reference data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredScripts = scripts.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.content.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredTemplates = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.content.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 pt-6 px-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Справочники</h1>
        <p className="text-gray-600 mt-2">
          База знаний: скрипты и шаблоны (Режим просмотра)
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("scripts")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "scripts"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Скрипты звонков</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "templates"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Шаблоны сообщений</span>
            </div>
          </button>
        </nav>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Поиск по базе знаний..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Загрузка данных...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
          {activeTab === "scripts"
            ? filteredScripts.map((script) => (
                <Card key={script.id}>
                  <CardHeader>
                    <h3 className="font-semibold text-gray-900">
                      {script.title}
                    </h3>
                    {script.category && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded w-fit">
                        {script.category}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
                      {script.content}
                    </p>
                  </CardContent>
                </Card>
              ))
            : filteredTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <h3 className="font-semibold text-gray-900">
                      {template.title}
                    </h3>
                    {template.type && (
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        {template.type === "email" ? (
                          <Mail className="w-4 h-4 mr-1" />
                        ) : (
                          <PhoneIcon className="w-4 h-4 mr-1" />
                        )}
                        {template.type.toUpperCase()}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
                      {template.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>
      )}
    </div>
  );
}
