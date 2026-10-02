import axios from "axios";

// Default baseURL points to FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: automatically attaches auth header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["auth"] = `Bearer ${token}`;
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract error detail gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired / invalid
    if (error.response && error.response.status === 401) {
      // Check if it's not the login endpoint
      if (!error.config.url.includes("/login")) {
        console.warn("Session expired or invalid token.");
      }
    }
    return Promise.reject(error);
  }
);

// Helper to extract clean error message from Axios error
export const getErrorMessage = (error, fallback = "An unexpected error occurred") => {
  if (!error) return fallback;
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail.map((d) => d.msg || d.message || JSON.stringify(d)).join(", ");
    }
    if (data.message) return data.message;
  }
  return error.message || fallback;
};

// API Services
export const systemService = {
  getWelcome: () => api.get("/"),
};

export const authService = {
  login: (credentials) => api.post("/login", credentials),
  register: (userData) => api.post("/registeruser", userData),
  getProfile: () => api.get("/me"),
  updateProfile: (profileData) => api.put("/Update-profile", profileData),
};

export const itemService = {
  getAllItems: (page = 1, limit = 10) =>
    api.get("/items", { params: { page, limit: Math.max(10, limit) } }),
  getCategories: () => api.get("/categories"),

  // Lost items
  reportLostItem: (itemData) => api.post("/lost-item", itemData),
  getMyLostItems: (page = 1, limit = 10) =>
    api.get("/see-lost-item", { params: { page, limit } }),
  getLostItem: (itemId) => api.get(`/see-lost-item/${itemId}`),
  updateLostItem: (itemId, updateData) =>
    api.put(`/lost-item/${itemId}`, updateData),
  deleteLostItem: (itemId) => api.delete(`/lost-item/${itemId}`),

  // Found items
  reportFoundItem: (itemData) => api.post("/found-item", itemData),
  getMyFoundItems: (page = 1, limit = 10) =>
    api.get("/see-found-item", { params: { page, limit } }),
  getFoundItem: (itemId) => api.get(`/see-found-item/${itemId}`),
  updateFoundItem: (itemId, updateData) =>
    api.put(`/found-item/${itemId}`, updateData),
  deleteFoundItem: (itemId) => api.delete(`/found-item/${itemId}`),
};

export const claimService = {
  createClaim: (itemId) => api.post(`/claim/${itemId}`),
  getItemClaims: (itemId) => api.get(`/item/${itemId}/claims`),
  getMyClaims: (page = 1, limit = 10) =>
    api.get("/my-claims", { params: { page, limit: Math.min(10, Math.max(1, limit)) } }),
  acceptClaim: (claimId) => api.put(`/claims/${claimId}/accept`),
  rejectClaim: (claimId) => api.put(`/claims/${claimId}/reject`),
  deleteClaim: (claimId) => api.delete(`/claims/${claimId}`),
};

export const adminService = {
  getUsers: (page = 1, limit = 10) =>
    api.get("/admin/users", { params: { page, limit: Math.min(10, Math.max(1, limit)) } }),
  getItems: (page = 1, limit = 10) =>
    api.get("/admin/items", { params: { page, limit: Math.min(10, Math.max(1, limit)) } }),
  getClaims: (page = 1, limit = 10) =>
    api.get("/admin/claims", { params: { page, limit: Math.min(10, Math.max(1, limit)) } }),
};

export default api;