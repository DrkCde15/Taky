import { r as Route$9 } from "./login-CpBICYok.js";
import { useEffect } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, redirect, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ArrowRight, BarChart3, Bell, Calendar, CheckSquare, Clock, GripVertical, Layers, LayoutGrid, MessageSquare, Shield, Users, Zap } from "lucide-react";
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-bikYnVv6.css";
//#endregion
//#region src/lib/lovable-error-reporting.ts
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-gradient text-7xl font-black",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Página não encontrada"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "A página que você procura não existe ou foi movida."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Voltar ao início"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight",
					children: "Algo deu errado"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Tente novamente ou volte ao início."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Tentar de novo"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent",
						children: "Início"
					})]
				})
			]
		})
	});
}
var Route$8 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Taky — Gestão de tarefas para equipes" },
			{
				name: "description",
				content: "Quadro Kanban, calendário e analytics para sua equipe."
			},
			{
				property: "og:title",
				content: "Taky"
			},
			{
				property: "og:description",
				content: "Gestão de tarefas para equipes."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/png",
				href: "/logo.png"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "pt-BR",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$8.useRouteContext();
	return /* @__PURE__ */ jsxs(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Toaster$1, {
			richColors: true,
			theme: "dark",
			position: "bottom-right"
		})]
	});
}
//#endregion
//#region src/routes/register.tsx
var $$splitComponentImporter$6 = () => import("./register-k54a_wFg.js");
var Route$7 = createFileRoute("/register")({
	beforeLoad: () => {
		if (typeof window === "undefined") return;
		try {
			const raw = window.localStorage.getItem("auth-storage");
			if ((raw ? JSON.parse(raw) : null)?.state?.token) throw redirect({ to: "/" });
		} catch (e) {
			if (e?.isRedirect) throw e;
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/home.tsx
var Route$6 = createFileRoute("/home")({
	beforeLoad: () => {
		if (typeof window === "undefined") return;
		try {
			const raw = window.localStorage.getItem("auth-storage");
			if ((raw ? JSON.parse(raw) : null)?.state?.token) throw redirect({ to: "/" });
		} catch (e) {
			if (e?.isRedirect) throw e;
		}
	},
	component: HomePage
});
var FEATURES = [
	{
		icon: Layers,
		title: "Quadro Kanban",
		desc: "Arraste e solte tarefas entre colunas. Visualize o fluxo de trabalho de forma clara e intuitiva."
	},
	{
		icon: Calendar,
		title: "Calendário",
		desc: "Acompanhe prazos e distribua a carga de trabalho com uma visão mensal completa."
	},
	{
		icon: BarChart3,
		title: "Analytics",
		desc: "Métricas em tempo real sobre produtividade, tarefas concluídas e gargalos da equipe."
	},
	{
		icon: Users,
		title: "Equipes",
		desc: "Organize membros por equipe, defina papéis e mantenha todos alinhados."
	},
	{
		icon: MessageSquare,
		title: "Comentários",
		desc: "Discuta tarefas diretamente no contexto com comentários e menções."
	},
	{
		icon: Bell,
		title: "Notificações",
		desc: "Receba alertas em tempo real sobre mudanças, menções e atualizações nas tarefas."
	},
	{
		icon: Clock,
		title: "Registro de Horas",
		desc: "Acompanhe o tempo gasto em cada tarefa para melhorar a estimativa e produtividade."
	},
	{
		icon: Shield,
		title: "Controle de Acesso",
		desc: "Administradores e membros com permissões distintas para manter a segurança."
	}
];
function HomePage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsx(Hero, {}),
			/* @__PURE__ */ jsx(Features, {}),
			/* @__PURE__ */ jsx(Stats, {}),
			/* @__PURE__ */ jsx(CTA, {}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
function Header() {
	return /* @__PURE__ */ jsx("header", {
		className: "fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--glow-primary)]",
						children: /* @__PURE__ */ jsx(LayoutGrid, {
							size: 18,
							strokeWidth: 2.5
						})
					}), /* @__PURE__ */ jsx("span", {
						className: "text-lg font-black tracking-tight",
						children: "Taky"
					})]
				}),
				/* @__PURE__ */ jsxs("nav", {
					className: "hidden items-center gap-1 md:flex",
					children: [/* @__PURE__ */ jsx("a", {
						href: "#features",
						className: "rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
						children: "Recursos"
					}), /* @__PURE__ */ jsx("a", {
						href: "#stats",
						className: "rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
						children: "Números"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/login",
						className: "rounded-lg border border-border px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-surface-2",
						children: "Entrar"
					}), /* @__PURE__ */ jsx(Link, {
						to: "/register",
						className: "rounded-lg bg-[image:var(--gradient-primary)] px-4 py-1.5 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.02] active:scale-95",
						children: "Cadastrar"
					})]
				})
			]
		})
	});
}
function Hero() {
	return /* @__PURE__ */ jsxs("section", {
		className: "relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "pointer-events-none absolute inset-0 -z-10",
			children: [/* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" }), /* @__PURE__ */ jsx("div", { className: "absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/8 blur-[100px]" })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-4xl text-center",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-4 py-1.5 text-xs font-semibold text-muted-foreground",
					children: [/* @__PURE__ */ jsx(Zap, {
						size: 14,
						className: "text-primary"
					}), "Gestão de tarefas para equipes modernas"]
				}),
				/* @__PURE__ */ jsxs("h1", {
					className: "text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl",
					children: [
						"Organize o caos.",
						/* @__PURE__ */ jsx("br", {}),
						/* @__PURE__ */ jsx("span", {
							className: "text-gradient",
							children: "Entregue com clareza."
						})
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mx-auto mt-6 max-w-2xl text-lg text-muted-foreground",
					children: "Taky é um sistema completo de gerenciamento de tarefas com Kanban, calendário, analytics em tempo real e notificações — tudo que seu time precisa para construir juntos."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-10 flex flex-wrap items-center justify-center gap-4",
					children: [/* @__PURE__ */ jsxs(Link, {
						to: "/register",
						className: "group inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-6 py-3 text-base font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.02] active:scale-95",
						children: ["Começar grátis", /* @__PURE__ */ jsx(ArrowRight, {
							size: 18,
							className: "transition-transform group-hover:translate-x-0.5"
						})]
					}), /* @__PURE__ */ jsx(Link, {
						to: "/login",
						className: "inline-flex items-center gap-2 rounded-xl border border-border bg-surface-1 px-6 py-3 text-base font-semibold transition-colors hover:bg-surface-2",
						children: "Já tenho conta"
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-16 grid grid-cols-3 gap-4 sm:gap-8",
					children: [
						{
							value: "+500",
							label: "Usuários ativos"
						},
						{
							value: "+2K",
							label: "Tarefas criadas"
						},
						{
							value: "99%",
							label: "Uptime"
						}
					].map((s) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-surface-1/50 p-4 backdrop-blur-sm",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-gradient text-2xl font-black sm:text-3xl",
							children: s.value
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs text-muted-foreground sm:text-sm",
							children: s.label
						})]
					}, s.label))
				})
			]
		})]
	});
}
function Features() {
	return /* @__PURE__ */ jsx("section", {
		id: "features",
		className: "relative px-4 py-24 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-6xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "text-center",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-3xl font-black tracking-tight sm:text-4xl",
					children: "Tudo que seu time precisa"
				}), /* @__PURE__ */ jsx("p", {
					className: "mx-auto mt-4 max-w-2xl text-muted-foreground",
					children: "Ferramentas completas para gerenciar tarefas, acompanhar prazos e melhorar a produtividade do seu time."
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: FEATURES.map((f) => {
					const Icon = f.icon;
					return /* @__PURE__ */ jsxs("div", {
						className: "group rounded-2xl border border-border bg-surface-1/50 p-6 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-surface-1",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20",
								children: /* @__PURE__ */ jsx(Icon, { size: 20 })
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-base font-bold",
								children: f.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: f.desc
							})
						]
					}, f.title);
				})
			})]
		})
	});
}
function Stats() {
	return /* @__PURE__ */ jsx("section", {
		id: "stats",
		className: "relative px-4 py-24 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ jsx("div", {
			className: "mx-auto max-w-6xl",
			children: /* @__PURE__ */ jsxs("div", {
				className: "relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface-1 to-surface-2 p-8 sm:p-12",
				children: [/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" }), /* @__PURE__ */ jsx("div", {
					className: "relative grid gap-8 sm:grid-cols-3",
					children: [
						{
							icon: CheckSquare,
							value: "4",
							label: "Colunas Kanban",
							desc: "A Fazer, Em Andamento, Bloqueado, Concluído"
						},
						{
							icon: GripVertical,
							value: "Drag & Drop",
							label: "Interação intuitiva",
							desc: "Arraste tarefas entre colunas com um clique"
						},
						{
							icon: BarChart3,
							value: "Tempo real",
							label: "Atualização instantânea",
							desc: "WebSockets para sincronizar o time"
						}
					].map((s) => {
						const Icon = s.icon;
						return /* @__PURE__ */ jsxs("div", {
							className: "text-center",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary",
									children: /* @__PURE__ */ jsx(Icon, { size: 24 })
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-2xl font-black tracking-tight sm:text-3xl",
									children: s.value
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-sm font-semibold",
									children: s.label
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: s.desc
								})
							]
						}, s.label);
					})
				})]
			})
		})
	});
}
function CTA() {
	return /* @__PURE__ */ jsx("section", {
		className: "relative px-4 py-24 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ jsx("div", {
			className: "mx-auto max-w-3xl text-center",
			children: /* @__PURE__ */ jsxs("div", {
				className: "rounded-3xl border border-border bg-surface-1/50 p-8 backdrop-blur-sm sm:p-12",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-3xl font-black tracking-tight sm:text-4xl",
						children: "Pronto para organizar seu fluxo?"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mx-auto mt-4 max-w-lg text-muted-foreground",
						children: "Crie sua conta em segundos e comece a gerenciar tarefas com seu time."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 flex flex-wrap items-center justify-center gap-4",
						children: [/* @__PURE__ */ jsxs(Link, {
							to: "/register",
							className: "group inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-6 py-3 text-base font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.02] active:scale-95",
							children: ["Criar conta gratuita", /* @__PURE__ */ jsx(ArrowRight, {
								size: 18,
								className: "transition-transform group-hover:translate-x-0.5"
							})]
						}), /* @__PURE__ */ jsx(Link, {
							to: "/login",
							className: "inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-base font-semibold transition-colors hover:bg-surface-2",
							children: "Fazer login"
						})]
					})
				]
			})
		})
	});
}
function Footer() {
	return /* @__PURE__ */ jsx("footer", {
		className: "border-t border-border px-4 py-8 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid h-7 w-7 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground",
						children: /* @__PURE__ */ jsx(LayoutGrid, {
							size: 14,
							strokeWidth: 2.5
						})
					}), /* @__PURE__ */ jsx("span", {
						className: "text-sm font-bold tracking-tight",
						children: "Taky"
					})]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Taky — todos os direitos reservados."
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ jsx("a", {
						href: "#features",
						className: "transition-colors hover:text-foreground",
						children: "Recursos"
					}), /* @__PURE__ */ jsx("a", {
						href: "#stats",
						className: "transition-colors hover:text-foreground",
						children: "Números"
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/routes/_app.tsx
var $$splitComponentImporter$5 = () => import("./_app-_MK9Z0cT.js");
var Route$5 = createFileRoute("/_app")({
	beforeLoad: () => {
		if (typeof window === "undefined") return;
		try {
			const raw = window.localStorage.getItem("auth-storage");
			if (!(raw ? JSON.parse(raw) : null)?.state?.token) throw redirect({ to: "/login" });
		} catch (e) {
			if (e?.isRedirect) throw e;
			throw redirect({ to: "/login" });
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/_app/index.tsx
var $$splitComponentImporter$4 = () => import("./_app-Ddw-p22g.js");
var Route$4 = createFileRoute("/_app/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
//#endregion
//#region src/routes/_app/teams.tsx
var $$splitComponentImporter$3 = () => import("./teams-CxxVqmZy.js");
var Route$3 = createFileRoute("/_app/teams")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
//#endregion
//#region src/routes/_app/profile.tsx
var $$splitComponentImporter$2 = () => import("./profile-DVri9aqH.js");
var Route$2 = createFileRoute("/_app/profile")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
//#endregion
//#region src/routes/_app/calendar.tsx
var $$splitComponentImporter$1 = () => import("./calendar-DJWbDn7a.js");
var Route$1 = createFileRoute("/_app/calendar")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
//#endregion
//#region src/routes/_app/admin.tsx
var $$splitComponentImporter = () => import("./admin-BL9bpkql.js");
var Route = createFileRoute("/_app/admin")({
	beforeLoad: () => {
		if (typeof window === "undefined") return;
		try {
			const raw = window.localStorage.getItem("auth-storage");
			const user = (raw ? JSON.parse(raw) : null)?.state?.user;
			if (!(user?.role === "admin" || (user?.team_memberships?.some((m) => m.role === "admin") ?? false))) throw redirect({ to: "/" });
		} catch (e) {
			if (e?.isRedirect) throw e;
		}
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var RegisterRoute = Route$7.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$8
});
var LoginRoute = Route$9.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$8
});
var HomeRoute = Route$6.update({
	id: "/home",
	path: "/home",
	getParentRoute: () => Route$8
});
var AppRoute = Route$5.update({
	id: "/_app",
	getParentRoute: () => Route$8
});
var AppIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var AppTeamsRoute = Route$3.update({
	id: "/teams",
	path: "/teams",
	getParentRoute: () => AppRoute
});
var AppProfileRoute = Route$2.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AppRoute
});
var AppCalendarRoute = Route$1.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => AppRoute
});
var AppRouteChildren = {
	AppAdminRoute: Route.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => AppRoute
	}),
	AppCalendarRoute,
	AppProfileRoute,
	AppTeamsRoute,
	AppIndexRoute
};
var rootRouteChildren = {
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	HomeRoute,
	LoginRoute,
	RegisterRoute
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		basepath: void 0,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
