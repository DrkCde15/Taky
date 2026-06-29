import { t as useAuthStore } from "./useAuthStore-C20Kd3MZ.js";
import { n as Navbar, t as useTaskStore } from "./useTaskStore-COpBNZKZ.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Link, Mail, Shield, User, Users } from "lucide-react";
//#region src/routes/_app/profile.tsx?tsr-split=component
function ProfilePage() {
	const { user, updateProfile } = useAuthStore();
	const { teams } = useTaskStore();
	const [name, setName] = useState(user?.name || "");
	const [email, setEmail] = useState(user?.email || "");
	const [avatar, setAvatar] = useState(user?.avatar || "");
	const [loading, setLoading] = useState(false);
	const handleSave = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await updateProfile({
				name,
				email,
				avatar
			});
			toast.success("Perfil atualizado com sucesso!");
		} catch (err) {
			toast.error(err.toString());
		} finally {
			setLoading(false);
		}
	};
	const getTeamName = (teamId) => {
		return teams.find((t) => t.id === teamId)?.name || `Equipe #${teamId}`;
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Navbar, {}), /* @__PURE__ */ jsxs("main", {
		className: "mx-auto max-w-[1000px] px-4 py-8 sm:px-6 lg:px-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-8",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Configurações"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "text-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl",
					children: "Meu Perfil"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Gerencie suas informações pessoais e conexões de equipe."
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-8 md:grid-cols-[1fr_360px]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "glass-strong rounded-2xl p-6 sm:p-8 animate-in slide-in-from-bottom-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-6 mb-8",
					children: [/* @__PURE__ */ jsx("div", {
						className: "relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-primary/20",
						children: avatar ? /* @__PURE__ */ jsx("img", {
							src: avatar,
							alt: "Avatar",
							className: "h-full w-full object-cover"
						}) : /* @__PURE__ */ jsx("div", {
							className: "grid h-full w-full place-items-center bg-[image:var(--gradient-primary)] text-3xl font-bold text-primary-foreground",
							children: name?.[0]?.toUpperCase() || "?"
						})
					}), /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-bold",
							children: name || "Seu Nome"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: email || "seu@email.com"
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "mt-2 inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: [
								/* @__PURE__ */ jsx(Shield, { size: 12 }),
								" ",
								user?.role || "Member"
							]
						})
					] })]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSave,
					className: "space-y-5",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
							className: "mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: [/* @__PURE__ */ jsx(User, { size: 14 }), " Nome Completo"]
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary",
							required: true
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
							className: "mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: [/* @__PURE__ */ jsx(Mail, { size: 14 }), " Endereço de E-mail"]
						}), /* @__PURE__ */ jsx("input", {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary",
							required: true
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("label", {
								className: "mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: [/* @__PURE__ */ jsx(Link, { size: 14 }), " URL do Avatar"]
							}),
							/* @__PURE__ */ jsx("input", {
								type: "url",
								value: avatar,
								onChange: (e) => setAvatar(e.target.value),
								placeholder: "https://...",
								className: "w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1.5 text-[11px] text-muted-foreground",
								children: "Cole um link de uma imagem pública para usar como foto de perfil."
							})
						] }),
						/* @__PURE__ */ jsx("div", {
							className: "pt-4",
							children: /* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: loading,
								className: "w-full rounded-xl bg-[image:var(--gradient-primary)] px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70",
								children: loading ? "Salvando..." : "Salvar Alterações"
							})
						})
					]
				})]
			}), /* @__PURE__ */ jsxs("aside", {
				className: "space-y-6 animate-in slide-in-from-bottom-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "glass rounded-2xl p-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-4 flex items-center gap-2 border-b border-border pb-3",
						children: [
							/* @__PURE__ */ jsx(Users, {
								size: 16,
								className: "text-primary"
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "font-bold text-sm",
								children: "Minhas Equipes"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "ml-auto rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-bold",
								children: user?.team_memberships?.length || 0
							})
						]
					}), /* @__PURE__ */ jsx("ul", {
						className: "space-y-3",
						children: !user?.team_memberships?.length ? /* @__PURE__ */ jsx("p", {
							className: "text-center text-xs text-muted-foreground py-4",
							children: "Você não está em nenhuma equipe."
						}) : user.team_memberships.map((tm) => /* @__PURE__ */ jsxs("li", {
							className: "flex items-center justify-between rounded-xl border border-border bg-surface-1 p-3 transition-colors hover:border-primary/50",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("p", {
									className: "truncate text-sm font-bold",
									children: getTeamName(tm.team_id)
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: ["Membro desde ", new Date(tm.created_at).toLocaleDateString()]
								})]
							}), /* @__PURE__ */ jsx("span", {
								className: `rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${tm.role === "admin" ? "bg-warning/20 text-warning" : "bg-surface-3 text-muted-foreground"}`,
								children: tm.role
							})]
						}, tm.id))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-border bg-surface-1/50 p-6 text-center",
					children: [/* @__PURE__ */ jsx(Shield, {
						className: "mx-auto mb-2 text-muted-foreground opacity-50",
						size: 24
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Sua conta está segura. Para trocar sua senha, entre em contato com um administrador do sistema."
					})]
				})]
			})]
		})]
	})] });
}
//#endregion
export { ProfilePage as component };
