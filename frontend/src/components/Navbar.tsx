import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, LayoutGrid, Plus, Filter, Calendar, Users, BarChart3 } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import NotificationBell from "./NotificationBell";
import type { Member } from "@/stores/useTaskStore";

interface Props {
  onCreateTask?: () => void;
  onFilterChange?: (id: string) => void;
  filterValue?: string;
  members?: Member[];
  showNewTask?: boolean;
}

const NAV = [
  { to: "/", label: "Quadro", icon: LayoutGrid },
  { to: "/calendar", label: "Calendário", icon: Calendar },
  { to: "/teams", label: "Equipes", icon: Users },
] as const;

export default function Navbar({
  onCreateTask,
  onFilterChange,
  filterValue,
  members,
  showNewTask,
}: Props) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const links = user?.role === "admin"
    ? [...NAV, { to: "/admin" as const, label: "Analytics", icon: BarChart3 }]
    : NAV;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src="/logo.png" alt="Taky" className="h-9 w-9 rounded-xl object-cover" />
          <span className="hidden text-lg font-bold tracking-tight sm:inline">
            Taky
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.to;
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                <span>{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
          {onFilterChange && (
            <div className="hidden items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 sm:flex">
              <Filter size={14} className="text-muted-foreground" />
              <select
                value={filterValue || "all"}
                onChange={(e) => onFilterChange(e.target.value)}
                className="bg-transparent text-sm font-medium text-foreground outline-none"
              >
                <option value="all">Todos os membros</option>
                {members?.map((m) => (
                  <option key={m.id} value={String(m.id)}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showNewTask && onCreateTask && (
            <button
              onClick={onCreateTask}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[image:var(--gradient-primary)] px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.02] active:scale-95"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Nova tarefa</span>
            </button>
          )}

          <NotificationBell />

          {user && (
            <div className="hidden items-center gap-2 rounded-lg border border-border bg-surface-1 px-2 py-1 sm:flex">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                {user.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <span className="max-w-[120px] truncate text-sm font-medium">
                {user.name}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            title="Sair"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
        {links.map((l) => {
          const active = pathname === l.to;
          const Icon = l.icon;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={14} />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
