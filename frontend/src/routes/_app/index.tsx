import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Column from "@/components/kanban/Column";
import ModalEditTask from "@/components/kanban/ModalEditTask";
import { useTaskStore, type Task } from "@/stores/useTaskStore";

export const Route = createFileRoute("/_app/")({
  component: DashboardPage,
});

const COLUMNS = [
  { id: "todo", title: "A Fazer" },
  { id: "in_progress", title: "Em Andamento" },
  { id: "blocked", title: "Bloqueado" },
  { id: "done", title: "Concluído" },
] as const;

function DashboardPage() {
  const {
    tasks,
    members,
    filterMemberId,
    setFilterMember,
    fetchTasks,
    fetchMembers,
    moveTask,
    addTask,
    loading,
  } = useTaskStore();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  useEffect(() => {
    const c = new AbortController();
    fetchTasks(c.signal);
    fetchMembers(c.signal);
    return () => c.abort();
  }, [fetchTasks, fetchMembers]);

  const handleDragEnd = (e: DragEndEvent) => {
    if (e.over && e.active.id !== e.over.id) {
      moveTask(String(e.active.id), String(e.over.id));
    }
  };

  const filtered =
    filterMemberId === "all"
      ? tasks
      : tasks.filter((t) => t.memberId === filterMemberId);

  const tasksByCol = (status: string) => filtered.filter((t) => t.status === status);

  return (
    <>
      <Navbar
        onCreateTask={() => setShowCreate(true)}
        showNewTask
        filterValue={filterMemberId}
        onFilterChange={setFilterMember}
        members={members}
      />

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quadro Kanban
            </p>
            <h1 className="text-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl">
              Fluxo de trabalho
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Arraste para mover. Clique para abrir.{" "}
              <span className="text-foreground">{filtered.length}</span> tarefas visíveis.
            </p>
          </div>
        </div>

        {loading && tasks.length === 0 ? (
          <div className="grid h-[60vh] place-items-center text-sm text-muted-foreground">
            Carregando...
          </div>
        ) : (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {COLUMNS.map((c) => (
                <Column
                  key={c.id}
                  id={c.id}
                  title={c.title}
                  tasks={tasksByCol(c.id)}
                  members={members}
                  onTaskClick={setActiveTask}
                />
              ))}
            </div>
          </DndContext>
        )}
      </main>

      {activeTask && (
        <ModalEditTask
          task={activeTask}
          members={members}
          onClose={() => setActiveTask(null)}
        />
      )}

      {showCreate && (
        <CreateTaskModal
          members={members}
          onClose={() => setShowCreate(false)}
          onCreate={async (payload) => {
            try {
              await addTask(payload);
              toast.success("Tarefa criada!");
              setShowCreate(false);
            } catch {
              toast.error("Falha ao criar tarefa");
            }
          }}
        />
      )}
    </>
  );
}

function CreateTaskModal({
  members,
  onClose,
  onCreate,
}: {
  members: ReturnType<typeof useTaskStore.getState>["members"];
  onClose: () => void;
  onCreate: (p: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [memberId, setMemberId] = useState(members[0]?.id ? String(members[0].id) : "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-strong w-full max-w-lg rounded-2xl p-6 animate-in zoom-in-95"
      >
        <h3 className="text-xl font-bold tracking-tight">Nova tarefa</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Preencha os campos essenciais. Você pode editar tudo depois.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!title || !memberId) return;
            onCreate({
              title,
              description,
              memberId,
              priority,
              status: "todo",
              tags: [],
            });
          }}
          className="mt-5 space-y-4"
        >
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Título
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              className="mt-1 w-full rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full resize-none rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Responsável
              </label>
              <select
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="" disabled>Selecione</option>
                {members.map((m) => (
                  <option key={m.id} value={String(m.id)} className="bg-surface-2">
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="low" className="bg-surface-2">Baixa</option>
                <option value="medium" className="bg-surface-2">Média</option>
                <option value="high" className="bg-surface-2">Alta</option>
              </select>
            </div>
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold hover:bg-surface-3"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] hover:scale-[1.01]"
            >
              Criar tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
