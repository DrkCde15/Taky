function renderHome(app) {
  if (store.get().token) { router.navigate('/'); return; }

  app.innerHTML = `
    <div class="min-h-screen">
      <header class="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
        <div class="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-3">
            <div class="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--glow-primary)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            </div>
            <span class="text-lg font-black tracking-tight">Taky</span>
          </div>
          <nav class="hidden items-center gap-1 md:flex">
            <a href="#features" class="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">Recursos</a>
            <a href="#stats" class="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">Números</a>
          </nav>
          <div class="flex items-center gap-3">
            <a href="#/login" class="rounded-lg border border-border px-4 py-1.5 text-sm font-semibold hover:bg-surface-2">Entrar</a>
            <a href="#/register" class="rounded-lg bg-[image:var(--gradient-primary)] px-4 py-1.5 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] hover:scale-[1.02] active:scale-95" style="display:inline-block;">Cadastrar</a>
          </div>
        </div>
      </header>

      <section class="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
        <div class="pointer-events-none absolute inset-0 -z-10">
          <div class="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"></div>
          <div class="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/8 blur-[100px]"></div>
        </div>
        <div class="mx-auto max-w-4xl text-center">
          <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-4 py-1.5 text-xs font-semibold text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 15.09 8.26 22 8.26 16.45 12.97 18.54 19.23 13 14.51 7.46 19.23 9.55 12.97 4 8.26 10.91 8.26 13 2"/></svg>
            Gestão de tarefas para equipes modernas
          </div>
          <h1 class="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">Organize o caos.<br><span class="text-gradient">Entregue com clareza.</span></h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">Taky é um sistema completo de gerenciamento de tarefas com Kanban, calendário, analytics em tempo real e notificações — tudo que seu time precisa para construir juntos.</p>
          <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#/register" class="group inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-6 py-3 text-base font-bold text-primary-foreground shadow-[var(--glow-primary)] hover:scale-[1.02] active:scale-95">Começar grátis <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-0.5"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
            <a href="#/login" class="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-1 px-6 py-3 text-base font-semibold hover:bg-surface-2">Já tenho conta</a>
          </div>
          <div class="mt-16 grid grid-cols-3 gap-4 sm:gap-8">
            <div class="rounded-xl border border-border bg-surface-1/50 p-4 backdrop-blur-sm"><p class="text-gradient text-2xl font-black sm:text-3xl">+500</p><p class="mt-1 text-xs text-muted-foreground sm:text-sm">Usuários ativos</p></div>
            <div class="rounded-xl border border-border bg-surface-1/50 p-4 backdrop-blur-sm"><p class="text-gradient text-2xl font-black sm:text-3xl">+2K</p><p class="mt-1 text-xs text-muted-foreground sm:text-sm">Tarefas criadas</p></div>
            <div class="rounded-xl border border-border bg-surface-1/50 p-4 backdrop-blur-sm"><p class="text-gradient text-2xl font-black sm:text-3xl">99%</p><p class="mt-1 text-xs text-muted-foreground sm:text-sm">Uptime</p></div>
          </div>
        </div>
      </section>

      <section id="features" class="relative px-4 py-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-6xl">
          <div class="text-center"><h2 class="text-3xl font-black tracking-tight sm:text-4xl">Tudo que seu time precisa</h2><p class="mx-auto mt-4 max-w-2xl text-muted-foreground">Ferramentas completas para gerenciar tarefas, acompanhar prazos e melhorar a produtividade do seu time.</p></div>
          <div class="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            ${[
              { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>', title: 'Quadro Kanban', desc: 'Arraste e solte tarefas entre colunas. Visualize o fluxo de trabalho de forma clara e intuitiva.' },
              { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>', title: 'Calendário', desc: 'Acompanhe prazos e distribua a carga de trabalho com uma visão mensal completa.' },
              { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>', title: 'Analytics', desc: 'Métricas em tempo real sobre produtividade, tarefas concluídas e gargalos da equipe.' },
              { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', title: 'Equipes', desc: 'Organize membros por equipe, defina papéis e mantenha todos alinhados.' },
              { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', title: 'Comentários', desc: 'Discuta tarefas diretamente no contexto com comentários e menções.' },
              { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>', title: 'Notificações', desc: 'Receba alertas em tempo real sobre mudanças, menções e atualizações nas tarefas.' },
              { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>', title: 'Registro de Horas', desc: 'Acompanhe o tempo gasto em cada tarefa para melhorar a estimativa e produtividade.' },
              { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', title: 'Controle de Acesso', desc: 'Administradores e membros com permissões distintas para manter a segurança.' },
            ].map(f => `<div class="group rounded-2xl border border-border bg-surface-1/50 p-6 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-surface-1"><div class="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20">${f.icon}</div><h3 class="text-base font-bold">${f.title}</h3><p class="mt-2 text-sm leading-relaxed text-muted-foreground">${f.desc}</p></div>`).join('')}
          </div>
        </div>
      </section>

      <section id="stats" class="relative px-4 py-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-6xl">
          <div class="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface-1 to-surface-2 p-8 sm:p-12">
            <div class="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/5 blur-[100px]"></div>
            <div class="relative grid gap-8 sm:grid-cols-3">
              ${[
                { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>', value: '4', label: 'Colunas Kanban', desc: 'A Fazer, Em Andamento, Bloqueado, Concluído' },
                { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="12" cy="15" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/><circle cx="12" cy="9" r="1"/></svg>', value: 'Drag & Drop', label: 'Interação intuitiva', desc: 'Arraste tarefas entre colunas com um clique' },
                { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', value: 'Tempo real', label: 'Atualização instantânea', desc: 'WebSockets para sincronizar o time' },
              ].map(s => `<div class="text-center"><div class="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">${s.icon}</div><p class="text-2xl font-black tracking-tight sm:text-3xl">${s.value}</p><p class="mt-1 text-sm font-semibold">${s.label}</p><p class="mt-1 text-xs text-muted-foreground">${s.desc}</p></div>`).join('')}
            </div>
          </div>
        </div>
      </section>

      <section class="relative px-4 py-24 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-3xl text-center">
          <div class="rounded-3xl border border-border bg-surface-1/50 p-8 backdrop-blur-sm sm:p-12">
            <h2 class="text-3xl font-black tracking-tight sm:text-4xl">Pronto para organizar seu fluxo?</h2>
            <p class="mx-auto mt-4 max-w-lg text-muted-foreground">Crie sua conta em segundos e comece a gerenciar tarefas com seu time.</p>
            <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href="#/register" class="group inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-6 py-3 text-base font-bold text-primary-foreground shadow-[var(--glow-primary)] hover:scale-[1.02] active:scale-95">Criar conta gratuita <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-0.5"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
              <a href="#/login" class="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-base font-semibold hover:bg-surface-2">Fazer login</a>
            </div>
          </div>
        </div>
      </section>

      <footer class="border-t border-border px-4 py-8 sm:px-6 lg:px-8">
        <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div class="flex items-center gap-2"><div class="grid h-7 w-7 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg></div><span class="text-sm font-bold tracking-tight">Taky</span></div>
          <p class="text-xs text-muted-foreground">&copy; ${new Date().getFullYear()} Taky — todos os direitos reservados.</p>
          <div class="flex items-center gap-4 text-xs text-muted-foreground"><a href="#features" class="hover:text-foreground">Recursos</a><a href="#stats" class="hover:text-foreground">Números</a></div>
        </div>
      </footer>
    </div>
  `;
}
