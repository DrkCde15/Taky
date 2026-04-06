import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Clock, User } from 'lucide-react';

export default function TaskCard({ task, onClick, member }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onClick(task)}
      className="glass"
      style={{
        ...style,
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        transition: 'border-color 0.2s',
        marginBottom: '0.75rem',
        border: '1px solid var(--border-primary)',
        background: 'var(--bg-secondary)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-primary)')}
    >

      <h4 style={{ fontSize: '0.95rem', fontWeight: '600' }}>{task.title}</h4>
      <p style={{ 
        fontSize: '0.8rem', 
        color: 'var(--text-secondary)',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }}>
        {task.description}
      </p>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <Clock size={14} />
          <span>{task.timeSpent}h</span>
        </div>
        
        {member && (
          <img 
            src={member.avatar} 
            alt={member.name} 
            title={member.name}
            style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border-primary)' }} 
          />
        )}
      </div>
    </div>
  );
}
