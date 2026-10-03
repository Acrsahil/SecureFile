/**
 * MedShare API Service
 * --------------------
 * All calls to the Django backend go through here.
 * Base URL: http://127.0.0.1:8000/api
 */

const BASE_URL = "http://127.0.0.1:8000/api";

// ---------------------------------------------------------------------------
// Token helpers — store JWT in localStorage
// ---------------------------------------------------------------------------

export const getAccessToken = () => localStorage.getItem("access_token");
export const getRefreshToken = () => localStorage.getItem("refresh_token");

export const saveTokens = (access: string, refresh: string) => {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

export const getStoredUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const saveUser = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// ---------------------------------------------------------------------------
// Types matching Django serializer fields
// ---------------------------------------------------------------------------

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: "ADMIN" | "DOCTOR" | "NURSE" | "PATIENT";
  created_at: string;
  initials: string;
  phone?: string;
  specialty?: string;
  assigned_to?: number | null;
  assigned_to_name?: string | null;
  patient_count?: number;
  nurse_count?: number;
  document_count?: number;
  role_display?: string;
}

export interface Document {
  id: number;
  title: string;
  file: string;
  document_type: string;
  uploaded_by: number;
  uploaded_by_name: string;
  file_size: string;
  file_extension: string;
  created_at: string;
  updated_at: string;
  is_owner: boolean;
}

export interface DocumentAccess {
  id: number;
  document: number;
  user: number;
  user_name: string;
  user_email: string;
  permission: "VIEW" | "DOWNLOAD";
  shared_by: number;
  shared_by_name: string;
  created_at: string;
}

export interface SharedDoc {
  id: number;
  document_id: number;
  title: string;
  document_type: string;
  file_size: string;
  file_extension: string;
  permission: "VIEW" | "DOWNLOAD";
  shared_by: string;
  shared_by_email: string;
  created_at: string;
}

export interface AccessRequest {
  id: number;
  document: number;
  document_id: number;
  document_title: string;
  requested_by: number;
  requested_by_name: string;
  requested_by_email: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
}

export interface ActivityLog {
  id: number;
  user_name: string;
  document: number | null;
  document_title: string | null;
  action: string;
  description: string;
  timestamp: string;
}

export interface DashboardData {
  stats: {
    total_documents: number;
    shared_documents: number;
    received_documents: number;
    pending_requests: number;
  };
  recent_documents: Document[];
  recent_activity: ActivityLog[];
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message: string; data?: T }> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await res.json();

  if (!res.ok) {
    let msg = json.message || "Request failed";
    if (json.errors && typeof json.errors === "object") {
      const fieldErrors = Object.values(json.errors).flat().join(" ");
      if (fieldErrors) msg = `${msg} ${fieldErrors}`;
    }
    throw new Error(msg.trim());
  }

  return json;
}

// ---------------------------------------------------------------------------
// Auth API
// ---------------------------------------------------------------------------

export const authAPI = {
  register: (data: {
    full_name: string;
    email: string;
    role: string;
    password: string;
    password2: string;
    assigned_to?: number | null;
  }) =>
    apiFetch<{ user: User; access: string; refresh: string }>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (email: string, password: string) =>
    apiFetch<{ user: User; access: string; refresh: string }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch("/auth/logout/", {
      method: "POST",
      body: JSON.stringify({ refresh: getRefreshToken() }),
    }),
};

// ---------------------------------------------------------------------------
// Profile API
// ---------------------------------------------------------------------------

export const profileAPI = {
  get: () => apiFetch<User>("/profile/"),

  update: (data: { full_name?: string; email?: string; phone?: string; specialty?: string }) =>
    apiFetch<User>("/profile/", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ---------------------------------------------------------------------------
// Documents API
// ---------------------------------------------------------------------------

export const documentsAPI = {
  list: () => apiFetch<Document[]>("/documents/"),

  get: (id: number) => apiFetch<Document>(`/documents/${id}/`),

  upload: (formData: FormData) =>
    apiFetch<Document>("/documents/", {
      method: "POST",
      body: formData, // multipart/form-data — no Content-Type header (browser sets it)
    }),

  delete: (id: number) =>
    apiFetch(`/documents/${id}/`, { method: "DELETE" }),

  /** Returns the URL to view/stream the file (requires token in header) */
  getFileUrl: (id: number, download = false) =>
    `${BASE_URL}/documents/${id}/file/${download ? "?download=1" : ""}`,
};

// ---------------------------------------------------------------------------
// Sharing API
// ---------------------------------------------------------------------------

export const sharingAPI = {
  share: (docId: number, userId: number, permission: "VIEW" | "DOWNLOAD") =>
    apiFetch<DocumentAccess>(`/documents/${docId}/share/`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId, permission }),
    }),

  listAccess: (docId: number) =>
    apiFetch<DocumentAccess[]>(`/documents/${docId}/access/`),

  revokeAccess: (docId: number, userId: number) =>
    apiFetch(`/documents/${docId}/access/${userId}/`, { method: "DELETE" }),

  sharedWithMe: () => apiFetch<SharedDoc[]>("/shared-with-me/"),
};

// ---------------------------------------------------------------------------
// Access Requests API
// ---------------------------------------------------------------------------

export const accessRequestsAPI = {
  list: () =>
    apiFetch<{ my_requests: AccessRequest[]; incoming_requests: AccessRequest[] }>(
      "/access-requests/"
    ),

  create: (documentId: number, reason: string) =>
    apiFetch<AccessRequest>("/access-requests/", {
      method: "POST",
      body: JSON.stringify({ document: documentId, reason }),
    }),

  approve: (id: number, permission: "VIEW" | "DOWNLOAD" = "VIEW") =>
    apiFetch(`/access-requests/${id}/approve/`, {
      method: "POST",
      body: JSON.stringify({ permission }),
    }),

  reject: (id: number) =>
    apiFetch(`/access-requests/${id}/reject/`, { method: "POST" }),
};

// ---------------------------------------------------------------------------
// Activity API
// ---------------------------------------------------------------------------

export const activityAPI = {
  list: () => apiFetch<ActivityLog[]>("/activity/"),
};

// ---------------------------------------------------------------------------
// Dashboard API
// ---------------------------------------------------------------------------

export const dashboardAPI = {
  get: () => apiFetch<DashboardData>("/dashboard/"),
};

// ---------------------------------------------------------------------------
// Users API (for share dropdown)
// ---------------------------------------------------------------------------

export const usersAPI = {
  list: () => apiFetch<User[]>("/users/"),
};

// ---------------------------------------------------------------------------
// Hierarchy / Team API
// ---------------------------------------------------------------------------

export const hierarchyAPI = {
  myPatients: () => apiFetch<User[]>("/my-patients/"),

  unassignedPatients: () => apiFetch<User[]>("/unassigned-patients/"),

  staffList: () => apiFetch<User[]>("/staff-list/"),

  assignUser: (userId: number, assignedToId: number | null) =>
    apiFetch(`/users/${userId}/assign/`, {
      method: "POST",
      body: JSON.stringify({ assigned_to_id: assignedToId }),
    }),
};

// ---------------------------------------------------------------------------
// Fetch a protected file as a Blob (used for inline viewing)
// ---------------------------------------------------------------------------

export async function fetchProtectedFile(docId: number, download = false): Promise<Blob> {
  const token = getAccessToken();
  const url = `${BASE_URL}/documents/${docId}/file/${download ? "?download=1" : ""}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Access denied or file not found");
  return res.blob();
}
