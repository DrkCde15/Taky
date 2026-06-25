import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  team_id?: number | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<any>;
  register: (data: { name: string; email: string; password: string; role?: string }) => Promise<any>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      login: async (email, password) => {
        const formData = new FormData();
        formData.append("username", email);
        formData.append("password", password);
        try {
          const response = await api.post("/auth/token", formData);
          set({
            user: response.data.user,
            token: response.data.access_token,
            refreshToken: response.data.refresh_token,
          });
          return response.data;
        } catch (error: any) {
          throw error.response?.data?.detail || "Login failed";
        }
      },

      register: async (userData) => {
        try {
          const response = await api.post("/auth/register", userData);
          return response.data;
        } catch (error: any) {
          const detail = error.response?.data?.detail;
          if (Array.isArray(detail)) {
            throw detail.map((e: any) => e.msg).join("; ");
          }
          throw detail || "Registration failed";
        }
      },

      logout: () => set({ user: null, token: null, refreshToken: null }),
    }),
    { name: "auth-storage" }
  )
);
