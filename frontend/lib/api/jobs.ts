import { apiClient } from "../api-client";
import { Job, PaginatedResponse } from "./types";
import { buildTurnstileHeaders } from "./applications";

export type JobDocumentMeta = {
  key: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
};

export const jobsApi = {
  getPublishedJobs: (params?: Record<string, any>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiClient.get<PaginatedResponse<Job>>(`/jobs${qs}`);
  },
  getAdminJobs: (params?: Record<string, any>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiClient.get<PaginatedResponse<Job>>(`/admin/jobs${qs}`);
  },
  getPublicJob: (id: string) => apiClient.get<Job>(`/jobs/${id}`),
  getAdminJob: (id: string) => apiClient.get<Job>(`/admin/jobs/${id}`),
  uploadDocument: (file: File, turnstileToken?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<JobDocumentMeta>("/jobs/upload-document", formData, {
      headers: buildTurnstileHeaders(turnstileToken),
    });
  },
  createPublicJob: (data: any) => apiClient.post<Job>("/jobs", data),
  createAdminJob: (data: any) => apiClient.post<Job>("/admin/jobs", data),
  updateJob: (id: string, data: any) => apiClient.patch<Job>(`/admin/jobs/${id}`, data),
  deleteJob: (id: string) => apiClient.delete<Job>(`/admin/jobs/${id}`),
  updateJobStatus: (id: string, status: string) => apiClient.patch<Job>(`/admin/jobs/${id}/status`, { status }),
};
