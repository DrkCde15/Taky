import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { User as UserIcon, Mail, Link as LinkIcon, Shield, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTaskStore } from "@/stores/useTaskStore";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const { teams } = useTaskStore(); // To get team names since team_memberships only has team_id

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name, email, avatar });
      toast.success("Perfil atualizado com sucesso!");
    } catch (err: any) {
      toast.error(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const getTeamName = (teamId: number) => {
    return teams.find(t => t.id === teamId)?.name || `Equipe #${teamId}`;
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1000px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Configurações</p>
          <h1 className="text-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl">Meu Perfil</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie suas informações pessoais e conexões de equipe.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_360px]">
          {/* Main Form */}
          <div className="glass-strong rounded-2xl p-6 sm:p-8 animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-6 mb-8">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-primary/20">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-[image:var(--gradient-primary)] text-3xl font-bold text-primary-foreground">
                    {name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">{name || "Seu Nome"}</h2>
                <p className="text-sm text-muted-foreground">{email || "seu@email.com"}</p>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Shield size={12} /> {user?.role || "Member"}
                </span>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <UserIcon size={14} /> Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Mail size={14} /> Endereço de E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <LinkIcon size={14} /> URL do Avatar
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Cole um link de uma imagem pública para usar como foto de perfil.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[image:var(--gradient-primary)] px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>

          {/* Teams Sidebar */}
          <aside className="space-y-6 animate-in slide-in-from-bottom-6">
            <div className="glass rounded-2xl p-6">
              <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                <Users size={16} className="text-primary" />
                <h3 className="font-bold text-sm">Minhas Equipes</h3>
                <span className="ml-auto rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-bold">
                  {user?.team_memberships?.length || 0}
                </span>
              </div>
              
              <ul className="space-y-3">
                {!user?.team_memberships?.length ? (
                  <p className="text-center text-xs text-muted-foreground py-4">Você não está em nenhuma equipe.</p>
                ) : (
                  user.team_memberships.map((tm) => (
                    <li key={tm.id} className="flex items-center justify-between rounded-xl border border-border bg-surface-1 p-3 transition-colors hover:border-primary/50">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{getTeamName(tm.team_id)}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Membro desde {new Date(tm.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${tm.role === 'admin' ? 'bg-warning/20 text-warning' : 'bg-surface-3 text-muted-foreground'}`}>
                        {tm.role}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            
            <div className="rounded-2xl border border-border bg-surface-1/50 p-6 text-center">
              <Shield className="mx-auto mb-2 text-muted-foreground opacity-50" size={24} />
              <p className="text-xs text-muted-foreground">
                Sua conta está segura. Para trocar sua senha, entre em contato com um administrador do sistema.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
