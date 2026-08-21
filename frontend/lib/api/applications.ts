import { apiClient } from "../api-client";
import { Application, PaginatedResponse, InternalNote, ActivityLog, Document } from "./types";

export const applicationsApi = {
  submitApplication: (data: any, turnstileToken?: string) =>
    apiClient.post<Application>("/applications", data, {
      headers: turnstileToken ? { "cf-turnstile-response": turnstileToken } : {},
    }),
  uploadResume: (file: File, turnstileToken?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<{
      key: string;
      parsedData: any;
      fileName: string;
      fileSize: number;
      mimeType: string;
    }>("/applications/upload-resume", formData, {
      headers: turnstileToken ? { "cf-turnstile-response": turnstileToken } : {},
    });
  },
  getAdminApplications: (params?: Record<string, any>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiClient.get<PaginatedResponse<Application>>(`/admin/applications${qs}`);
  },
  getApplicationDetail: (id: string) => apiClient.get<Application & { documents: Document[]; notes: InternalNote[] }>(`/admin/applications/${id}`),
  updateStatus: (id: string, status: string) => apiClient.patch<Application>(`/admin/applications/${id}/status`, { status }),
  addNote: (id: string, content: string) => apiClient.post<InternalNote>(`/admin/applications/${id}/notes`, { content }),
  getNotes: (id: string) => apiClient.get<InternalNote[]>(`/admin/applications/${id}/notes`),
  getActivity: (id: string) => apiClient.get<ActivityLog[]>(`/admin/applications/${id}/activity`),
  getDocuments: (id: string) => apiClient.get<Document[]>(`/admin/applications/${id}/documents`),
  getDownloadUrl: (appId: string, docId: string) => apiClient.get<{ url: string }>(`/admin/applications/${appId}/documents/${docId}/download`),
};
