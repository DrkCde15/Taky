import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null, // user: { id, name, email, avatar, role: 'admin' | 'member' }
      token: null,
      
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      
      login: async (email, password) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        
        try {
          const response = await api.post('/token', formData);
          set({ user: response.data.user, token: response.data.access_token });
          return response.data;
        } catch (error) {
          throw error.response?.data?.detail || 'Login failed';
        }
      },
      
      register: async (userData) => {
        try {
          const response = await api.post('/register', userData);
          return response.data;
        } catch (error) {
          throw error.response?.data?.detail || 'Registration failed';
        }
      },
      
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
