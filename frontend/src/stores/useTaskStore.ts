import { create } from "zustand";
import api from "../utils/api";

export interface TaskComment {
  id: number;
  content: string;
  user_id: number;
  created_at: string;
}
export interface TaskHistory {
  id: number;
  action: string;
  created_at: string;
}
export interface TaskFile {
  id: number;
  filename: string;
  url?: string;
  size?: number;
}
export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "blocked" | "done";
  memberId: string;
  timeSpent: number;
  priority: "low" | "medium" | "high";
  tags: string[];
  dueDate?: string | null;
  createdAt?: string;
  comments: TaskComment[];
  history: TaskHistory[];
  files: TaskFile[];
}

export interface Member {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  team_id: number;
}

export interface Team {
  id: number;
  name: string;
  owner_id: number;
}

interface TaskState {
  tasks: Task[];
  members: Member[];
  teams: Team[];
  projects: Project[];
  activeProjectId: number | null;
  filterMemberId: string;
  loading: boolean;
  error: string | null;
  setActiveProject: (id: number | null) => void;
  setFilterMember: (id: string) => void;
  setLoading: (l: boolean) => void;
  setError: (e: string | null) => void;
  clearError: () => void;
  fetchTasks: (projectId: number, signal?: AbortSignal) => Promise<void>;
  fetchMembers: (signal?: AbortSignal) => Promise<void>;
  deleteMember: (id: number) => Promise<void>;
  addComment: (taskId: string, content: string) => Promise<void>;
  uploadFile: (taskId: string, file: File) => Promise<void>;
  addTask: (data: Partial<Task> & { title: string; memberId: string }) => Promise<any>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  moveTask: (activeId: string, overId: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchTeams: (signal?: AbortSignal) => Promise<void>;
  addTeam: (name: string) => Promise<any>;
  fetchProjects: (teamId: number, signal?: AbortSignal) => Promise<void>;
  addProject: (teamId: number, name: string, description?: string) => Promise<any>;
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  members: [],
  teams: [],
  projects: [],
  activeProjectId: null,
  filterMemberId: "all",
  loading: false,
  error: null,

  setActiveProject: (id) => set({ activeProjectId: id }),
  setFilterMember: (memberId) => set({ filterMemberId: memberId }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  fetchTasks: async (projectId, signal) => {
    set({ loading: true, error: null });
    try {
      const resp = await api.get(`/tasks?project_id=${projectId}`, { signal });
      const mappedTasks: Task[] = resp.data.map((t: any) => ({
        id: t.id.toString(),
        title: t.title,
        description: t.description ?? "",
        status: t.status,
        memberId: t.user_id?.toString() ?? "",
        timeSpent: t.time_spent ?? 0,
        priority: t.priority || "medium",
        tags: t.tags ? t.tags.split(",").filter((x: string) => x) : [],
        dueDate: t.due_date,
        createdAt: t.created_at,
        comments: t.comments || [],
        history: t.history || [],
        files: t.files || [],
      }));
      set({ tasks: mappedTasks, loading: false });
    } catch (e: any) {
      if (e.name === "CanceledError" || e.code === "ERR_CANCELED") return;
      set({ error: "Falha ao buscar tarefas", loading: false });
    }
  },

  fetchMembers: async (signal) => {
    try {
      const resp = await api.get("/members", { signal });
      set({ members: resp.data });
    } catch (e: any) {
      if (e.name === "CanceledError" || e.code === "ERR_CANCELED") return;
      set({ error: "Falha ao buscar membros" });
    }
  },

  deleteMember: async (id) => {
    try {
      await api.delete(`/members/${id}`);
      get().fetchMembers();
      const { activeProjectId } = get();
      if (activeProjectId) get().fetchTasks(activeProjectId);
    } catch (e: any) {
      set({ error: e.response?.data?.detail || "Falha ao remover membro" });
    }
  },

  addComment: async (taskId, content) => {
    try {
      const raw = window.localStorage.getItem("auth-storage");
      const auth = raw ? JSON.parse(raw) : null;
      const userId = auth?.state?.user?.id;
      if (!userId) throw new Error("Usuário não encontrado");
      await api.post(`/tasks/${taskId}/comments`, { content, user_id: userId });
      const { activeProjectId } = get();
      if (activeProjectId) get().fetchTasks(activeProjectId);
    } catch (e: any) {
      set({ error: e.response?.data?.detail || "Falha ao adicionar comentário" });
    }
  },

  uploadFile: async (taskId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post(`/tasks/${taskId}/files`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { activeProjectId } = get();
      if (activeProjectId) get().fetchTasks(activeProjectId);
    } catch (e: any) {
      set({ error: e.response?.data?.detail || "Falha ao enviar arquivo" });
    }
  },

  addTask: async (taskData) => {
    try {
      const resp = await api.post("/tasks", {
        title: taskData.title,
        description: taskData.description ?? "",
        status: taskData.status ?? "todo",
        priority: taskData.priority || "medium",
        tags: taskData.tags ? taskData.tags.join(",") : "",
        due_date: taskData.dueDate,
        project_id: get().activeProjectId,
        user_id: parseInt(taskData.memberId),
      });
      const { activeProjectId } = get();
      if (activeProjectId) await get().fetchTasks(activeProjectId);
      return resp.data;
    } catch (e: any) {
      set({ error: e.response?.data?.detail || "Falha ao criar tarefa" });
      throw e;
    }
  },

  updateTask: async (id, updates) => {
    try {
      const task = get().tasks.find((t) => t.id === id);
      if (!task) return;
      const payload = {
        title: updates.title ?? task.title,
        description: updates.description ?? task.description,
        status: updates.status ?? task.status,
        priority: updates.priority ?? task.priority,
        tags: updates.tags ? updates.tags.join(",") : task.tags.join(","),
        due_date: updates.dueDate ?? task.dueDate,
        project_id: get().activeProjectId,
        user_id: parseInt(updates.memberId ?? task.memberId),
      };
      await api.put(`/tasks/${id}`, payload);
      const { activeProjectId } = get();
      if (activeProjectId) get().fetchTasks(activeProjectId);
    } catch (e: any) {
      set({ error: e.response?.data?.detail || "Falha ao atualizar tarefa" });
    }
  },

  moveTask: async (activeId, overId) => {
    const { tasks } = get();
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;
    if (["todo", "in_progress", "blocked", "done"].includes(overId)) {
      await get().updateTask(activeId, { status: overId as Task["status"] });
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
    } catch (e: any) {
      set({ error: e.response?.data?.detail || "Falha ao remover tarefa" });
    }
  },

  fetchTeams: async (signal) => {
    try {
      const resp = await api.get("/teams", { signal });
      set({ teams: resp.data });
    } catch (e: any) {
      if (e.name === "CanceledError" || e.code === "ERR_CANCELED") return;
      set({ error: "Falha ao buscar equipes" });
    }
  },

  addTeam: async (name) => {
    try {
      const resp = await api.post("/teams", { name });
      get().fetchTeams();
      return resp.data;
    } catch (e: any) {
      const message = e.response?.data?.detail || "Falha ao criar equipe";
      throw new Error(message);
    }
  },

  fetchProjects: async (teamId, signal) => {
    try {
      const resp = await api.get(`/projects/team/${teamId}`, { signal });
      set({ projects: resp.data });
    } catch (e: any) {
      if (e.name === "CanceledError" || e.code === "ERR_CANCELED") return;
      set({ error: "Falha ao buscar projetos" });
    }
  },

  addProject: async (teamId, name, description) => {
    try {
      const resp = await api.post("/projects", { name, description, team_id: teamId });
      get().fetchProjects(teamId);
      return resp.data;
    } catch (e: any) {
      throw new Error(e.response?.data?.detail || "Falha ao criar projeto");
    }
  },
}));
