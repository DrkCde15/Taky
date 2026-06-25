import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useNotificationStore } from "@/stores/useNotificationStore";

const TYPE_ICONS: Record<string, string> = {
  task_assigned: "📋",
  status_changed: "🔄",
  new_comment: "💬",
  member_removed: "🚫",
};

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadCount();
    const i1 = setInterval(fetchUnreadCount, 15000);
    const i2 = setInterval(() => setNow(Date.now()), 60000);
    return () => {
      clearInterval(i1);
      clearInterval(i2);
    };
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleClick = async (n: { id: number; read: number; task_id?: number }) => {
    if (!n.read) await markAsRead(n.id);
    if (n.task_id) navigate({ to: "/" });
    setOpen(false);
  };

  const since = (dateStr: string) => {
    const diff = now - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "agora";
    if (mins < 60) return `${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        title="Notificações"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="glass-strong absolute right-0 top-[calc(100%+8px)] z-50 flex w-[360px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h4 className="text-sm font-semibold">Notificações</h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
              >
                <CheckCheck size={14} /> Marcar tudo
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`flex w-full items-start gap-3 border-b border-border/50 px-4 py-3 text-left transition-colors hover:bg-white/5 ${
                    n.read ? "" : "border-l-2 border-l-primary bg-primary/5"
                  }`}
                >
                  <span className="text-lg leading-none">{TYPE_ICONS[n.type] || "🔔"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm leading-snug text-foreground">
                      {n.message}
                    </p>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {since(n.created_at)}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
