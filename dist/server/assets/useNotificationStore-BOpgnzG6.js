import { n as api } from "./useAuthStore-C20Kd3MZ.js";
import { create } from "zustand";
//#region src/stores/useNotificationStore.ts
var useNotificationStore = create()((set) => ({
	notifications: [],
	unreadCount: 0,
	fetchNotifications: async () => {
		try {
			set({ notifications: (await api.get("/notifications")).data });
		} catch {}
	},
	fetchUnreadCount: async () => {
		try {
			set({ unreadCount: (await api.get("/notifications/unread-count")).data.count });
		} catch {}
	},
	markAsRead: async (notifId) => {
		try {
			await api.patch(`/notifications/${notifId}/read`);
			set((state) => ({
				notifications: state.notifications.map((n) => n.id === notifId ? {
					...n,
					read: 1
				} : n),
				unreadCount: Math.max(0, state.unreadCount - 1)
			}));
		} catch {}
	},
	markAllAsRead: async () => {
		try {
			await api.post("/notifications/read-all");
			set((state) => ({
				notifications: state.notifications.map((n) => ({
					...n,
					read: 1
				})),
				unreadCount: 0
			}));
		} catch {}
	}
}));
//#endregion
export { useNotificationStore as t };
