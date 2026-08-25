export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function normalizeApiBase(url: string): string {
  if (url && !url.endsWith("/api/v1")) {
    return url.replace(/\/$/, "") + "/api/v1";
  }
  return url;
}

/**
 * Resolve API base URL.
 *
 * In the browser on a deployed host (e.g. Vercel), prefer same-origin `/api/v1`
 * so Next.js rewrites proxy to Render and `hs_session` is a first-party cookie.
 * Localhost keeps the configured backend URL (usually http://localhost:3001).
 */
function resolveApiBaseUrl(): string {
  // In the browser, always use the Next.js rewrite proxy (/api/v1).
  // next.config.ts rewrites /api/v1/* → backend on both localhost and production,
  // keeping requests same-origin and avoiding CORS preflight issues.
  if (typeof window !== "undefined") {
    return "/api/v1";
  }

  // Server-side (SSR/API routes): use the configured backend URL directly.
  return normalizeApiBase(
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
  );
}

async function handleResponse<T>(response: Response): Promise<T> {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      // Avoid infinite loop if we are already on the login page
      // And ONLY redirect if the user is in an admin-protected route
      if (window.location.pathname.startsWith("/admin") && !window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    let message = data?.message || data?.error || response.statusText || "An error occurred";
    if (Array.isArray(message)) {
      message = message.join(", ");
    }
    throw new ApiError(response.status, message, data);
  }

  return data as T;
}

export const apiClient = {
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${resolveApiBaseUrl()}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
      credentials: "include",
    });
    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> {
    const url = `${resolveApiBaseUrl()}${endpoint}`;
    const response = await fetch(url, {
      method: "POST",
      ...options,
      headers: {
        ...(body instanceof FormData || body === undefined ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      },
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "include",
    });
    return handleResponse<T>(response);
  },

  async patch<T>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> {
    const url = `${resolveApiBaseUrl()}${endpoint}`;
    const response = await fetch(url, {
      method: "PATCH",
      ...options,
      headers: {
        ...(body instanceof FormData || body === undefined ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      },
      body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "include",
    });
    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${resolveApiBaseUrl()}${endpoint}`;
    const response = await fetch(url, {
      method: "DELETE",
      ...options,
      headers: {
        ...options.headers,
      },
      credentials: "include",
    });
    return handleResponse<T>(response);
  },
};
