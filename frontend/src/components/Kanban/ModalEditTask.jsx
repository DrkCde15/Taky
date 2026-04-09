import React, { useState, useEffect } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  X, Calendar, Clock, User, Tag, AlertCircle, MessageSquare, 
  History as HistoryIcon, FileText, Upload, Trash2, Download, Paperclip
} from 'lucide-react';
import { format } from 'date-fns';

export default function ModalEditTask({ task, onClose }) {
  const { updateTask, members, deleteTask, addComment, uploadFile } = useTaskStore();
  const { user } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('details');
  const [editedTask, setEditedTask] = useState({ ...task });
  const [commentInput, setCommentInput] = useState('');
  const [tagInput, setTagInput] = useState('');

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
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadFile(task.id, file);
    }
  };

  // Status/Priority options
  const STATUSES = [
    { id: 'in_progress', label: 'In Progress' },
    { id: 'blocked', label: 'Blocked' },
    { id: 'ready_for_review', label: 'Ready for Review' },
    { id: 'done', label: 'Done' }
  ];

  const PRIORITIES = [
    { id: 'low', label: 'Low', color: 'var(--success)' },
    { id: 'medium', label: 'Medium', color: 'orange' },
    { id: 'high', label: 'High', color: 'var(--error)' }
  ];

  if (!task) return null;

  return (
    <div className="animate-fade-in" style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass" style={{
        maxWidth: '900px',
        width: '100%',
        height: '90vh',
        maxHeight: '750px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '700' }}>#{task.id}</span>
            <div style={{ width: '2px', height: '16px', background: 'var(--border-primary)' }} />
            <select 
              value={editedTask.status} 
              onChange={(e) => handleUpdate('status', e.target.value)}
              style={{ background: 'transparent', border: 'none', fontWeight: '700', padding: '0', cursor: 'pointer', color: 'var(--accent-primary)' }}
            >
              {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none' }}>
            <X size={24} color="var(--text-secondary)" />
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Main Content Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
            {/* Tabs Navigation */}
            <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-primary)', marginBottom: '2rem' }}>
              {[
                { id: 'details', label: 'Details', icon: FileText },
                { id: 'comments', label: 'Comments', icon: MessageSquare, count: task.comments?.length },
                { id: 'history', label: 'History', icon: HistoryIcon },
                { id: 'files', label: 'Files', icon: Paperclip, count: task.files?.length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0.75rem 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                    color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: activeTab === tab.id ? '700' : '600',
                    borderRadius: 0,
                    fontSize: '0.9rem'
                  }}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  {tab.count > 0 && <span style={{ fontSize: '0.7rem', padding: '1px 5px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)' }}>{tab.count}</span>}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            {activeTab === 'details' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <input 
                    value={editedTask.title} 
                    onChange={(e) => handleUpdate('title', e.target.value)}
                    placeholder="Task Title"
                    style={{ fontSize: '1.75rem', fontWeight: '800', width: '100%', border: 'none', background: 'transparent', padding: 0 }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700' }}>DESCRIPTION</label>
                  <textarea 
                    value={editedTask.description} 
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    placeholder="Describe this task..."
                    style={{ minHeight: '150px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)' }}
                  />
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  {editedTask.tags?.map(tag => (
                    <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--accent-primary)15', color: 'var(--accent-primary)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700' }}>
                      <Tag size={12} /> {tag}
                      <button onClick={() => handleUpdate('tags', editedTask.tags.filter(t => t !== tag))} style={{ background: 'transparent', border: 'none', padding: 0, color: 'var(--error)', marginLeft: '4px' }}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  <input 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="+ Add tag..."
                    style={{ width: '120px', border: '1px dashed var(--border-primary)', background: 'transparent', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem' }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <textarea 
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Write a comment..."
                    style={{ minHeight: '80px', borderRadius: 'var(--radius-md)' }}
                  />
                  <button onClick={handleAddComment} style={{ alignSelf: 'flex-end', backgroundColor: 'var(--accent-primary)', color: 'black', fontWeight: '700' }}>
                    Send Comment
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {task.comments?.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                       <MessageSquare size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                       <p>No comments yet. Start the conversation!</p>
                    </div>
                  ) : task.comments.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).map(comment => (
                    <div key={comment.id} style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`} alt="user" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>User ID {comment.user_id}</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{format(new Date(comment.created_at), 'MMM d, HH:mm')}</span>
                        </div>
                        <div className="glass" style={{ padding: '1rem', borderRadius: '0 12px 12px 12px', fontSize: '0.95rem' }}>
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {task.history?.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No activity logs yet.</div>
                ) : task.history.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).map(log => (
                  <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                    <div style={{ minWidth: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                    <span style={{ fontSize: '0.9rem' }}>{log.action}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>{format(new Date(log.created_at), 'MMM d, HH:mm')}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'files' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ border: '2px dashed var(--border-primary)', padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.target.style.background = 'transparent'} onClick={() => document.getElementById('file-upload').click()}>
                  <Upload size={40} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
                  <p style={{ fontWeight: '700' }}>Drop files here or click to upload</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>PDF, XLSX, JSON, DOCX up to 10MB</p>
                  <input id="file-upload" type="file" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {task.files?.map(file => (
                    <div key={file.id} className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ padding: '8px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '6px' }}>
                          <FileText size={20} color="var(--accent-primary)" />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                           <p style={{ fontSize: '0.85rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.filename}</p>
                           <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{file.file_type?.split('/')[1]?.toUpperCase()}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                        <a href={`http://localhost:8000${file.file_path}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: '700' }}>
                          OPEN FILE
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ width: '280px', borderLeft: '1px solid var(--border-primary)', padding: '2rem', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '800' }}>PRIORITY</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {PRIORITIES.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleUpdate('priority', p.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: editedTask.priority === p.id ? `${p.color}20` : 'transparent',
                      border: editedTask.priority === p.id ? `1px solid ${p.color}` : '1px solid var(--border-primary)',
                      color: editedTask.priority === p.id ? p.color : 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      justifyContent: 'flex-start'
                    }}
                  >
                    <AlertCircle size={14} /> {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '800' }}>ASSIGNEE</label>
              <select 
                value={editedTask.memberId} 
                onChange={(e) => handleUpdate('memberId', e.target.value)}
                style={{ width: '100%', padding: '0.75rem' }}
              >
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '800' }}>DUE DATE</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                <input 
                  type="date"
                  value={editedTask.dueDate ? format(new Date(editedTask.dueDate), 'yyyy-MM-dd') : ''}
                  onChange={(e) => handleUpdate('dueDate', e.target.value)}
                  style={{ width: '100%', paddingLeft: '40px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '800' }}>TIME SPENT (HOURS)</label>
              <div style={{ position: 'relative' }}>
                <Clock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                <input 
                  type="number"
                  step="0.5"
                  value={editedTask.timeSpent}
                  onChange={(e) => handleUpdate('timeSpent', e.target.value)}
                  style={{ width: '100%', paddingLeft: '40px' }}
                />
              </div>
            </div>

            {user?.role === 'admin' && (
              <button 
                onClick={() => { if(window.confirm('Excluir permanentemente?')) { deleteTask(task.id); onClose(); } }}
                style={{ marginTop: 'auto', background: 'rgba(248, 81, 73, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Trash2 size={18} /> Delete Task
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
