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

export interface Team {
  id: number;
  name: string;
  owner_id: number;
}

interface TaskState {
  tasks: Task[];
  members: Member[];
  teams: Team[];
  filterMemberId: string;
  loading: boolean;
  error: string | null;
  setFilterMember: (id: string) => void;
  setLoading: (l: boolean) => void;
  setError: (e: string | null) => void;
  clearError: () => void;
  fetchTasks: (signal?: AbortSignal) => Promise<void>;
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
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  members: [],
  teams: [],
  filterMemberId: "all",
  loading: false,
  error: null,

  setFilterMember: (memberId) => set({ filterMemberId: memberId }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  fetchTasks: async (signal) => {
    set({ loading: true, error: null });
    try {
      const resp = await api.get("/tasks", { signal });
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
      get().fetchTasks();
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
      get().fetchTasks();
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
      get().fetchTasks();
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
        time_spent: taskData.timeSpent || 0,
        user_id: parseInt(taskData.memberId),
      });
      await get().fetchTasks();
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
        time_spent: parseFloat(String(updates.timeSpent !== undefined ? updates.timeSpent : task.timeSpent)),
        user_id: parseInt(updates.memberId ?? task.memberId),
      };
      await api.put(`/tasks/${id}`, payload);
      get().fetchTasks();
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
}));
