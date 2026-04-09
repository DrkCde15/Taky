import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, LogOut, Users, Plus, Shield, UserPlus, Trash2 } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';

export default function Teams() {
  const { members, teams, addMember, fetchMembers, fetchTasks, fetchTeams, addTeam, deleteMember } = useTaskStore();

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [newMemberName, setNewMemberName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    fetchMembers();
    fetchTasks(); 
    fetchTeams();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    try {
      await addTeam(newTeamName);
      setNewTeamName('');
      setShowCreateModal(false);
    } catch (err) {
      alert(err);
    }
  };



  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    addMember({
      id: Math.random().toString(36).substr(2, 9),
      name: newMemberName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newMemberName}`
    });
    setNewMemberName('');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
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
            <LayoutGrid size={24} /> Tasky
          </h2>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => navigate('/')} 
              style={{ background: 'transparent', border: 'none', fontWeight: '600', color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
            >Board</button>
            <button 
              onClick={() => navigate('/calendar')} 
              style={{ background: 'transparent', border: 'none', fontWeight: '600', color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
            >Calendar</button>
            <button 
              onClick={() => navigate('/teams')} 
              style={{ background: 'transparent', border: 'none', fontWeight: '600', color: 'var(--text-primary)' }}
            >Teams</button>

            {user?.role === 'admin' && (
              <button 
                onClick={() => navigate('/admin')} 
                style={{ background: 'transparent', border: 'none', fontWeight: '600', color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
              >Admin</button>
            )}

          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={user?.avatar} alt={user?.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', padding: '0.25rem' }}>
              <LogOut size={20} color="var(--text-secondary)" />
            </button>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* Teams Section */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Your Teams</h2>
              {user?.role === 'admin' && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/invite`);
                      alert('Invitation link copied to clipboard!');
                    }}
                    style={{ background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}
                  >
                    <UserPlus size={18} /> Invite Link
                  </button>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)', fontWeight: '700' }}
                  >
                    <Plus size={18} /> Create Team
                  </button>
                </div>
              )}

            </div>

            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {teams.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>No teams created yet.</div>
              ) : teams.map(team => (
                <div key={team.id} className="glass" style={{ padding: '2rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Shield size={24} color="var(--accent-primary)" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{team.name}</h3>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Owner ID: {team.owner_id}</p>
                  <button style={{ marginTop: '1rem', width: '100%', padding: '0.5rem', background: 'transparent', border: '1px solid var(--border-primary)' }}>Manage Team</button>
                </div>
              ))}
            </div>
          </section>

          {/* Members Section */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Team Members</h2>
              {user?.role === 'admin' && (
                <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    value={newMemberName} 
                    onChange={(e) => setNewMemberName(e.target.value)} 
                    placeholder="New member name..." 
                    style={{ minWidth: '250px' }}
                  />
                  <button type="submit" style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)', fontWeight: '700' }}>
                    <UserPlus size={18} /> Add Member
                  </button>
                </form>
              )}
            </div>


            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {members.map((m, i) => (
                <div key={m.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '1rem 1.5rem', 
                  borderBottom: i === members.length - 1 ? 'none' : '1px solid var(--border-primary)',
                  transition: 'background 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={m.avatar} alt={m.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    <div>
                      <h4 style={{ fontWeight: '600' }}>{m.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full access • {i === 0 ? 'Admin' : 'Member'}</p>
                    </div>
                  </div>
                  {user?.role === 'admin' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (m.id === user.id) return alert("You can't delete yourself!");
                        if (window.confirm(`Delete ${m.name}? All tasks will be removed.`)) {
                          deleteMember(m.id);
                        }
                      }}
                      style={{ background: 'transparent', color: 'var(--error)', border: 'none', padding: '0.5rem' }}
                    >
                      <Trash2 size={18} opacity={0.5} />
                    </button>
                  )}

                </div>

              ))}
            </div>
          </section>

        </div>
      </main>

      {/* Modal Criar Equipe */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass" style={{
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Create New Team</h2>
            <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label>Team Name</label>
                <input 
                  value={newTeamName} 
                  onChange={(e) => setNewTeamName(e.target.value)} 
                  placeholder="Engineering, Design, etc..."
                  autoFocus
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, background: 'transparent' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)', fontWeight: '700' }}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

