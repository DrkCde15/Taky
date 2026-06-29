import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  LayoutGrid,
  CheckSquare,
  Calendar,
  BarChart3,
  Users,
  Bell,
  ArrowRight,
  Layers,
  GripVertical,
  MessageSquare,
  Clock,
  Shield,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/home")({
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
  component: HomePage,
});

const FEATURES = [
  {
    icon: Layers,
    title: "Quadro Kanban",
    desc: "Arraste e solte tarefas entre colunas. Visualize o fluxo de trabalho de forma clara e intuitiva.",
  },
  {
    icon: Calendar,
    title: "Calendário",
    desc: "Acompanhe prazos e distribua a carga de trabalho com uma visão mensal completa.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Métricas em tempo real sobre produtividade, tarefas concluídas e gargalos da equipe.",
  },
  {
    icon: Users,
    title: "Equipes",
    desc: "Organize membros por equipe, defina papéis e mantenha todos alinhados.",
  },
  {
    icon: MessageSquare,
    title: "Comentários",
    desc: "Discuta tarefas diretamente no contexto com comentários e menções.",
  },
  {
    icon: Bell,
    title: "Notificações",
    desc: "Receba alertas em tempo real sobre mudanças, menções e atualizações nas tarefas.",
  },
  {
    icon: Clock,
    title: "Registro de Horas",
    desc: "Acompanhe o tempo gasto em cada tarefa para melhorar a estimativa e produtividade.",
  },
  {
    icon: Shield,
    title: "Controle de Acesso",
    desc: "Administradores e membros com permissões distintas para manter a segurança.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--glow-primary)]">
            <LayoutGrid size={18} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-black tracking-tight">Taky</span>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          <a
            href="#features"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Recursos
          </a>
          <a
            href="#stats"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Números
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg border border-border px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-surface-2"
          >
            Entrar
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-[image:var(--gradient-primary)] px-4 py-1.5 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.02] active:scale-95"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/8 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-4 py-1.5 text-xs font-semibold text-muted-foreground">
          <Zap size={14} className="text-primary" />
          Gestão de tarefas para equipes modernas
        </div>

        <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Organize o caos.
          <br />
          <span className="text-gradient">Entregue com clareza.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Taky é um sistema completo de gerenciamento de tarefas com Kanban, calendário, analytics
          em tempo real e notificações — tudo que seu time precisa para construir juntos.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-6 py-3 text-base font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.02] active:scale-95"
          >
            Começar grátis
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-1 px-6 py-3 text-base font-semibold transition-colors hover:bg-surface-2"
          >
            Já tenho conta
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8">
          {[
            { value: "+500", label: "Usuários ativos" },
            { value: "+2K", label: "Tarefas criadas" },
            { value: "99%", label: "Uptime" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-surface-1/50 p-4 backdrop-blur-sm"
            >
              <p className="text-gradient text-2xl font-black sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Tudo que seu time precisa
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Ferramentas completas para gerenciar tarefas, acompanhar prazos e melhorar a
            produtividade do seu time.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-2xl border border-border bg-surface-1/50 p-6 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-surface-1"
              >
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section id="stats" className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface-1 to-surface-2 p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />

          <div className="relative grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: CheckSquare,
                value: "4",
                label: "Colunas Kanban",
                desc: "A Fazer, Em Andamento, Bloqueado, Concluído",
              },
              {
                icon: GripVertical,
                value: "Drag & Drop",
                label: "Interação intuitiva",
                desc: "Arraste tarefas entre colunas com um clique",
              },
              {
                icon: BarChart3,
                value: "Tempo real",
                label: "Atualização instantânea",
                desc: "WebSockets para sincronizar o time",
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center">
                  <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={24} />
                  </div>
                  <p className="text-2xl font-black tracking-tight sm:text-3xl">{s.value}</p>
                  <p className="mt-1 text-sm font-semibold">{s.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <div className="rounded-3xl border border-border bg-surface-1/50 p-8 backdrop-blur-sm sm:p-12">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Pronto para organizar seu fluxo?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Crie sua conta em segundos e comece a gerenciar tarefas com seu time.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-6 py-3 text-base font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.02] active:scale-95"
            >
              Criar conta gratuita
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-base font-semibold transition-colors hover:bg-surface-2"
            >
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
            <LayoutGrid size={14} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold tracking-tight">Taky</span>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Taky — todos os direitos reservados.
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <a href="#features" className="transition-colors hover:text-foreground">
            Recursos
          </a>
          <a href="#stats" className="transition-colors hover:text-foreground">
            Números
          </a>
        </div>
      </div>
    </footer>
  );
}
