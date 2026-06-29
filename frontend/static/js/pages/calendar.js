function renderCalendarPage(app) {
  const s = store.get();
  if (!s.token) { router.navigate('/login'); return; }

  store.fetchMembers();

  let selectedDate = new Date();
  let viewDate = new Date();

  function render() {
    const s = store.get();
    app.innerHTML = '';
    renderNavbar(app);

    const main = document.createElement('main');
    main.className = 'mx-auto max-w-1400 px-4 py-6 sm:px-6 lg:px-8';

    const tasksByDay = new Map();
    s.tasks.forEach(t => {
      if (!t.dueDate) return;
      const key = new Date(t.dueDate).toISOString().slice(0, 10);
      const arr = tasksByDay.get(key) || [];
      arr.push(t);
      tasksByDay.set(key, arr);
    });

    const dayTasks = s.tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate));

    const memberName = (id) => s.members.find(m => String(m.id) === id)?.name || '—';

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    function isSameDay(d1, d2) {
      return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    }

    function formatDate(date) {
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    }

    function formatPt(date) {
      return `${date.getDate()} de ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
    }

    const prioDot = { high: 'bg-destructive', medium: 'bg-warning', low: 'bg-success' };

    let calendarDays = '';
    for (let i = 0; i < firstDay; i++) calendarDays += '<div></div>';
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const key = date.toISOString().slice(0, 10);
      const dayTasks = tasksByDay.get(key);
      const isToday = isSameDay(date, today);
      const isSelected = isSameDay(date, selectedDate);
      calendarDays += `
        <button onclick="selectedDate=new Date(${year},${month},${d});render()" class="flex flex-col items-center justify-center rounded-xl transition-all p-1 ${isSelected ? 'bg-primary text-primary-foreground font-bold' : isToday ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-white/5'}">
          <span class="text-sm" style="${isSelected ? 'color: var(--primary-foreground)' : ''}">${d}</span>
          ${dayTasks?.length ? `<div class="flex gap-0.5 mt-0.5">${dayTasks.slice(0, 3).map(t => `<span class="h-1.5 w-1.5 rounded-full ${prioDot[t.priority] || 'bg-primary'}"></span>`).join('')}</div>` : ''}
        </button>
      `;
    }

    main.innerHTML = `
      <div class="mb-6"><p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cronograma</p><h1 class="text-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl">Calendário</h1></div>
      <div class="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div class="glass rounded-2xl p-4 sm:p-6">
          <div class="kanban-calendar">
            <div class="flex items-center justify-between mb-4">
              <button onclick="viewDate.setMonth(viewDate.getMonth()-1);render()" class="p-2 rounded-lg hover:bg-white/5 text-foreground font-bold"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
              <span class="text-base font-bold">${monthNames[month]} ${year}</span>
              <button onclick="viewDate.setMonth(viewDate.getMonth()+1);render()" class="p-2 rounded-lg hover:bg-white/5 text-foreground font-bold"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
            </div>
            <div class="grid grid-cols-7 gap-1 mb-1">
              ${dayNames.map(d => `<div class="text-center text-xs font-semibold uppercase text-muted-foreground py-1">${d}</div>`).join('')}
            </div>
            <div class="grid grid-cols-7 gap-1">
              ${calendarDays}
            </div>
          </div>
        </div>
        <aside class="glass flex flex-col rounded-2xl p-5">
          <div class="flex items-center gap-2 border-b border-border pb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            <h3 class="text-sm font-bold">${formatPt(selectedDate)}</h3>
            <span class="ml-auto rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-bold">${dayTasks.length}</span>
          </div>
          <div class="mt-3 flex-1 space-y-2 overflow-y-auto">
            ${dayTasks.length === 0
              ? '<div class="grid place-items-center py-10 text-center text-sm text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2 opacity-30"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>Sem tarefas para esta data.</div>'
              : dayTasks.map(t => `
                <div class="rounded-xl border border-border bg-surface-1 p-3 hover:border-primary/40">
                  <div class="flex items-center justify-between gap-2">
                    <span class="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${t.priority === 'high' ? 'bg-destructive/15 text-destructive' : t.priority === 'medium' ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success'}">${t.priority}</span>
                    <span class="font-mono text-[10px] text-muted-foreground">#${t.id}</span>
                  </div>
                  <h4 class="mt-1.5 text-sm font-semibold">${escHtml(t.title)}</h4>
                  <div class="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>${memberName(t.memberId)}</span>
                    <span class="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${t.timeSpent}h</span>
                  </div>
                </div>
              `).join('')}
          </div>
        </aside>
      </div>
    `;
    app.appendChild(main);
  }

  store.fetchTasks();
  render();
}
