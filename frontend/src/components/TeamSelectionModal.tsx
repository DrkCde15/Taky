import { useEffect, useState } from "react";
import { Users, ShieldCheck, Plus } from "lucide-react";
import api from "@/utils/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

interface Team {
  id: number;
  name: string;
  owner_id: number;
}

export default function TeamSelectionModal() {
  const { user, setUser } = useAuthStore();

  if (!user || user.team_id) return null;

  if (user.role === "admin") return <AdminTeamSetup user={user} setUser={setUser} />;
  return <MemberTeamSelection user={user} setUser={setUser} />;
}

function AdminTeamSetup({
  user,
  setUser,
}: {
  user: NonNullable<ReturnType<typeof useAuthStore.getState>["user"]>;
  setUser: (u: typeof user) => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/teams", { name: name.trim() });
      await api.post(`/teams/${res.data.id}/join`);
      setUser({ ...user, team_id: res.data.id });
      toast.success(`Equipe "${res.data.name}" criada com sucesso!`);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erro ao criar equipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="glass-strong w-full max-w-md rounded-2xl p-8 animate-in zoom-in-95">
        <div className="mb-2 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Plus size={24} className="text-primary" />
          </div>
        </div>
        <h3 className="text-center text-xl font-bold tracking-tight">
          Criar equipe
        </h3>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Crie sua primeira equipe para começar a gerenciar
        </p>

        {error && (
          <p className="mt-3 text-center text-sm font-medium text-destructive">{error}</p>
        )}

        <form onSubmit={create} className="mt-6 space-y-4">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da equipe"
            className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
          />
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar equipe"}
          </button>
        </form>
      </div>
    </div>
  );
}

function MemberTeamSelection({
  user,
  setUser,
}: {
  user: NonNullable<ReturnType<typeof useAuthStore.getState>["user"]>;
  setUser: (u: typeof user) => void;
}) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/teams")
      .then((res) => setTeams(res.data))
      .catch(() => setError("Erro ao carregar equipes"))
      .finally(() => setLoading(false));
  }, []);

  const join = async (teamId: number) => {
    setJoining(teamId);
    setError("");
    try {
      const res = await api.post(`/teams/${teamId}/join`);
      setUser({ ...user, team_id: res.data.team_id });
      toast.success("Você entrou na equipe!");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erro ao entrar na equipe");
    } finally {
      setJoining(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="glass-strong w-full max-w-lg rounded-2xl p-8 animate-in zoom-in-95">
        <div className="mb-2 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Users size={24} className="text-primary" />
          </div>
        </div>
        <h3 className="text-center text-xl font-bold tracking-tight">
          Escolha sua equipe
        </h3>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Selecione em qual equipe você deseja se integrar
        </p>

        {error && (
          <p className="mt-3 text-center text-sm font-medium text-destructive">{error}</p>
        )}

        <div className="mt-6 max-h-64 space-y-2 overflow-y-auto">
          {loading ? (
            <p className="text-center text-sm text-muted-foreground">Carregando equipes...</p>
          ) : teams.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Nenhuma equipe cadastrada ainda.
            </p>
          ) : (
            teams.map((team) => (
              <button
                key={team.id}
                onClick={() => join(team.id)}
                disabled={joining === team.id}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface-2 p-4 text-left transition-all hover:border-primary/50 hover:bg-surface-3 disabled:opacity-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{team.name}</p>
                  <p className="text-xs text-muted-foreground">Equipe #{team.id}</p>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {joining === team.id ? "Entrando..." : "Entrar"}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
