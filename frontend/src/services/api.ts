const API_BASE_URL = (import.meta.env as any).VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("cisp_token");
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorDetail = "";
    try {
      const errorData = await res.json();
      errorDetail = errorData.detail;
    } catch {
      errorDetail = res.statusText;
    }

    if (res.status === 401) {
      throw new Error(errorDetail && errorDetail !== "Not authenticated" ? errorDetail : "Your session has expired. Please log in again.");
    } else if (res.status === 403) {
      throw new Error(errorDetail || "You do not have permission to upload curriculum documents.");
    } else if (res.status === 400) {
      throw new Error(errorDetail || "Invalid curriculum document.");
    } else if (res.status >= 500) {
      throw new Error(errorDetail || "Document processing failed. Please try again.");
    }
    throw new Error(errorDetail || `API Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // System & Health
  getHealth: () => fetchApi("/health"),
  getSystemStatus: () => fetchApi("/system/status"),

  // Auth
  login: (formData: FormData) => fetchApi("/auth/login", { method: "POST", body: formData }),
  getMe: () => fetchApi("/auth/me"),

  // Analytics & Dashboard
  getNationalAnalytics: () => fetchApi("/analytics/national"),
  getEmergingTechHeatmap: () => fetchApi("/analytics/emerging-tech-heatmap"),

  // Universities & Programs
  getUniversities: () => fetchApi("/universities/"),
  getPrograms: () => fetchApi("/programs/"),

  // Curricula
  getReferenceCurricula: (programId?: number) => fetchApi(`/curricula/reference${programId ? `?program_id=${programId}` : ''}`),
  getReferenceCurriculumById: (id: number) => fetchApi(`/curricula/reference/${id}`),
  createReferenceCurriculum: (data: any) => fetchApi("/curricula/reference", { method: "POST", body: JSON.stringify(data) }),

  getUniversityCurricula: (uniId?: number, status?: string) => {
    const params = new URLSearchParams();
    if (uniId) params.append("university_id", String(uniId));
    if (status) params.append("status_filter", status);
    return fetchApi(`/curricula/university?${params.toString()}`);
  },
  getUniversityCurriculumById: (id: number) => fetchApi(`/curricula/university/${id}`),
  createUniversityCurriculum: (data: any) => fetchApi("/curricula/university", { method: "POST", body: JSON.stringify(data) }),
  submitCurriculum: (id: number) => fetchApi(`/curricula/university/${id}/submit`, { method: "POST" }),
  publishCurriculum: (id: number) => fetchApi(`/curricula/university/${id}/publish`, { method: "POST" }),

  // Documents & Extraction Pipeline
  uploadDocument: (formData: FormData) => fetchApi("/documents/upload", { method: "POST", body: formData }),
  getDocument: (id: number) => fetchApi(`/documents/${id}`),
  getDocumentStatus: (id: number) => fetchApi(`/documents/${id}/status`),
  getExtractedCurriculum: (id: number) => fetchApi(`/documents/${id}/extracted`),
  updateExtractedCurriculum: (id: number, data: any) => fetchApi(`/documents/${id}/extracted`, { method: "PUT", body: JSON.stringify(data) }),
  confirmExtraction: (id: number) => fetchApi(`/documents/${id}/confirm`, { method: "POST" }),

  // Semantic Comparison
  runComparison: (uniCurrId: number, refCurrId: number) => fetchApi("/comparisons/run", {
    method: "POST",
    body: JSON.stringify({ university_curriculum_id: uniCurrId, reference_curriculum_id: refCurrId })
  }),
  getComparison: (uniCurrId: number) => fetchApi(`/comparisons/${uniCurrId}`),

  // Review Queue & Comments
  getReviewQueue: () => fetchApi("/reviews/queue"),
  submitReviewDecision: (id: number, decision: string, comments?: string) => fetchApi(`/reviews/${id}/decision`, {
    method: "POST",
    body: JSON.stringify({ decision, comments })
  }),
  getComments: (id: number) => fetchApi(`/reviews/${id}/comments`),
  addComment: (id: number, text: string, courseId?: number) => fetchApi(`/reviews/${id}/comments`, {
    method: "POST",
    body: JSON.stringify({ text, course_id: courseId })
  }),

  // Notices & Circulars
  getNotices: () => fetchApi("/notices/"),

  // Audit Logs & Settings
  getAuditLogs: () => fetchApi("/audit-logs/"),
  getSettings: () => fetchApi("/settings/"),
  updateWeights: (weights: any) => fetchApi("/settings/weights", { method: "PUT", body: JSON.stringify(weights) }),

  // Reports Export URLs
  getPdfReportUrl: (id: number) => `${API_BASE_URL}/reports/pdf/${id}`,
  getExcelReportUrl: (id: number) => `${API_BASE_URL}/reports/excel/${id}`
};
