function renderNavbar(app, opts = {}) {
  const { onCreateTask, onFilterChange, filterValue, members, showNewTask } = opts;

  const navHtml = `
    <header class="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl" id="main-navbar">
      <div class="mx-auto flex h-16 max-w-1600 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#/" class="flex shrink-0 items-center gap-2">
          <img src="/logo.png" alt="Taky" class="h-9 w-9 rounded-xl object-cover" />
          <span class="hidden text-lg font-bold tracking-tight sm:inline">Taky</span>
        </a>
        <nav class="hidden items-center gap-1 md:flex" id="nav-links"></nav>
        <div class="ml-auto flex min-w-0 items-center gap-2 sm:gap-3" id="nav-actions"></div>
      </div>
      <nav class="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden" id="nav-links-mobile"></nav>
    </header>
  `;

  const navPlaceholder = document.createElement('div');
  navPlaceholder.id = 'navbar-placeholder';
  if (app && app instanceof HTMLElement) {
    app.insertBefore(navPlaceholder, app.firstChild);
  }

  document.getElementById('navbar-placeholder')?.remove();

  const temp = document.createElement('div');
  temp.innerHTML = navHtml;
  const navbar = temp.firstElementChild;

  const user = store.get().user;
  const isAdminOrOwner = user?.role === 'admin' || (user?.team_memberships?.some(m => m.role === 'admin') ?? false);

  const links = [
    { to: '/', label: 'Quadro', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>' },
    { to: '/calendar', label: 'Calendário', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>' },
    { to: '/teams', label: 'Equipes', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  ];
  if (isAdminOrOwner) {
    links.push({ to: '/admin', label: 'Analytics', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>' });
  }

  const pathname = router.getPath();

  function renderLinks(containerId) {
    const container = navbar.querySelector(containerId);
    if (!container) return;
    container.innerHTML = links.map(l => {
      const active = pathname === l.to;
      return `<a href="#${l.to}" class="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}">${l.icon}<span>${l.label}</span></a>`;
    }).join('');
  }

  renderLinks('#nav-links');
  renderLinks('#nav-links-mobile');

  const actions = navbar.querySelector('#nav-actions');

  if (onFilterChange && members) {
    const filterDiv = document.createElement('div');
    filterDiv.className = 'hidden items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 sm:flex';
    filterDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
      <select id="member-filter" class="bg-transparent text-sm font-medium text-foreground outline-none">
        <option value="all">Todos os membros</option>
        ${members.map(m => `<option value="${m.id}">${escHtml(m.name)}</option>`).join('')}
      </select>
    `;
    if (filterValue) filterDiv.querySelector('select').value = filterValue;
    filterDiv.querySelector('select').addEventListener('change', (e) => onFilterChange(e.target.value));
    actions.appendChild(filterDiv);
  }

  if (showNewTask && onCreateTask) {
    const newBtn = document.createElement('button');
    newBtn.className = 'inline-flex shrink-0 items-center gap-2 rounded-lg bg-[image:var(--gradient-primary)] px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.02] active:scale-95';
    newBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg><span class="hidden sm:inline">Nova tarefa</span>`;
    newBtn.onclick = onCreateTask;
    actions.appendChild(newBtn);
  }

  const notifContainer = document.createElement('div');
  actions.appendChild(notifContainer);
  let notifCleanup = renderNotificationBell(notifContainer);

  if (user) {
    const userLink = document.createElement('a');
    userLink.href = '#/profile';
    userLink.className = 'hidden items-center gap-2 rounded-lg border border-border bg-surface-1 px-2 py-1 transition-all hover:border-primary/50 hover:bg-surface-2 sm:flex';
    const initial = user.name?.[0]?.toUpperCase() ?? '?';
    userLink.innerHTML = `
      <div class="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-primary/15 text-xs font-bold text-primary">
        ${user.avatar?.startsWith('http') ? `<img src="${escHtml(user.avatar)}" alt="Avatar" class="h-full w-full object-cover" />` : initial}
      </div>
      <span class="max-w-[120px] truncate text-sm font-medium">${escHtml(user.name)}</span>
    `;
    actions.appendChild(userLink);
  }

  const logoutBtn = document.createElement('button');
  logoutBtn.title = 'Sair';
  logoutBtn.className = 'grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground';
  logoutBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>';
  logoutBtn.onclick = () => { store.logout(); router.navigate('/login'); };
  actions.appendChild(logoutBtn);

  if (app && app instanceof HTMLElement) {
    app.insertBefore(navbar, app.firstChild);
  } else {
    document.body.insertBefore(navbar, document.body.firstChild);
  }

  return () => {
    navbar.remove();
    if (notifCleanup) notifCleanup();
  };
}
