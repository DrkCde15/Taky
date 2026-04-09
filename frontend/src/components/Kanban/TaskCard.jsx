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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ 
          fontSize: '0.6rem', 
          fontWeight: '800', 
          padding: '2px 6px', 
          borderRadius: '3px', 
          textTransform: 'uppercase',
          background: task.priority === 'high' ? 'rgba(248, 81, 73, 0.15)' : 
                      task.priority === 'medium' ? 'rgba(255, 165, 0, 0.15)' : 
                      'rgba(63, 185, 80, 0.15)',
          color: task.priority === 'high' ? 'var(--error)' : 
                 task.priority === 'medium' ? 'orange' : 
                 'var(--success)'
        }}>
          {task.priority || 'medium'}
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>#{task.id}</span>
      </div>

      {task.tags && task.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {task.tags.map(tag => (
            <span key={tag} style={{ fontSize: '0.6rem', padding: '1px 5px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <h4 style={{ fontSize: '1rem', fontWeight: '700', lineHeight: '1.3' }}>{task.title}</h4>

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
