const PRIORITY_CLASSES = {
  high: 'bg-destructive/15 text-destructive border-destructive/30',
  medium: 'bg-warning/15 text-warning border-warning/30',
  low: 'bg-success/15 text-success border-success/30',
};

function renderTaskCard(task, members, onClick) {
  const member = members.find(m => String(m.id) === task.memberId);
  const prio = PRIORITY_CLASSES[task.priority] || PRIORITY_CLASSES.medium;

  const card = document.createElement('div');
  card.className = 'glass cursor-grab rounded-xl p-3.5 transition-all hover:border-primary/40 hover:shadow-[0_0_0_1px_oklch(0.78_0.16_220_/_0.3),0_8px_24px_-8px_oklch(0.78_0.16_220_/_0.4)] active:cursor-grabbing';
  card.draggable = true;
  card.dataset.taskId = task.id;

  card.innerHTML = `
    <div class="flex items-start justify-between gap-2">
      <span class="rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${prio}">${task.priority}</span>
      <span class="text-[10px] font-mono text-muted-foreground">#${task.id}</span>
    </div>
    ${task.tags?.length > 0 ? `<div class="mt-2 flex flex-wrap gap-1">${task.tags.slice(0, 3).map(tag => `<span class="rounded border border-border bg-surface-1 px-1.5 py-0.5 text-[10px] text-muted-foreground">${escHtml(tag)}</span>`).join('')}</div>` : ''}
    <h4 class="mt-2 text-sm font-semibold leading-snug">${escHtml(task.title)}</h4>
    ${task.description ? `<p class="mt-1 line-clamp-2 text-xs text-muted-foreground">${escHtml(task.description)}</p>` : ''}
    <div class="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
      <div class="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span class="inline-flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${task.timeSpent}h
        </span>
        ${task.comments?.length > 0 ? `<span class="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>${task.comments.length}</span>` : ''}
        ${task.files?.length > 0 ? `<span class="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>${task.files.length}</span>` : ''}
      </div>
      ${member ? `<div title="${escHtml(member.name)}" class="grid h-6 w-6 place-items-center rounded-full border border-border bg-primary/20 text-[10px] font-bold text-primary">${member.avatar ? `<img src="${escHtml(member.avatar)}" alt="${escHtml(member.name)}" class="h-full w-full rounded-full object-cover"/>` : (member.name?.[0]?.toUpperCase() ?? '?')}</div>` : ''}
    </div>
  `;

  card.addEventListener('click', () => onClick(task));
  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    card.classList.add('opacity-40');
    card.classList.remove('cursor-grab');
    card.classList.add('cursor-grabbing');
  });
  card.addEventListener('dragend', () => {
    card.classList.remove('opacity-40');
    card.classList.add('cursor-grab');
    card.classList.remove('cursor-grabbing');
  });

  return card;
}
