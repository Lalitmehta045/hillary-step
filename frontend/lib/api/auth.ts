import { apiClient } from "../api-client";
import { Admin } from "./types";

export const authApi = {
  login: (credentials: any) => apiClient.post<{ admin?: Admin; token?: string; requiresMfa?: boolean; mfaToken?: string; message: string }>("/auth/login", credentials),
  logout: () => apiClient.post<{ message: string }>("/auth/logout"),
  getSession: () => apiClient.get<{ admin: Admin }>("/auth/session"),
  verifyMfa: (data: any) => apiClient.post<{ admin: Admin; token: string; message: string }>("/auth/mfa/verify", data),
};
