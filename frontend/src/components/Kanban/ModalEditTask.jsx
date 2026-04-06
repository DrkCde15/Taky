import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { useAuthStore } from '../../store/useAuthStore';
import { X, Save, Trash2, Clock, User, CheckCircle } from 'lucide-react';


export default function ModalEditTask({ task, onClose, members }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [timeSpent, setTimeSpent] = useState(task.timeSpent);
  const [memberId, setMemberId] = useState(task.memberId);
  const [status, setStatus] = useState(task.status);
  const { user } = useAuthStore();
  const { updateTask, deleteTask } = useTaskStore();


  const handleSave = () => {
    updateTask(task.id, { title, description, timeSpent: parseFloat(timeSpent) || 0, memberId, status });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <div className="animate-fade-in" style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem'
    }}>
      <div className="glass" style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '550px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        border: '1px solid var(--border-primary)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Task Detail</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', padding: '0.5rem' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label>Title</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Task title"
              style={{ width: '100%', fontSize: '1.25rem', fontWeight: '700' }}
            />
          </div>

          <div>
            <label>Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="What needs to be done?"
              style={{ width: '100%', minHeight: '120px', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label><User size={16} inline="true" /> Assigned To</label>
              <select value={memberId} onChange={(e) => setMemberId(e.target.value)} style={{ width: '100%' }}>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label><Clock size={16} inline="true" /> Time Spent (hours)</label>
              <input 
                type="number" 
                value={timeSpent} 
                onChange={(e) => setTimeSpent(e.target.value)} 
                step="0.5"
                min="0"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label><CheckCircle size={16} inline="true" /> Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%' }}>
              <option value="in_progress">In Progress</option>
              <option value="blocked">Blocked</option>
              <option value="ready_for_review">Ready for Review</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--border-primary)', paddingTop: '1.5rem' }}>
          {user?.role === 'admin' ? (
            <button 
              onClick={handleDelete}
              style={{ 
                background: 'transparent', 
                color: 'var(--error)', 
                borderColor: 'var(--error)', 
                opacity: 0.8
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(248, 81, 73, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Trash2 size={18} /> Delete Task
            </button>
          ) : <div />}


          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={onClose} style={{ background: 'transparent' }}>Cancel</button>
            <button 
              onClick={handleSave}
              style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)', fontWeight: '700' }}
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
