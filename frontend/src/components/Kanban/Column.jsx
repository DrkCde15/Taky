import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import './Column.css';

export default function Column({ id, title, tasks, onTaskClick, members }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  const getMember = (memberId) => members.find((m) => m.id === memberId);

  return (
    <div
      ref={setNodeRef}
      className={`column glass ${isOver ? 'column-over' : ''}`}
    >
      <div className="column-header">
        <h3 className="column-title">{title}</h3>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div className="column-tasks">
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
