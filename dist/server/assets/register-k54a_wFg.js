import { n as Field, t as AuthShell } from "./login-CpBICYok.js";
import { t as useAuthStore } from "./useAuthStore-C20Kd3MZ.js";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Shield, User } from "lucide-react";
//#region src/routes/register.tsx?tsr-split=component
var roles = [{
	value: "member",
	label: "Membro",
	icon: User,
	desc: "Acessa tarefas e projetos"
}, {
	value: "admin",
	label: "Admin",
	icon: Shield,
	desc: "Gerencia equipe e permissões"
}];
function RegisterPage() {
	const navigate = useNavigate();
	const { register } = useAuthStore();
	const [data, setData] = useState({
		name: "",
		email: "",
		password: "",
		role: "member"
	});
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await register(data);
			toast.success("Conta criada! Faça login para continuar.");
			navigate({ to: "/login" });
		} catch (err) {
			toast.error(typeof err === "string" ? err : "Falha no cadastro");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ jsx(AuthShell, {
		title: "Crie sua conta",
		subtitle: "Comece a organizar seu time em minutos.",
		footer: /* @__PURE__ */ jsxs("p", { children: [
			"Já possui conta?",
			" ",
			/* @__PURE__ */ jsx(Link, {
				to: "/login",
				className: "font-semibold text-primary hover:underline",
				children: "Entrar"
			})
		] }),
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsx(Field, {
					icon: /* @__PURE__ */ jsx(User, { size: 16 }),
					label: "Nome",
					children: /* @__PURE__ */ jsx("input", {
						required: true,
						value: data.name,
						onChange: (e) => setData({
							...data,
							name: e.target.value
						}),
						placeholder: "Seu nome",
						className: "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					icon: /* @__PURE__ */ jsx(Mail, { size: 16 }),
					label: "E-mail",
					children: /* @__PURE__ */ jsx("input", {
						type: "email",
						required: true,
						value: data.email,
						onChange: (e) => setData({
							...data,
							email: e.target.value
						}),
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
						minLength: 6,
						value: data.password,
						onChange: (e) => setData({
							...data,
							password: e.target.value
						}),
						placeholder: "Mínimo 6 caracteres",
						className: "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setShow((s) => !s),
						className: "text-muted-foreground hover:text-foreground",
						children: show ? /* @__PURE__ */ jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsx(Eye, { size: 16 })
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Perfil"
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 gap-2",
						children: roles.map((role) => {
							const Icon = role.icon;
							return /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setData({
									...data,
									role: role.value
								}),
								className: `flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-sm transition-all ${data.role === role.value ? "border-primary bg-primary/10 text-primary shadow-[var(--glow-primary)]" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`,
								children: [
									/* @__PURE__ */ jsx(Icon, { size: 22 }),
									/* @__PURE__ */ jsx("span", {
										className: "font-bold",
										children: role.label
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-[11px] leading-tight opacity-70",
										children: role.desc
									})
								]
							}, role.value);
						})
					})]
				}),
				/* @__PURE__ */ jsxs("button", {
					type: "submit",
					disabled: loading,
					className: "group flex w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50",
					children: [loading ? "Criando..." : "Criar conta", /* @__PURE__ */ jsx(ArrowRight, {
						size: 16,
						className: "transition-transform group-hover:translate-x-0.5"
					})]
				})
			]
		})
	});
}
//#endregion
export { RegisterPage as component };
