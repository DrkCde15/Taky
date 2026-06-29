import { n as api, t as useAuthStore } from "./useAuthStore-C20Kd3MZ.js";
import { t as useNotificationStore } from "./useNotificationStore-BOpgnzG6.js";
import { useEffect, useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Plus, ShieldCheck, Users } from "lucide-react";
//#region src/components/TeamSelectionModal.tsx
function TeamSelectionModal() {
	const { user, setUser } = useAuthStore();
	if (!user || (user.team_memberships?.length ?? 0) > 0) return null;
	if (user.role === "admin") return /* @__PURE__ */ jsx(AdminTeamSetup, {
		user,
		setUser
	});
	return /* @__PURE__ */ jsx(MemberTeamSelection, {
		user,
		setUser
	});
}
function AdminTeamSetup({ user, setUser }) {
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const create = async (e) => {
		e.preventDefault();
		if (!name.trim()) return;
		setLoading(true);
		setError("");
		try {
			const res = await api.post("/teams", { name: name.trim() });
			const membership = res.data.members?.find((m) => m.user_id === user.id);
			setUser({
				...user,
				team_memberships: membership ? [...user.team_memberships || [], membership] : user.team_memberships
			});
			toast.success(`Equipe "${res.data.name}" criada com sucesso!`);
		} catch (err) {
			setError(err.response?.data?.detail || "Erro ao criar equipe");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[1500] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
		children: /* @__PURE__ */ jsxs("div", {
			className: "glass-strong w-full max-w-md rounded-2xl p-8 animate-in zoom-in-95",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "mb-2 flex justify-center",
					children: /* @__PURE__ */ jsx("div", {
						className: "flex h-12 w-12 items-center justify-center rounded-full bg-primary/20",
						children: /* @__PURE__ */ jsx(Plus, {
							size: 24,
							className: "text-primary"
						})
					})
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "text-center text-xl font-bold tracking-tight",
					children: "Criar equipe"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 text-center text-sm text-muted-foreground",
					children: "Crie sua primeira equipe para começar a gerenciar"
				}),
				error && /* @__PURE__ */ jsx("p", {
					className: "mt-3 text-center text-sm font-medium text-destructive",
					children: error
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: create,
					className: "mt-6 space-y-4",
					children: [/* @__PURE__ */ jsx("input", {
						required: true,
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Nome da equipe",
						className: "w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
					}), /* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: loading || !name.trim(),
						className: "flex w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50",
						children: loading ? "Criando..." : "Criar equipe"
					})]
				})
			]
		})
	});
}
function MemberTeamSelection({ user, setUser }) {
	const [teams, setTeams] = useState([]);
	const [loading, setLoading] = useState(true);
	const [joining, setJoining] = useState(null);
	const [error, setError] = useState("");
	useEffect(() => {
		api.get("/teams").then((res) => setTeams(res.data)).catch(() => setError("Erro ao carregar equipes")).finally(() => setLoading(false));
	}, []);
	const join = async (teamId) => {
		setJoining(teamId);
		setError("");
		try {
			const res = await api.post(`/teams/${teamId}/join`);
			setUser({
				...user,
				team_memberships: res.data.team_memberships
			});
			toast.success("Você entrou na equipe!");
		} catch (err) {
			setError(err.response?.data?.detail || "Erro ao entrar na equipe");
		} finally {
			setJoining(null);
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[1500] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
		children: /* @__PURE__ */ jsxs("div", {
			className: "glass-strong w-full max-w-lg rounded-2xl p-8 animate-in zoom-in-95",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "mb-2 flex justify-center",
					children: /* @__PURE__ */ jsx("div", {
						className: "flex h-12 w-12 items-center justify-center rounded-full bg-primary/20",
						children: /* @__PURE__ */ jsx(Users, {
							size: 24,
							className: "text-primary"
						})
					})
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "text-center text-xl font-bold tracking-tight",
					children: "Escolha sua equipe"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 text-center text-sm text-muted-foreground",
					children: "Selecione em qual equipe você deseja se integrar"
				}),
				error && /* @__PURE__ */ jsx("p", {
					className: "mt-3 text-center text-sm font-medium text-destructive",
					children: error
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6 max-h-64 space-y-2 overflow-y-auto",
					children: loading ? /* @__PURE__ */ jsx("p", {
						className: "text-center text-sm text-muted-foreground",
						children: "Carregando equipes..."
					}) : teams.length === 0 ? /* @__PURE__ */ jsx("p", {
						className: "text-center text-sm text-muted-foreground",
						children: "Nenhuma equipe cadastrada ainda."
					}) : teams.map((team) => /* @__PURE__ */ jsxs("button", {
						onClick: () => join(team.id),
						disabled: joining === team.id,
						className: "flex w-full items-center gap-3 rounded-xl border border-border bg-surface-2 p-4 text-left transition-all hover:border-primary/50 hover:bg-surface-3 disabled:opacity-50",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary",
								children: /* @__PURE__ */ jsx(ShieldCheck, { size: 20 })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ jsx("p", {
									className: "font-semibold",
									children: team.name
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-xs text-muted-foreground",
									children: ["Equipe #", team.id]
								})]
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-sm font-semibold text-primary",
								children: joining === team.id ? "Entrando..." : "Entrar"
							})
						]
					}, team.id))
				})
			]
		})
	});
}
//#endregion
//#region src/routes/_app.tsx?tsr-split=component
function AppLayout() {
	const { token } = useAuthStore();
	const { fetchNotifications, fetchUnreadCount } = useNotificationStore();
	const [ready, setReady] = useState(false);
	useEffect(() => {
		setReady(true);
		if (token) {
			fetchNotifications();
			fetchUnreadCount();
			const id = window.setInterval(() => fetchUnreadCount(), 6e4);
			return () => window.clearInterval(id);
		}
	}, [
		token,
		fetchNotifications,
		fetchUnreadCount
	]);
	if (!ready) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ jsx(TeamSelectionModal, {}), /* @__PURE__ */ jsx(Outlet, {})]
	});
}
//#endregion
export { AppLayout as component };
