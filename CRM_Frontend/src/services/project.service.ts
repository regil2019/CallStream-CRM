import { apiClient } from "./api-client";
import type { Project, Script, Template } from "../types";

export const projectService = {
  async getProjects(params: { page?: number; limit?: number } = {}) {
    const response = await apiClient.get<any>("/projects", { params });
    return response.data.data;
  },

  async getProject(id: string) {
    const response = await apiClient.get<any>(`/projects/${id}`);
    return response.data.data;
  },

  async createProject(projectData: Partial<Project>) {
    const response = await apiClient.post<any>("/projects", projectData);
    return response.data.data;
  },

  async updateProject(id: string, projectData: Partial<Project>) {
    const response = await apiClient.patch<any>(`/projects/${id}`, projectData);
    return response.data.data;
  },

  async deleteProject(id: string) {
    await apiClient.delete(`/projects/${id}`);
  },
};

export const scriptService = {
  async getScripts() {
    const response = await apiClient.get<any>("/scripts");
    return response.data.data;
  },

  async createScript(scriptData: Partial<Script>) {
    const response = await apiClient.post<any>("/scripts", scriptData);
    return response.data.data;
  },
};

export const templateService = {
  async getTemplates() {
    const response = await apiClient.get<any>("/templates");
    return response.data.data;
  },

  async createTemplate(templateData: Partial<Template>) {
    const response = await apiClient.post<any>("/templates", templateData);
    return response.data.data;
  },
};

export const statsService = {
  async getCallStats(params: { startDate?: string; endDate?: string } = {}) {
    const response = await apiClient.get<any>("/stats/calls", { params });
    return response.data.data;
  },
};
