import { create } from "zustand";
import api from "../utils/api";

export interface AppNotification {
  id: number;
  message: string;
  type: string;
  read: number;
  task_id?: number;
  created_at: string;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const resp = await api.get("/notifications");
      set({ notifications: resp.data });
    } catch {
      // silent
    }
  },

  fetchUnreadCount: async () => {
    try {
      const resp = await api.get("/notifications/unread-count");
      set({ unreadCount: resp.data.count });
    } catch {
      // silent
    }
  },

  markAsRead: async (notifId) => {
    try {
      await api.patch(`/notifications/${notifId}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notifId ? { ...n, read: 1 } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {
      // silent
    }
  },

  markAllAsRead: async () => {
    try {
      await api.post("/notifications/read-all");
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: 1 })),
        unreadCount: 0,
      }));
    } catch {
      // silent
    }
  },
}));
