export interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
  mfaEnabled: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';

export interface JobAttachment {
  fileKey: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface Job {
  id: string;
  jobTitle: string;
  organizationName?: string;
  roleType?: string;
  experienceLevel?: string;
  country?: string;
  city?: string;
  jobDescription?: string;
  industry?: string;
  salaryRange?: string;
  applicationDeadline?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  countryCode?: string;
  status: JobStatus;
  isPublic: boolean;
  attachments?: JobAttachment[] | null;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'NEW' | 'REVIEWING' | 'SHORTLISTED' | 'INTERVIEW' | 'HIRED' | 'REJECTED';

export interface Application {
  id: string;
  applicationNumber: string;
  fullName: string;
  email: string;
  phone?: string;
  countryCode?: string;
  linkedinProfile?: string;
  currentDesignation?: string;
  practice?: string;
  industry?: string;
  experienceYears?: string;
  preferredLocation?: string;
  coverNote?: string;
  resumeFileKey?: string;
  resumeFileName?: string;
  status: ApplicationStatus;
  createdAt: string;
  job?: { jobTitle: string };
  parsedData?: any;
}

export interface InternalNote {
  id: string;
  content: string;
  createdAt: string;
  admin: { name: string; email: string };
}

export interface ActivityLog {
  id: string;
  action: string;
  performedBy: string;
  details?: any;
  createdAt: string;
}

export interface Document {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type EnquiryPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Enquiry {
  id: string;
  enquiryNumber: string;
  name?: string;
  companyName?: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  countryCode?: string;
  organization?: string;
  industry?: string;
  serviceRequired?: string;
  message?: string;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  createdAt: string;
}
