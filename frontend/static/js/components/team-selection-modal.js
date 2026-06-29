function renderTeamSelectionModal() {
  const user = store.get().user;
  if (!user || (user.team_memberships?.length ?? 0) > 0) return;

  if (user.role === 'admin') {
    renderAdminTeamSetup(user);
  } else {
    renderMemberTeamSelection(user);
  }
}

function renderAdminTeamSetup(user) {
  const overlay = openModal(`
    <div onclick="event.stopPropagation()" class="glass-strong w-full max-w-md rounded-2xl p-8 animate-in zoom-in-95">
      <div class="mb-2 flex justify-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
        </div>
      </div>
      <h3 class="text-center text-xl font-bold tracking-tight">Criar equipe</h3>
      <p class="mt-1 text-center text-sm text-muted-foreground">Crie sua primeira equipe para começar a gerenciar</p>
      <p id="team-error" class="mt-3 text-center text-sm font-medium text-destructive hidden"></p>
      <form id="team-create-form" class="mt-6 space-y-4">
        <input required id="team-name-input" placeholder="Nome da equipe" class="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-primary" />
        <button type="submit" id="team-create-btn" class="flex w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50">Criar equipe</button>
      </form>
    </div>
  `);

  const form = overlay.querySelector('#team-create-form');
  const input = overlay.querySelector('#team-name-input');
  const btn = overlay.querySelector('#team-create-btn');
  const err = overlay.querySelector('#team-error');

  form.onsubmit = async (e) => {
    e.preventDefault();
    if (!input.value.trim()) return;
    btn.disabled = true;
    btn.textContent = 'Criando...';
    err.classList.add('hidden');
    try {
      const res = await api.post('/teams', { name: input.value.trim() });
      const membership = res.members?.find(m => m.user_id === user.id);
      if (membership) {
        const newUser = { ...user, team_memberships: [...(user.team_memberships || []), membership] };
        store.set('user', newUser);
        store.saveAuth();
      }
      toast.success(`Equipe "${res.name}" criada com sucesso!`);
      overlay.remove();
    } catch (e) {
      err.textContent = e.message || 'Erro ao criar equipe';
      err.classList.remove('hidden');
      btn.disabled = false;
      btn.textContent = 'Criar equipe';
    }
  };
}

function renderMemberTeamSelection(user) {
  const overlay = openModal(`
    <div onclick="event.stopPropagation()" class="glass-strong w-full max-w-lg rounded-2xl p-8 animate-in zoom-in-95">
      <div class="mb-2 flex justify-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
      </div>
      <h3 class="text-center text-xl font-bold tracking-tight">Escolha sua equipe</h3>
      <p class="mt-1 text-center text-sm text-muted-foreground">Selecione em qual equipe você deseja se integrar</p>
      <p id="team-join-error" class="mt-3 text-center text-sm font-medium text-destructive hidden"></p>
      <div id="team-list" class="mt-6 max-h-64 space-y-2 overflow-y-auto"><p class="text-center text-sm text-muted-foreground">Carregando equipes...</p></div>
    </div>
  `);

  const list = overlay.querySelector('#team-list');
  const err = overlay.querySelector('#team-join-error');

  api.get('/teams').then(teams => {
    if (teams.length === 0) {
      list.innerHTML = '<p class="text-center text-sm text-muted-foreground">Nenhuma equipe cadastrada ainda.</p>';
      return;
    }
    list.innerHTML = teams.map(team => `
      <button onclick="(async function(){try{const res = await api.post('/teams/${team.id}/join');store.set('user',{...store.get().user,team_memberships:res.team_memberships});store.saveAuth();toast.success('Você entrou na equipe!');this.closest('.custom-modal-overlay').remove()}catch(e){errEl.textContent=e.message||'Erro ao entrar na equipe';errEl.classList.remove('hidden')}})()" class="flex w-full items-center gap-3 rounded-xl border border-border bg-surface-2 p-4 text-left transition-all hover:border-primary/50 hover:bg-surface-3">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold">${escHtml(team.name)}</p>
          <p class="text-xs text-muted-foreground">Equipe #${team.id}</p>
        </div>
        <span class="text-sm font-semibold text-primary">Entrar</span>
      </button>
    `).join('');
  }).catch(() => {
    list.innerHTML = '<p class="text-center text-sm text-destructive">Erro ao carregar equipes</p>';
  });
}
