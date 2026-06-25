import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, LayoutGrid, Plus, Filter } from 'lucide-react';
import NotificationBell from '../notifications/NotificationBell';
import './Navbar.css';

export default function Navbar({ onCreateTask, onFilterChange, filterValue, members, showNewTask }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Quadro' },
    { path: '/calendar', label: 'Calendário' },
    { path: '/teams', label: 'Equipes' },
    ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Analytics' }] : []),
  ];

  return (
    <nav className="navbar glass">
      <div className="navbar-left">
        <h2 className="navbar-brand" onClick={() => navigate('/')}>
          <LayoutGrid size={24} /> Tasky
        </h2>
        <div className="navbar-links">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      <div className="navbar-right">
        {onFilterChange && (
          <div className="filter-group">
            <Filter size={16} />
            <select value={filterValue || 'all'} onChange={(e) => onFilterChange(e.target.value)} className="filter-select">
              <option value="all">Todos os Membros</option>
              {members?.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        )}

        {showNewTask && onCreateTask && (
          <button onClick={onCreateTask} className="btn-primary">
            <Plus size={18} /> Nova Tarefa
          </button>
        )}

        <div className="user-section">
          <NotificationBell />
          {user?.avatar && (
            <img src={user.avatar} alt={user.name} className="user-avatar" />
          )}
          <button onClick={handleLogout} className="btn-icon" title="Sair">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
