import { create } from 'zustand';
import api from '../utils/api';

export const useTaskStore = create()((set, get) => ({
  tasks: [],
  members: [],
  teams: [],
  filterMemberId: 'all',

  setFilterMember: (memberId) => set({ filterMemberId: memberId }),

  fetchTasks: async () => {
    try {
      const resp = await api.get('/tasks');
      const mappedTasks = resp.data.map(t => ({
        id: t.id.toString(),
        title: t.title,
        description: t.description,
        status: t.status,
        memberId: t.user_id.toString(),
        timeSpent: t.time_spent,
        priority: t.priority || 'medium',
        tags: t.tags ? t.tags.split(',').filter(x => x) : [],
        dueDate: t.due_date,
        createdAt: t.created_at,
        comments: t.comments || [],
        history: t.history || [],
        files: t.files || []
      }));
      set({ tasks: mappedTasks });
    } catch (e) {
      console.error("Fetch tasks failed", e);
    }
  },

  fetchMembers: async () => {
    try {
      const resp = await api.get('/members');
      set({ members: resp.data });
    } catch (e) {
      console.error("Fetch members failed", e);
    }
  },

  deleteMember: async (id) => {
    try {
      await api.delete(`/members/${id}`);
      get().fetchMembers();
      get().fetchTasks();
    } catch (e) {
      console.error("Delete member failed", e);
    }
  },

  addComment: async (taskId, content) => {
    try {
      const userId = JSON.parse(localStorage.getItem('auth-storage'))?.state?.user?.id;
      await api.post(`/tasks/${taskId}/comments`, { content, user_id: userId });
      get().fetchTasks();
    } catch (e) {
      console.error("Add comment failed", e);
    }
  },

  uploadFile: async (taskId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post(`/tasks/${taskId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      get().fetchTasks();
    } catch (e) {
      console.error("Upload file failed", e);
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
      get().fetchTasks();
      return resp.data;
    } catch (e) {
      console.error("Add task failed", e);
    }
  },

  updateTask: async (id, updates) => {
    try {
      const task = get().tasks.find(t => t.id === id);
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
      console.error("Update task failed", e);
    }
  },


  moveTask: async (activeId, overId) => {
    const { tasks } = get();
    const activeTask = tasks.find((t) => t.id === activeId);
    
    if (!activeTask) return;

    // Colunas: 'done', 'in_progress', 'blocked', 'ready_for_review'
    if (['done', 'in_progress', 'blocked', 'ready_for_review'].includes(overId)) {
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
      console.error("Delete task failed", e);
    }
  },
  
  fetchTeams: async () => {
    try {
      const resp = await api.get('/teams');
      set({ teams: resp.data });
    } catch (e) {
      console.error("Fetch teams failed", e);
    }
  },

  addTeam: async (teamName) => {
    try {
      const resp = await api.post('/teams', { name: teamName });
      get().fetchTeams();
      return resp.data;
    } catch (e) {
      console.error("Add team failed", e);
      throw e.response?.data?.detail || "Failed to create team";
    }
  },

  addMember: async (member) => {

    // Member addition is now registration. 
    // In a real system you'd have a Create User endpoint.
    // For now we'll just mock registration in the UI.
  },
}));
