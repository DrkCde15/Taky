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
import { wsClient } from "@/lib/websocket";

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
    teams,
    fetchTeams,
    projects,
    fetchProjects,
    activeProjectId,
    setActiveProject,
  } = useTaskStore();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  useEffect(() => {
    const c = new AbortController();
    fetchMembers(c.signal);
    fetchTeams(c.signal);
    return () => c.abort();
  }, [fetchMembers, fetchTeams]);

  useEffect(() => {
    if (selectedTeamId) {
      fetchProjects(selectedTeamId);
    }
  }, [selectedTeamId, fetchProjects]);

  useEffect(() => {
    if (activeProjectId) {
      const c = new AbortController();
      fetchTasks(activeProjectId, c.signal);
      wsClient.connect(activeProjectId);
      wsClient.on("TASK_CREATED", () => fetchTasks(activeProjectId));
      wsClient.on("TASK_UPDATED", () => fetchTasks(activeProjectId));
      return () => {
        c.abort();
        wsClient.off("TASK_CREATED", () => fetchTasks(activeProjectId));
        wsClient.off("TASK_UPDATED", () => fetchTasks(activeProjectId));
        wsClient.disconnect();
      };
    }
  }, [activeProjectId, fetchTasks]);

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

  if (!activeProjectId) {
    return (
      <>
        <Navbar members={members} />
        <main className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-2xl font-bold">Selecione um Projeto</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Para ver o Kanban, escolha uma equipe e depois um projeto.
            </p>
            
            <div className="mt-8 space-y-4 text-left">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Equipe</label>
                <select 
                  className="mt-1 w-full rounded-lg border border-border bg-surface-1 px-3 py-3 text-sm outline-none focus:border-primary"
                  value={selectedTeamId || ""}
                  onChange={e => setSelectedTeamId(Number(e.target.value))}
                >
                  <option value="">Selecione uma equipe</option>
                  {teams.map(t => <option key={t.id} value={t.id} className="bg-surface-2">{t.name}</option>)}
                </select>
              </div>

              {selectedTeamId && (
                <div className="mt-6">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Projetos</label>
                  <div className="grid gap-3">
                    {projects.length === 0 ? (
                      <p className="text-sm text-muted-foreground rounded-lg border border-dashed border-border p-4 text-center">Nenhum projeto encontrado para esta equipe.</p>
                    ) : (
                      projects.map(p => (
                        <button
                          key={p.id}
                          onClick={() => setActiveProject(p.id)}
                          className="flex w-full items-center justify-between rounded-xl border border-border bg-surface-1 p-4 text-left transition-all hover:border-primary hover:shadow-[var(--glow-primary)]"
                        >
                          <div>
                            <span className="block font-bold">{p.name}</span>
                            {p.description && <span className="block text-xs text-muted-foreground mt-1">{p.description}</span>}
                          </div>
                          <span className="text-primary">&rarr;</span>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-semibold mb-2 text-muted-foreground">CRIAR NOVO PROJETO</p>
                    <form 
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const input = form.elements.namedItem("projectName") as HTMLInputElement;
                        if (input.value.trim()) {
                          try {
                            await useTaskStore.getState().addProject(selectedTeamId, input.value.trim());
                            input.value = "";
                            toast.success("Projeto criado!");
                          } catch (err: any) {
                            toast.error(err.toString());
                          }
                        }
                      }}
                      className="flex gap-2"
                    >
                      <input 
                        name="projectName"
                        placeholder="Nome do novo projeto" 
                        required
                        className="flex-1 rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                      <button 
                        type="submit"
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90"
                      >
                        Criar
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </>
    );
  }

  const activeProject = projects.find(p => p.id === activeProjectId);

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
              {activeProject?.name} / Kanban
            </p>
            <h1 className="text-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl">
              Fluxo de trabalho
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Arraste para mover. Clique para abrir.{" "}
              <span className="text-foreground">{filtered.length}</span> tarefas visíveis.
            </p>
          </div>
          <button 
            onClick={() => setActiveProject(null)}
            className="text-sm font-semibold text-primary underline transition-opacity hover:opacity-80"
          >
            Trocar Projeto
          </button>
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
