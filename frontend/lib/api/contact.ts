import { apiClient } from "../api-client";
import { Enquiry, PaginatedResponse } from "./types";

export const contactApi = {
  submitEnquiry: (data: any) => apiClient.post<Enquiry>("/contact", data),
  getAdminEnquiries: (params?: Record<string, any>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiClient.get<PaginatedResponse<Enquiry>>(`/admin/enquiries${qs}`);
  },
  getEnquiryDetail: (id: string) => apiClient.get<Enquiry>(`/admin/enquiries/${id}`),
  updateStatus: (id: string, status: string) => apiClient.patch<Enquiry>(`/admin/enquiries/${id}/status`, { status }),
  updatePriority: (id: string, priority: string) => apiClient.patch<Enquiry>(`/admin/enquiries/${id}/priority`, { priority }),
};
