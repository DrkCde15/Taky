import { n as api, t as useAuthStore } from "./useAuthStore-C20Kd3MZ.js";
import { t as useNotificationStore } from "./useNotificationStore-BOpgnzG6.js";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { BarChart3, Bell, Calendar, CheckCheck, Filter, LayoutGrid, LogOut, Plus, Users } from "lucide-react";
import { create } from "zustand";
//#region src/components/NotificationBell.tsx
var TYPE_ICONS = {
	task_assigned: "📋",
	status_changed: "🔄",
	new_comment: "💬",
	member_removed: "🚫"
};
function NotificationBell() {
	const { notifications, unreadCount, fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead } = useNotificationStore();
	const [open, setOpen] = useState(false);
	const [now, setNow] = useState(() => Date.now());
	const ref = useRef(null);
	const navigate = useNavigate();
	useEffect(() => {
		fetchUnreadCount();
		const i1 = setInterval(fetchUnreadCount, 15e3);
		const i2 = setInterval(() => setNow(Date.now()), 6e4);
		return () => {
			clearInterval(i1);
			clearInterval(i2);
		};
	}, [fetchUnreadCount]);
	useEffect(() => {
		if (open) fetchNotifications();
	}, [open, fetchNotifications]);
	useEffect(() => {
		if (!open) return;
		const handler = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [open]);
	const handleClick = async (n) => {
		if (!n.read) await markAsRead(n.id);
		if (n.task_id) navigate({ to: "/" });
		setOpen(false);
	};
	const since = (dateStr) => {
		const diff = now - new Date(dateStr).getTime();
		const mins = Math.floor(diff / 6e4);
		if (mins < 1) return "agora";
		if (mins < 60) return `${mins}min`;
		const hours = Math.floor(mins / 60);
		if (hours < 24) return `${hours}h`;
		return `${Math.floor(hours / 24)}d`;
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "relative",
		ref,
		children: [/* @__PURE__ */ jsxs("button", {
			onClick: () => setOpen((v) => !v),
			className: "relative grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground",
			title: "Notificações",
			children: [/* @__PURE__ */ jsx(Bell, { size: 18 }), unreadCount > 0 && /* @__PURE__ */ jsx("span", {
				className: "absolute right-1 top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground",
				children: unreadCount > 9 ? "9+" : unreadCount
			})]
		}), open && /* @__PURE__ */ jsxs("div", {
			className: "glass-strong absolute right-0 top-[calc(100%+8px)] z-50 flex w-[360px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ jsx("h4", {
					className: "text-sm font-semibold",
					children: "Notificações"
				}), unreadCount > 0 && /* @__PURE__ */ jsxs("button", {
					onClick: markAllAsRead,
					className: "flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10",
					children: [/* @__PURE__ */ jsx(CheckCheck, { size: 14 }), " Marcar tudo"]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "max-h-[400px] overflow-y-auto",
				children: notifications.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "px-4 py-12 text-center text-sm text-muted-foreground",
					children: "Nenhuma notificação"
				}) : notifications.map((n) => /* @__PURE__ */ jsxs("button", {
					onClick: () => handleClick(n),
					className: `flex w-full items-start gap-3 border-b border-border/50 px-4 py-3 text-left transition-colors hover:bg-white/5 ${n.read ? "" : "border-l-2 border-l-primary bg-primary/5"}`,
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-lg leading-none",
						children: TYPE_ICONS[n.type] || "🔔"
					}), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ jsx("p", {
							className: "break-words text-sm leading-snug text-foreground",
							children: n.message
						}), /* @__PURE__ */ jsx("span", {
							className: "mt-1 block text-xs text-muted-foreground",
							children: since(n.created_at)
						})]
					})]
				}, n.id))
			})]
		})]
	});
}
//#endregion
//#region src/components/Navbar.tsx
var NAV = [
	{
		to: "/",
		label: "Quadro",
		icon: LayoutGrid
	},
	{
		to: "/calendar",
		label: "Calendário",
		icon: Calendar
	},
	{
		to: "/teams",
		label: "Equipes",
		icon: Users
	}
];
function Navbar({ onCreateTask, onFilterChange, filterValue, members, showNewTask }) {
	const { user, logout } = useAuthStore();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const handleLogout = () => {
		logout();
		navigate({ to: "/login" });
	};
	const links = user?.role === "admin" || (user?.team_memberships?.some((m) => m.role === "admin") ?? false) ? [...NAV, {
		to: "/admin",
		label: "Analytics",
		icon: BarChart3
	}] : NAV;
	return /* @__PURE__ */ jsxs("header", {
		className: "sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "flex shrink-0 items-center gap-2",
					children: [/* @__PURE__ */ jsx("img", {
						src: "/logo.png",
						alt: "Taky",
						className: "h-9 w-9 rounded-xl object-cover"
					}), /* @__PURE__ */ jsx("span", {
						className: "hidden text-lg font-bold tracking-tight sm:inline",
						children: "Taky"
					})]
				}),
				/* @__PURE__ */ jsx("nav", {
					className: "hidden items-center gap-1 md:flex",
					children: links.map((l) => {
						const active = pathname === l.to;
						const Icon = l.icon;
						return /* @__PURE__ */ jsxs(Link, {
							to: l.to,
							className: `flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`,
							children: [/* @__PURE__ */ jsx(Icon, { size: 16 }), /* @__PURE__ */ jsx("span", { children: l.label })]
						}, l.to);
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "ml-auto flex min-w-0 items-center gap-2 sm:gap-3",
					children: [
						onFilterChange && /* @__PURE__ */ jsxs("div", {
							className: "hidden items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 sm:flex",
							children: [/* @__PURE__ */ jsx(Filter, {
								size: 14,
								className: "text-muted-foreground"
							}), /* @__PURE__ */ jsxs("select", {
								value: filterValue || "all",
								onChange: (e) => onFilterChange(e.target.value),
								className: "bg-transparent text-sm font-medium text-foreground outline-none",
								children: [/* @__PURE__ */ jsx("option", {
									value: "all",
									children: "Todos os membros"
								}), members?.map((m) => /* @__PURE__ */ jsx("option", {
									value: String(m.id),
									children: m.name
								}, m.id))]
							})]
						}),
						showNewTask && onCreateTask && /* @__PURE__ */ jsxs("button", {
							onClick: onCreateTask,
							className: "inline-flex shrink-0 items-center gap-2 rounded-lg bg-[image:var(--gradient-primary)] px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.02] active:scale-95",
							children: [/* @__PURE__ */ jsx(Plus, {
								size: 16,
								strokeWidth: 2.5
							}), /* @__PURE__ */ jsx("span", {
								className: "hidden sm:inline",
								children: "Nova tarefa"
							})]
						}),
						/* @__PURE__ */ jsx(NotificationBell, {}),
						user && /* @__PURE__ */ jsxs(Link, {
							to: "/profile",
							className: "hidden items-center gap-2 rounded-lg border border-border bg-surface-1 px-2 py-1 transition-all hover:border-primary/50 hover:bg-surface-2 sm:flex",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-primary/15 text-xs font-bold text-primary",
								children: user.avatar && user.avatar.startsWith("http") ? /* @__PURE__ */ jsx("img", {
									src: user.avatar,
									alt: "Avatar",
									className: "h-full w-full object-cover"
								}) : user.name?.[0]?.toUpperCase() ?? "?"
							}), /* @__PURE__ */ jsx("span", {
								className: "max-w-[120px] truncate text-sm font-medium",
								children: user.name
							})]
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: handleLogout,
							title: "Sair",
							className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground",
							children: /* @__PURE__ */ jsx(LogOut, { size: 18 })
						})
					]
				})
			]
		}), /* @__PURE__ */ jsx("nav", {
			className: "flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden",
			children: links.map((l) => {
				const active = pathname === l.to;
				const Icon = l.icon;
				return /* @__PURE__ */ jsxs(Link, {
					to: l.to,
					className: `flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`,
					children: [/* @__PURE__ */ jsx(Icon, { size: 14 }), l.label]
				}, l.to);
			})
		})]
	});
}
//#endregion
//#region src/stores/useTaskStore.ts
var useTaskStore = create()((set, get) => ({
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
		set({
			loading: true,
			error: null
		});
		try {
			set({
				tasks: (await api.get(`/tasks?project_id=${projectId}`, { signal })).data.map((t) => ({
					id: t.id.toString(),
					title: t.title,
					description: t.description ?? "",
					status: t.status,
					memberId: t.user_id?.toString() ?? "",
					timeSpent: t.time_spent ?? 0,
					priority: t.priority || "medium",
					tags: t.tags ? t.tags.split(",").filter((x) => x) : [],
					dueDate: t.due_date,
					createdAt: t.created_at,
					comments: t.comments || [],
					history: t.history || [],
					files: t.files || []
				})),
				loading: false
			});
		} catch (e) {
			if (e.name === "CanceledError" || e.code === "ERR_CANCELED") return;
			set({
				error: "Falha ao buscar tarefas",
				loading: false
			});
		}
	},
	fetchMembers: async (signal) => {
		try {
			set({ members: (await api.get("/members", { signal })).data });
		} catch (e) {
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
		} catch (e) {
			set({ error: e.response?.data?.detail || "Falha ao remover membro" });
		}
	},
	addComment: async (taskId, content) => {
		try {
			const raw = window.localStorage.getItem("auth-storage");
			const userId = (raw ? JSON.parse(raw) : null)?.state?.user?.id;
			if (!userId) throw new Error("Usuário não encontrado");
			await api.post(`/tasks/${taskId}/comments`, {
				content,
				user_id: userId
			});
			const { activeProjectId } = get();
			if (activeProjectId) get().fetchTasks(activeProjectId);
		} catch (e) {
			set({ error: e.response?.data?.detail || "Falha ao adicionar comentário" });
		}
	},
	uploadFile: async (taskId, file) => {
		const formData = new FormData();
		formData.append("file", file);
		try {
			await api.post(`/tasks/${taskId}/files`, formData, { headers: { "Content-Type": "multipart/form-data" } });
			const { activeProjectId } = get();
			if (activeProjectId) get().fetchTasks(activeProjectId);
		} catch (e) {
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
				user_id: parseInt(taskData.memberId)
			});
			const { activeProjectId } = get();
			if (activeProjectId) await get().fetchTasks(activeProjectId);
			return resp.data;
		} catch (e) {
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
				user_id: parseInt(updates.memberId ?? task.memberId)
			};
			await api.put(`/tasks/${id}`, payload);
			const { activeProjectId } = get();
			if (activeProjectId) get().fetchTasks(activeProjectId);
		} catch (e) {
			set({ error: e.response?.data?.detail || "Falha ao atualizar tarefa" });
		}
	},
	moveTask: async (activeId, overId) => {
		const { tasks } = get();
		const activeTask = tasks.find((t) => t.id === activeId);
		if (!activeTask) return;
		if ([
			"todo",
			"in_progress",
			"blocked",
			"done"
		].includes(overId)) {
			await get().updateTask(activeId, { status: overId });
			return;
		}
		const overTask = tasks.find((t) => t.id === overId);
		if (overTask && activeTask.status !== overTask.status) await get().updateTask(activeId, { status: overTask.status });
	},
	deleteTask: async (id) => {
		try {
			await api.delete(`/tasks/${id}`);
			set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
		} catch (e) {
			set({ error: e.response?.data?.detail || "Falha ao remover tarefa" });
		}
	},
	fetchTeams: async (signal) => {
		try {
			set({ teams: (await api.get("/teams", { signal })).data });
		} catch (e) {
			if (e.name === "CanceledError" || e.code === "ERR_CANCELED") return;
			set({ error: "Falha ao buscar equipes" });
		}
	},
	addTeam: async (name) => {
		try {
			const resp = await api.post("/teams", { name });
			get().fetchTeams();
			return resp.data;
		} catch (e) {
			const message = e.response?.data?.detail || "Falha ao criar equipe";
			throw new Error(message);
		}
	},
	fetchProjects: async (teamId, signal) => {
		try {
			set({ projects: (await api.get(`/projects/team/${teamId}`, { signal })).data });
		} catch (e) {
			if (e.name === "CanceledError" || e.code === "ERR_CANCELED") return;
			set({ error: "Falha ao buscar projetos" });
		}
	},
	addProject: async (teamId, name, description) => {
		try {
			const resp = await api.post("/projects", {
				name,
				description,
				team_id: teamId
			});
			get().fetchProjects(teamId);
			return resp.data;
		} catch (e) {
			throw new Error(e.response?.data?.detail || "Falha ao criar projeto");
		}
	},
	updateTeam: async (teamId, name) => {
		try {
			await api.put(`/teams/${teamId}`, { name });
			get().fetchTeams();
		} catch (e) {
			const message = e.response?.data?.detail || "Falha ao renomear equipe";
			throw new Error(message);
		}
	},
	deleteTeam: async (teamId) => {
		try {
			await api.delete(`/teams/${teamId}`);
			get().fetchTeams();
		} catch (e) {
			const message = e.response?.data?.detail || "Falha ao excluir equipe";
			throw new Error(message);
		}
	}
}));
//#endregion
export { Navbar as n, useTaskStore as t };
