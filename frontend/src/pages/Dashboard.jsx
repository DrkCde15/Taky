import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { useTaskStore } from '../store/useTaskStore';
import { useAuthStore } from '../store/useAuthStore';
import AppLayout from '../components/layout/AppLayout';
import Navbar from '../components/layout/Navbar';
import Column from '../components/Kanban/Column';
import ModalEditTask from '../components/Kanban/ModalEditTask';
import './Dashboard.css';

export default function Dashboard() {
  const {
    tasks,
    moveTask,
    filterMemberId,
    setFilterMember,
    members,
    addTask,
    fetchTasks,
    fetchMembers,
  } = useTaskStore();
  const { user } = useAuthStore();
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const abort = new AbortController();
    fetchTasks(abort.signal);
    fetchMembers(abort.signal);
    return () => abort.abort();
  }, [fetchTasks, fetchMembers]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const COLUMNS = [
    { id: 'todo', title: 'A Fazer' },
    { id: 'in_progress', title: 'Em Andamento' },
    { id: 'blocked', title: 'Bloqueado' },
    { id: 'done', title: 'Concluído' },
  ];

  const handleDragStart = useCallback(() => {}, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over) return;
      if (active.id !== over.id) {
        moveTask(active.id, over.id);
      }
    },
    [moveTask]
  );

  const filteredTasks = useMemo(
    () =>
      tasks.filter((t) =>
        filterMemberId === 'all' ? true : t.memberId === filterMemberId
      ),
    [tasks, filterMemberId]
  );

  const handleCreateTask = useCallback(async () => {
    const memberId = user?.id || members[0]?.id;
    if (!memberId) return;
    try {
      const newTask = await addTask({
        title: 'Nova Tarefa',
        description: '',
        status: 'todo',
        memberId: memberId.toString(),
        timeSpent: 0,
      });
      if (newTask?.id) {
        const created = useTaskStore.getState().tasks.find(
          (t) => t.id === newTask.id.toString()
        );
        if (created) setEditingTask(created);
      }
    } catch {
      // silent
    }
  }, [addTask, user, members]);

  return (
    <AppLayout
      navbar={
        <Navbar
          onCreateTask={handleCreateTask}
          onFilterChange={setFilterMember}
          filterValue={filterMemberId}
          members={members}
          showNewTask
        />
      }
    >
      <div className="dashboard-content">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="kanban-board">
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                id={col.id}
                title={col.title}
                tasks={filteredTasks.filter((t) => t.status === col.id)}
                members={members}
                onTaskClick={setEditingTask}
              />
            ))}
          </div>
        </DndContext>
      </div>

      {editingTask && (
        <ModalEditTask
          task={editingTask}
          onClose={() => setEditingTask(null)}
          members={members}
        />
      )}
    </AppLayout>
  );
}
