const store = (() => {
  const state = {
    user: null,
    token: null,
    refreshToken: null,
    tasks: [],
    members: [],
    teams: [],
    projects: [],
    activeProjectId: null,
    filterMemberId: 'all',
    loading: false,
    error: null,
    notifications: [],
    unreadCount: 0,
  };

  const listeners = {};

  function get() { return state; }

  function set(key, value) {
    state[key] = value;
    emit(key, value);
  }

  function on(event, fn) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
    return () => { listeners[event] = listeners[event].filter(f => f !== fn); };
  }

  function emit(event, data) {
    (listeners[event] || []).forEach(fn => fn(data));
  }

  function loadAuth() {
    try {
      const raw = localStorage.getItem('auth-storage');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const s = parsed.state;
      if (s?.token) {
        state.user = s.user;
        state.token = s.token;
        state.refreshToken = s.refreshToken;
      }
    } catch {}
  }

  function saveAuth() {
    localStorage.setItem('auth-storage', JSON.stringify({
      state: { user: state.user, token: state.token, refreshToken: state.refreshToken },
      version: 0
    }));
  }

  async function login(email, password) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    const data = await api.post('/auth/token', formData);
    state.user = data.user;
    state.token = data.access_token;
    state.refreshToken = data.refresh_token;
    saveAuth();
    emit('user', state.user);
    return data;
  }

  async function register(userData) {
    const data = await api.post('/auth/register', userData);
    return data;
  }

  async function updateProfile(data) {
    const res = await api.put('/auth/me', data);
    state.user = res;
    saveAuth();
    emit('user', state.user);
    return res;
  }

  function logout() {
    state.user = null;
    state.token = null;
    state.refreshToken = null;
    saveAuth();
    emit('user', null);
  }

  async function fetchTasks(projectId) {
    if (!projectId) return;
    set('loading', true);
    try {
      const resp = await api.get(`/tasks?project_id=${projectId}`);
      state.tasks = resp.map(t => ({
        id: String(t.id),
        title: t.title,
        description: t.description ?? '',
        status: t.status,
        memberId: String(t.user_id ?? ''),
        timeSpent: t.time_spent ?? 0,
        priority: t.priority || 'medium',
        tags: t.tags ? t.tags.split(',').filter(x => x) : [],
        dueDate: t.due_date,
        createdAt: t.created_at,
        comments: t.comments || [],
        history: t.history || [],
        files: t.files || [],
      }));
      set('loading', false);
    } catch (e) {
      if (e.name === 'AbortError') return;
      set('error', 'Falha ao buscar tarefas');
      set('loading', false);
    }
  }

  async function fetchMembers() {
    try {
      const resp = await api.get('/members');
      state.members = resp;
      emit('members', state.members);
    } catch {}
  }

  async function deleteMember(id) {
    await api.delete(`/members/${id}`);
    await fetchMembers();
  }

  async function addComment(taskId, content) {
    const raw = localStorage.getItem('auth-storage');
    const auth = raw ? JSON.parse(raw) : null;
    const userId = auth?.state?.user?.id;
    if (!userId) throw new Error('Usuário não encontrado');
    await api.post(`/tasks/${taskId}/comments`, { content, user_id: userId });
  }

  async function uploadFile(taskId, file) {
    const formData = new FormData();
    formData.append('file', file);
    await api.post(`/tasks/${taskId}/files`, formData);
  }

  async function addTask(taskData) {
    const resp = await api.post('/tasks', {
      title: taskData.title,
      description: taskData.description ?? '',
      status: taskData.status ?? 'todo',
      priority: taskData.priority || 'medium',
      tags: taskData.tags ? taskData.tags.join(',') : '',
      due_date: taskData.dueDate,
      project_id: state.activeProjectId,
      user_id: parseInt(taskData.memberId),
    });
    if (state.activeProjectId) await fetchTasks(state.activeProjectId);
    return resp;
  }

  async function updateTask(id, updates) {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;
    await api.put(`/tasks/${id}`, {
      title: updates.title ?? task.title,
      description: updates.description ?? task.description,
      status: updates.status ?? task.status,
      priority: updates.priority ?? task.priority,
      tags: updates.tags ? updates.tags.join(',') : (task.tags || []).join(','),
      due_date: updates.dueDate ?? task.dueDate,
      project_id: state.activeProjectId,
      user_id: parseInt(updates.memberId ?? task.memberId),
    });
    if (state.activeProjectId) await fetchTasks(state.activeProjectId);
  }

  async function moveTask(activeId, overId) {
    const activeTask = state.tasks.find(t => t.id === activeId);
    if (!activeTask) return;
    if (['todo', 'in_progress', 'blocked', 'done'].includes(overId)) {
      await updateTask(activeId, { status: overId });
      return;
    }
    const overTask = state.tasks.find(t => t.id === overId);
    if (overTask && activeTask.status !== overTask.status) {
      await updateTask(activeId, { status: overTask.status });
    }
  }

  async function deleteTask(id) {
    await api.delete(`/tasks/${id}`);
    state.tasks = state.tasks.filter(t => t.id !== id);
    emit('tasks', state.tasks);
  }

  async function fetchTeams() {
    const resp = await api.get('/teams');
    state.teams = resp;
    emit('teams', state.teams);
  }

  async function addTeam(name) {
    const resp = await api.post('/teams', { name });
    await fetchTeams();
    return resp;
  }

  async function updateTeam(teamId, name) {
    await api.put(`/teams/${teamId}`, { name });
    await fetchTeams();
  }

  async function deleteTeam(teamId) {
    await api.delete(`/teams/${teamId}`);
    await fetchTeams();
  }

  async function fetchProjects(teamId) {
    const resp = await api.get(`/projects/team/${teamId}`);
    state.projects = resp;
    emit('projects', state.projects);
  }

  async function addProject(teamId, name, description) {
    const resp = await api.post('/projects', { name, description, team_id: teamId });
    await fetchProjects(teamId);
    return resp;
  }

  async function fetchNotifications() {
    try { state.notifications = await api.get('/notifications'); emit('notifications', state.notifications); } catch {}
  }

  async function fetchUnreadCount() {
    try { const resp = await api.get('/notifications/unread-count'); state.unreadCount = resp.count; emit('unreadCount', state.unreadCount); } catch {}
  }

  async function markAsRead(notifId) {
    await api.patch(`/notifications/${notifId}/read`);
    state.notifications = state.notifications.map(n => n.id === notifId ? { ...n, read: 1 } : n);
    state.unreadCount = Math.max(0, state.unreadCount - 1);
    emit('notifications', state.notifications);
    emit('unreadCount', state.unreadCount);
  }

  async function markAllAsRead() {
    await api.post('/notifications/read-all');
    state.notifications = state.notifications.map(n => ({ ...n, read: 1 }));
    state.unreadCount = 0;
    emit('notifications', state.notifications);
    emit('unreadCount', state.unreadCount);
  }

  loadAuth();

  return {
    get, set, on,
    login, register, updateProfile, logout,
    fetchTasks, fetchMembers, deleteMember,
    addComment, uploadFile, addTask, updateTask, moveTask, deleteTask,
    fetchTeams, addTeam, updateTeam, deleteTeam,
    fetchProjects, addProject,
    fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead,
  };
})();
