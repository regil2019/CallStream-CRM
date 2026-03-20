import { apiClient } from "./api-client";
import type { User } from "../types";

export const authService = {
  async login(credentials: { email: string; password: string }) {
    const response = await apiClient.post<any>("/auth/login", credentials);
    const { token, user } = response.data.data;
    if (token) {
      localStorage.setItem("auth_token", token);
    }
    return { token, user };
  },

  async register(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    const response = await apiClient.post<any>("/auth/register", userData);
    const { token, user } = response.data.data;
    if (token) {
      localStorage.setItem("auth_token", token);
    }
    return { token, user };
  },

  async getMe() {
    const response = await apiClient.get<any>("/auth/me");
    return response.data.data;
  },

  logout() {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  },
};
