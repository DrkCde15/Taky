import { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  X,
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  MessageSquare,
  History as HistoryIcon,
  FileText,
  Upload,
  Trash2,
  Paperclip,
} from 'lucide-react';
import { format } from 'date-fns';
import Toast from '../ui/Toast';
import ConfirmModal from '../ui/ConfirmModal';
import './ModalEditTask.css';

export default function ModalEditTask({ task, onClose, members }) {
  const { updateTask, deleteTask, addComment, uploadFile } = useTaskStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('details');
  const [editedTask, setEditedTask] = useState({ ...task });
  const [commentInput, setCommentInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [toast, setToast] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const STATUSES = [
    { id: 'todo', label: 'A Fazer' },
    { id: 'in_progress', label: 'Em Andamento' },
    { id: 'blocked', label: 'Bloqueado' },
    { id: 'done', label: 'Concluído' },
  ];

  const PRIORITIES = [
    { id: 'low', label: 'Baixa', color: 'var(--success)' },
    { id: 'medium', label: 'Média', color: 'orange' },
    { id: 'high', label: 'Alta', color: 'var(--error)' },
  ];

  const TABS = [
    { id: 'details', label: 'Detalhes', icon: FileText },
    { id: 'comments', label: 'Comentários', icon: MessageSquare, count: task.comments?.length },
    { id: 'history', label: 'Histórico', icon: HistoryIcon },
    { id: 'files', label: 'Arquivos', icon: Paperclip, count: task.files?.length },
  ];

  const handleUpdate = (field, value) => {
    const updated = { ...editedTask, [field]: value };
    setEditedTask(updated);
    updateTask(task.id, updated);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTags = [...(editedTask.tags || []), tagInput.trim()];
      handleUpdate('tags', newTags);
      setTagInput('');
    }
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    addComment(task.id, commentInput);
    setCommentInput('');
    setToast({ message: 'Comentário adicionado', type: 'success' });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadFile(task.id, file);
      setToast({ message: 'Arquivo enviado', type: 'success' });
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDelete(false);
    onClose();
  };

  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-edit glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="task-id-label">#{task.id}</span>
            <div className="header-divider" />
            <select
              value={editedTask.status}
              onChange={(e) => handleUpdate('status', e.target.value)}
              className="status-select"
            >
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <button onClick={onClose} className="btn-close">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-main">
            <div className="modal-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn ${activeTab === tab.id ? 'tab-active' : ''}`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="tab-count">{tab.count}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === 'details' && (
                <div className="details-tab">
                  <input
                    value={editedTask.title}
                    onChange={(e) => handleUpdate('title', e.target.value)}
                    placeholder="Título da Tarefa"
                    className="task-title-input"
                  />

                  <div className="description-section">
                    <label>DESCRIÇÃO</label>
                    <textarea
                      value={editedTask.description}
                      onChange={(e) => handleUpdate('description', e.target.value)}
                      placeholder="Descreva esta tarefa..."
                      className="description-input"
                    />
                  </div>

                  <div className="tags-section">
                    {editedTask.tags?.map((tag) => (
                      <span key={tag} className="tag-badge">
                        <Tag size={12} /> {tag}
                        <button
                          onClick={() =>
                            handleUpdate(
                              'tags',
                              editedTask.tags.filter((t) => t !== tag)
                            )
                          }
                          className="tag-remove"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="+ Adicionar tag..."
                      className="tag-input"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="comments-tab">
                  <div className="comment-form">
                    <textarea
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Escreva um comentário..."
                      className="comment-textarea"
                    />
                    <button onClick={handleAddComment} className="btn-send">
                      Enviar Comentário
                    </button>
                  </div>

                  <div className="comments-list">
                    {task.comments?.length === 0 ? (
                      <div className="empty-tab">
                        <MessageSquare size={48} />
                        <p>Nenhum comentário ainda. Inicie a conversa!</p>
                      </div>
                    ) : (
                      [...task.comments]
                        .sort(
                          (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at)
                        )
                        .map((comment) => (
                          <div key={comment.id} className="comment-item">
                            <div className="comment-avatar">
                              <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`}
                                alt="user"
                              />
                            </div>
                            <div className="comment-content">
                              <div className="comment-header">
                                <span className="comment-author">
                                  Usuário ID {comment.user_id}
                                </span>
                                <span className="comment-time">
                                  {format(
                                    new Date(comment.created_at),
                                    'MMM d, HH:mm'
                                  )}
                                </span>
                              </div>
                              <div className="comment-bubble glass">
                                {comment.content}
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="history-tab">
                  {task.history?.length === 0 ? (
                    <div className="empty-tab">
                      <p>Nenhum registro de atividade ainda.</p>
                    </div>
                  ) : (
                    [...task.history]
                      .sort(
                        (a, b) =>
                          new Date(b.created_at) - new Date(a.created_at)
                      )
                      .map((log) => (
                        <div key={log.id} className="history-item">
                          <div className="history-dot" />
                          <span className="history-action">{log.action}</span>
                          <span className="history-time">
                            {format(new Date(log.created_at), 'MMM d, HH:mm')}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              )}

              {activeTab === 'files' && (
                <div className="files-tab">
                  <div
                    className="upload-zone"
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    <Upload size={40} />
                    <p className="upload-text">
                      Arraste arquivos aqui ou clique para enviar
                    </p>
                    <p className="upload-hint">
                      PDF, XLSX, JSON, DOCX até 10MB
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                  </div>

                  <div className="files-grid">
                    {task.files?.map((file) => (
                      <div key={file.id} className="file-card glass">
                        <div className="file-info">
                          <div className="file-icon">
                            <FileText size={20} />
                          </div>
                          <div className="file-details">
                            <p className="file-name">{file.filename}</p>
                            <p className="file-type">
                              {file.file_type?.split('/')[1]?.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <a
                          href={`http://localhost:8000${file.file_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="file-download"
                        >
                          ABRIR ARQUIVO
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-sidebar">
            <div className="sidebar-section">
              <label className="sidebar-label">PRIORIDADE</label>
              <div className="priority-options">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleUpdate('priority', p.id)}
                    className={`priority-option ${
                      editedTask.priority === p.id ? 'priority-selected' : ''
                    }`}
                    style={{
                      '--priority-color': p.color,
                    }}
                  >
                    <AlertCircle size={14} /> {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <label className="sidebar-label">RESPONSÁVEL</label>
              <select
                value={editedTask.memberId}
                onChange={(e) => handleUpdate('memberId', e.target.value)}
                className="sidebar-select"
              >
                {members?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sidebar-section">
              <label className="sidebar-label">DATA DE VENCIMENTO</label>
              <div className="input-with-icon">
                <Calendar size={18} className="input-icon" />
                <input
                  type="date"
                  value={
                    editedTask.dueDate
                      ? format(new Date(editedTask.dueDate), 'yyyy-MM-dd')
                      : ''
                  }
                  onChange={(e) => handleUpdate('dueDate', e.target.value)}
                  className="sidebar-input"
                />
              </div>
            </div>

            <div className="sidebar-section">
              <label className="sidebar-label">TEMPO GASTO (HORAS)</label>
              <div className="input-with-icon">
                <Clock size={18} className="input-icon" />
                <input
                  type="number"
                  step="0.5"
                  value={editedTask.timeSpent}
                  onChange={(e) => handleUpdate('timeSpent', e.target.value)}
                  className="sidebar-input"
                />
              </div>
            </div>

            {user?.role === 'admin' && (
              <button
                onClick={() => setShowDelete(true)}
                className="btn-delete-task"
              >
                <Trash2 size={18} /> Excluir Tarefa
              </button>
            )}
          </div>
        </div>
      </div>

      {showDelete && (
        <ConfirmModal
          title="Excluir Tarefa"
          message="Tem certeza que deseja excluir permanentemente esta tarefa?"
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
