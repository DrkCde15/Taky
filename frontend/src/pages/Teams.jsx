import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Users, Plus, Shield, UserPlus, Trash2 } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import AppLayout from '../components/layout/AppLayout';
import Navbar from '../components/layout/Navbar';
import Toast from '../components/ui/Toast';
import ConfirmModal from '../components/ui/ConfirmModal';
import './Teams.css';

export default function Teams() {
  const {
    members,
    teams,
    fetchMembers,
    fetchTasks,
    fetchTeams,
    addTeam,
    deleteMember,
    error,
    clearError,
  } = useTaskStore();

  const { user } = useAuthStore();
  const [newMemberName, setNewMemberName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const abort = new AbortController();
    fetchMembers(abort.signal);
    fetchTasks(abort.signal);
    fetchTeams(abort.signal);
    return () => abort.abort();
  }, [fetchMembers, fetchTasks, fetchTeams]);

  useEffect(() => {
    if (error) {
      setToast({ message: error, type: 'error' }); // eslint-disable-line react-hooks/set-state-in-effect
      clearError();
    }
  }, [error, clearError]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    try {
      await addTeam(newTeamName);
      setNewTeamName('');
      setShowCreateModal(false);
      setToast({ message: 'Equipe criada com sucesso', type: 'success' });
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    setToast({
      message: 'Use o Link de Convite para adicionar novos membros à sua equipe.',
      type: 'info',
    });
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(`${window.location.origin}/invite`);
    setToast({ message: 'Link de convite copiado para a área de transferência!', type: 'success' });
  };

  const handleDeleteMember = async (memberId, memberName) => {
    if (memberId === user.id) {
      setToast({ message: 'Você não pode se excluir!', type: 'error' });
      return;
    }
    try {
      await deleteMember(memberId);
      setToast({ message: `${memberName} removido com sucesso`, type: 'success' });
    } catch {
      setToast({ message: 'Falha ao remover membro', type: 'error' });
    }
    setConfirmDelete(null);
  };

  return (
    <AppLayout
      navbar={<Navbar />}
    >
      <div className="teams-content">
        <div className="teams-container">
          <section className="teams-section">
            <div className="section-header">
              <h2>Suas Equipes</h2>
              {user?.role === 'admin' && (
                <div className="section-actions">
                  <button
                    onClick={handleCopyInvite}
                    className="btn-outline"
                  >
                    <UserPlus size={18} /> Link de Convite
                  </button>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary"
                  >
                    <Plus size={18} /> Criar Equipe
                  </button>
                </div>
              )}
            </div>

            <div className="teams-grid">
              {teams.length === 0 ? (
                <div className="empty-state">
                  <Shield size={48} />
                  <h3>Nenhuma equipe ainda</h3>
                  <p>Crie sua primeira equipe para começar.</p>
                </div>
              ) : (
                teams.map((team) => (
                  <div key={team.id} className="team-card glass">
                    <div className="team-card-header">
                      <Shield size={24} color="var(--accent-primary)" />
                      <h3>{team.name}</h3>
                    </div>
                    <p className="team-owner">
                      Proprietário ID: {team.owner_id}
                    </p>
                    <button className="btn-secondary">
                      Gerenciar Equipe
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="members-section">
            <div className="section-header">
              <h2>Membros da Equipe</h2>
              {user?.role === 'admin' && (
                <form onSubmit={handleAddMember} className="add-member-form">
                  <input
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Nome do novo membro..."
                  />
                  <button type="submit" className="btn-primary">
                    <UserPlus size={18} /> Adicionar Membro
                  </button>
                </form>
              )}
            </div>

            <div className="members-list">
              {members.length === 0 ? (
                <div className="empty-state">
                  <Users size={48} />
                  <h3>Nenhum membro ainda</h3>
                  <p>Convide membros para colaborar.</p>
                </div>
              ) : (
                members.map((m, i) => (
                  <div key={m.id} className="member-row">
                    <div className="member-info">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="member-avatar"
                      />
                      <div>
                        <h4>{m.name}</h4>
                        <p className="member-role">
                          Acesso total &bull; {i === 0 ? 'Admin' : 'Membro'}
                        </p>
                      </div>
                    </div>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => setConfirmDelete(m)}
                        className="btn-delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
            <h2>Criar Nova Equipe</h2>
            <form onSubmit={handleCreateTeam}>
              <div className="form-group">
                <label>Nome da Equipe</label>
                <input
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Engenharia, Design, etc..."
                  autoFocus
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Remover Membro"
          message={`Excluir ${confirmDelete.name}? Todas as tarefas associadas serão removidas.`}
          onConfirm={() =>
            handleDeleteMember(confirmDelete.id, confirmDelete.name)
          }
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
