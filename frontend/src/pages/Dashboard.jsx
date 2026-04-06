import React, { useState, useEffect } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay, closestCorners } from '@dnd-kit/core';
import { useTaskStore } from '../store/useTaskStore';
import { useAuthStore } from '../store/useAuthStore';
import Column from '../components/Kanban/Column';
import ModalEditTask from '../components/Kanban/ModalEditTask';
import { LogOut, Filter, Users, Plus, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { tasks, moveTask, filterMemberId, setFilterMember, members, addTask, fetchTasks, fetchMembers } = useTaskStore();
  const { user, logout } = useAuthStore();
  const [editingTask, setEditingTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, []);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const COLUMNS = [
    { id: 'done', title: 'Done' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'blocked', title: 'Blocked' },
    { id: 'ready_for_review', title: 'Ready for Review' },
  ];


  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId !== overId) {
      moveTask(activeId, overId);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredTasks = tasks.filter((t) => 
    filterMemberId === 'all' ? true : t.memberId === filterMemberId
  );

  const handleCreateTask = () => {
    const newTask = {
      title: 'New Task',
      description: 'Describe what needs to be done...',
      status: 'in_progress',
      memberId: user.id || members[0].id,
      timeSpent: 0
    };
    addTask(newTask);
    // Automatically edit it
    // Wait for the task store to add it (or simulate id)
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Top Navigation */}
      <nav className="glass" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 2rem', 
        borderBottom: '1px solid var(--border-primary)',
        width: '100%',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LayoutGrid size={24} /> Tasky
          </h2>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => navigate('/')} 
              style={{ background: 'transparent', border: 'none', fontWeight: '600', color: 'var(--text-primary)' }}
            >Board</button>
            <button 
              onClick={() => navigate('/teams')} 
              style={{ background: 'transparent', border: 'none', fontWeight: '600', color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
            >Teams</button>
            {user?.role === 'admin' && (
              <button 
                onClick={() => navigate('/admin')} 
                style={{ background: 'transparent', border: 'none', fontWeight: '600', color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
              >Admin</button>
            )}

          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-tertiary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
            <Filter size={16} />
            <select 
              value={filterMemberId} 
              onChange={(e) => setFilterMember(e.target.value)}
              style={{ background: 'transparent', border: 'none', padding: 0, fontSize: '0.875rem', fontWeight: '500' }}
            >
              <option value="all">All Members</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>

          <button 
            onClick={handleCreateTask}
            style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)', fontWeight: '700', padding: '0.5rem 1rem' }}
          >
            <Plus size={18} /> New Task
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={user?.avatar} alt={user?.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', padding: '0.25rem' }}>
              <LogOut size={20} color="var(--text-secondary)" />
            </button>
          </div>
        </div>
      </nav>

      {/* Kanban Board Container */}
      <main style={{ flex: 1, padding: '2rem', overflowX: 'auto', background: 'var(--bg-primary)' }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: 'flex', gap: '1.5rem', height: '100%', minWidth: 'fit-content' }}>
            {COLUMNS.map((col) => (
              <Column 
                key={col.id} 
                id={col.id} 
                title={col.title} 
                tasks={filteredTasks.filter(t => t.status === col.id)} 
                members={members}
                onTaskClick={setEditingTask}
              />
            ))}
          </div>

          {/* Simple drag overlay could go here but let's keep it clean first */}
        </DndContext>
      </main>

      {/* Edit Modal */}
      {editingTask && (
        <ModalEditTask 
          task={editingTask} 
          onClose={() => setEditingTask(null)} 
          members={members}
        />
      )}
    </div>
  );
}
