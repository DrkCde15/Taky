import { useDraggable } from '@dnd-kit/core';
import { Clock } from 'lucide-react';
import './TaskCard.css';

export default function TaskCard({ task, onClick, member }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { type: 'Task', task },
  });

  const dragStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 1,
      }
    : undefined;

  const priorityClass = `priority-${task.priority || 'medium'}`;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onClick(task)}
      className={`task-card glass ${isDragging ? 'task-dragging' : ''}`}
      style={dragStyle}
    >
      <div className="task-card-top">
        <span className={`priority-badge ${priorityClass}`}>
          {task.priority || 'medium'}
        </span>
        <span className="task-id">#{task.id}</span>
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag) => (
            <span key={tag} className="task-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <h4 className="task-title">{task.title}</h4>

      <p className="task-description">{task.description}</p>

      <div className="task-card-footer">
        <div className="task-time">
          <Clock size={14} />
          <span>{task.timeSpent}h</span>
        </div>

        {member && (
          <img
            src={member.avatar}
            alt={member.name}
            title={member.name}
            className="task-avatar"
          />
        )}
      </div>
    </div>
  );
}
