import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useNavigate } from 'react-router-dom';
import './NotificationBell.css';

const TYPE_ICONS = {
  task_assigned: '📋',
  status_changed: '🔄',
  new_comment: '💬',
  member_removed: '🚫',
};

export default function NotificationBell() {
  const { notifications, unreadCount, fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead } =
    useNotificationStore();
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(Date.now);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000);
    const tick = setInterval(() => setNow(Date.now()), 60000);
    return () => { clearInterval(interval); clearInterval(tick); };
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  const handleNotifClick = async (notif) => {
    if (!notif.read) await markAsRead(notif.id);
    if (notif.task_id) navigate('/');
    setOpen(false);
  };

  const since = (dateStr) => {
    const diff = now - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'agora';
    if (mins < 60) return `${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <div className="notif-wrapper" ref={ref}>
      <button className="notif-bell" onClick={() => setOpen(!open)} title="Notificações">
        <Bell size={20} />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-dropdown glass">
          <div className="notif-header">
            <h4>Notificações</h4>
            {unreadCount > 0 && (
              <button className="notif-mark-all" onClick={markAllAsRead}>
                <CheckCheck size={16} /> Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">Nenhuma notificação</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notif-item ${n.read ? '' : 'notif-unread'}`}
                  onClick={() => handleNotifClick(n)}
                >
                  <span className="notif-icon">{TYPE_ICONS[n.type] || '🔔'}</span>
                  <div className="notif-body">
                    <p className="notif-message">{n.message}</p>
                    <span className="notif-time">{since(n.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
