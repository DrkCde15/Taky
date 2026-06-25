import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ListChecks, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useTaskStore } from "@/stores/useTaskStore";

export const Route = createFileRoute("/_app/admin")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("auth-storage");
      const auth = raw ? JSON.parse(raw) : null;
      if (auth?.state?.user?.role !== "admin") {
        throw redirect({ to: "/" });
      }
    } catch (e) {
      if ((e as any)?.isRedirect) throw e;
    }
  },
  component: AdminPage,
});

const STATUS_LABEL: Record<string, string> = {
  todo: "A Fazer",
  in_progress: "Em Andamento",
  blocked: "Bloqueado",
  done: "Concluído",
};
const PRIO_COLORS: Record<string, string> = {
  high: "oklch(0.68 0.22 22)",
  medium: "oklch(0.78 0.16 70)",
  low: "oklch(0.72 0.17 155)",
};

function AdminPage() {
  const { tasks, members, fetchTasks, fetchMembers } = useTaskStore();

  useEffect(() => {
    const c = new AbortController();
    fetchTasks(c.signal);
    fetchMembers(c.signal);
    return () => c.abort();
  }, [fetchTasks, fetchMembers]);

  const stats = useMemo(() => {
    const done = tasks.filter((t) => t.status === "done").length;
    const blocked = tasks.filter((t) => t.status === "blocked").length;
    const totalHours = tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);
    return {
      total: tasks.length,
      done,
      blocked,
      pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0,
      totalHours,
    };
  }, [tasks]);

  const statusData = useMemo(
    () =>
      Object.keys(STATUS_LABEL).map((status) => ({
        name: STATUS_LABEL[status],
        value: tasks.filter((t) => t.status === status).length,
      })),
    [tasks]
  );

  const prioData = useMemo(
    () =>
      ["high", "medium", "low"].map((p) => ({
        name: p,
        value: tasks.filter((t) => t.priority === p).length,
      })),
    [tasks]
  );

  const perMember = useMemo(
    () =>
      members.map((m) => ({
        name: m.name?.split(" ")[0] ?? "—",
        tarefas: tasks.filter((t) => t.memberId === String(m.id)).length,
        horas: tasks
          .filter((t) => t.memberId === String(m.id))
          .reduce((sum, t) => sum + (t.timeSpent || 0), 0),
      })),
    [members, tasks]
  );

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Visão geral
          </p>
          <h1 className="text-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl">
            Analytics
          </h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={<ListChecks className="text-info" size={18} />}
            label="Total"
            value={stats.total}
          />
          <KpiCard
            icon={<CheckCircle2 className="text-success" size={18} />}
            label="Concluídas"
            value={`${stats.done} (${stats.pct}%)`}
          />
          <KpiCard
            icon={<AlertTriangle className="text-destructive" size={18} />}
            label="Bloqueadas"
            value={stats.blocked}
          />
          <KpiCard
            icon={<Clock className="text-warning" size={18} />}
            label="Horas registradas"
            value={`${stats.totalHours}h`}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <ChartCard title="Tarefas por status" span="lg:col-span-2">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={statusData}>
                <XAxis dataKey="name" stroke="oklch(0.66 0.02 256)" fontSize={12} />
                <YAxis stroke="oklch(0.66 0.02 256)" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.22 0.024 260)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                  }}
                  labelStyle={{ color: "oklch(0.97 0.01 250)" }}
                />
                <Bar dataKey="value" fill="oklch(0.78 0.16 220)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Por prioridade">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={prioData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {prioData.map((entry) => (
                    <Cell key={entry.name} fill={PRIO_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.22 0.024 260)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Carga por pessoa" span="lg:col-span-3">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={perMember}>
                <XAxis dataKey="name" stroke="oklch(0.66 0.02 256)" fontSize={12} />
                <YAxis stroke="oklch(0.66 0.02 256)" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.22 0.024 260)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                  }}
                />
                <Legend />
                <Bar dataKey="tarefas" fill="oklch(0.78 0.16 220)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="horas" fill="oklch(0.78 0.16 70)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </main>
    </>
  );
}

function KpiCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  span,
  children,
}: {
  title: string;
  span?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`glass rounded-2xl p-5 ${span ?? ""}`}>
      <h3 className="text-sm font-bold">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}
