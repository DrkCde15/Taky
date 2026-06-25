import { create } from 'zustand';
import api from '../utils/api';

export const useTaskStore = create()((set, get) => ({
  tasks: [],
  members: [],
  teams: [],
  filterMemberId: 'all',
  loading: false,
  error: null,

  setFilterMember: (memberId) => set({ filterMemberId: memberId }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  fetchTasks: async (signal) => {
    set({ loading: true, error: null });
    try {
      const resp = await api.get('/tasks', { signal });
      const mappedTasks = resp.data.map((t) => ({
        id: t.id.toString(),
        title: t.title,
        description: t.description,
        status: t.status,
        memberId: t.user_id.toString(),
        timeSpent: t.time_spent,
        priority: t.priority || 'medium',
        tags: t.tags ? t.tags.split(',').filter((x) => x) : [],
        dueDate: t.due_date,
        createdAt: t.created_at,
        comments: t.comments || [],
        history: t.history || [],
        files: t.files || [],
      }));
      set({ tasks: mappedTasks, loading: false });
    } catch (e) {
      if (e.name === 'CanceledError' || e.code === 'ERR_CANCELED') return;
      set({ error: 'Failed to fetch tasks', loading: false });
    }
  },

  fetchMembers: async (signal) => {
    try {
      const resp = await api.get('/members', { signal });
      set({ members: resp.data });
    } catch (e) {
      if (e.name === 'CanceledError' || e.code === 'ERR_CANCELED') return;
      set({ error: 'Failed to fetch members' });
    }
  },

  deleteMember: async (id) => {
    try {
      await api.delete(`/members/${id}`);
      get().fetchMembers();
      get().fetchTasks();
    } catch (e) {
      set({ error: e.response?.data?.detail || 'Failed to delete member' });
    }
  },

  addComment: async (taskId, content) => {
    try {
      const auth = JSON.parse(localStorage.getItem('auth-storage'));
      const userId = auth?.state?.user?.id;
      if (!userId) throw new Error('User not found');
      await api.post(`/tasks/${taskId}/comments`, { content, user_id: userId });
      get().fetchTasks();
    } catch (e) {
      set({ error: e.response?.data?.detail || 'Failed to add comment' });
    }
  },

  uploadFile: async (taskId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post(`/tasks/${taskId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      get().fetchTasks();
    } catch (e) {
      set({ error: e.response?.data?.detail || 'Failed to upload file' });
    }
  },

  addTask: async (taskData) => {
    try {
      const resp = await api.post('/tasks', {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority || 'medium',
        tags: taskData.tags ? taskData.tags.join(',') : '',
        due_date: taskData.dueDate,
        time_spent: taskData.timeSpent || 0,
        user_id: parseInt(taskData.memberId),
      });
      await get().fetchTasks();
      return resp.data;
    } catch (e) {
      set({ error: e.response?.data?.detail || 'Failed to create task' });
      throw e;
    }
  },

  updateTask: async (id, updates) => {
    try {
      const task = get().tasks.find((t) => t.id === id);
      if (!task) return;

      const payload = {
        title: updates.title || task.title,
        description: updates.description || task.description,
        status: updates.status || task.status,
        priority: updates.priority || task.priority,
        tags: updates.tags ? updates.tags.join(',') : (task.tags ? task.tags.join(',') : ''),
        due_date: updates.dueDate || task.dueDate,
        time_spent: parseFloat(updates.timeSpent !== undefined ? updates.timeSpent : task.timeSpent),
        user_id: parseInt(updates.memberId || task.memberId),
      };

      await api.put(`/tasks/${id}`, payload);
      get().fetchTasks();
    } catch (e) {
      set({ error: e.response?.data?.detail || 'Failed to update task' });
    }
  },

  moveTask: async (activeId, overId) => {
    const { tasks } = get();
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    if (['todo', 'in_progress', 'blocked', 'done'].includes(overId)) {
      await get().updateTask(activeId, { status: overId });
      return;
    }

    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && activeTask.status !== overTask.status) {
      await get().updateTask(activeId, { status: overTask.status });
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    } catch (e) {
      set({ error: e.response?.data?.detail || 'Failed to delete task' });
    }
  },

  fetchTeams: async (signal) => {
    try {
      const resp = await api.get('/teams', { signal });
      set({ teams: resp.data });
    } catch (e) {
      if (e.name === 'CanceledError' || e.code === 'ERR_CANCELED') return;
      set({ error: 'Failed to fetch teams' });
    }
  },

  addTeam: async (teamName) => {
    try {
      const resp = await api.post('/teams', { name: teamName });
      get().fetchTeams();
      return resp.data;
    } catch (e) {
      const message = e.response?.data?.detail || 'Failed to create team';
      throw new Error(message);
    }
  },
}));
