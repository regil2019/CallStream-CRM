import React, { useState, useEffect } from "react";
import { clientService } from "../services/client.service";
import { authService } from "../services/auth.service";
import { projectService, statsService } from "../services/project.service";
import type { Client, Project } from "../types";

export function LoginExample() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token, user } = await authService.login({ email, password });
      console.log("✅ Login bem-sucedido:", user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro no login");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Entrar</button>
    </form>
  );
}

export function ClientsListExample() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadClients();
  }, [page, search]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const response = await clientService.getClients({
        page,
        limit: 10,
        search,
        status: "new",
      });

      setClients(response.data);
      setTotalPages(response.totalPages);
      console.log(
        `📋 Carregados ${response.data.length} de ${response.total} clientes`,
      );
    } catch (error) {
      console.error("❌ Erro ao carregar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar clientes..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {clients.map((client) => (
            <li key={client.id}>
              {client.name} - {client.phone} ({client.status})
            </li>
          ))}
        </ul>
      )}

      <div>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ← Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}

export function CreateClientExample() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    inn: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    try {
      const newClient = await clientService.createClient(formData);
      console.log("✅ Cliente criado:", newClient);
      setSuccess(true);

      // Limpar formulário
      setFormData({ name: "", phone: "", email: "", company: "", inn: "" });
    } catch (error: any) {
      console.error("❌ Erro ao criar cliente:", error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ submit: "Erro ao salvar. Tente novamente." });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome *</label>
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
      </div>

      <div>
        <label>Telefone *</label>
        <input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+79161234567"
        />
        {errors.phone && <span style={{ color: "red" }}>{errors.phone}</span>}
      </div>

      <div>
        <label>INN (10 ou 12 dígitos)</label>
        <input
          value={formData.inn}
          onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
          placeholder="7707083893"
        />
        {errors.inn && <span style={{ color: "red" }}>{errors.inn}</span>}
      </div>

      {errors.submit && <p style={{ color: "red" }}>{errors.submit}</p>}
      {success && (
        <p style={{ color: "green" }}>✅ Cliente salvo com sucesso!</p>
      )}

      <button type="submit">Salvar Cliente</button>
    </form>
  );
}

export function BulkUploadExample() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    imported: number;
    duplicates: number;
    errors: number;
  } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const uploadResult = await clientService.uploadBulk(file);
      setResult(uploadResult);
      console.log("📤 Upload concluído:", uploadResult);
    } catch (error) {
      console.error("❌ Erro no upload:", error);
      alert("Erro ao importar ficheiro. Verifique o formato.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h3>Importar Clientes (CSV/Excel)</h3>

      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload}
        disabled={uploading}
      />

      {uploading && <p>⏳ Processando ficheiro...</p>}

      {result && (
        <div
          style={{ marginTop: "1rem", padding: "1rem", background: "#f0f0f0" }}
        >
          <h4>✅ Importação Concluída</h4>
          <p>✅ Importados: {result.imported}</p>
          <p>⚠️ Duplicados ignorados: {result.duplicates}</p>
          <p>❌ Erros: {result.errors}</p>
        </div>
      )}
    </div>
  );
}

export function UpdateClientExample({ clientId }: { clientId: string }) {
  const [status, setStatus] = useState<Client["status"]>("new");

  const handleUpdateStatus = async () => {
    try {
      await clientService.updateClient(clientId, { status });
      console.log("✅ Status atualizado para:", status);
      alert("Status atualizado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao atualizar:", error);
    }
  };

  return (
    <div>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as Client["status"])}
      >
        <option value="new">Novo</option>
        <option value="in_progress">Em Progresso</option>
        <option value="completed">Concluído</option>
        <option value="rejected">Rejeitado</option>
      </select>
      <button onClick={handleUpdateStatus}>Atualizar Status</button>
    </div>
  );
}

export function ProjectsExample() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectService.getProjects({ page: 1, limit: 20 });
      setProjects(response.data);
    } catch (error) {
      console.error("Erro ao carregar projectos:", error);
    }
  };

  const createNewProject = async () => {
    try {
      const newProject = await projectService.createProject({
        name: "Campanha de Março 2026",
        description: "Nova campanha de cold calling",
        status: "active",
      });
      console.log("✅ Projecto criado:", newProject);
      loadProjects();
    } catch (error) {
      console.error("❌ Erro ao criar projecto:", error);
    }
  };

  return (
    <div>
      <button onClick={createNewProject}>+ Criar Novo Projecto</button>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.name} - {project.clientsCount} clientes
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StatsExample() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await statsService.getCallStats({
        startDate: "2026-02-01",
        endDate: "2026-02-15",
      });
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  if (!stats) return <p>Carregando estatísticas...</p>;

  return (
    <div>
      <h3>📊 Estatísticas de Chamadas</h3>
      <p>Total de Clientes: {stats.totalClients}</p>
      <p>Total de Chamadas: {stats.totalCalls}</p>
      <p>
        Taxa de Sucesso:{" "}
        {((stats.successfulCalls / stats.totalCalls) * 100).toFixed(1)}%
      </p>
      <p>Duração Média: {stats.averageCallDuration}s</p>
    </div>
  );
}

export function AdvancedUploadExample() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log(
        "📄 Ficheiro selecionado:",
        selectedFile.name,
        `(${(selectedFile.size / 1024).toFixed(2)} KB)`,
      );
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const result = await clientService.uploadBulk(file);
      alert(
        `✅ Importação concluída!\n\n` +
          `Novos clientes: ${result.imported}\n` +
          `Duplicados ignorados: ${result.duplicates}\n` +
          `Erros: ${result.errors}`,
      );
      setFile(null);
    } catch (error: any) {
      alert(
        "❌ Erro ao fazer upload:\n" +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{ padding: "2rem", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <h3>📤 Upload de Ficheiro</h3>

      {!file ? (
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
        />
      ) : (
        <div>
          <p>
            <strong>Ficheiro:</strong> {file.name}
          </p>
          <p>
            <strong>Tamanho:</strong> {(file.size / 1024).toFixed(2)} KB
          </p>
          <button onClick={() => setFile(null)}>❌ Remover</button>
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? "⏳ Enviando..." : "✅ Confirmar Upload"}
          </button>
        </div>
      )}
    </div>
  );
}
