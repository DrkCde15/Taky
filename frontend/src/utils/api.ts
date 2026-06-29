import axios from "axios";

export const baseURL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

export const api = axios.create({ baseURL });

function getAuthState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("auth-storage");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state ?? null;
  } catch {
    return null;
  }
}

api.interceptors.request.use((config) => {
  const state = getAuthState();
  if (state?.token) {
    config.headers.Authorization = `Bearer ${state.token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    if (originalRequest.url === "/auth/refresh") {
      const state = getAuthState();
      if (state) {
        state.token = null;
        state.refreshToken = null;
        window.localStorage.setItem("auth-storage", JSON.stringify({ state, version: 0 }));
      }
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const state = getAuthState();

    if (!state?.refreshToken) {
      isRefreshing = false;
      state.token = null;
      window.localStorage.setItem("auth-storage", JSON.stringify({ state, version: 0 }));
      window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      const resp = await axios.post(`${baseURL}/auth/refresh`, {
        refresh_token: state.refreshToken,
      });

      const newToken = resp.data.access_token;
      state.token = newToken;
      state.refreshToken = resp.data.refresh_token;
      window.localStorage.setItem("auth-storage", JSON.stringify({ state, version: 0 }));

      isRefreshing = false;
      pendingRequests.forEach((cb) => cb(newToken));
      pendingRequests = [];

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch {
      isRefreshing = false;
      pendingRequests = [];
      state.token = null;
      state.refreshToken = null;
      window.localStorage.setItem("auth-storage", JSON.stringify({ state, version: 0 }));
      window.location.href = "/login";
      return Promise.reject(error);
    }
  }
);

export default api;
