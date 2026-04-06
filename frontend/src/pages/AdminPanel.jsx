import React, { useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { LayoutGrid, LogOut, TrendingUp, Clock, AlertCircle, CheckCircle2, UserPen, Trash2 } from 'lucide-react';

export default function AdminPanel() {
  const { tasks, members, fetchTasks, fetchMembers, deleteMember } = useTaskStore();

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, []);


  // If not admin, redirect or show "Unauthorized" (Better to check in App.jsx but double security)
  if (user?.role !== 'admin') {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
      <h1>Unauthorized</h1>
      <button onClick={() => navigate('/')}>Back to Board</button>
    </div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Data Calculations
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const blockedTasks = tasks.filter(t => t.status === 'blocked').length;
  const totalHours = tasks.reduce((acc, t) => acc + (t.timeSpent || 0), 0);

  const statusData = [
    { name: 'Done', value: doneTasks, color: 'var(--success)' },
    { name: 'Blocked', value: blockedTasks, color: 'var(--error)' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: '#0ea5e9' },
    { name: 'Review', value: tasks.filter(t => t.status === 'ready_for_review').length, color: 'var(--warning)' },
  ];

  const memberData = members.map(m => ({
    id: m.id,
    name: m.name,
    hours: tasks.filter(t => t.memberId === m.id.toString()).reduce((acc, t) => acc + (t.timeSpent || 0), 0),
    tasks: tasks.filter(t => t.memberId === m.id.toString()).length
  }));


  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>{title}</span>
        <div style={{ background: `${color}20`, padding: '8px', borderRadius: '8px' }}>
          <Icon size={20} color={color} />
        </div>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>{value}</div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: 'var(--bg-primary)' }}>
      {/* Top Navigation */}
      <nav className="glass" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 2rem', 
        borderBottom: '1px solid var(--border-primary)',
        width: '100%',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LayoutGrid size={24} /> Tasky Admin
          </h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => navigate('/')} style={{ background: 'transparent', border: 'none', fontWeight: '600', color: 'var(--text-secondary)' }}>Board</button>
            <button onClick={() => navigate('/teams')} style={{ background: 'transparent', border: 'none', fontWeight: '600', color: 'var(--text-secondary)' }}>Teams</button>
            <button key="admin-nav" style={{ background: 'transparent', border: 'none', fontWeight: '600', color: 'var(--accent-primary)' }}>Analytics</button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img src={user?.avatar} alt={user?.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          <button onClick={handleLogout} style={{ background: 'transparent', border: 'none' }}><LogOut size={20} color="var(--text-secondary)" /></button>
        </div>
      </nav>

      {/* Admin Content */}
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '900', letterSpacing: '-0.04em' }}>Manager Dashboard</h1>

          {/* KPI Cards */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <StatCard title="Total Tasks" value={totalTasks} icon={TrendingUp} color="var(--accent-primary)" />
            <StatCard title="Completed" value={doneTasks} icon={CheckCircle2} color="var(--success)" />
            <StatCard title="Total Hours" value={`${totalHours}h`} icon={Clock} color="#8b5cf6" />
            <StatCard title="Blocked Tasks" value={blockedTasks} icon={AlertCircle} color="var(--error)" />
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
            {/* Status Chart */}
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '400px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Task Distribution</h3>
              <ResponsiveContainer width="100%" height="100%">
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
                    contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Chart */}
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '400px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Member Performance (Hours)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={memberData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="var(--text-secondary)" />
                  <YAxis axisLine={false} tickLine={false} stroke="var(--text-secondary)" />
                  <RTooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="hours" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem' }}>Team Leaderboard</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-primary)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '1rem' }}>TEAM MEMBER</th>
                  <th style={{ padding: '1rem' }}>TASKS ASSIGNED</th>
                  <th style={{ padding: '1rem' }}>TOTAL HOURS</th>
                  <th style={{ padding: '1rem' }}>ENGAGEMENT</th>
                  <th style={{ padding: '1rem' }}>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {memberData.sort((a, b) => b.hours - a.hours).map((m, i) => (
                  <tr key={m.id} style={{ borderBottom: i === memberData.length - 1 ? 'none' : '1px solid var(--border-primary)' }}>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>{m.name}</td>
                    <td style={{ padding: '1rem' }}>{m.tasks} tasks</td>
                    <td style={{ padding: '1rem' }}>{m.hours}h</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ width: '100%', maxWidth: '100px', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px' }}>
                        <div style={{ width: `${Math.min((m.hours / (totalHours || 1)) * 100, 100)}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: '3px' }}/>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => {
                          if (m.id === user.id) return alert("You can't delete yourself!");
                          if (window.confirm(`Delete ${m.name}?`)) deleteMember(m.id);
                        }}
                        style={{ background: 'transparent', border: 'none', color: 'var(--error)' }}
                      >
                        <Trash2 size={16} opacity={0.6} />
                      </button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
