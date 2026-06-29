function renderDashboard(app) {
  const COLUMNS = [
    { id: 'todo', title: 'A Fazer' },
    { id: 'in_progress', title: 'Em Andamento' },
    { id: 'blocked', title: 'Bloqueado' },
    { id: 'done', title: 'Concluído' },
  ];

  let selectedTeamId = null;
  let activeTask = null;
  let showCreate = false;

  const s = store.get();
  if (!s.activeProjectId) {
    store.fetchMembers();
    store.fetchTeams();
  }

  function render() {
    const s = store.get();

    if (!s.activeProjectId) {
      renderProjectSelector();
      return;
    }

    app.innerHTML = '';

    const navbarCleanup = renderNavbar(app, {
      onCreateTask: () => { showCreate = true; render(); },
      showNewTask: true,
      filterValue: s.filterMemberId,
      onFilterChange: (id) => { store.set('filterMemberId', id); render(); },
      members: s.members,
    });

    const activeProject = s.projects.find(p => p.id === s.activeProjectId);
    const filtered = s.filterMemberId === 'all' ? s.tasks : s.tasks.filter(t => t.memberId === s.filterMemberId);
    const tasksByCol = (status) => filtered.filter(t => t.status === status);

    const main = document.createElement('main');
    main.className = 'mx-auto max-w-1600 px-4 py-6 sm:px-6 lg:px-8';

    main.innerHTML = `
      <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">${escHtml(activeProject?.name || '')} / Kanban</p>
          <h1 class="text-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl">Fluxo de trabalho</h1>
          <p class="mt-1 text-sm text-muted-foreground">Arraste para mover. Clique para abrir. <span class="text-foreground">${filtered.length}</span> tarefas visíveis.</p>
        </div>
        <button id="switch-project" class="text-sm font-semibold text-primary underline hover:opacity-80">Trocar Projeto</button>
      </div>
      ${s.loading && s.tasks.length === 0
        ? '<div class="grid h-[60vh] place-items-center text-sm text-muted-foreground">Carregando...</div>'
        : '<div class="flex gap-4 overflow-x-auto pb-4" id="kanban-board"></div>'
      }
    `;

    app.appendChild(main);

    main.querySelector('#switch-project')?.addEventListener('click', () => {
      store.set('activeProjectId', null);
      render();
    });

    if (!s.loading && s.tasks.length >= 0) {
      const board = main.querySelector('#kanban-board');
      if (board) {
        const handleDrop = async (taskId, columnId) => {
          await store.moveTask(taskId, columnId);
          render();
        };
        COLUMNS.forEach(c => {
          const columnEl = renderColumn(c.id, c.title, tasksByCol(c.id), s.members,
            (task) => { activeTask = task; renderModalEditTask(task, s.members, () => { activeTask = null; render(); }); },
            handleDrop
          );
          board.appendChild(columnEl);
        });
      }
    }

    if (showCreate) {
      renderCreateTaskModal(s.members);
    }
  }

  function renderProjectSelector() {
    app.innerHTML = '';
    renderNavbar(app, { members: store.get().members });

    const main = document.createElement('main');
    main.className = 'mx-auto max-w-1600 px-4 py-12 sm:px-6 lg:px-8';
    main.innerHTML = `
      <div class="mx-auto max-w-lg text-center">
        <h2 class="text-2xl font-bold">Selecione um Projeto</h2>
        <p class="mt-2 text-sm text-muted-foreground">Para ver o Kanban, escolha uma equipe e depois um projeto.</p>
        <div class="mt-8 space-y-4 text-left">
          <div>
            <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Equipe</label>
            <select id="team-select" class="mt-1 w-full rounded-lg border border-border bg-surface-1 px-3 py-3 text-sm outline-none focus:border-primary">
              <option value="">Selecione uma equipe</option>
              ${store.get().teams.map(t => `<option value="${t.id}" class="bg-surface-2">${escHtml(t.name)}</option>`).join('')}
            </select>
          </div>
          <div id="project-list" class="mt-6"></div>
        </div>
      </div>
    `;
    app.appendChild(main);

    const teamSelect = main.querySelector('#team-select');
    const projectList = main.querySelector('#project-list');

    teamSelect.addEventListener('change', async (e) => {
      selectedTeamId = Number(e.target.value);
      if (selectedTeamId) {
        await store.fetchProjects(selectedTeamId);
        renderProjects(projectList);
      } else {
        projectList.innerHTML = '';
      }
    });

    if (store.get().projects.length > 0 && selectedTeamId) {
      renderProjects(projectList);
    }
  }

  function renderProjects(container) {
    const s = store.get();
    container.innerHTML = `
      <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Projetos</label>
      <div class="grid gap-3">
        ${s.projects.length === 0
          ? '<p class="text-sm text-muted-foreground rounded-lg border border-dashed border-border p-4 text-center">Nenhum projeto encontrado para esta equipe.</p>'
          : s.projects.map(p => `
            <button data-project-id="${p.id}" class="project-btn flex w-full items-center justify-between rounded-xl border border-border bg-surface-1 p-4 text-left transition-all hover:border-primary hover:shadow-[var(--glow-primary)]">
              <div><span class="block font-bold">${escHtml(p.name)}</span>${p.description ? `<span class="block text-xs text-muted-foreground mt-1">${escHtml(p.description)}</span>` : ''}</div>
              <span class="text-primary">&rarr;</span>
            </button>
          `).join('')}
      </div>
      <div class="mt-4 pt-4 border-t border-border">
        <p class="text-xs font-semibold mb-2 text-muted-foreground">CRIAR NOVO PROJETO</p>
        <form id="create-project-form" class="flex gap-2">
          <input name="projectName" placeholder="Nome do novo projeto" required class="flex-1 rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary" />
          <button type="submit" class="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90">Criar</button>
        </form>
      </div>
    `;

    container.querySelector('#create-project-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = e.target.querySelector('input');
      if (input.value.trim()) {
        try {
          await store.addProject(selectedTeamId, input.value.trim());
          input.value = '';
          toast.success('Projeto criado!');
          renderProjects(container);
        } catch (err) { toast.error(err.toString()); }
      }
    });

    container.querySelectorAll('.project-btn')?.forEach(btn => {
      btn.addEventListener('click', async () => {
        const pid = Number(btn.dataset.projectId);
        wsClient.disconnect();
        wsClient.clearListeners();
        wsClient.connect(pid);
        wsClient.on('TASK_CREATED', () => store.fetchTasks(pid));
        wsClient.on('TASK_UPDATED', () => store.fetchTasks(pid));
        store.set('activeProjectId', pid);
        await store.fetchTasks(pid);
        render();
      });
    });
  }

  function renderCreateTaskModal(members) {
    const overlay = openModal(`
      <div onclick="event.stopPropagation()" class="glass-strong w-full max-w-lg rounded-2xl p-6 animate-in zoom-in-95">
        <h3 class="text-xl font-bold tracking-tight">Nova tarefa</h3>
        <p class="mt-1 text-sm text-muted-foreground">Preencha os campos essenciais. Você pode editar tudo depois.</p>
        <form id="create-task-form" class="mt-5 space-y-4">
          <div><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Título</label><input id="ct-title" required autofocus class="mt-1 w-full rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary" /></div>
          <div><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descrição</label><textarea id="ct-desc" rows="3" class="mt-1 w-full resize-none rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary"></textarea></div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Responsável</label><select id="ct-member" required class="mt-1 w-full rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary"><option value="" disabled>Selecione</option>${members.map(m => `<option value="${m.id}" class="bg-surface-2">${escHtml(m.name)}</option>`).join('')}</select></div>
            <div><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prioridade</label><select id="ct-priority" class="mt-1 w-full rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary"><option value="low" class="bg-surface-2">Baixa</option><option value="medium" class="bg-surface-2">Média</option><option value="high" class="bg-surface-2">Alta</option></select></div>
          </div>
          <div class="flex gap-3">
            <button type="button" onclick="this.closest('.custom-modal-overlay').remove();showCreate=false;" class="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold hover:bg-surface-3">Cancelar</button>
            <button type="submit" class="flex-1 rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] hover:scale-[1.01]">Criar tarefa</button>
          </div>
        </form>
      </div>
    `);

    overlay.querySelector('#create-task-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await store.addTask({
          title: document.getElementById('ct-title').value,
          description: document.getElementById('ct-desc').value,
          memberId: document.getElementById('ct-member').value,
          priority: document.getElementById('ct-priority').value,
          status: 'todo',
          tags: [],
        });
        toast.success('Tarefa criada!');
        overlay.remove();
        showCreate = false;
        render();
      } catch { toast.error('Falha ao criar tarefa'); }
    });
  }

  const unsubTasks = store.on('tasks', render);
  const unsubLoading = store.on('loading', render);

  // Initial fetch if project is active
  if (store.get().activeProjectId) {
    store.fetchTasks(store.get().activeProjectId);
  }

  render();

  return () => {
    unsubTasks();
    unsubLoading();
    wsClient.disconnect();
  };
}
