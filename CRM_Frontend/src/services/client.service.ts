import { apiClient } from "./api-client";
import type { Client, PaginatedResponse } from "../types";

export interface ClientFilters {
  page?: number;
  limit?: number;
  search?: string;
  projectId?: string;
  status?: string;
  name?: string;
  phone?: string;
}

export const clientService = {
  async getClients(params: ClientFilters = {}) {
    const response = await apiClient.get<any>("/clients", { params });
    return response.data.data;
  },

  async getClient(id: string) {
    const response = await apiClient.get<any>(`/clients/${id}`);
    return response.data.data;
  },

  async createClient(clientData: Partial<Client>) {
    const response = await apiClient.post<any>("/clients", clientData);
    return response.data.data;
  },

  async updateClient(id: string, clientData: Partial<Client>) {
    const response = await apiClient.patch<any>(`/clients/${id}`, clientData);
    return response.data.data;
  },

  async deleteClient(id: string) {
    await apiClient.delete(`/clients/${id}`);
  },

  async uploadBulk(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<any>("/clients/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data; // Contém estatísticas de importação e duplicados
  },
};
