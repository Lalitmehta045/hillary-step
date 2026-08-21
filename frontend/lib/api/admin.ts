import { apiClient } from "../api-client";
import { Admin } from "./types";

export const adminApi = {
  getProfile: () => apiClient.get<Admin>("/admin/settings/profile"),
  updateProfile: (data: { name?: string; email?: string }) =>
    apiClient.patch<Admin>("/admin/settings/profile", data),
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    apiClient.post<{ message: string }>("/admin/settings/change-password", data),
};
