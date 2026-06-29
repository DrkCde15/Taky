import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, Plus, Trash2, Mail, Crown, Pencil } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import ConfirmModal from "@/components/ConfirmModal";
import { useTaskStore } from "@/stores/useTaskStore";
import { useAuthStore } from "@/stores/useAuthStore";

export const Route = createFileRoute("/_app/teams")({
  component: TeamsPage,
});

function TeamsPage() {
  const {
    members,
    teams,
    fetchMembers,
    fetchTeams,
    addTeam,
    deleteMember,
    updateTeam,
    deleteTeam,
  } = useTaskStore();
  const { user } = useAuthStore();
  const [newTeam, setNewTeam] = useState("");
  const [creating, setCreating] = useState(false);
  const [toDelete, setToDelete] = useState<number | null>(null);
  const [editingTeam, setEditingTeam] = useState<{ id: number; name: string } | null>(null);
  const [confirmDeleteTeam, setConfirmDeleteTeam] = useState<number | null>(null);

  useEffect(() => {
    const c = new AbortController();
    fetchMembers(c.signal);
    fetchTeams(c.signal);
    return () => c.abort();
  }, [fetchMembers, fetchTeams]);

  const isAdmin = user?.role === "admin";

  const handleCreate = async () => {
    if (!newTeam.trim()) return;
    setCreating(true);
    try {
      await addTeam(newTeam.trim());
      setNewTeam("");
      toast.success("Equipe criada!");
    } catch (e: any) {
      toast.error(e?.message ?? "Falha ao criar equipe");
    } finally {
      setCreating(false);
    }
  };

  const handleRename = async () => {
    if (!editingTeam || !editingTeam.name.trim()) return;
    try {
      await updateTeam(editingTeam.id, editingTeam.name.trim());
      setEditingTeam(null);
      toast.success("Equipe renomeada!");
    } catch (e: any) {
      toast.error(e?.message ?? "Falha ao renomear equipe");
    }
  };

  const handleDeleteTeam = async () => {
    if (!confirmDeleteTeam) return;
    try {
      await deleteTeam(confirmDeleteTeam);
      setConfirmDeleteTeam(null);
      toast.success("Equipe excluída!");
    } catch (e: any) {
      toast.error(e?.message ?? "Falha ao excluir equipe");
    }
  };

  const userOwnedTeamIds = teams.filter((t) => t.owner_id === user?.id).map((t) => t.id);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Colaboração
            </p>
            <h1 className="text-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl">
              Equipes & Pessoas
            </h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* Teams */}
          <section className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Users size={16} className="text-primary" />
              <h3 className="text-sm font-bold">Equipes</h3>
              <span className="ml-auto rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-bold">
                {teams.length}
              </span>
            </div>

            {isAdmin && (
              <div className="mt-4 flex gap-2">
                <input
                  value={newTeam}
                  onChange={(e) => setNewTeam(e.target.value)}
                  placeholder="Nome da equipe"
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  className="flex-1 rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="grid place-items-center rounded-lg bg-[image:var(--gradient-primary)] px-3 text-primary-foreground shadow-[var(--glow-primary)] hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>
            )}

            <ul className="mt-4 space-y-2">
              {teams.length === 0 ? (
                <li className="rounded-xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                  Nenhuma equipe ainda.
                </li>
              ) : (
                teams.map((t) => {
                  const isOwner = t.owner_id === user?.id;
                  return (
                    <li
                      key={t.id}
                      className="group flex items-center gap-3 rounded-xl border border-border bg-surface-1 px-3 py-2.5"
                    >
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 font-bold text-primary">
                        {t.name[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {isOwner ? "Você é o administrador" : "Membro"}
                        </p>
                      </div>
                      {isOwner && (
                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => setEditingTeam({ id: t.id, name: t.name })}
                            className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-surface-3 hover:text-foreground"
                            title="Renomear"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteTeam(t.id)}
                            className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-surface-3 hover:text-destructive"
                            title="Excluir"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </section>

          {/* Members */}
          <section className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Users size={16} className="text-primary" />
              <h3 className="text-sm font-bold">Membros</h3>
              <span className="ml-auto rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-bold">
                {members.length}
              </span>
            </div>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {members.map((m) => {
                const isOwner = m.role === "admin";
                return (
                  <li
                    key={m.id}
                    className="group relative rounded-2xl border border-border bg-surface-1 p-4 transition-all hover:border-primary/40 hover:shadow-[var(--glow-primary)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-[image:var(--gradient-primary)] font-bold text-primary-foreground">
                        {m.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-bold">{m.name}</p>
                          {isOwner && <Crown size={12} className="text-warning" />}
                        </div>
                        {m.email && (
                          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                            <Mail size={10} />
                            {m.email}
                          </p>
                        )}
                        <span className="mt-2 inline-block rounded-md bg-surface-3 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {m.role ?? "member"}
                        </span>
                      </div>
                      {userOwnedTeamIds.length > 0 && m.id !== user?.id && (
                        <button
                          onClick={() => setToDelete(m.id)}
                          className="opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                          title="Remover"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </main>

      {editingTeam && (
        <div
          onClick={() => setEditingTeam(null)}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-strong w-full max-w-md rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold tracking-tight">Renomear equipe</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRename();
              }}
              className="mt-4 space-y-4"
            >
              <input
                value={editingTeam.name}
                onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                autoFocus
                className="w-full rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTeam(null)}
                  className="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold hover:bg-surface-3"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)]"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteTeam !== null && (
        <ConfirmModal
          title="Excluir equipe?"
          message="Esta ação não pode ser desfeita. Todos os projetos e tarefas serão perdidos."
          onConfirm={handleDeleteTeam}
          onCancel={() => setConfirmDeleteTeam(null)}
        />
      )}

      {toDelete !== null && (
        <ConfirmModal
          title="Remover membro?"
          message="Esta ação não pode ser desfeita e suas tarefas ficarão sem responsável."
          onConfirm={async () => {
            await deleteMember(toDelete);
            setToDelete(null);
            toast.success("Membro removido");
          }}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}
