function renderProfilePage(app) {
  const s = store.get();
  if (!s.token) { router.navigate('/login'); return; }

  store.fetchTeams();

  function render() {
    const s = store.get();
    const user = s.user;
    if (!user) return;

    const getTeamName = (teamId) => s.teams.find(t => t.id === teamId)?.name || `Equipe #${teamId}`;

    app.innerHTML = '';
    renderNavbar(app);

    const main = document.createElement('main');
    main.className = 'mx-auto max-w-1000 px-4 py-8 sm:px-6 lg:px-8';
    main.innerHTML = `
      <div class="mb-8"><p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Configurações</p><h1 class="text-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl">Meu Perfil</h1><p class="mt-1 text-sm text-muted-foreground">Gerencie suas informações pessoais e conexões de equipe.</p></div>
      <div class="grid gap-8 md:grid-cols-[1fr_360px]">
        <div class="glass-strong rounded-2xl p-6 sm:p-8 animate-in slide-in-from-bottom-4">
          <div class="flex items-center gap-6 mb-8">
            <div class="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-primary/20">
              ${user.avatar ? `<img src="${escHtml(user.avatar)}" alt="Avatar" class="h-full w-full object-cover" />` : `<div class="grid h-full w-full place-items-center bg-[image:var(--gradient-primary)] text-3xl font-bold text-primary-foreground">${(user.name?.[0] || '?').toUpperCase()}</div>`}
            </div>
            <div><h2 class="text-xl font-bold">${escHtml(user.name || 'Seu Nome')}</h2><p class="text-sm text-muted-foreground">${escHtml(user.email || 'seu@email.com')}</p><span class="mt-2 inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> ${user.role || 'Member'}</span></div>
          </div>
          <form id="profile-form" class="space-y-5">
            <div><label class="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Nome Completo</label><input type="text" id="profile-name" value="${escHtml(user.name || '')}" required class="w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary" /></div>
            <div><label class="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> Endereço de E-mail</label><input type="email" id="profile-email" value="${escHtml(user.email || '')}" required class="w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary" /></div>
            <div><label class="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> URL do Avatar</label><input type="url" id="profile-avatar" value="${escHtml(user.avatar || '')}" placeholder="https://..." class="w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary" /><p class="mt-1.5 text-[11px] text-muted-foreground">Cole um link de uma imagem pública para usar como foto de perfil.</p></div>
            <div class="pt-4"><button type="submit" id="profile-save-btn" class="w-full rounded-xl bg-[image:var(--gradient-primary)] px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70">Salvar Alterações</button></div>
          </form>
        </div>
        <aside class="space-y-6">
          <div class="glass rounded-2xl p-6">
            <div class="mb-4 flex items-center gap-2 border-b border-border pb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <h3 class="font-bold text-sm">Minhas Equipes</h3>
              <span class="ml-auto rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-bold">${user.team_memberships?.length || 0}</span>
            </div>
            <ul class="space-y-3">
              ${!user.team_memberships?.length
                ? '<p class="text-center text-xs text-muted-foreground py-4">Você não está em nenhuma equipe.</p>'
                : user.team_memberships.map(tm => `
                  <li class="flex items-center justify-between rounded-xl border border-border bg-surface-1 p-3 hover:border-primary/50">
                    <div class="min-w-0"><p class="truncate text-sm font-bold">${escHtml(getTeamName(tm.team_id))}</p><p class="text-[11px] text-muted-foreground mt-0.5">Membro desde ${new Date(tm.created_at).toLocaleDateString()}</p></div>
                    <span class="rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${tm.role === 'admin' ? 'bg-warning/20 text-warning' : 'bg-surface-3 text-muted-foreground'}">${tm.role}</span>
                  </li>
                `).join('')}
            </ul>
          </div>
          <div class="rounded-2xl border border-border bg-surface-1/50 p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-2 text-muted-foreground opacity-50"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <p class="text-xs text-muted-foreground">Sua conta está segura. Para trocar sua senha, entre em contato com um administrador do sistema.</p>
          </div>
        </aside>
      </div>
    `;
    app.appendChild(main);

    const form = document.getElementById('profile-form');
    const saveBtn = document.getElementById('profile-save-btn');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      saveBtn.disabled = true;
      saveBtn.textContent = 'Salvando...';
      try {
        await store.updateProfile({
          name: document.getElementById('profile-name').value,
          email: document.getElementById('profile-email').value,
          avatar: document.getElementById('profile-avatar').value,
        });
        toast.success('Perfil atualizado com sucesso!');
      } catch (err) { toast.error(err.toString()); }
      saveBtn.disabled = false;
      saveBtn.textContent = 'Salvar Alterações';
    });
  }

  const unsubTeams = store.on('teams', render);
  render();

  return () => { unsubTeams(); };
}
