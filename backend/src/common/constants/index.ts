// ============================================================
// FILE SIZE & UPLOAD CONSTRAINTS
// ============================================================
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_RESUME_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const ALLOWED_RESUME_EXTENSIONS = ['.pdf', '.doc', '.docx'] as const;

// Magic byte signatures for file validation
export const FILE_SIGNATURES: Record<string, number[][]> = {
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  'application/msword': [[0xd0, 0xcf, 0x11, 0xe0]], // DOC
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    [0x50, 0x4b, 0x03, 0x04], // DOCX (ZIP-based)
  ],
};

// ============================================================
// APPLICATION STATUSES (matches frontend admin portal)
// ============================================================
export const APPLICATION_STATUSES = [
  'new',
  'reviewing',
  'shortlisted',
  'interview',
  'hired',
  'rejected',
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

// ============================================================
// ENQUIRY STATUSES (matches frontend admin portal)
// ============================================================
export const ENQUIRY_STATUSES = [
  'new',
  'contacted',
  'in-progress',
  'resolved',
  'closed',
] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

// ============================================================
// ENQUIRY PRIORITY
// ============================================================
export const ENQUIRY_PRIORITIES = ['high', 'medium', 'low'] as const;
export type EnquiryPriority = (typeof ENQUIRY_PRIORITIES)[number];

// ============================================================
// JOB STATUSES
// ============================================================
export const JOB_STATUSES = [
  'draft',
  'published',
  'closed',
  'archived',
] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

// ============================================================
// EMPLOYMENT TYPES (matches frontend forms)
// ============================================================
export const EMPLOYMENT_TYPES = [
  'full-time',
  'part-time',
  'contract',
  'internship',
  'temporary',
] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

// ============================================================
// EXPERIENCE LEVELS
// ============================================================
export const EXPERIENCE_LEVELS = ['entry', 'mid', 'senior', 'lead'] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

// ============================================================
// COUNTRY CODES (matches frontend phone field)
// ============================================================
export const COUNTRY_CODES = [
  '+1',
  '+91',
  '+61',
  '+44',
  '+971',
  '+65',
  '+60',
  '+974',
  '+968',
  '+966',
  '+973',
] as const;

// ============================================================
// INDUSTRIES (matches frontend forms)
// ============================================================
export const INDUSTRIES = [
  'Oil & Gas',
  'Mining & Metals',
  'Civil & Infrastructure',
  'IT Solutions',
  'Power & Energy',
  'Manufacturing',
  'Marine & Offshore',
  'Healthcare',
  'Education',
  'Other',
] as const;
export type Industry = (typeof INDUSTRIES)[number];

// ============================================================
// SERVICE CATEGORIES (matches frontend enquiry form)
// ============================================================
export const SERVICE_CATEGORIES = [
  'Global Staffing',
  'IT Solutions',
  'Civil & Infrastructure',
  'Innovation Lab',
] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

// ============================================================
// PRACTICES (matches frontend application form)
// ============================================================
export const PRACTICES = [
  'Engineering',
  'Data & AI',
  'Civil & Infrastructure',
  'Corporate',
] as const;

// ============================================================
// PREFERRED LOCATIONS (matches frontend forms)
// ============================================================
export const PREFERRED_LOCATIONS = [
  'USA',
  'Australia',
  'India',
  'Middle East',
  'Southeast Asia',
  'Europe',
  'Africa',
  'Any Location',
] as const;

// ============================================================
// COUNTRIES (matches frontend post-a-job)
// ============================================================
export const COUNTRIES = [
  { code: 'us', name: 'United States' },
  { code: 'au', name: 'Australia' },
  { code: 'in', name: 'India' },
] as const;

// ============================================================
// ADMIN ROLES
// ============================================================
export const ADMIN_ROLES = ['super_admin', 'admin', 'moderator'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

// ============================================================
// SECURITY CONSTANTS
// ============================================================
export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MINUTES = 15;
export const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
export const PRESIGNED_URL_EXPIRY_SECONDS = 900; // 15 minutes (short-lived)
export const MFA_WINDOW = 1; // TOTP verification window (allows 1 step in either direction)

// ============================================================
// PAGINATION DEFAULTS
// ============================================================
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE = 1;

// ============================================================
// REQUEST LIMITS
// ============================================================
export const MAX_REQUEST_BODY_SIZE = 10 * 1024 * 1024; // 10MB (for multipart)
export const MAX_JSON_BODY_SIZE = 1 * 1024 * 1024; // 1MB

// ============================================================
// RATE LIMITING (endpoint-specific)
// ============================================================
export const AUTH_RATE_LIMIT = { max: 5, windowMs: 60 * 1000 }; // 5 per minute
export const UPLOAD_RATE_LIMIT = { max: 10, windowMs: 60 * 1000 }; // 10 per minute
export const CONTACT_RATE_LIMIT = { max: 3, windowMs: 60 * 1000 }; // 3 per minute
