import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, isSameDay } from "date-fns";
import { Calendar as CalIcon, Clock, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useTaskStore, type Task } from "@/stores/useTaskStore";

export const Route = createFileRoute("/_app/calendar")({
  component: CalendarPage,
});

const PRIO_DOT: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-success",
};

function CalendarPage() {
  const { tasks, fetchTasks, members, fetchMembers } = useTaskStore();
  const [selected, setSelected] = useState<Date>(new Date());

  useEffect(() => {
    const c = new AbortController();
    fetchTasks(c.signal);
    fetchMembers(c.signal);
    return () => c.abort();
  }, [fetchTasks, fetchMembers]);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      const key = format(new Date(t.dueDate), "yyyy-MM-dd");
      const arr = map.get(key) ?? [];
      arr.push(t);
      map.set(key, arr);
    });
    return map;
  }, [tasks]);

  const dayTasks = useMemo(
    () =>
      tasks.filter(
        (t) => t.dueDate && isSameDay(new Date(t.dueDate), selected)
      ),
    [tasks, selected]
  );

  const memberName = (id: string) =>
    members.find((m) => String(m.id) === id)?.name ?? "—";

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Cronograma
          </p>
          <h1 className="text-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl">
            Calendário
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="glass rounded-2xl p-4 sm:p-6">
            <div className="rc-Taky">
              <Calendar
                value={selected}
                onChange={(v) => setSelected(v as Date)}
                tileContent={({ date }) => {
                  const key = format(date, "yyyy-MM-dd");
                  const t = tasksByDay.get(key);
                  if (!t || t.length === 0) return null;
                  return (
                    <div className="mt-1 flex justify-center gap-0.5">
                      {t.slice(0, 3).map((task) => (
                        <span
                          key={task.id}
                          className={`h-1.5 w-1.5 rounded-full ${
                            PRIO_DOT[task.priority] ?? "bg-primary"
                          }`}
                        />
                      ))}
                    </div>
                  );
                }}
              />
            </div>
          </div>

          <aside className="glass flex flex-col rounded-2xl p-5">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <CalIcon size={16} className="text-primary" />
              <h3 className="text-sm font-bold">
                {format(selected, "dd 'de' MMMM, yyyy")}
              </h3>
              <span className="ml-auto rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-bold">
                {dayTasks.length}
              </span>
            </div>

            <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
              {dayTasks.length === 0 ? (
                <div className="grid place-items-center py-10 text-center text-sm text-muted-foreground">
                  <AlertCircle size={32} className="mb-2 opacity-30" />
                  Sem tarefas para esta data.
                </div>
              ) : (
                dayTasks.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-border bg-surface-1 p-3 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          t.priority === "high"
                            ? "bg-destructive/15 text-destructive"
                            : t.priority === "medium"
                              ? "bg-warning/15 text-warning"
                              : "bg-success/15 text-success"
                        }`}
                      >
                        {t.priority}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        #{t.id}
                      </span>
                    </div>
                    <h4 className="mt-1.5 text-sm font-semibold">{t.title}</h4>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{memberName(t.memberId)}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} />
                        {t.timeSpent}h
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
