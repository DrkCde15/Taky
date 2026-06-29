function renderAdminPage(app) {
  const s = store.get();
  if (!s.token) { router.navigate('/login'); return; }

  const user = s.user;
  const isAdminOrOwner = user?.role === 'admin' || (user?.team_memberships?.some(m => m.role === 'admin') ?? false);
  if (!isAdminOrOwner) { router.navigate('/'); return; }

  store.fetchMembers();
  store.fetchTasks();

  const STATUS_LABEL = { todo: 'A Fazer', in_progress: 'Em Andamento', blocked: 'Bloqueado', done: 'Concluído' };
  const PRIO_COLORS = { high: '#e05a4f', medium: '#d4a843', low: '#6bc47f' };

  function render() {
    const s = store.get();
    const tasks = s.tasks;
    const members = s.members;

    const done = tasks.filter(t => t.status === 'done').length;
    const blocked = tasks.filter(t => t.status === 'blocked').length;
    const totalHours = tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

    const statusData = Object.keys(STATUS_LABEL).map(status => ({
      name: STATUS_LABEL[status],
      value: tasks.filter(t => t.status === status).length,
    }));

    const prioData = ['high', 'medium', 'low'].map(p => ({
      name: p,
      value: tasks.filter(t => t.priority === p).length,
    }));

    const maxPrio = Math.max(...prioData.map(d => d.value), 1);

    const perMember = members.map(m => ({
      name: m.name?.split(' ')[0] || '—',
      tarefas: tasks.filter(t => t.memberId === String(m.id)).length,
      horas: tasks.filter(t => t.memberId === String(m.id)).reduce((sum, t) => sum + (t.timeSpent || 0), 0),
    }));

    const maxStatus = Math.max(...statusData.map(d => d.value), 1);
    const maxMemberTasks = Math.max(...perMember.map(d => d.tarefas), 1);
    const maxMemberHours = Math.max(...perMember.map(d => d.horas), 1);

    app.innerHTML = '';
    renderNavbar(app);

    app.innerHTML += `
      <main class="mx-auto max-w-1600 px-4 py-6 sm:px-6 lg:px-8">
        <div class="mb-6"><p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visão geral</p><h1 class="text-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl">Analytics</h1></div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          ${[
            { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--info)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 6H9a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h7"/><path d="M16 14V2"/><path d="M18 10h-4"/></svg>', label: 'Total', value: tasks.length },
            { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>', label: 'Concluídas', value: `${done} (${pct}%)` },
            { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--destructive)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>', label: 'Bloqueadas', value: blocked },
            { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>', label: 'Horas registradas', value: `${totalHours}h` },
          ].map(k => `<div class="glass rounded-2xl p-5"><div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">${k.icon} ${k.label}</div><p class="mt-3 text-3xl font-black tracking-tight">${k.value}</p></div>`).join('')}
        </div>

        <div class="mt-6 grid gap-6 lg:grid-cols-3">
          <div class="glass rounded-2xl p-5 lg:col-span-2">
            <h3 class="text-sm font-bold">Tarefas por status</h3>
            <div class="mt-4 space-y-2">
              ${statusData.map(d => `<div><div class="flex justify-between text-xs mb-1"><span>${d.name}</span><span class="font-semibold">${d.value}</span></div><div class="h-6 rounded-lg bg-surface-3 overflow-hidden"><div class="h-full rounded-lg bg-info transition-all" style="width:${(d.value / maxStatus * 100)}%"></div></div></div>`).join('')}
            </div>
          </div>

          <div class="glass rounded-2xl p-5">
            <h3 class="text-sm font-bold">Por prioridade</h3>
            <div class="mt-4 flex flex-col items-center">
              <div class="relative w-40 h-40">
                <svg viewBox="0 0 32 32" class="w-full h-full -rotate-90">
                  ${(() => {
                    const total = prioData.reduce((s, d) => s + d.value, 0) || 1;
                    let offset = 0;
                    const r = 14, c = 2 * Math.PI * r;
                    return prioData.map(d => {
                      const pct = d.value / total;
                      const len = pct * c;
                      const dash = `${len} ${c - len}`;
                      const seg = `<circle cx="16" cy="16" r="${r}" fill="none" stroke="${PRIO_COLORS[d.name]}" stroke-width="3" stroke-dasharray="${dash}" stroke-dashoffset="${-offset}"/>`;
                      offset += len;
                      return seg;
                    }).join('');
                  })()}
                </svg>
                <div class="absolute inset-0 flex items-center justify-center text-2xl font-black">${tasks.length}</div>
              </div>
              <div class="mt-4 flex gap-4 text-xs">
                ${prioData.map(d => `<div class="flex items-center gap-1"><span class="w-2 h-2 rounded-full" style="background:${PRIO_COLORS[d.name]}"></span>${d.name} (${d.value})</div>`).join('')}
              </div>
            </div>
          </div>

          <div class="glass rounded-2xl p-5 lg:col-span-3">
            <h3 class="text-sm font-bold">Carga por pessoa</h3>
            <div class="mt-4 space-y-3">
              ${perMember.map(m => `
                <div>
                  <div class="flex justify-between text-xs mb-1"><span class="font-semibold">${escHtml(m.name)}</span><span class="text-muted-foreground">${m.tarefas} tasks · ${m.horas}h</span></div>
                  <div class="flex gap-1 h-5">
                    <div class="flex-1 rounded-lg bg-surface-3 overflow-hidden"><div class="h-full rounded-lg bg-info transition-all" style="width:${(m.tarefas / maxMemberTasks * 100)}%"></div></div>
                    <div class="flex-1 rounded-lg bg-surface-3 overflow-hidden"><div class="h-full rounded-lg bg-warning transition-all" style="width:${(m.horas / maxMemberHours * 100)}%"></div></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </main>
    `;
  }

  const unsubTasks = store.on('tasks', render);
  render();

  return () => { unsubTasks(); };
}
