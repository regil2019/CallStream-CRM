import { authService } from "./auth.service";
import { clientService } from "./client.service";
import {
  projectService,
  scriptService,
  templateService,
  statsService,
} from "./project.service";
import type { Client, Project, Script, Template } from "../types";

/**
 * Legacy API object for backward compatibility.
 * Now powered by Axios and real backend services.
 */
class ApiService {
  // Auth
  getToken() {
    return localStorage.getItem("auth_token");
  }

  setToken(token: string) {
    localStorage.setItem("auth_token", token);
  }

  clearToken() {
    localStorage.removeItem("auth_token");
  }

  async login(email: string, password: string) {
    return authService.login({ email, password });
  }

  async register(email: string, password: string, name: string, phone: string) {
    return authService.register({ email, password, name, phone });
  }

  async getCurrentUser() {
    return authService.getMe();
  }

  // Clients
  async getClients(params?: any) {
    return clientService.getClients(params);
  }

  async getClient(id: string) {
    return clientService.getClient(id);
  }

  async createClient(data: Partial<Client>) {
    return clientService.createClient(data);
  }

  async updateClient(id: string, data: Partial<Client>) {
    return clientService.updateClient(id, data);
  }

  async deleteClient(id: string) {
    return clientService.deleteClient(id);
  }

  async importClients(file: File) {
    return clientService.uploadBulk(file);
  }

  // Projects
  async getProjects(params?: any) {
    return projectService.getProjects(params);
  }

  async getProject(id: string) {
    return projectService.getProject(id);
  }

  async createProject(data: Partial<Project>) {
    return projectService.createProject(data);
  }

  async updateProject(id: string, data: Partial<Project>) {
    return projectService.updateProject(id, data);
  }

  async deleteProject(id: string) {
    return projectService.deleteProject(id);
  }

  // Scripts & Templates
  async getScripts() {
    return scriptService.getScripts();
  }

  async createScript(data: Partial<Script>) {
    return scriptService.createScript(data);
  }

  async getTemplates() {
    return templateService.getTemplates();
  }

  async createTemplate(data: Partial<Template>) {
    return templateService.createTemplate(data);
  }

  // Statistics
  async getStatistics(params?: { startDate?: string; endDate?: string }) {
    return statsService.getCallStats(params);
  }
}

export const api = new ApiService();
export {
  authService,
  clientService,
  projectService,
  scriptService,
  templateService,
  statsService,
};
