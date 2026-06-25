import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      login: async (email, password) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        try {
          const response = await api.post('/auth/token', formData);
          set({
            user: response.data.user,
            token: response.data.access_token,
            refreshToken: response.data.refresh_token,
          });
          return response.data;
        } catch (error) {
          throw error.response?.data?.detail || 'Login failed';
        }
      },

      register: async (userData) => {
        try {
          const response = await api.post('/auth/register', userData);
          return response.data;
        } catch (error) {
          const detail = error.response?.data?.detail;
          if (Array.isArray(detail)) {
            throw detail.map((e) => e.msg).join('; ');
          }
          throw detail || 'Registration failed';
        }
      },

      logout: () => set({ user: null, token: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
