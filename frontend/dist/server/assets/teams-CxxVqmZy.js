import { t as useAuthStore } from "./useAuthStore-C20Kd3MZ.js";
import { n as Navbar, t as useTaskStore } from "./useTaskStore-COpBNZKZ.js";
import { t as ConfirmModal } from "./ConfirmModal-8XbNTfEe.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Crown, Mail, Pencil, Plus, Trash2, Users } from "lucide-react";
//#region src/routes/_app/teams.tsx?tsr-split=component
function TeamsPage() {
	const { members, teams, fetchMembers, fetchTeams, addTeam, deleteMember, updateTeam, deleteTeam } = useTaskStore();
	const { user } = useAuthStore();
	const [newTeam, setNewTeam] = useState("");
	const [creating, setCreating] = useState(false);
	const [toDelete, setToDelete] = useState(null);
	const [editingTeam, setEditingTeam] = useState(null);
	const [confirmDeleteTeam, setConfirmDeleteTeam] = useState(null);
	useEffect(() => {
		const c = new AbortController();
		fetchMembers(c.signal);
		fetchTeams(c.signal);
		return () => c.abort();
	}, [fetchMembers, fetchTeams]);
	const isAdmin = user?.role === "admin";
	const handleCreate = async () => {
		if (!newTeam.trim()) return;
		setCreating(true);
		try {
			await addTeam(newTeam.trim());
			setNewTeam("");
			toast.success("Equipe criada!");
		} catch (e) {
			toast.error(e?.message ?? "Falha ao criar equipe");
		} finally {
			setCreating(false);
		}
	};
	const handleRename = async () => {
		if (!editingTeam || !editingTeam.name.trim()) return;
		try {
			await updateTeam(editingTeam.id, editingTeam.name.trim());
			setEditingTeam(null);
			toast.success("Equipe renomeada!");
		} catch (e) {
			toast.error(e?.message ?? "Falha ao renomear equipe");
		}
	};
	const handleDeleteTeam = async () => {
		if (!confirmDeleteTeam) return;
		try {
			await deleteTeam(confirmDeleteTeam);
			setConfirmDeleteTeam(null);
			toast.success("Equipe excluída!");
		} catch (e) {
			toast.error(e?.message ?? "Falha ao excluir equipe");
		}
	};
	const userOwnedTeamIds = teams.filter((t) => t.owner_id === user?.id).map((t) => t.id);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Navbar, {}),
		/* @__PURE__ */ jsxs("main", {
			className: "mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsx("div", {
				className: "mb-6 flex flex-wrap items-end justify-between gap-4",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Colaboração"
				}), /* @__PURE__ */ jsx("h1", {
					className: "text-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl",
					children: "Equipes & Pessoas"
				})] })
			}), /* @__PURE__ */ jsxs("div", {
				className: "grid gap-6 lg:grid-cols-[360px_1fr]",
				children: [/* @__PURE__ */ jsxs("section", {
					className: "glass rounded-2xl p-5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 border-b border-border pb-3",
							children: [
								/* @__PURE__ */ jsx(Users, {
									size: 16,
									className: "text-primary"
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-sm font-bold",
									children: "Equipes"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "ml-auto rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-bold",
									children: teams.length
								})
							]
						}),
						isAdmin && /* @__PURE__ */ jsxs("div", {
							className: "mt-4 flex gap-2",
							children: [/* @__PURE__ */ jsx("input", {
								value: newTeam,
								onChange: (e) => setNewTeam(e.target.value),
								placeholder: "Nome da equipe",
								onKeyDown: (e) => e.key === "Enter" && handleCreate(),
								className: "flex-1 rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary"
							}), /* @__PURE__ */ jsx("button", {
								onClick: handleCreate,
								disabled: creating,
								className: "grid place-items-center rounded-lg bg-[image:var(--gradient-primary)] px-3 text-primary-foreground shadow-[var(--glow-primary)] hover:scale-[1.02] active:scale-95 disabled:opacity-50",
								children: /* @__PURE__ */ jsx(Plus, {
									size: 16,
									strokeWidth: 2.5
								})
							})]
						}),
						/* @__PURE__ */ jsx("ul", {
							className: "mt-4 space-y-2",
							children: teams.length === 0 ? /* @__PURE__ */ jsx("li", {
								className: "rounded-xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground",
								children: "Nenhuma equipe ainda."
							}) : teams.map((t) => {
								const isOwner = t.owner_id === user?.id;
								return /* @__PURE__ */ jsxs("li", {
									className: "group flex items-center gap-3 rounded-xl border border-border bg-surface-1 px-3 py-2.5",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "grid h-9 w-9 place-items-center rounded-lg bg-primary/15 font-bold text-primary",
											children: t.name[0]?.toUpperCase()
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ jsx("p", {
												className: "truncate text-sm font-semibold",
												children: t.name
											}), /* @__PURE__ */ jsx("p", {
												className: "text-xs text-muted-foreground",
												children: isOwner ? "Você é o administrador" : "Membro"
											})]
										}),
										isOwner && /* @__PURE__ */ jsxs("div", {
											className: "flex gap-1 opacity-0 transition-opacity group-hover:opacity-100",
											children: [/* @__PURE__ */ jsx("button", {
												onClick: () => setEditingTeam({
													id: t.id,
													name: t.name
												}),
												className: "grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-surface-3 hover:text-foreground",
												title: "Renomear",
												children: /* @__PURE__ */ jsx(Pencil, { size: 12 })
											}), /* @__PURE__ */ jsx("button", {
												onClick: () => setConfirmDeleteTeam(t.id),
												className: "grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-surface-3 hover:text-destructive",
												title: "Excluir",
												children: /* @__PURE__ */ jsx(Trash2, { size: 12 })
											})]
										})
									]
								}, t.id);
							})
						})
					]
				}), /* @__PURE__ */ jsxs("section", {
					className: "glass rounded-2xl p-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 border-b border-border pb-3",
						children: [
							/* @__PURE__ */ jsx(Users, {
								size: 16,
								className: "text-primary"
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold",
								children: "Membros"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "ml-auto rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-bold",
								children: members.length
							})
						]
					}), /* @__PURE__ */ jsx("ul", {
						className: "mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
						children: members.map((m) => {
							const isOwner = m.role === "admin";
							return /* @__PURE__ */ jsx("li", {
								className: "group relative rounded-2xl border border-border bg-surface-1 p-4 transition-all hover:border-primary/40 hover:shadow-[var(--glow-primary)]",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-3",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "grid h-12 w-12 place-items-center rounded-full bg-[image:var(--gradient-primary)] font-bold text-primary-foreground",
											children: m.name?.[0]?.toUpperCase() ?? "?"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "min-w-0 flex-1",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ jsx("p", {
														className: "truncate text-sm font-bold",
														children: m.name
													}), isOwner && /* @__PURE__ */ jsx(Crown, {
														size: 12,
														className: "text-warning"
													})]
												}),
												m.email && /* @__PURE__ */ jsxs("p", {
													className: "mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground",
													children: [/* @__PURE__ */ jsx(Mail, { size: 10 }), m.email]
												}),
												/* @__PURE__ */ jsx("span", {
													className: "mt-2 inline-block rounded-md bg-surface-3 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
													children: m.role ?? "member"
												})
											]
										}),
										userOwnedTeamIds.length > 0 && m.id !== user?.id && /* @__PURE__ */ jsx("button", {
											onClick: () => setToDelete(m.id),
											className: "opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100",
											title: "Remover",
											children: /* @__PURE__ */ jsx(Trash2, { size: 14 })
										})
									]
								})
							}, m.id);
						})
					})]
				})]
			})]
		}),
		editingTeam && /* @__PURE__ */ jsx("div", {
			onClick: () => setEditingTeam(null),
			className: "fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md",
			children: /* @__PURE__ */ jsxs("div", {
				onClick: (e) => e.stopPropagation(),
				className: "glass-strong w-full max-w-md rounded-2xl p-6",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-lg font-bold tracking-tight",
					children: "Renomear equipe"
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: (e) => {
						e.preventDefault();
						handleRename();
					},
					className: "mt-4 space-y-4",
					children: [/* @__PURE__ */ jsx("input", {
						value: editingTeam.name,
						onChange: (e) => setEditingTeam({
							...editingTeam,
							name: e.target.value
						}),
						autoFocus: true,
						className: "w-full rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setEditingTeam(null),
							className: "flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold hover:bg-surface-3",
							children: "Cancelar"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "flex-1 rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)]",
							children: "Salvar"
						})]
					})]
				})]
			})
		}),
		confirmDeleteTeam !== null && /* @__PURE__ */ jsx(ConfirmModal, {
			title: "Excluir equipe?",
			message: "Esta ação não pode ser desfeita. Todos os projetos e tarefas serão perdidos.",
			onConfirm: handleDeleteTeam,
			onCancel: () => setConfirmDeleteTeam(null)
		}),
		toDelete !== null && /* @__PURE__ */ jsx(ConfirmModal, {
			title: "Remover membro?",
			message: "Esta ação não pode ser desfeita e suas tarefas ficarão sem responsável.",
			onConfirm: async () => {
				await deleteMember(toDelete);
				setToDelete(null);
				toast.success("Membro removido");
			},
			onCancel: () => setToDelete(null)
		})
	] });
}
//#endregion
export { TeamsPage as component };
