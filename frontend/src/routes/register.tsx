import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("auth-storage");
      const auth = raw ? JSON.parse(raw) : null;
      if (auth?.state?.token) throw redirect({ to: "/" });
    } catch (e) {
      if ((e as any)?.isRedirect) throw e;
    }
  },
  component: RegisterPage,
});

const roles = [
  { value: "member", label: "Membro", icon: User, desc: "Acessa tarefas e projetos" },
  { value: "admin", label: "Admin", icon: Shield, desc: "Gerencia equipe e permissões" },
];

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [data, setData] = useState({ name: "", email: "", password: "", role: "member" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(data);
      toast.success("Conta criada! Faça login para continuar.");
      navigate({ to: "/login" });
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Falha no cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Crie sua conta"
      subtitle="Comece a organizar seu time em minutos."
      footer={
        <p>
          Já possui conta?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Entrar
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field icon={<User size={16} />} label="Nome">
          <input
            required
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="Seu nome"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
        </Field>
        <Field icon={<Mail size={16} />} label="E-mail">
          <input
            type="email"
            required
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="voce@exemplo.com"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
        </Field>
        <Field icon={<Lock size={16} />} label="Senha">
          <input
            type={show ? "text" : "password"}
            required
            minLength={6}
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            placeholder="Mínimo 6 caracteres"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </Field>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Perfil
          </p>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((role) => {
              const Icon = role.icon;
              const selected = data.role === role.value;
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setData({ ...data, role: role.value })}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-sm transition-all ${
                    selected
                      ? "border-primary bg-primary/10 text-primary shadow-[var(--glow-primary)]"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <Icon size={22} />
                  <span className="font-bold">{role.label}</span>
                  <span className="text-[11px] leading-tight opacity-70">{role.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50"
        >
          {loading ? "Criando..." : "Criar conta"}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>
    </AuthShell>
  );
}
