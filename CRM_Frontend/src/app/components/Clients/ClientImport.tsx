import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { api } from "../../../services/api";

interface ClientImportProps {
  onClose: () => void;
}

export function ClientImport({ onClose }: ClientImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    imported: number;
    duplicates: number;
    errors: number;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const importResult = await api.importClients(file);
      setResult(importResult);
    } catch (error: any) {
      console.error("Error importing clients:", error);
      alert("Ошибка импорта. Проверьте формат файла.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Импорт клиентов</h1>
          <p className="text-gray-600 mt-2">
            Загрузите файл с данными клиентов
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Загрузка файла
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />

              {file ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <button
                    onClick={() => setFile(null)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Выбрать другой файл
                  </button>
                </div>
              ) : (
                <div>
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Выберите файл
                    </span>
                    <span className="text-gray-600"> или перетащите сюда</span>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Поддерживаются форматы: CSV, Excel
                  </p>
                </div>
              )}
            </div>

            {file && !result && (
              <Button
                onClick={handleImport}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Импорт..." : "Начать импорт"}
              </Button>
            )}

            {result && (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Импорт завершен</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">
                      Импортировано клиентов
                    </span>
                    <span className="font-medium text-green-600">
                      {result.imported}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Дубликатов пропущено</span>
                    <span className="font-medium text-yellow-600">
                      {result.duplicates}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">Ошибок</span>
                    <span className="font-medium text-red-600">
                      {result.errors}
                    </span>
                  </div>
                </div>

                <Button onClick={onClose} className="w-full">
                  Готово
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Формат файла
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Требования к файлу:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Файл должен содержать заголовки столбцов</li>
                    <li>Обязательные поля: Имя, Телефон</li>
                    <li>Дубликаты проверяются по телефону и ИНН</li>
                    <li>Неверные данные будут пропущены</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Пример структуры:
              </h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <div>Имя,Телефон,Email,Компания,ИНН</div>
                <div>
                  Иванов И.И.,+79161234567,ivanov@mail.ru,ООО Рога,7707083893
                </div>
                <div>
                  Петров П.П.,+79167654321,petrov@mail.ru,АО Копыта,7707049388
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Поддерживаемые столбцы:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="font-medium min-w-[100px]">Имя *</span>
                  <span className="text-gray-600">Полное имя клиента</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium min-w-[100px]">Телефон *</span>
                  <span className="text-gray-600">Номер телефона</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium min-w-[100px]">Email</span>
                  <span className="text-gray-600">Адрес электронной почты</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium min-w-[100px]">Компания</span>
                  <span className="text-gray-600">Название компании</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium min-w-[100px]">ИНН</span>
                  <span className="text-gray-600">10 или 12 цифр</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium min-w-[100px]">Заметки</span>
                  <span className="text-gray-600">
                    Дополнительная информация
                  </span>
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">* Обязательные поля</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
