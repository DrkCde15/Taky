import { useEffect, useRef, useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { useAuthStore } from '../store/useAuthStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Navbar from '../components/layout/Navbar';
import Toast from '../components/ui/Toast';
import ConfirmModal from '../components/ui/ConfirmModal';
import './AdminPanel.css';

export default function AdminPanel() {
  const { tasks, members, fetchTasks, fetchMembers, deleteMember, error, clearError } =
    useTaskStore();
  const { user } = useAuthStore();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const prevError = useRef(null);

  useEffect(() => {
    const abort = new AbortController();
    fetchTasks(abort.signal);
    fetchMembers(abort.signal);
    return () => abort.abort();
  }, [fetchTasks, fetchMembers]);

  useEffect(() => {
    if (error && error !== prevError.current) {
      prevError.current = error;
      setToast({ message: error, type: 'error' }); // eslint-disable-line react-hooks/set-state-in-effect
      clearError();
    } else if (!error) {
      prevError.current = null;
    }
  }, [error, clearError]);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const blockedTasks = tasks.filter((t) => t.status === 'blocked').length;
  const totalHours = tasks.reduce((acc, t) => acc + (t.timeSpent || 0), 0);

  const statusData = [
    { name: 'Concluído', value: doneTasks, color: 'var(--success)' },
    { name: 'Bloqueado', value: blockedTasks, color: 'var(--error)' },
    {
      name: 'Em Andamento',
      value: tasks.filter((t) => t.status === 'in_progress').length,
      color: '#0ea5e9',
    },
    {
      name: 'A Fazer',
      value: tasks.filter((t) => t.status === 'todo').length,
      color: 'var(--warning)',
    },
  ];

  const memberData = members.map((m) => ({
    id: m.id,
    name: m.name,
    hours: tasks
      .filter((t) => t.memberId === m.id.toString())
      .reduce((acc, t) => acc + (t.timeSpent || 0), 0),
    tasks: tasks.filter((t) => t.memberId === m.id.toString()).length,
  }));

  const handleDeleteMember = async (member) => {
    if (member.id === user.id) {
      setToast({ message: 'Você não pode se excluir!', type: 'error' });
      setConfirmDelete(null);
      return;
    }
    try {
      await deleteMember(member.id);
      setToast({ message: `${member.name} removido`, type: 'success' });
    } catch {
      setToast({ message: 'Falha ao remover membro', type: 'error' });
    }
    setConfirmDelete(null);
  };

  return (
    <AppLayout navbar={<Navbar />}>
      <div className="admin-content">
        <div className="admin-container">
          <h1>Painel do Gerente</h1>

          <div className="kpi-grid">
            <StatCard
              title="Total de Tarefas"
              value={totalTasks}
              icon={TrendingUp}
              color="var(--accent-primary)"
            />
            <StatCard
              title="Concluídas"
              value={doneTasks}
              icon={CheckCircle2}
              color="var(--success)"
            />
            <StatCard
              title="Total de Horas"
              value={`${totalHours}h`}
              icon={Clock}
              color="#8b5cf6"
            />
            <StatCard
              title="Tarefas Bloqueadas"
              value={blockedTasks}
              icon={AlertCircle}
              color="var(--error)"
            />
          </div>

          <div className="charts-grid">
            <div className="chart-card glass">
              <h3>Distribuição de Tarefas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RTooltip
                    contentStyle={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card glass">
              <h3>Desempenho dos Membros (Horas)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={memberData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    stroke="var(--text-secondary)"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    stroke="var(--text-secondary)"
                  />
                  <RTooltip
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    contentStyle={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar
                    dataKey="hours"
                    fill="var(--accent-primary)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="leaderboard-card glass">
            <h3>Ranking da Equipe</h3>
            <div className="leaderboard-table-wrapper">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>MEMBRO</th>
                    <th>TAREFAS ATRIBUÍDAS</th>
                    <th>TOTAL DE HORAS</th>
                    <th>ENGAJAMENTO</th>
                    <th>AÇÃO</th>
                  </tr>
                </thead>
                <tbody>
                  {memberData
                    .sort((a, b) => b.hours - a.hours)
                    .map((m) => (
                      <tr key={m.id}>
                        <td className="member-name">{m.name}</td>
                        <td>{m.tasks} tarefas</td>
                        <td>{m.hours}h</td>
                        <td>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${Math.min(
                                  (m.hours / (totalHours || 1)) * 100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <button
                            onClick={() => setConfirmDelete(m)}
                            className="btn-icon-delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmModal
          title="Remover Membro"
          message={`Excluir ${confirmDelete.name}?`}
          onConfirm={() => handleDeleteMember(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AppLayout>
  );
}

function StatCard({ title, value, icon: Icon, color }) { // eslint-disable-line no-unused-vars
  return (
    <div className="stat-card glass">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <div className="stat-icon" style={{ background: `${color}20` }}>
          <Icon size={20} color={color} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
