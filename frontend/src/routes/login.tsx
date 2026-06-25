import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutGrid, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";

export const Route = createFileRoute("/login")({
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
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Bem-vindo de volta!");
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Falha ao entrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Acesse sua conta"
      subtitle="Continue de onde parou."
      footer={
        <p>
          Não tem conta?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field icon={<Mail size={16} />} label="E-mail">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
        </Field>

        <Field icon={<Lock size={16} />} label="Senha">
          <input
            type={show ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
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

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 -z-10 bg-[image:var(--gradient-primary)] opacity-90" />
        <div className="absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(circle_at_25%_25%,white_2px,transparent_2px)] [background-size:24px_24px]" />
        <div className="flex items-center gap-3 text-primary-foreground">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
            <LayoutGrid size={20} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black tracking-tight">Tasky</span>
        </div>
        <div className="text-primary-foreground">
          <h2 className="text-4xl font-black leading-tight tracking-tight">
            Organize o caos.<br />Entregue com clareza.
          </h2>
          <p className="mt-4 max-w-md text-base text-primary-foreground/85">
            Quadros Kanban inteligentes, calendário compartilhado e analytics em tempo real
            para times que constroem juntos.
          </p>
        </div>
        <div className="text-xs text-primary-foreground/70">© Tasky — todos os direitos reservados.</div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--glow-primary)]">
              <LayoutGrid size={18} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight">Tasky</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}

export function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-1 px-3 py-2.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <span className="text-muted-foreground">{icon}</span>
        {children}
      </div>
    </label>
  );
}
