import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

export default function Column({ id, title, tasks, onTaskClick, members }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const getMember = (id) => members.find(m => m.id === id);

  return (
    <div
      ref={setNodeRef}
      className="glass"
      style={{
        flex: 1,
        minWidth: '280px',
        maxWidth: '350px',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        background: isOver ? 'rgba(56, 189, 248, 0.05)' : 'var(--bg-secondary)',
        border: isOver ? '1px solid var(--accent-primary)' : '1px solid var(--border-primary)',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: 'calc(100vh - 200px)',
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
        <span style={{ 
          fontSize: '0.75rem', 
          background: 'var(--bg-tertiary)', 
          padding: '2px 8px', 
          borderRadius: '12px',
          color: 'var(--text-secondary)'
        }}>{tasks.length}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onClick={onTaskClick}
            member={getMember(task.memberId)}
          />
        ))}
      </div>
    </div>
  );
}
