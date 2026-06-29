function renderTeamsPage(app) {
  const s = store.get();
  if (!s.token) { router.navigate('/login'); return; }

  store.fetchMembers();
  store.fetchTeams();

  let toDelete = null;
  let confirmDeleteTeam = null;
  let editingTeam = null;

  function render() {
    const s = store.get();
    const user = s.user;
    const isAdmin = user?.role === 'admin';
    const userOwnedTeamIds = s.teams.filter(t => t.owner_id === user?.id).map(t => t.id);

    app.innerHTML = '';
    renderNavbar(app);

    const main = document.createElement('main');
    main.className = 'mx-auto max-w-1400 px-4 py-6 sm:px-6 lg:px-8';
    main.innerHTML = `
      <div class="mb-6"><p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Colaboração</p><h1 class="text-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl">Equipes & Pessoas</h1></div>
      <div class="grid gap-6 lg:grid-cols-[360px_1fr]">
        <section class="glass rounded-2xl p-5">
          <div class="flex items-center gap-2 border-b border-border pb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <h3 class="text-sm font-bold">Equipes</h3>
            <span class="ml-auto rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-bold">${s.teams.length}</span>
          </div>
          ${isAdmin ? `
            <div class="mt-4 flex gap-2">
              <input id="new-team-input" placeholder="Nome da equipe" class="flex-1 rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary" />
              <button id="create-team-btn" class="grid place-items-center rounded-lg bg-[image:var(--gradient-primary)] px-3 text-primary-foreground shadow-[var(--glow-primary)] hover:scale-[1.02] active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
              </button>
            </div>
          ` : ''}
          <ul class="mt-4 space-y-2" id="team-list">
            ${s.teams.length === 0
              ? '<li class="rounded-xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground">Nenhuma equipe ainda.</li>'
              : s.teams.map(t => {
                  const isOwner = t.owner_id === user?.id;
                  return `<li class="group flex items-center gap-3 rounded-xl border border-border bg-surface-1 px-3 py-2.5">
                    <div class="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 font-bold text-primary">${escHtml((t.name[0] || '').toUpperCase())}</div>
                    <div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold">${escHtml(t.name)}</p><p class="text-xs text-muted-foreground">${isOwner ? 'Você é o administrador' : 'Membro'}</p></div>
                    ${isOwner ? `<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onclick="editingTeam={id:${t.id},name:'${escHtml(t.name)}'};render()" class="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-surface-3 hover:text-foreground" title="Renomear"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                      <button onclick="confirmDeleteTeam=${t.id};render()" class="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-surface-3 hover:text-destructive" title="Excluir"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
                    </div>` : ''}
                  </li>`;
                }).join('')}
          </ul>
        </section>
        <section class="glass rounded-2xl p-5">
          <div class="flex items-center gap-2 border-b border-border pb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <h3 class="text-sm font-bold">Membros</h3>
            <span class="ml-auto rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-bold">${s.members.length}</span>
          </div>
          <ul class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            ${s.members.map(m => {
              const isOwner = m.role === 'admin';
              return `<li class="group relative rounded-2xl border border-border bg-surface-1 p-4 transition-all hover:border-primary/40 hover:shadow-[var(--glow-primary)]">
                <div class="flex items-start gap-3">
                  <div class="grid h-12 w-12 place-items-center rounded-full bg-[image:var(--gradient-primary)] font-bold text-primary-foreground">${(m.name?.[0]?.toUpperCase() ?? '?')}</div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5"><p class="truncate text-sm font-bold">${escHtml(m.name)}</p>${isOwner ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' : ''}</div>
                    ${m.email ? `<p class="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>${escHtml(m.email)}</p>` : ''}
                    <span class="mt-2 inline-block rounded-md bg-surface-3 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">${m.role ?? 'member'}</span>
                  </div>
                  ${userOwnedTeamIds.length > 0 && m.id !== user?.id ? `<button onclick="toDelete=${m.id};render()" class="opacity-0 hover:text-destructive group-hover:opacity-100 transition-opacity" title="Remover"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>` : ''}
                </div>
              </li>`;
            }).join('')}
          </ul>
        </section>
      </div>
    `;
    app.appendChild(main);

    // Create team
    const newTeamInput = app.querySelector('#new-team-input');
    const createBtn = app.querySelector('#create-team-btn');
    if (newTeamInput && createBtn) {
      const createTeam = async () => {
        if (!newTeamInput.value.trim()) return;
        try {
          await store.addTeam(newTeamInput.value.trim());
          newTeamInput.value = '';
          toast.success('Equipe criada!');
          render();
        } catch (e) { toast.error(e?.message ?? 'Falha ao criar equipe'); }
      };
      createBtn.addEventListener('click', createTeam);
      newTeamInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') createTeam(); });
    }

    renderModals();
  }

  // Handle modals
  function renderModals() {
    const existing = document.querySelector('.custom-modal-overlay');
    if (existing) existing.remove();

    if (editingTeam) {
      const overlay = openModal(`
        <div onclick="event.stopPropagation()" class="glass-strong w-full max-w-md rounded-2xl p-6">
          <h3 class="text-lg font-bold tracking-tight">Renomear equipe</h3>
          <form id="rename-form" class="mt-4 space-y-4">
            <input id="rename-input" value="${escHtml(editingTeam.name)}" autofocus class="w-full rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary" />
            <div class="flex gap-3">
              <button type="button" onclick="this.closest('.custom-modal-overlay').remove();editingTeam=null" class="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold hover:bg-surface-3">Cancelar</button>
              <button type="submit" class="flex-1 rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)]">Salvar</button>
            </div>
          </form>
        </div>
      `);
      overlay.querySelector('#rename-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          await store.updateTeam(editingTeam.id, document.getElementById('rename-input').value.trim());
          editingTeam = null;
          overlay.remove();
          toast.success('Equipe renomeada!');
          render();
        } catch (e) { toast.error(e?.message ?? 'Falha ao renomear equipe'); }
      });
    }

    if (confirmDeleteTeam) {
      showConfirmModal('Excluir equipe?', 'Esta ação não pode ser desfeita. Todos os projetos e tarefas serão perdidos.', async () => {
        await store.deleteTeam(confirmDeleteTeam);
        confirmDeleteTeam = null;
        toast.success('Equipe excluída!');
        render();
      });
    }

    if (toDelete) {
      showConfirmModal('Remover membro?', 'Esta ação não pode ser desfeita e suas tarefas ficarão sem responsável.', async () => {
        await store.deleteMember(toDelete);
        toDelete = null;
        toast.success('Membro removido');
        render();
      });
    }
  }

  const unsubTeams = store.on('teams', render);

  render();

  return () => {
    unsubTeams();
    const existing = document.querySelector('.custom-modal-overlay');
    if (existing) existing.remove();
  };
}
