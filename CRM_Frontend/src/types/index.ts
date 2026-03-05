export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "operator";
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  inn?: string;
  status: "new" | "in_progress" | "completed" | "rejected";
  projectId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "active" | "completed" | "archived";
  clientsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Call {
  id: string;
  clientId: string;
  userId: string;
  duration: number;
  result: "success" | "no_answer" | "busy" | "rejected";
  notes?: string;
  createdAt: string;
}

export interface Script {
  id: string;
  title: string;
  content: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  title: string;
  content: string;
  type?: "email" | "sms" | "message" | string;
  createdAt: string;
  updatedAt: string;
}

export interface Statistics {
  totalClients: number;
  totalCalls: number;
  successfulCalls: number;
  successRate: number;
  averageCallDuration: number;
  callsByDay: { date: string; count: number }[];
  callsByResult: { result: string; count: number }[];
  managerStats?: { userId: string; userName: string; count: number }[];
  projectStats?: {
    projectId: string;
    projectName: string;
    total: number;
    results: any[];
  }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
