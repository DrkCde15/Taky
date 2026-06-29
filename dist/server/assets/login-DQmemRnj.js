import { t as useAuthStore } from "./useAuthStore-C20Kd3MZ.js";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, LayoutGrid, Lock, Mail } from "lucide-react";
//#region src/routes/login.tsx?tsr-split=component
function LoginPage() {
	const navigate = useNavigate();
	const { login } = useAuthStore();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await login(email, password);
			toast.success("Bem-vindo de volta!");
			navigate({ to: "/" });
		} catch (err) {
			toast.error(typeof err === "string" ? err : "Falha ao entrar");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ jsx(AuthShell, {
		title: "Acesse sua conta",
		subtitle: "Continue de onde parou.",
		footer: /* @__PURE__ */ jsxs("p", { children: [
			"Não tem conta?",
			" ",
			/* @__PURE__ */ jsx(Link, {
				to: "/register",
				className: "font-semibold text-primary hover:underline",
				children: "Cadastre-se"
			})
		] }),
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsx(Field, {
					icon: /* @__PURE__ */ jsx(Mail, { size: 16 }),
					label: "E-mail",
					children: /* @__PURE__ */ jsx("input", {
						type: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "voce@exemplo.com",
						className: "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
					})
				}),
				/* @__PURE__ */ jsxs(Field, {
					icon: /* @__PURE__ */ jsx(Lock, { size: 16 }),
					label: "Senha",
					children: [/* @__PURE__ */ jsx("input", {
						type: show ? "text" : "password",
						required: true,
						value: password,
						onChange: (e) => setPassword(e.target.value),
						placeholder: "••••••••",
						className: "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setShow((s) => !s),
						className: "text-muted-foreground hover:text-foreground",
						children: show ? /* @__PURE__ */ jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsx(Eye, { size: 16 })
					})]
				}),
				/* @__PURE__ */ jsxs("button", {
					type: "submit",
					disabled: loading,
					className: "group flex w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50",
					children: [loading ? "Entrando..." : "Entrar", /* @__PURE__ */ jsx(ArrowRight, {
						size: 16,
						className: "transition-transform group-hover:translate-x-0.5"
					})]
				})
			]
		})
	});
}
function AuthShell({ title, subtitle, children, footer }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "relative grid min-h-screen lg:grid-cols-2",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12",
			children: [
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 bg-[image:var(--gradient-primary)] opacity-90" }),
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(circle_at_25%_25%,white_2px,transparent_2px)] [background-size:24px_24px]" }),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3 text-primary-foreground",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur",
						children: /* @__PURE__ */ jsx(LayoutGrid, {
							size: 20,
							strokeWidth: 2.5
						})
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xl font-black tracking-tight",
						children: "Taky"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "text-primary-foreground",
					children: [/* @__PURE__ */ jsxs("h2", {
						className: "text-4xl font-black leading-tight tracking-tight",
						children: [
							"Organize o caos.",
							/* @__PURE__ */ jsx("br", {}),
							"Entregue com clareza."
						]
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-4 max-w-md text-base text-primary-foreground/85",
						children: "Quadros Kanban inteligentes, calendário compartilhado e analytics em tempo real para times que constroem juntos."
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "text-xs text-primary-foreground/70",
					children: "© Taky — todos os direitos reservados."
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "flex items-center justify-center p-6 sm:p-12",
			children: /* @__PURE__ */ jsxs("div", {
				className: "w-full max-w-md",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-6 flex items-center gap-2 lg:hidden",
						children: [/* @__PURE__ */ jsx("div", {
							className: "grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--glow-primary)]",
							children: /* @__PURE__ */ jsx(LayoutGrid, {
								size: 18,
								strokeWidth: 2.5
							})
						}), /* @__PURE__ */ jsx("span", {
							className: "text-lg font-bold tracking-tight",
							children: "Taky"
						})]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-black tracking-tight",
						children: title
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: subtitle
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-8",
						children
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-8 text-center text-sm text-muted-foreground",
						children: footer
					})
				]
			})
		})]
	});
}
function Field({ icon, label, children }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "block",
		children: [/* @__PURE__ */ jsx("span", {
			className: "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 rounded-xl border border-border bg-surface-1 px-3 py-2.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
			children: [/* @__PURE__ */ jsx("span", {
				className: "text-muted-foreground",
				children: icon
			}), children]
		})]
	});
}
//#endregion
export { AuthShell, Field, LoginPage as component };
