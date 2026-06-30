import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useAuthStore } from "@/stores/useAuthStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import TeamSelectionModal from "@/components/TeamSelectionModal";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("auth-storage");
      const auth = raw ? JSON.parse(raw) : null;
      if (!auth?.state?.token) {
        throw redirect({ to: "/login" });
      }
    } catch (e) {
      if ((e as any)?.isRedirect) throw e;
      throw redirect({ to: "/login" });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  const { token } = useAuthStore();
  const { fetchNotifications, fetchUnreadCount } = useNotificationStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    if (token) {
      fetchNotifications();
      fetchUnreadCount();
      const id = window.setInterval(() => fetchUnreadCount(), 60_000);
      return () => window.clearInterval(id);
    }
  }, [token, fetchNotifications, fetchUnreadCount]);

  if (!ready) return null;

  return (
    <div className="min-h-screen">
      <TeamSelectionModal />
      <Outlet />
    </div>
  );
}

